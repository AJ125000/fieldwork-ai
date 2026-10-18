"""Evidence-first search over condition records. Filters on shown claims and grade sets,
never on seller prose. `seed_fixtures()` writes hand-made records for tests and demo fallback."""

from __future__ import annotations

from .spec import Capture, Claim, ConditionRecord, Item, Lane, Severity
from .store import store


def _listing_map() -> dict[str, dict]:
    return {l["id"]: l for l in store.list_json("listings") if "id" in l}


def _flaws(r: ConditionRecord) -> list[dict]:
    return [{"code": c.code, "region": c.region, "severity": c.severity.value, "claim_id": c.id}
            for c in r.claims if c.lane == Lane.shown and c.severity != Severity.none]


def _declared_flaws(r: ConditionRecord) -> list[dict]:
    return [{"code": c.code, "region": c.region, "severity": c.severity.value, "claim_id": c.id}
            for c in r.claims if c.lane == Lane.declared and (c.severity != Severity.none or c.id.startswith("seller_issue_"))]


def _card(r: ConditionRecord, listing: dict) -> dict:
    badge = listing.get("evidence_badge") or ("strong" if r.capture.code_seen else "basic")
    return {
        "id": r.id,
        "item": r.item.model_dump(),
        "grade_set": r.grade_set,
        "price_band": list(r.price_band) if r.price_band else None,
        "currency": r.currency,
        "shown_flaws": _flaws(r),
        "declared_flaws": _declared_flaws(r),
        "cant_judge": sorted({c.region for c in r.claims if c.lane == Lane.cant_judge}),
        "evidence_badge": badge,
        "summary_line": r.summary_line(),
    }


def search(query: dict) -> list[dict]:
    """query keys: type, colour, max_price, min_grade, exclude_defects (list of codes), size_label (or size)."""
    q = {k: v for k, v in (query or {}).items() if v not in (None, "", [])}
    lmap = _listing_map()
    out = []
    for raw in store.list_json("records"):
        r = ConditionRecord(**raw)
        lifecycle = store.get_json("seller_drafts", r.id)
        if lifecycle is not None and lifecycle.get("status") != "published":
            continue
        if lmap.get(r.id, {}).get("publication_status", "published") != "published":
            continue
        if "type" in q and q["type"].lower() not in r.item.type.lower():
            continue
        if "colour" in q and q["colour"].lower() not in (r.item.colour or "").lower():
            continue
        if "max_price" in q and (not r.price_band or r.price_band[0] > q["max_price"]):
            continue
        if "min_grade" in q and (not r.grade_set or max(r.grade_set) < q["min_grade"]):
            continue
        size = q.get("size_label") or q.get("size")
        if size and size.lower() not in (r.item.size_label or "").lower():
            continue
        bad = {f["code"] for f in _flaws(r) + _declared_flaws(r)}  # sorter-reported flaws also exclude
        if any(c in bad for c in q.get("exclude_defects", [])):
            continue
        out.append(_card(r, lmap.get(r.id, {})))
    return out


def _rec(id, typ, brand, size, colour, material, grades, band, claims, text, code_seen=True) -> tuple[dict, dict]:
    r = ConditionRecord(
        id=id, item=Item(type=typ, brand=brand, size_label=size, colour=colour, material=material),
        claims=claims, grade_set=grades, price_band=band,
        capture=Capture(code_expected="K7Q2", code_seen=code_seen, take_sha256="fixture", frames=["f1", "f2"]),
        listing_text_en=text)
    l = {"id": id, "en": text, "evidence_badge": "strong" if code_seen else "basic", "fixture": True}
    return r.model_dump(mode="json"), l


def _s(i, code, region, sev, note) -> Claim:
    return Claim(id=i, lane=Lane.shown, code=code, region=region, severity=sev, note=note)


def _cj(i, region, note) -> Claim:
    return Claim(id=i, lane=Lane.cant_judge, code="feel_or_smell", region=region, note=note)


def seed_fixtures() -> list[str]:
    N, M, m = Severity.none, Severity.major, Severity.minor
    fx = [
        _rec("fx_coat_navy_clean", "coat", "Uniqlo", "M", "navy", "100% wool", [4, 5], (4500, 5800),
             [_s("c1", "no_stain_visible", "whole", N, "No stains visible on the outer, collar or cuffs"),
              _s("c2", "no_hole_visible", "whole", N, "No holes or tears visible"),
              Claim(id="c3", lane=Lane.measured, code="chest_width_cm", region="front", value=56.0, error=1.0),
              _cj("c4", "whole", "Smell and fabric feel cannot be judged from the take")],
             "Navy wool coat, clean, no flaws shown."),
        _rec("fx_coat_navy_stain", "coat", "Muji", "M", "navy", "wool blend", [3, 4], (3000, 4000),
             [_s("c1", "stain", "left_cuff", m, "Small dark stain on the left cuff"),
              _s("c2", "no_hole_visible", "whole", N, "No holes visible"),
              _cj("c3", "whole", "Smell cannot be judged from the take")],
             "Navy coat, small stain on left cuff.", code_seen=False),
        _rec("fx_jacket_denim", "jacket", "Levis", "L", "blue", "cotton denim", [3, 4], (3200, 4400),
             [_s("c1", "fading", "back", m, "Light fading across the back"),
              _s("c2", "no_stain_visible", "whole", N, "No stains visible")],
             "Classic denim trucker jacket."),
        _rec("fx_jacket_black_bomber", "jacket", "Alpha", "M", "black", "nylon", [4], (4000, 4800),
             [_s("c1", "no_stain_visible", "whole", N, "No stains visible"),
              _s("c2", "snag", "right_sleeve", m, "Small snag on the right sleeve")],
             "Black nylon bomber."),
        _rec("fx_jeans_indigo", "jeans", "GU", "W30", "indigo", "cotton denim", [3, 4], (1800, 2600),
             [_s("c1", "fading", "front", m, "Whiskering and light fade on thighs"),
              _s("c2", "hole", "pocket", M, "Hole in the left back pocket")],
             "Indigo straight jeans, hole in pocket."),
        _rec("fx_coat_grey_wool", "coat", "Theory", "S", "grey", "wool", [5], (7200, 8400),
             [_s("c1", "no_stain_visible", "whole", N, "No stains visible"),
              _s("c2", "no_hole_visible", "whole", N, "No holes visible")],
             "Grey wool coat in excellent condition."),
    ]
    for rec, lst in fx:
        store.put_json("records", rec["id"], rec)
        store.put_json("listings", rec["id"], lst)
    return [r["id"] for r, _ in fx]
