"""The unbox check: listing take vs unboxing take -> consistent / differs / cant_tell.

Order of evidence
1. Replay guard: an unbox frame (near-)identical to a listing frame is replayed media.
2. Declared-flaw fingerprints: every flaw the seller showed must still be there; a
   missing flaw suggests a different garment (swap).
3. New change: aligned crop pairs from the diff map, judged by Gemini.
This produces a suggested assessment for the report, never a payment decision.
An inconclusive comparison suggests a random close-up for the human reviewer.
"""

from __future__ import annotations

import random
from dataclasses import dataclass, field
from pathlib import Path

import cv2
import numpy as np

from ..spec import ConditionRecord, Lane, Severity
from .. import config
from ..evidence import valid_box
from . import judge
from .align import align
from .diff import change_regions, crop_pair, InsufficientComparisonArea


# Change scores: planted stains ~6, unchanged re-shoots ~2.6 (tests/test_cv.py). Recalibrate on real pairs.
MIN_CHANGE_SCORE = config.CHANGE_SCORE


@dataclass
class Finding:
    kind: str  # new_defect | flaw_missing | replay
    what: str
    region_box: list[int]
    listing_crop: str | None = None
    unbox_crop: str | None = None
    reason: str = ""


@dataclass
class UnboxResult:
    verdict: str  # consistent | differs | cant_tell
    findings: list[Finding] = field(default_factory=list)
    closeup_request: str | None = None
    pairs_aligned: int = 0
    pairs_total: int = 0
    flags: list[str] = field(default_factory=list)
    limitations: list[str] = field(default_factory=list)
    comparisons: list[dict] = field(default_factory=list)


def _near_identical(a: Path, b: Path) -> bool:
    ia = cv2.resize(cv2.imread(str(a), cv2.IMREAD_GRAYSCALE), (256, 256)).astype(np.float32)
    ib = cv2.resize(cv2.imread(str(b), cv2.IMREAD_GRAYSCALE), (256, 256)).astype(np.float32)
    return float(np.mean(np.abs(ia - ib))) < 1.5  # real re-shoots never get this close


