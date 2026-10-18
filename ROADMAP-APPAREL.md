# Fieldwork: apparel roadmap (end to end)

**Date:** 7 Oct 2026 · **Submit:** 17 Oct (official deadline 18 Oct; team formation closes 11 Oct)
**Category:** pre-loved branded and everyday apparel (jackets, denim, hoodies, shirts, dresses). Global / JAPAC.
**Sources:** research/reports R6-01 (capture), R6-02 (condition model), R6-03 (listing, fit, record), R6-04 (handover), R6-05 (disputes, business, pre-mortem), plus R4-00..04 and R5-01..02.

---

## 0. Verdict: GO with apparel

- All five stage reviews say **stay**. None found a technical blocker that forces a category change.
- **The only switch trigger:** Akshat's employer (Meesho) policy check. If that fails, fall back to books.
- Every serious risk has a mitigation, listed in §4.

**The one-line pitch:**
> "Second-hand clothes come with a record of evidence: what's shown, what's measured, what isn't shown. At handover, an AI check says whether it's consistent with the listing. Disputes get settled on evidence, not guesswork."

**How we position it:**
- **We lead with evidence, not AI-written listings.** Carousell (Gemini), Mercari, Depop, eBay and ThredUp already ship AI listing generation (R6-03).
- **The closest competitor, Fleek Sort, grades garments for B2B sorting hubs.** Nobody gives *buyers and sellers* a handover check and an evidence-based dispute (R6-05).

---

## 1. The journey, stage by stage

Each stage lists: what the user sees · the AI and technology · our innovations (with the paper or library each builds on) · risks · build tier.

Build tiers:
- **CORE** is built first.
- **STRETCH** only once the core works end to end.
- **SKIP** is a roadmap slide only.

### Stage A: Seller capture (R6-01, R4-02)

**What the seller sees:**
- **The 4 core shots (default):**
  1. front flat-lay
  2. back flat-lay
  3. brand and care label
  4. a close-up of each flaw
- **"Stronger evidence badge" (optional):** add the **Fieldwork card/tag** (QR + one-time code + grey patch) and 2–4 coached close-ups: collar, cuffs, armpits, hem.

**AI and technology:**
- **Live quality gate in the browser** (OpenCV.js): checks blur (Laplacian), exposure, glare and framing.
- **Garment segmentation:** `garment-detector-seg` (Apache-2.0, Fashionpedia-trained), or Gemini masks.
- **Gemini Flash-Lite:** confirms the angle and the coverage.
- **ADK capture-planner agent:** decides the next shot ("show the left cuff closer").
- **Capture proof:**
  - a server nonce, shown as a QR plus a handwritten code in the frame
  - duplicate and stock-photo checks (PDQ / ImageHash, Gemini Embedding 2, Cloud Vision Web Detection)
  - an AI or edit risk flag (Community Forensics, TruFor), shown as a flag only, never a verdict

**Innovations:**
1. **Tape-free measurement (wow 5, feasibility 4).** The card's known size gives scale via a homography. Garment landmarks then give chest, length, shoulder and sleeve, with error bars.
   - **Builds on:** Kowaleczko 2022 (ArUco, 4.07% mean error) and HRNet landmarks (MIT licence); Gemini points are tested against them.
2. **Flaw ledger:** every flaw gets a size in mm and a position relative to landmarks, e.g. "left cuff, 3 cm from the seam".
3. **Defence against AI-faked damage claims.** Vinted had a public refund-fraud wave in Mar 2026. Damage claimed at arrival is checked against the nonce-proven listing record.
4. *(Stretch)* **Gemini Live voice coach** during capture. The ADK live toolkit is experimental, so a scripted coach is the fallback.

**Risks:**
- **Seller friction (high).** Mitigation: tiered capture, with the card optional.
- **No hardware camera proof on the web (medium).** The evidence badge is graded, not binary.

**Tier:**
- **CORE:** quality gate, 4-shot protocol, nonce/QR check, duplicate check, measurement.
- **STRETCH:** AI or edit risk flag, voice coach, C2PA manifest.
- **SKIP:** fabric-weave fingerprint (gets a 1-hour feasibility test only).

### Stage B: The condition model (R6-02): our trained model

**Data:**
- **Train:** the Hugging Face mirror `fnauman/fashion-second-hand-front-only-rgb` (CC-BY; 28.2k train / 3.4k test; front photo; background removed). It replaces the 26.9 GB zip.
- **Cross-domain test:** the Norway 16.5k-garment set (CC-BY, non-standard photos).
- **Our 40 phone-photographed garments:** used for calibration, domain adaptation and a human-ceiling check.

