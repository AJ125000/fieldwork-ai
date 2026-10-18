# Fieldwork: handover for Akshil (10 Oct 2026)

Welcome back, Akshil. This is the full picture in one file: what we're building and why, what exists, honest results so far, and **what you own: the AI architecture, its feasibility, new innovations, and data/training.** Your Claude should also read `CLAUDE.md` in this folder.

**Competition:** Google Cloud AI Builder Cup 2026, JAPAC, Retail & Commerce theme.

**Dates:**
- Feature freeze: Tue 14 Oct.
- We submit Fri 17 Oct. The official deadline is 18 Oct.
- The Singapore finale is 4 Dec; 2 people travel.

**Judging:**

| Criterion | Weight |
|---|---|
| Technical merit and meaningful Gen AI use | 40% |
| Problem alignment and impact | 25% |
| Innovation and creativity | 25% |
| UX and solution design | 10% |

**Mandatory:**
- Gemini or Gemma
- an agentic platform (we use Google ADK + Gemini Enterprise Agent Platform, formerly Vertex AI)
- deployed on Cloud Run
- a working prototype
- a 3-minute video
- docs, and a PDF proposal with a feasibility analysis

---

## 1. The idea (locked)

**Problem:** buying second-hand clothes online is a gamble. Nobody can trust a one-of-one item's condition, and disputes are settled by guesswork. We spent 2 weeks on problem-first research; it's all in `research/`, so start with the reports listed in §7.

**Category:** pre-loved branded and everyday apparel, global/JAPAC.
- Phones were dropped (refurb is already covered by Amazon, Flipkart and Cashify).
- Ethnic wear was dropped (too India-specific).
- Meesho employer check: OK.

**Positioning: "the condition oracle for agentic commerce."**
- Google is pushing shopping agents (Gemini / AI Mode, UCP / AP2).
- Agents can trade new products, because a SKU is a SKU. They can't trade second-hand goods, because every item is one-of-one and an agent can't eyeball photos or trust a seller.
- Fieldwork makes a used garment's condition machine-checkable, so agents can find it, question it, pay for it and settle on it.