def check(record: ConditionRecord, listing_frames: dict[str, Path], pairs: list[tuple[str, Path]], work: Path,
          seed: int | None = None, *, reference_masks: dict[str, np.ndarray] | None = None,
          require_garment_focus: bool = False) -> UnboxResult:
    """pairs: (listing_frame_id, unbox_frame_path) matched upstream (unbox/pair.py)."""
    work.mkdir(parents=True, exist_ok=True)
    res = UnboxResult(verdict="consistent", pairs_total=len({fid for fid, _ in pairs}))
    aligned: dict[str, Path] = {}
    masks: dict[str, np.ndarray] = {}
    failed_views: set[str] = set()
    replayed_views: set[str] = set()
    unsure = 0

    for fid, ub in pairs:
        if fid in aligned or fid in replayed_views:
            continue
        ref = listing_frames[fid]
        if _near_identical(ref, ub):
            replayed_views.add(fid)
            res.flags.append("replayed_listing_media")
            res.findings.append(Finding("replay", "unbox frame matches listing frame pixel-for-pixel", [0, 0, 1000, 1000]))
            continue
        focus = (reference_masks or {}).get(fid)
        a = align(ref, ub, reference_mask=focus) if focus is not None else align(ref, ub)
        if a.ok and a.warped_path:
            aligned[fid] = a.warped_path
            if require_garment_focus and not getattr(a, "garment_focused", False):
                unsure += 1
                res.limitations.append(f"Listing view {fid} has no usable garment outline; background correspondence cannot establish garment correspondence.")
            if getattr(a, "method", "akaze") == "sift":
                # Real shared-background controls can pass SIFT on different
                # garments. Keep fallback comparisons provisional for review.
                unsure += 1
                res.limitations.append(f"Fallback alignment in listing view {fid} is provisional; garment-area correspondence needs human review.")
            mask_path = getattr(a, "valid_mask_path", None)
            if mask_path:
                mask = cv2.imread(str(mask_path), cv2.IMREAD_GRAYSCALE)
                if mask is None:
                    raise OSError("Aligned coverage mask unavailable")
                masks[fid] = mask
            res.comparisons.append({"kind": "aligned_view", "what": f"Compared view {fid}",
                                    "listing_crop": str(ref), "unbox_crop": str(a.warped_path),
                                    "reason": f"Aligned view ({getattr(a, 'method', 'akaze')}), not proof of garment identity."})
        else:
            failed_views.add(fid)
    for fid in sorted(failed_views - aligned.keys() - replayed_views):
        res.limitations.append(f"Could not align listing view {fid} after trying candidate views.")
    res.pairs_aligned = len(aligned)

    # Declared-flaw fingerprints.
    for c in record.claims:
        if c.lane != Lane.shown or c.severity == Severity.none:
            continue
        for b in c.evidence:
            if b.frame_id in aligned and valid_box(b.box_2d):
                mask = masks.get(b.frame_id)
                if mask is not None:
                    h, w = mask.shape
                    y0, x0, y1, x1 = b.box_2d
                    area = mask[int(y0*h/1000):int(np.ceil(y1*h/1000)), int(x0*w/1000):int(np.ceil(x1*w/1000))]
                    if not area.size or float(np.mean(area > 0)) < 0.95:
                        continue  # try another evidence box; never call a black border a missing flaw
                ca, cb = crop_pair(listing_frames[b.frame_id], aligned[b.frame_id], b.box_2d, out_dir=work / b.frame_id)
                v = judge.flaw_still_there(ca, cb, f"{c.severity.value} {c.code} on {c.region}")
                res.comparisons.append({"kind": "existing_flaw", "what": f"Listed {c.code} on {c.region}",
                                        "listing_crop": str(ca), "unbox_crop": str(cb), **v.model_dump()})
                if v.unsure:
                    unsure += 1
                if not v.still_visible and not v.unsure:
                    res.findings.append(Finding("flaw_missing", f"listed {c.code} on {c.region} not found", b.box_2d,
                                                str(ca), str(cb), v.reason))
                break
        else:
            res.limitations.append(f"Listed {c.code} on {c.region} could not be checked.")
            unsure += 1

    # New change between listing and unboxing.
    for fid, warped in aligned.items():
        mask = masks.get(fid)
        try:
            regions = change_regions(listing_frames[fid], warped, top_k=3, **({"valid_mask": mask} if mask is not None else {}))
        except InsufficientComparisonArea:
            unsure += 1
            res.limitations.append(f"Insufficient comparable area after alignment borders in listing view {fid}.")
            continue
        for r in regions:
            if r.score < MIN_CHANGE_SCORE:
                continue  # below the noise floor measured in tests/test_cv.py; don't spend a Gemini call
            ca, cb = crop_pair(listing_frames[fid], warped, r.box_2d, out_dir=work / fid)
            v = judge.compare(ca, cb)
            res.comparisons.append({"kind": "candidate_change", "what": f"Candidate change in {fid}",
                                    "listing_crop": str(ca), "unbox_crop": str(cb), **v.model_dump()})
            if v.unsure:
                unsure += 1
            elif v.new_defect and v.severity in ("minor", "major"):
                res.findings.append(Finding("new_defect", f"new {v.severity} {v.code}", r.box_2d, str(ca), str(cb), v.reason))

    if res.flags or any(f.kind in ("new_defect", "flaw_missing") for f in res.findings):
        res.verdict = "differs" if not res.flags else "cant_tell"
    elif res.pairs_aligned == 0 or unsure > 0:
        res.verdict = "cant_tell"

    if res.pairs_aligned < len(listing_frames):
        res.limitations.append("Not all listing views were compared.")
        if res.verdict == "consistent":
            res.verdict = "cant_tell"
    if unsure:
        res.limitations.append("One or more alignment, listed-flaw or crop checks were inconclusive.")

    if res.verdict == "cant_tell":
        # Random, never announced in advance: a cheater can't prepare for it.
        regions = sorted({c.region for c in record.claims if c.region != "whole"}) or ["left_cuff", "collar", "hem"]
        res.closeup_request = random.Random(seed).choice(regions)
    return res
