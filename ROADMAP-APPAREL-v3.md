# Fieldwork: roadmap v3, "One Take"

**Date:** 8 Oct 2026 · **Submit:** 17 Oct · **Category:** global pre-loved apparel (apparel locked; the Meesho check passed)
**Supersedes v2.** It is built from:
- R8-06 and R8-07 (the inventors)
- R8-01 to R8-05 (the red team on build feasibility, ML validity, judges, users and fraud)

The v1 and v2 files hold the research detail.

---

## 1. The idea in one breath

> **Sell it in one take. Settle it in one unboxing.**
> The seller turns the garment in front of the camera for 12 seconds; that single take *is* the listing, the condition record and the evidence. The buyer films the unboxing; that single clip *is* the check. If it matches, the seller is paid on the spot. If it doesn't, a case opens itself with both clips attached. Nobody fills a form, writes a description, or argues.

**Steps merged:**

| Before (v2): eight separate chores | After (v3): two takes and a pass |
|---|---|
| capture → grading → listing → buyer Q&A → handover check → dispute filing → evidence gathering → payout | **One Take** (seller) → **Garment Pass** (auto) → **Unbox** (buyer) |
| ~50 taps and ~7 min to list (R8-06) | **2 taps, ~45 s** (estimate; we'll time it in testing) |

**Hero for the story (judges' fix, R8-03):** *Yuki*, a Tokyo student selling a jacket, is falsely accused of a stain by a buyer in Singapore. Today it's her word against theirs. With Fieldwork, her 12-second take settles it in seconds.

**Gemini is visibly the star.** It watches the take, writes every claim, zooms into flaws, answers buyers in their language, compares the two clips, and weighs the case. Our own trained model and classic computer vision are the grounding underneath.

---

## 2. The experience, moment by moment

### Moment 1: One Take (seller, ~45 s)
- The seller taps Sell, and the camera opens with a **one-time code on screen**. They show the garment front and back, then the label, and say the code aloud or hold it in frame: **12 seconds.**
- **Train-friendly fallback:** pick 3 photos from the camera roll. They get a weaker evidence badge (R8-04 fix).
- **Gemini 3.x video understanding** and **sharp-frame selection** turn the take into the listing. It contains:
  - the garment type, brand (read from the label) and size
  - a **four-lane record** (Shown / Measured / Declared / Can't judge)
  - **flaw close-ups from Agentic Vision** (it crops and zooms itself)
  - **our trained condition grade** (an honest range such as "grade 3–4")
  - a price range
  - the multilingual listing
- **At most one follow-up:** "Show the left cuff closer".
- **No printed tag at listing.** The Fieldwork code is printed on the shipping label at sale (R8-04).

### Moment 2: The Garment Pass (automatic)
- The record becomes a **pass**: a web pass (core), and a Google Wallet pass as a stretch goal.
- Buyers scan it or tap it, and "**Ask the garment**" answers in Japanese, Korean, Thai, Hindi and more, with the exact crop, or "Not in the take".
- The pass is the garment's identity from owner to owner. It is also the **agent-readable Condition Spec** that shopping agents can query (MCP is a stretch goal).

### Moment 3: Unbox (buyer)
- **Two options (R8-04 fix):**
  - **"All good":** 1 tap.
  - **"Unbox on camera":** this gives full buyer protection, and the seller is paid **the moment it checks out**. It turns "no video, no refund" into a feature.
- **The check:**
  - Matching frames are paired across the two clips by embedding similarity.
  - They are aligned with AKAZE / LightGlue.
  - A DINOv2 patch difference and a pixel difference are taken.
  - **Gemini compares the aligned crops.**
- **Verdict:**
  - **Consistent with listing**, which pays the seller (simulated).
  - **Differs**, with the **blink comparator** showing the spot flashing, and a case opens automatically.
  - **Can't tell**, which asks for **one random close-up** chosen by the system and never revealed in advance (fraud fix, R8-05). "Can't tell" never releases money.

### Moment 4: The case settles itself (most of the time)
- **The flow:**
  - The case card is pre-filled from the two clips.
  - Facts are extracted into a fixed structure (prompt-injection quarantine).
  - **Gemini judges three times.**
  - When the runs agree, the case auto-closes with a **remedy slider**, anchored to a published fair-wear schedule.
  - When they disagree, or the claim is large, it **goes to a human**.
- **Photo-only claims are capped.** Larger claims require a physical return (fraud fix).
- Both people see the reason in their own language.

---

## 3. What we deliberately do NOT build (red team cuts)

| Cut | Why | Instead |
|---|---|---|
| SAM 3, RoMa v2 | They need a GPU and gated weights (R8-01) | Gemini boxes; AKAZE / kornia LightGlue |
| anomalib, GarmentIQ, measurement | Time; GarmentIQ is stretch only | "Measured" lane on the roadmap slide |
| Synthetic defects for training | Circular when also used for testing (R8-02) | Synthetic defects only as a **labelled stress test**; the headline uses **real planted changes** |
| "Certified" / "guaranteed" wording | Unsupportable with our sample sizes | Report numbers with intervals, per group |
| Printed tag at listing, props | Seller friction (R8-04) | Code on the shipping label at sale |
| Gemini Live voice coach | 7+ days; ~1 fps is not evidence | Slide / stretch |
| Circle to Search, real AP2 payments, Wallet transfer | No public API | Simulated, and said so |

---

## 4. Honest results we will show (R8-02 spec)

| Measure | How | Minimum size |
|---|---|---|
| Condition grade: ours vs untuned Gemini vs non-expert reference | SigLIP 2 + ordinal head trained on a 5–8k HF subset; 2 people relabel 150 test images | 3.4k test; 150 relabelled |
| Grade ranges hold on phone takes | Calibrate in-domain (~1.7k); report phone coverage *as measured* | 30+ garments |
| Unbox check catches real changes | **Real planted changes:** washable marker, lint, a pinned snag | ≥100 changes across ≥30 garments |
| False "consistent" on a different item | Per group: different garments, and near-identical pairs | ~100 different + **as many near-identical pairs as we can (target 10+)** |
| Agentic Vision vs plain Gemini | Same flaw crops | ≥60 crops |
| Forger vs Fieldwork | A ladder of AI-faked damage: raw → JPEG → screenshot → re-photographed; plus a "too-perfect match" detector | 20–30 fakes |
| Cost and speed per take / per check | Logged | All runs |

**Wording rules:** "to our knowledge the first condition-grade baseline on this dataset"; "consistent with listing", never "verified"; no "certified" or "guaranteed".

---

## 5. Architecture (shippable)

```
Phone browser (Next.js; camera, take recorder, blink comparator)
        │
Cloud Run · one service (FastAPI + ADK agents, Python 3.12, built with Cloud Build)
  ├─ take_workflow     : frame select + quality + code check → Gemini video record → Agentic Vision flaws
  │                       → our grade head (SigLIP 2, CPU) → 4-lane record → listing in N languages
  ├─ ask_agent         : answers from the public record only, with crops
  ├─ unbox_workflow    : frame pairing → align → diff → Gemini crop compare → 3-way gate → random close-up
  └─ case_workflow     : typed-fact quarantine → Gemini ×3 → agreement gate → remedy / human
Firestore · Cloud Storage · Gemini 3.x Flash via Gemini Enterprise Agent Platform / AI Studio
```

---

## 6. Schedule (about 8 build days, plus buffer)

| Day | Claude | Akshat (critical path) |
|---|---|---|
| **Thu 9 Oct** | Python 3.12 setup (uv); dataset subset; SigLIP 2 embeddings; **day-1 tests:** Gemini on video vs on photos, Agentic Vision gain, frame alignment on 3 pairs, composite fake stain; hello-world deploy | **Google Cloud project + billing (personal Gmail)** and a Gemini key with billing: **nothing deploys without this.** Photo session 1: 15 garments, a One Take video + 3 photos each |
| Fri 10 Oct | Grade head + calibration; take_workflow end to end | Session 2: re-film the same 15 after planting changes; near-identical pairs |
| **Sat 11 Oct** | 4-lane record, listing, Ask the garment, Garment Pass page | **Teammate locked (hard deadline).** Garments 16–30 |
| Sun 12 Oct | unbox_workflow + blink comparator + random close-up | Planted-change re-shoots for 16–30 |
| Mon 13 Oct | case_workflow + remedy slider + pay-on-pass (sim); stress-test fakes | Relabel 150 images (you + teammate/friend; ~1 h each) |
| **Tue 14 Oct** | Front end wired + deployed on a phone URL. **Feature freeze** | Test on your phone; time the takes |
| Wed 15 Oct | Evaluation run + results table + Forger ladder; demo fallback videos | **Record the 3-min video** (Yuki's story) |
| Thu 16 Oct | PDF proposal with feasibility analysis; README; deck | Review the deck and PDF |
| **Fri 17 Oct** | Buffer | **Submit** |

**Stretch (only if ahead of schedule):**
- Google Wallet pass (needs an issuer account; apply now if you want it)
- fieldwork-mcp
- buyer memory (Memory Bank)
- measurement

**Stage in Singapore:** every demo segment has a pre-recorded fallback, and the "blind swap" on a judge's garment is an optional live bonus (R8-01: conference Wi-Fi and cold starts).

---

## 7. Risks still open

| Risk | Mitigation |
|---|---|
| Gemini on video misses small flaws that a still photo would catch | Day-1 test. If it fails, the take still lists, but flaws come from the sharpest extracted frames plus one close-up |
| No billing by 9 Oct | Nothing deploys; this is the #1 action today |
| No teammate by 11 Oct | We can't submit; this is the #1 non-technical risk |
| Garment photo sessions slip | Critical path: book two sessions this week |
| Front end too heavy for one builder | A web-dev teammate owns it; otherwise reuse the existing screens with the minimum restyle |