**Model:**
- A **frozen SigLIP 2-B/16** backbone, compared against Marqo-FashionSigLIP.
- **Multi-task CORN ordinal heads** for the 1–5 condition grade, the 1–5 pilling grade and a price bucket.
- **Masked stain and hole heads** (labels are sparse).
- *Optional:* linear-probe-then-fine-tune.

**Calibration and honesty:**
- temperature scaling
- **split-conformal grade sets** ("grade 3 or 4", rather than a false single number)
- out-of-distribution abstention, so the model says "can't tell" when unsure

**Defects:**
- **Gemini 3.x boxes** localise each defect, and a **crop classifier confirms** it.
- Only defects found by both are shown; the rest go to "ask for a close-up".

**Metrics:**
- QWK (quadratic weighted kappa)
- within-±1 grade accuracy
- AP for defects
- ECE (calibration)
- a risk–coverage curve

**Baselines:**
- majority class
- **untuned Gemini**
- human annotator agreement

**Target:** QWK of 0.55–0.65. This is our estimate; no published number exists.

**Innovation, and a research first:**
- Only two papers use this dataset, and the best published result is binary damage AP 72.
- **Nobody has published a condition-grade or pilling baseline, so ours will be the first.**
- The model also "knows when it doesn't know": conformal grade sets plus the "ask for another photo" loop.

**Risks:**
- **Stain and hole labels are mostly missing (high).** Stains are 71% blank and holes 95% blank; only 356 positives were verified. Mitigation: train grade and pilling, which are well labelled. Defects come from Gemini plus the classifier, and are always framed as evidence and abstention, never a verdict.
- **Domain gap (high).** The training photos are sorting-line shots, not phone photos. Mitigation: adapt on our 40 garments, report the cross-domain score, and abstain.

**Tier:**
- **CORE:** SigLIP 2 heads, calibration, conformal sets, the Gemini baseline.
- **STRETCH:** Gemma 4 E4B LoRA writing the coded record; Vertex tuning of Gemini 2.5 Flash (retiring around 16–20 Oct, so risky).

### Stage C: Item record, listing, "Ask the garment", fit (R6-03, R4-04)

**The record:** compact, coded and language-neutral.

**Each claim sits in one of four lanes:**
| Lane | Example |
|---|---|
| **Shown** | "No stain visible on cuffs (2 close-ups)" |
| **Measured** | "Chest 52 cm ± 1" |
| **Declared by seller** | "Smoke-free home", "worn 5 times" |
| **Can't judge from photos** | smell, feel, fit on the body |

**Cost and languages:** about 95 tokens per record, versus 262 for verbose JSON. It is rendered at read time into EN, JA, KO, TH, ID, VI and HI.

**Innovations:**
1. **A cited listing and "Ask the garment" (score 20).** Every sentence and every answer carries a claim ID and the crop behind it. Questions about unseen regions get "Not in the photos". This abstention is **enforced in code**, not left to the prompt.
2. **"Fits like…" (score 18).** The garment's measurements are compared with one the buyer already owns, giving **snug / similar / roomy**, with error bars and a "can't tell" state.
   - **Honest framing:** even Zalando's mature system prevents only about 8–10% of size returns, so this is comparison, not prediction.
3. **The garment passport.** The record travels with the garment from owner to owner. The tag is encoded as a **GS1 Digital Link**, making it "ready for the EU digital product passport" (textile duties from about 2028–29).

**Risks:**
- **"AI listing" is already common (high, positioning only).** Mitigation: lead with evidence and with what isn't shown.
- **The glossary needs native-speaker checks** in 6 languages.

**Tier:**
- **CORE:** record schema, four lanes, cited listing, "Ask the garment", multilingual render.
- **CORE-lite:** fits-like (once measurement works).
- **SKIP:** passport (roadmap slide).

### Stage D: Search and discovery (R6-03)

**Tri-state condition search:**
- "Shown clean" is not the same as "not shown".
- Example query: "only grade ≥4, cuffs shown clean".
- Built on Marqo-FashionSigLIP (Apache-2.0).

**Tier:** **STRETCH.**

### Stage E: The handover check (R6-04)

**The flow:**
1. The buyer takes a guided flat-lay at arrival, with the tag still attached.
2. **Normalise:**
   - the tag corners give scale and a colour reference
   - garment-part masks plus landmarks drive a **thin-plate-spline warp onto a standard garment template** (kornia / OpenCV)
3. **Identity, from distinctive marks rather than overall look:**
   - the tag serial
   - label and print matching (ALIKED + LightGlue + MAGSAC)
   - **recovery of the seller's declared flaws**
4. **Change, region by region:**
   - an albedo-space difference (Lab chroma)
   - anomalib PatchCore fitted on the listing crop
   - wrinkle suppression
   - **Gemini judges only aligned crop pairs**, never whole photos
