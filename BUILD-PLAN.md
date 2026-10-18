# Fieldwork build plan (locked concept: the condition oracle for agentic commerce)

**Concept:** second-hand items are one-of-one, so shopping agents can't trade them. Fieldwork makes a used garment's condition machine-checkable, so agents can find, question, pay for and settle second-hand apparel.

**The demo flow:**
- **Yuki (Tokyo seller):**
  - films One Take
  - gets a Garment Pass
  - her listing is readable by agents
- **Buyer (Singapore):**
  - asks Gemini in one sentence
  - the agent searches by evidence, asks the garment questions, shows a try-on of *that* coat, and pays into escrow ("release only if the unboxing matches")
- **Unbox check:**
  - **consistent:** money releases
  - **differs:** a case opens itself
  - **can't tell:** one random close-up is requested

**Window:** Day 1 = Thu 9 Oct → submit Fri 17 Oct.

**Rules for the build:**
- Claude designs the interfaces and reviews the code.
- Well-specified modules go to Sonnet subagents (credits).
- Everything runs locally first (file store), and the cloud is swapped in on Day 6.

---

## 1. Repo layout

```
ai-builder-cup/
  fieldwork-ai/                 Python 3.12 (uv), backend + agents + ML
    fieldwork/
      config.py                 model IDs + paths from env (never hard-code model names)
      gemini.py                 google-genai client: structured output, retries, token/cost log
      store.py                  Store interface: LocalStore (files) now, FirestoreGCSStore on Day 6
      spec.py                   Condition Spec v0 (pydantic) + render(record, lang) + to_merchant()
      take/  frames.py          OpenCV: extract frames, sharpness, pick best per view
             code_check.py      Gemini reads the one-time code in frame
             record.py          Gemini video → draft record (4 lanes, claims with evidence refs)
             flaws.py           Gemini Agentic Vision (code execution zoom) → flaw crops
             grade.py           our SigLIP 2 head → grade set (conformal)
             pipeline.py        take → record → listing (N languages)
      ask.py                    Ask the garment: public record only, answer + crop or "not in the take"
      unbox/ pair.py            match listing↔unbox frames (embedding similarity)
             align.py           AKAZE homography (+ kornia LightGlue if needed)
             diff.py            DINOv2-S patch diff + pixel diff → candidate regions
             judge.py           Gemini compares aligned crop pairs
             gate.py            consistent / differs / cant_tell; random close-up; too-perfect-match flag
      case.py                   typed facts → Gemini ×3 → agreement → remedy proposal | human
      escrow.py                 simulated AP2-style mandate: hold → release on "consistent"
      tryon.py                  Vertex Virtual Try-On if access, else Gemini image edit; labelled "preview"
      market.py                 seed marketplace: ~30 own garments as listings
      agents/ seller.py         ADK seller agent (lists, answers agents from the record)
              buyer.py          ADK buyer agent (search by evidence → ask → try-on → escrow)
              mcp_server.py     fieldwork-mcp: search, get_record, ask_garment, verify_unbox
      api.py                    FastAPI: /take, /pass/{id}, /ask, /unbox, /case, /agent/chat, /escrow
    train/  subset.py, embed.py, heads.py, calibrate.py
    eval/   run_eval.py, forger.py, report.py → results table
    data/   hf/ (subset), garments/<id>/{take.mp4, photos/, unbox.mp4, changes.json}
  fieldwork-app/                Next.js front end (existing; screens reworked on Days 5–6)
```

---

## 2. Data contracts (the only things screens and agents depend on)

- **ConditionRecord:**
  - `id`, `item` (type, brand, size, colour, material)
  - `claims[]`
    - each claim: `id`, `lane` (shown/measured/declared/cant_judge), `code`, `region`, `severity`, `text_key`, `evidence[]` (frame_id, box)
  - `grade_set` (e.g. [3,4]), `flaws[]`, `price_band`, `capture` (code_ok, take_hash, created_at)
- **AskAnswer:** `answer`, `lang`, `state` (shown/not_in_take/cant_tell), `evidence[]`
- **UnboxResult:** `verdict` (consistent/differs/cant_tell), `regions[]` (listing_crop, unbox_crop, what, where), `closeup_request?`, `flags[]`
- **CaseCard:** `facts[]`, `runs[3]`, `agreement`, `proposal` (remedy, pct, reason) | `escalate`
- **Mandate:** `id`, `amount`, `currency`, `condition: "unbox_consistent"`, `status` (held/released/refunded)