**The demo story (hero: Yuki, a Tokyo student, falsely accused of a stain by a buyer in Singapore):**
1. **One Take.** The seller films a 12-second turn of the garment, holding a one-time code. Gemini turns it into a **Garment Pass**: a condition record in 4 lanes (Shown / Measured / Declared by seller / Can't judge from photos), with evidence crops, our model's grade range, a price band, and the listing in 8 languages.
2. **The buyer's Gemini shopping agent (ADK)** gets one sentence ("navy wool coat, no stains, under ¥6,000"). It searches by evidence, asks the garment questions through our **fieldwork-mcp** connector, shows a try-on of *that* garment, and pays into **escrow that releases only if the unboxing matches**.
3. **Unbox:** the buyer either taps "All good" or films the unboxing. The verdict is one of:
   - **Consistent:** money is released.
   - **Differs:** a blink comparator shows the change, and a case opens by itself.
   - **Can't tell:** one *random* close-up is requested. "Can't tell" never moves money.
4. **Case:** the buyer's text is quarantined into typed fields, and Gemini judges 3 times. If all three agree, the case auto-closes with a remedy anchored to a published fair-wear schedule; otherwise a human decides.
5. **"Forger vs Fieldwork":** we attack our own system with AI-faked damage and publish the forger's win rate.

**Wording rules:** never "verified / certified / guaranteed". Say "consistent with the listing", "evidence", "can't tell". Never show a confidence number to users.

---

## 2. What exists (code in `fieldwork-ai/`, front end in `fieldwork-app/`)

| Area | Files | Status |
|---|---|---|
| Foundation | `fieldwork/config.py` (model IDs from env, fallback chain), `gemini.py` (structured output, retries, 180 s timeout, model fallback, token/latency log in `logs/cost.jsonl`, Vertex mode via `FW_USE_VERTEX=1`) | ✅ |
| Data contract | `fieldwork/spec.py`: `ConditionRecord` (4 lanes, coded claims, evidence boxes as `[ymin,xmin,ymax,xmax]` 0–1000 on frame ids), schema.org export | ✅ (**don't break it**: API, UI and agents depend on it) |
| One Take | `take/frames.py` (OpenCV frame extraction, sharpness, selection), `take/record.py` (Gemini: video + frames → draft record; "shown without evidence" is demoted in code), `take/grade.py` (our model at runtime), `take/flaws.py` (Agentic Vision vs plain), `take/pipeline.py` (end to end + translations) | Code done; **real-video run pending (quota + garments)** |
| Ask the garment | `ask.py`: public record + evidence frames only; "shown" without cited claims is downgraded in code | ✅ tested once (Japanese) |
| Unbox check | `unbox/align.py` (AKAZE homography), `unbox/diff.py` (DINOv2-S patch diff + Lab diff → regions; `crop_pair`), `unbox/judge.py` (Gemini on aligned crop pairs + declared-flaw check), `unbox/gate.py` (replay guard, declared-flaw fingerprints, change gate with `MIN_CHANGE_SCORE=3.5`, random close-up), `unbox/pipeline.py` (SigLIP frame pairing) | CV ✅ on synthetic pairs (stain ranked #1 in 3/3; noise ~2.6 vs change ~6). Gemini parts mocked only |
| Case + escrow | `case.py` (quarantine → facts from code → Gemini ×3 → agreement → caps/human), `escrow.py` (HMAC-signed AP2-style mandate, release on "consistent") | Escrow ✅; case mocked |
| Agents | `agents/mcp_server.py` (MCP tools: search, get record, ask, create/get escrow), `agents/buyer.py` (ADK + McpToolset), `agents/seller.py` (answers other agents from the record, never below the floor), `market.py` | Buyer agent ✅ end to end (on gemini-2.5-flash) |
| Extras | `tryon.py` (Vertex `virtual-try-on-001` → Gemini image → cache), `forensics.py` (weak), `imgedit.py`, `stats.py` (Clopper–Pearson) | Mocked |
| Cloud | `store.py` (LocalStore / CloudStore with Firestore + GCS), `Dockerfile`, `deploy.cmd`, `cloud-setup.cmd`, `fieldwork-app/deploy-web.cmd` | Written; **not deployed** (gcloud not signed in) |
| API | `api.py` (FastAPI): /take /records /listings /search /ask /agent/chat /seller/chat /seller/floor /tryon /unbox /case /escrow /media | ✅ smoke-tested |
| Eval | `eval/run_eval.py` (runs every `data/garments/*` folder → `data/results/RESULTS.md` with intervals), `eval/testbed.py` (planted changes via image edit + composite), `eval/forger.py` (laundering ladder), `eval/gemini_grade_baseline.py`, `eval/day1_agentic.py` | Mocked tests ✅ |
| Training | `train/embed.py` (SigLIP 2-B/16-224 frozen embeddings, CPU), `train/heads.py` (ordinal heads + split-conformal sets; stain/hole binary), `fieldwork/ml.py` | Running on the full 28k (see §3) |
| Demo data | `fieldwork/demo_seed.py`: 24 real HF garments (d_01…d_24) with photos; sorter-reported flaws shown as "declared", never "shown" | ✅ |
| Front end | `fieldwork-app/` (Next.js 16): routes `/sell`, `/pass/[id]`, `/agent`, `/unbox/[id]`, `/case/[id]`, `/` | ✅ on fixtures; camera paths untested; premium redesign planned for 11–14 Oct |
| Submission drafts | `submission/README.md`, `PROPOSAL.md`, `VIDEO-SCRIPT.md`, `DECK-OUTLINE.md` (results are `[[placeholders]]`) | Drafts |

**Tests:**
- `tests/test_cv.py`
- `tests/test_agent.py`
- `tests/test_harness.py` (mocked)
- `tests/test_store.py` (mocked)

---

## 3. Honest results so far

1. **Our condition model v0** is frozen SigLIP 2-B/16 at 224px, with ordinal logistic heads fitted on 4.9k garments and tested on 3,390. It is **weak**:

| Measure | Result | Baseline |
|---|---|---|
| Condition QWK | 0.22 | — |
| Condition exact | 32% | majority class 20% |
| Condition within ±1 | 78% | — |
| Pilling QWK | 0.03–0.17 | — |
| Stains AP | 0.42 | prevalence 0.27 |
| Holes AP | 0.16 | prevalence 0.07 |

   - Conformal sets give 91% coverage, but **average 3.6 grades**: honest, but uninformative.
   - Tuning C didn't help.
   - A full 28k retrain is running now (`logs/embed_full.log` → `logs/heads_full.log`).
2. **Dataset labels vs the photo.** RISE/Nauman labels come from people *handling* the garment. Many "Major stain/hole" items show nothing in the single front photo: Gemini (with or without Agentic Vision) saw the flaw in only 2/10. So **flaw detection must be evaluated on our own garment takes**, not on these labels.
3. **Agentic Vision works** on `gemini-3.5-flash`: about 44 s per call, about a dozen crops and zooms. The plain vs agentic comparison is not yet measured; the quota ran out.
4. **Gemini vs our grade model:** only 6 items before the quota ran out. Ignore it.
5. **Gemini quota:** the AI Studio key is on the free tier (about 20 requests per day per model) and is exhausted. **Fix:** sign in with `cloud-setup.cmd` and use Vertex with the ₹28k trial credit (`FW_USE_VERTEX=1`). Akshat is doing this.

---

## 4. Your mission (Akshil owns the AI): rework, check feasibility, innovate, train

Everything in §2 is a working first draft that you're free to redesign. Constraints: keep the `spec.py` contract and the API routes stable (or change them together with Akshat's Claude), and keep to the timeline.

**A. Review and rework the AI architecture (by 11 Oct)**
- Read `BUILD-PLAN.md`, `ROADMAP-APPAREL-v3.md` and `research/reports/R8-0*.md` (red team on feasibility, ML validity, judges, users, fraud).
- Decide what stays, what changes and what's cut. Write your decisions in `AI-ARCHITECTURE.md` (new): components, models, why, risks.
- **Questions to answer:**
  1. Is a single Gemini video pass (One Take) good enough for flaws, or do we need frames plus close-ups plus Agentic Vision?
  2. Should the unbox comparison use our alignment + diff + Gemini-on-crops, or something better: dense matching (RoMa / LoFTR if CPU allows), Gemini directly on pairs, or embedding retrieval?
  3. How should abstention ("can't tell") be calibrated with small data?
  4. Is ADK the right agent orchestration for the take/unbox/case flows, or should only the buyer/seller agents be ADK?

**B. Data and training (the biggest gap for the 40% Technical score)**
- Make the condition model genuinely better than v0, or reframe it honestly. **Options, roughly cheap to expensive:**
  1. **Higher resolution / patch features:** `siglip2-base-patch16-384/512` or naflex; mean of patch tokens.
  2. **Multi-view input:** our takes give front, back, label and close-ups, while RISE gives front, back and label in the full 27 GB zip. The HF mirror is front-only.
  3. **Fashion backbones:** Marqo-FashionSigLIP, FashionCLIP.
  4. **Proper fine-tuning (LP-FT / LoRA)** on a GPU: Colab T4, Kaggle, or Vertex custom training using the trial credit. Also CORN ordinal loss and label-noise-aware training.
  5. **Gemma 3/4 vision LoRA** emitting the coded record (stretch).
- **Report honestly against baselines:**
  - majority class
  - untuned Gemini (`eval/gemini_grade_baseline.py`, n ≥ 100)
  - human non-expert reference: 150 relabels, Akshat to organise
- **Measurement:** report QWK, within ±1, conformal coverage + set size, AP for stains and holes.
- **Our own data:** Akshat films 30 garments plus planted changes (`CAPTURE-GUIDE.md`). Use them for:
  - domain adaptation / calibration
  - flaw-detection eval (Gemini plain vs Agentic Vision)
  - unbox gate thresholds (`MIN_CHANGE_SCORE`)
  - the false-"consistent" rate on look-alike pairs

**C. New innovations (pick what's feasible by 14 Oct)**
- Ideas already researched are in `research/reports/R7-0*.md` (about 95 idea cards), the inventors' reports R8-06 and R8-07, and `ROADMAP-APPAREL-v2.md` §1.
- **Strong candidates:**
  1. Per-claim conformal filtering of the record (ConfLVLM-style)
  2. Agentic Vision ablation as a headline result
  3. A planted-change test bed at scale with Nano Banana 2.1 (synthetic stress test, separate from the headline)
  4. Tape-free measurement (GarmentIQ / landmarks, with the QR card as scale) for "fits like"
  5. Declared-flaw fingerprints for identity
  6. Too-perfect-match / laundering-ladder forensics
  7. Garment re-identification that is robust to folds
- Add anything better you know from Esri / CV practice.

**D. Feasibility check (by 11 Oct):** for each core component, record in `AI-ARCHITECTURE.md`:
- works / risky / cut
- measured latency and cost on Vertex
- what ships by 14 Oct

---

## 5. Who does what

| Person | Owns |
|---|---|
| **Akshil (+ his Claude)** | AI architecture, models, training, evaluation, the results table, the technical part of the PDF and README |
| **Akshat (+ his Claude)** | Product, garment filming, demo story, video, deck. His Claude does integration, front end, deployment, and wiring Akshil's models into the API |
| **Both** | Results table sign-off on 15 Oct, rehearsal |

**Timeline:**

| Date | Milestone |
|---|---|
| 10–11 Oct | Akshil's architecture review + feasibility; cloud sign-in; first garment takes |
| 11 Oct | **Team formation closes** (confirm Akshil is on the Hack2skill team) |
| 12–13 Oct | Training + eval on real takes; wire into the API |
| **14 Oct** | **Feature freeze**; deployed URL works on a phone |
| 15 Oct | Results table final; video recorded |
| 16 Oct | PDF proposal, README, deck |
| **17 Oct** | **Submit** |

---

## 6. Setup for your machine

1. Python 3.12 via `uv`: in `fieldwork-ai/`, run `uv sync`. On a corporate network with TLS inspection, set `UV_SYSTEM_CERTS=1`; the code uses `truststore`.
2. **Data:** `data/emb/*.npz` (SigLIP embeddings) and `models/heads.joblib` are in the zip. The raw HF parquet (2.7 GB) is **not** in the zip. Re-download it with the snippet in `CLAUDE.md` (dataset `fnauman/fashion-second-hand-front-only-rgb`, CC-BY 4.0). The full RISE zip with all 3 views is on Zenodo record 12518734 (26.9 GB).
3. **Gemini:** set your own `GEMINI_API_KEY` as an environment variable (never in code or chat), or use Vertex: `gcloud auth application-default login`, then `FW_USE_VERTEX=1 FW_GCP_PROJECT=project-5c967997-3711-4585-9ed`. Ask Akshat to add you to the GCP project.
4. **Front end:** `fieldwork-app/` (Node 20+): `npm install`, `npm run dev`. The API runs with `uv run uvicorn fieldwork.api:app --port 8000`. Seed demo data with `uv run python -m fieldwork.demo_seed`.

---

## 7. Where everything is

| Path | What |
|---|---|
| `STATUS.md` | Older status, pre-pivot (phones). Historical |
| `FIELDWORK-PRODUCT-BRIEF.md`, `AI-HANDOFF-SPEC.md` | **Pre-pivot (phones)**; still useful for principles, but superseded |
| `ROADMAP-APPAREL.md` → `-v2` → `-v3` | The apparel plan, in versions; **v3 is current** |
| `BUILD-PLAN.md` | **Current build plan**: layout, data contracts, day plan, R9 changes |
| `CAPTURE-GUIDE.md` | How Akshat films garments and planted changes |
| `research/reports/` | All research. Key reports: R4-00 (synthesis), R6-01…05 (apparel stages), R7-01…05 (95 idea cards), R8-01…07 (red team + inventors), R9 (plan challenge) |
| `research/app-reviews/` | 7,812 app reviews + labels (problem evidence) |
| `submission/` | README, PROPOSAL, VIDEO-SCRIPT, DECK-OUTLINE drafts |
| `fieldwork-ai/` | Backend, agents, ML, eval |
| `fieldwork-app/` | Front end + `DESIGN.md` (Akshat's design system) |