5. **Gate:** a fixed three-way decision, **Consistent with listing / Differs (what, where) / Can't tell**.
   - Thresholds are set with Learn-then-Test (MAPIE) and reported with Clopper–Pearson intervals.
   - On "Can't tell", an ADK agent asks for **one targeted close-up**.

**Innovations:**
1. **Declared-flaw fingerprints (score 20).** A flaw that has vanished is strong evidence of a swap.
2. **A defect map in template space (score 20):** "new ~2 cm stain, wearer-left cuff".
3. **An active re-ask on the most uncertain region** (score 16).
4. **A risk-certified gate** (score 16).

**Risks:**
- **A plain mass-produced garment with no marks can't be proven to be the same unit (high).** The tag proves only the tag.
  - Mitigation, through wording: "**consistent with listing**", never "proven same item".
  - This does **not** force a category change.
- **Small validation set.** With 60–100 hard negatives, the best false-match rate we can certify is about 3–5%. We state this openly.
- **Avoid:**
  - DeepFashion2: request-form access, dormant since 2020
  - UniGarmentManip: the repo is a stub
  - SuperPoint weights, unless needed

**Tier:**
- **CORE:** normalise, identity marks, region change, gate, re-ask.
- **STRETCH:** buyer-preference weights (which defects this buyer accepts).

### Stage F: Problem → case → fair outcome (R6-05, R4-04)

**The flow:**
1. **Arrival scan** within the 2–3-day report window. The handover result *is* the evidence.
2. **The case card:**
   - a quarantined fact extractor (no tools; prompt-injection defence)
   - a **claim-vs-evidence score**
   - a **"can't judge from photos" lane** for smell and fit
   - claim, policy and skeptic agents
   - adjudication run **twice with the party order swapped** (a bias check)
   - a deterministic abstention gate
   - a **human approves**
3. **Proportional remedy engine.** A dispute costs about $40–80 (estimate), often more than the item. So the engine proposes a **severity-weighted partial refund** ("keep it, get 20% back") instead of a return.
4. **Both sides see the reason,** in their own language.

**Evidence:**
- Mercari JP's "trouble rate" (all categories): 0.56% in H2 2023, 0.35% in H1 2026.
- **Mercari built a physical collection centre and a full-compensation programme because of swapped and empty returns.** Fieldwork is the software substitute.

**Scope line on fakes:** "Authenticity is not in scope; risk flag only." Vinted's own authenticity check also excludes apparel.

**Tier:**
- **CORE:** case card, can't-judge lane, human approval, remedy engine.
- **STRETCH:** order-swap and injection test suite published in the repo.

---

## 2. Architecture

```
Browser (Next.js, existing)
  │  photos, nonce, answers
  ▼
Cloud Run: api (Python, Google ADK 2.11 workflow)
  ├─ capture_workflow   : quality gate → segment → Gemini coverage → planner agent → proof checks
  ├─ condition_workflow : SigLIP 2 heads (ours) ∥ Gemini boxes → crop classifier → reconcile → conformal sets
  ├─ record_builder     : coded record (4 lanes) → measurements → render(lang)
  ├─ ask_agent          : grounded Q&A over public record only
  ├─ handover_workflow  : normalise → identity → region change → gate → re-ask agent
  └─ case_workflow      : quarantine → claim/policy/skeptic → order-swapped adjudication → gate → human
Cloud Run: vision (CPU: SigLIP 2, LightGlue, PatchCore, OpenCV; weights baked into the image)
Firestore (records, cases, events) · Cloud Storage (photos; hashes) · Gemini 3.x Flash / Flash-Lite via AI Studio / Vertex
```

**Why this design scores well on the 40% Technical criterion:**
- It is agentic (ADK).
- It uses a **model we trained** and compare against Gemini.
- It uses classical CV where determinism matters.
- Its uncertainty is calibrated.
- Every claim is measured.

---

## 3. Data plan