---

## 3. Day-by-day (with done-criteria)

| Day | Build | Done when |
|---|---|---|
| **1 · Thu 9** | gemini.py, config, store; HF subset (5–8k) + SigLIP 2 embeddings; baseline heads; **day-1 tests** (Gemini video vs photos on 5 garments; Agentic Vision vs plain on 20 crops; AKAZE on 3 pairs) | Embeddings saved; head beats majority; the 3 tests have a written verdict |
| 2 · Fri 10 | take/ pipeline + spec + render + ask | One real take → valid ConditionRecord + listing in EN/JA + 5 ask answers with crops |
| 3 · Sat 11 | unbox/ pipeline + gate; calibration on planted changes | 10 real pairs → correct verdicts on ≥8; blink-comparator data returned |
| 4 · Sun 12 | case, escrow, market seed, mcp_server, buyer + seller ADK agents | Buyer agent finds the right coat from one sentence, asks 2 questions via MCP, creates a mandate; unbox releases it |
| 5 · Mon 13 | tryon; front end: Take, Pass, Agent chat | Try-on preview of a real listing; three screens on mock → real API |
| 6 · Tue 14 | front end: Unbox (blink), Case; **deploy both services to Cloud Run**. **Feature freeze** | Full flow works on a phone at the public URL |
| 7 · Wed 15 | eval run + forger ladder + results table; record fallback demo clips | Table filled with N and intervals; **Akshat records the video** |
| 8 · Thu 16 | PDF proposal (incl. feasibility), README, deck | All submission items drafted |
| 9 · Fri 17 | Buffer · **submit** | Submitted |

**Cut order if late:**
1. Try-on (becomes a slide)
2. Extra languages (EN + JA only)
3. Remedy slider (escalate everything)
4. Seller agent (keep the buyer agent)
5. MCP (call functions directly)

**Never cut:**
- One Take → record
- Ask the garment
- Unbox check
- Buyer agent + escrow
- The results table

---

## 4. Blocking inputs from Akshat

| Need | By | Why |
|---|---|---|
| `GEMINI_API_KEY` (own key, billing on) set as a Windows user variable | **Day 1** | Every Gemini call and the day-1 tests |
| Google Cloud project + billing (personal Gmail) | Day 4 | Deploy on Day 6; Vertex Try-On check |
| 5 garments: a 12-second take + 3 photos each | **Day 1 evening** | Day-1 video test |
| Session 1: 15 garments (take + photos) → session 2: the same garments re-filmed as an "unboxing" after planted changes | Day 2–3 | Unbox calibration |
| Up to 30 garments in total, near-identical pairs if possible; 150 relabels (two people) | Day 5 | Eval + marketplace seed |
| Teammate approved | Before submission | Rules (min. 2) |

---

## 4b. Changes after the plan challenge (R9, 9 Oct)

All four unknowns check out:

| Unknown | Status | Notes |
|---|---|---|
| Vertex Virtual Try-On (`virtual-try-on-001`) | Exists | Quota limits; needs cloud credentials |
| AP2 sample code | Exists | Python + ADK samples; mandates are signed JSON. **Escrow is our extension** |
| Agentic Vision | Works | Via an AI Studio key with the code-execution tool; calls can take minutes |
| ADK + MCP | Works | `McpToolset` + stdio |

**Changes:**
1. **Google Cloud project + billing + gcloud: today (Day 1), not Day 4.**
2. **Deploy a skeleton by Day 2:** one Cloud Run service (FastAPI serving API + built front end). Every later day ships to the live URL.
3. TLS fixed (system certs via `truststore` / `UV_SYSTEM_CERTS`). ✅
4. **Time-box the SigLIP head to half a day.** If it doesn't beat the baseline, keep it as a reported baseline row only.
5. **Fake early, make real later:** escrow, try-on and marketplace start as stubs returning cached demo outputs. That keeps the demo safe from slow Agentic Vision calls and quota errors.
6. Check the model IDs against the live list on Day 1 (`models.list`); pin the ADK and MCP import paths.

## 5. Credit and token discipline

- **Sonnet subagents implement modules from this contract.** Claude reviews diffs, not whole files.
- **Gemini spend:**
  - Gemini Flash-Lite where it suffices
  - `media_resolution` low for frame selection
  - context caching for the record in the ask/case flows
  - every call logs tokens to `logs/cost.jsonl`
- **No long agent research runs from here on,** except the single plan challenge.
