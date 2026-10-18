# Fieldwork: apparel roadmap v2

**Date:** 8 Oct 2026 · **Submit:** 17 Oct · **Category:** global pre-loved branded and everyday apparel
**Supersedes:** `ROADMAP-APPAREL.md` (v1). v1 still holds the stage-by-stage detail and the risk register; v2 lists what changed and what we build.

**Round 2 research (≈95 idea cards, each one new relative to v1):**

| Report | Lens |
|---|---|
| R7-01 | Adjacent industries: car rental, insurance, rental fashion, museums, textile QC |
| R7-02 | Frontier research 2025–26 |
| R7-03 | Open-source and Google sweep |
| R7-04 | Startups and business models |
| R7-05 | Wildcards and demo |

---

## 1. What changed from v1, in one table

| Area | v1 | v2 | Why (source) |
|---|---|---|---|
| Sparse stain/hole labels | Gemini + classifier only | **Synthetic defects:** Nano Banana 2.1 (GA 6 Oct), mask-controlled, adds stains, holes and snags to clean garments. Used to train, *and* to build a planted-change test bed of hundreds of pairs | R7-02 #1–2, R7-03 #2 |
| Defect finding | Gemini boxes, run 3 times | **Gemini Agentic Vision** (code execution: it crops and zooms itself), reported *with vs without* | R7-02 #3, R7-03 #3 |
| Honesty of the record | Conformal grade sets | Plus **per-claim conformal filtering** (ConfLVLM, EMNLP 2025; false claims 87.8% → 10.0% in the paper). The record carries a stated error bound | R7-02 #5 |
| Defect scale | Our own codes | **Four-point demerit system** (the textile-QC standard): seller-facing, judge-credible | R7-01 #10 |
| Garment parts | garment-detector-seg | **SAM 3** text-prompted parts ("left cuff"), with FASHN parser as a fallback | R7-02 #11, R7-03 #8–9 |
| Change detection | PatchCore fit per item | **AnomalyDINO** (one-shot, no fitting) | R7-02 #8 |
| Alignment | Thin-plate spline | **RoMa v2 dense warp**, with built-in visibility masks. TPS is the fallback | R7-02 #7 |
| Handover capture | Free guided shots | **Ghost overlay:** the listing photo is overlaid in the camera, which auto-snaps when aligned | R7-01 #4 |
| Identity of plain garments | Tag + declared flaws | Plus **tag-code OCR cross-check** (style code, RN/CA number, production date) and an optional **sealed "witness mark"** (hash committed at listing, revealed at handover) | R7-01 #15, R7-05 |
| Holes and thin spots | Not handled | Optional **backlit "light-through" shot** of cuffs and elbows | R7-01 #3 |
| Measurement | Build from scratch | **GarmentIQ** package (MIT) for the day-1 test, with a tape-measure reveal in the demo | R7-03 #4, R7-05 |
| Dispute judging | Claim/policy/skeptic agents | **Meta-judge** (debate amplifies bias) + **"Trust or Escalate"** (accepts only at a guaranteed agreement level, otherwise a human) + a **published fair-wear schedule** (tolerances shown *before* any dispute) | R7-02 #4, #9; R7-01 #2 |
| Remedy | Severity-weighted refund | Plus **remedy anchors** (age depreciation + repair-cost quote) and **pay-on-pass** (seller paid when the handover check passes) | R7-01 #12, R7-04 #3 |
| Fraud | Capture proof | Plus a **cross-case registry** (recycled damage photos, serial claimants) and **"Forger vs Fieldwork"**: we attack ourselves with AI-faked damage and publish the forger's win rate | R7-01 #7, R7-05, R7-02 #18 |
| Agent commerce | Not planned | **Fieldwork Condition Spec v0**, an agent-readable record mapped to Merchant Center/schema.org and ISO 20245 + a **fieldwork-mcp** connector (`get_record`, `ask_garment`, `verify_handover`) | R7-04 #1–2, R7-03 #15 |
| Platform naming | "Vertex AI" | **Gemini Enterprise Agent Platform** (Vertex's new name; this is the "Agent Platform" the rules name). Agent Engine + Memory Bank for buyer sizes and preferences | R7-03 #5 |
| Positioning | vs AI-listing apps | Also vs **Google Lens resale value**: Lens says what an item is *worth*; we show what *this one's* condition is, with evidence | R7-03 #21 |

---

## 2. The five signature innovations (what judges should remember)

1. **A model that knows what it doesn't know.**
   - It is trained on 28k real second-hand garments, plus synthetic defects.
   - It is the first published condition- and pilling-grade baseline on this dataset.
   - Its record carries a **stated error bound**, claim by claim.
2. **An AI inspector that zooms in.** Gemini Agentic Vision crops its own close-ups of suspected flaws, and we show measured gains against plain Gemini.
3. **A handover check you can watch.**
   - The ghost overlay gives an aligned arrival photo.
   - The **blink comparator** shows the changed spot flashing.
   - The verdict is "consistent with listing / differs / can't tell", calibrated on hundreds of planted changes.
4. **Forger vs Fieldwork.** We attacked our own system with AI-faked damage and report the forger's win rate. This matters because Vinted faced a refund-fraud wave in Mar 2026.
5. **Built for agents.**
   - Shopping agents can read an open condition spec and an MCP connector.
   - The outcome flows into pay-on-pass and, as a stretch, an AP2 payment mandate.

---

## 3. Build plan v2 (Claude ≈ 9 working days; tiers are strict)

| # | Component | Days | Tier |
|---|---|---|---|
| 1 | Data pipeline (HF mirror 28k/3.4k) + SigLIP 2 embeddings + CORN heads + calibration + conformal sets | 1.5 | CORE |
| 2 | Synthetic defects (Nano Banana 2.1, masked) → training augmentation + planted-change test bed | 1.0 | CORE |
| 3 | Capture workflow: quality gate, nonce/QR, SAM 3 parts, coverage, planner agent, tag OCR, ghost overlay | 1.5 | CORE |
| 4 | Inspector: Agentic Vision + crop classifier + reconcile + per-claim conformal filter + demerit score | 1.0 | CORE |
| 5 | Record (4 lanes) + Condition Spec v0 + multilingual render + "Ask the garment" | 1.0 | CORE |
| 6 | Handover: RoMa v2 / LightGlue + declared-flaw and tag identity + AnomalyDINO change + calibrated gate + blink comparator | 1.5 | CORE |
| 7 | Dispute: fact quarantine (Model Armor) + meta-judge + Trust-or-Escalate + fair-wear schedule + remedy anchors + human approval | 1.0 | CORE |
| 8 | Front end re-skinned for apparel and wired up; deploy to Cloud Run + Agent Platform | 1.5 | CORE (**a web-dev teammate can own this**) |
| 9 | Evaluation run + results table + Forger vs Fieldwork run | 0.5 | CORE |
| — | Measurement (GarmentIQ) + "fits like" | 0.5 | STRETCH-1 |
| — | fieldwork-mcp | 0.5 | STRETCH-1 |
| — | Pay-on-pass escrow (simulated) | 0.3 | STRETCH-1 |
| — | Cross-case photo registry | 0.3 | STRETCH-2 |
| — | Backlit shot, witness mark | 0.3 | STRETCH-2 |
| — | AP2 mandate, Memory Bank, voice coach, try-on, parallax video | — | STRETCH-3 / slide |

**Honest load:** CORE is about **10.5 Claude-days in 9 days.** It only fits if:
- (a) a web-dev teammate takes #8, or
- (b) we drop #2's training use and keep only the test bed.

**Pitch-only (0 build):**
- buyback underwriting
- evidence-priced return assurance
- JAPAC inspection-hub economics
- weigh-in chain of custody
- garment passport / EU DPP
- 3D reconstruction

---

## 4. The demo (3-min video; 5-min stage in Singapore)

1. **Capture (30 s).** A jacket is listed. The coach asks for one cuff close-up, and the record shows four lanes with crops. *Optional:* measurement lines draw on the jacket, then a real tape confirms them.
2. **Ask the garment (20 s).** A question in Japanese: "Any stains on the sleeves?" The answer comes with the crop, or "Not in the photos". Then the **"make it lie"** challenge, where it refuses to claim what it can't see.
3. **Handover (45 s).** The ghost overlay aligns, the **blink comparator** flashes a new stain on the left cuff, and the verdict is "Differs".
4. **Case (30 s).** The one-line outcome, a refund slider anchored to the fair-wear schedule, and a human approves.
5. **Forger vs Fieldwork (20 s).** A Nano Banana-faked damage photo is caught, along with the forger's win rate.
6. **Numbers (25 s).** The results table: our model vs Gemini vs human, the certified false-match bound, and cost per check.

**On stage:** a judge's own garment is scanned live, altered off-stage, then the check names the change (the "blind swap").

---

## 5. Day-1 feasibility tests (updated)

| Test | Pass if | If it fails |
|---|---|---|
| HF mirror + SigLIP 2 on CPU | ≥5k images embedded in under 1 h | Smaller subset / Colab |
| Linear probe on grade | Beats majority and is close to untuned Gemini | Lean on Gemini + calibration |
| Nano Banana 2.1 masked stain on 10 garments | A human can't easily tell 6/10 are synthetic | Open-source anomaly synthesis (R7-02 #13) |
| Agentic Vision vs plain Gemini on 20 defect crops | Finds more true flaws | Keep plain Gemini, drop the claim |
| GarmentIQ vs tape (5 garments) | Within ±2 cm | Measurement → slide |
| RoMa v2 / LightGlue on 3 folded pairs | Aligns labels and prints | TPS + tag only |

---

## 6. Decisions for Akshat

1. **Approve v2 CORE.** Which fallback, if no web-dev teammate: (a) or (b)?
2. **The stage demo:** blind swap on a judge's garment, yes or no?
3. **Still open:** the Meesho check, and the teammate by 10 Oct.