| Data | Use | Owner | When |
|---|---|---|---|
| HF mirror, 28.2k + 3.4k (CC-BY) | Train and test the condition model | Claude | 8 Oct |
| Norway 16.5k set (CC-BY) | Cross-domain test | Claude | 9 Oct |
| **40 own garments** (mix of branded and everyday; ≥15 with real flaws) | Calibration, domain adaptation, demo | Akshat | 8–10 Oct |
| Tape measurements of those 40 (chest, length, shoulder, sleeve) | Measurement accuracy | Akshat | 8–10 Oct |
| **Handover pairs:** re-photograph each garment folded differently, in other light; add *removable* changes (washable marker "stain", a lint patch, a safety-pin "snag"); ~10 near-identical pairs (two similar plain tees) | Gate calibration, false-match rate | Akshat | 9–11 Oct |
| Printed Fieldwork card/tag (I'll generate a PDF) | Scale, colour, nonce | Akshat prints | 8 Oct |
| ~20 synthetic disputes + ~15 injection attempts | Case evaluation | Claude | 12 Oct |

---

## 4. Deal-breaker register (consolidated)

| # | Risk | Severity | Mitigation | Forces a switch? |
|---|---|---|---|---|
| 1 | Meesho employer-policy conflict | High | Check now; public data only | **Yes, if it fails → books** |
| 2 | Plain garments can't be proven to be the same unit | High | Wording ("consistent with listing"), tag, declared-flaw fingerprints | No |
| 3 | Stain and hole labels are sparse in the training data | High | Train grade and pilling; defects via Gemini + classifier; abstain | No |
| 4 | Domain gap: sorting-line vs phone photos | High | 40-garment adaptation; cross-domain test; conformal abstention | No |
| 5 | Seller friction (card + many shots) | High | 4-shot core; card optional | No |
| 6 | "Looks like a Gemini photo grader" | High | Lead with the trained model + results table + handover gate | No |
| 7 | Smell, fit and feel can't be photographed | Medium | "Can't judge" lane; measured fit comparison | No |
| 8 | Small validation set | Medium | Report intervals openly | No |
| 9 | Model churn (Gemini IDs, ADK releases) | Medium | Pin versions; model IDs in env vars | No |
| 10 | Scope vs 10 days, no team member confirmed | High | CORE only until end to end; teammate by 10 Oct | No (but a team is required to submit) |

---

## 5. Day-1 feasibility tests (kill switches, 8 Oct)

| Test | Pass if | If it fails |
|---|---|---|
| HF mirror downloads; SigLIP 2 embeddings run on this laptop's CPU | ≥5k images embedded in under 1 h | Use a smaller subset or Colab |
| Quick linear probe on condition grade | Better than majority class and close to untuned Gemini | Lean on Gemini + calibration; keep the trained model for pilling |
| Gemini landmark points vs tape measure (5 garments) | Within ±2 cm | Use HRNet landmarks; if both fail, drop measurement to STRETCH |
| LightGlue on 3 handover pairs | Matches labels and prints across folds | Rely on the tag + declared flaws |
| Fabric-weave fingerprint (1 hour) | Same garment re-identified from macro shots | Skip (roadmap slide) |

---

## 6. Ten-day schedule

| Day | Claude builds | Akshat |
|---|---|---|
| **Wed 8 Oct** | Day-1 tests; data pipeline; card/tag PDF; capture guide | Print the card; photograph garments 1–20 + tape measurements; **teammate search**; Meesho check |
| Thu 9 Oct | Train condition heads + calibration; capture workflow (ADK) | Garments 21–40; start handover pairs |
| Fri 10 Oct | Record builder, 4 lanes, cited listing, "Ask the garment", measurement | Handover pairs; **choose teammate** |
| **Sat 11 Oct** | Handover workflow (normalise, identity, change, gate) | **Teammate joined (hard deadline)** |
| Sun 12 Oct | Gate calibration; case workflow + remedy engine; synthetic disputes | Review outputs on own garments |
| **Mon 13 Oct** | Front end re-skinned for apparel and wired to the API; deploy both services to Cloud Run. **Feature freeze** | Test the live link on a phone |
| Tue 14 Oct | Full evaluation run → results table; premium UI polish of the hero screens | Video script |
| Wed 15 Oct | Fixes | **Record the video (< 3 min)** |
| Thu 16 Oct | README; **PDF proposal with feasibility analysis (required)**; deck | Deck story, final review |
| **Fri 17 Oct** | Buffer | **Submit** |

---

## 7. What we'll report (the results table)

| Measure | Our system | Untuned Gemini | Human | N / interval |
|---|---|---|---|---|
| Condition grade (QWK, within ±1) | | | | |
| Pilling grade (QWK) | | | | |
| Defect evidence precision | | | | |
| Abstention rate and accuracy on answered items | | | | |
| Measurement error (cm) | | | | |
| Handover false-match rate (certified upper bound) | | | | |
| Handover change detection (recall on planted changes) | | | | |
| Prompt-injection attempts resisted | | | | |
| Cost per listing / per handover / per case | | | | |
| Latency per stage | | | | |

---

## 8. Cut list (if behind schedule, cut in this order)

1. Voice coach
2. Tri-state search
3. Gemma 4 LoRA
4. AI/edit risk flag
5. Buyer-preference weights
6. Fits-like (keep raw measurements)
7. Proportional remedy (keep the case card)

**Never cut:**
- the trained condition model and its baseline comparison
- the handover gate
- the four-lane record
- the results table
