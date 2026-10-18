# R8-01 Red team: build feasibility of ROADMAP-APPAREL-v2

Date: 8 Oct 2026. Scope: section 3 CORE components of `ROADMAP-APPAREL-v2.md`. Attacker view: will it run on this laptop, will it deploy, what breaks the schedule.

## 0. Verified facts about the environment (probed today)

- Laptop: Windows 11, 14 logical cores, 15.5 GB RAM, Intel integrated graphics only (no CUDA), 180 GB free disk, Python 3.14.6, git present.
- **No `docker`, no `gcloud`** on PATH. Docker is not installed, so no local image builds. The only route to a Cloud Run image is `gcloud run deploy --source` or Cloud Build, which needs gcloud + a billing-enabled project.
- PyPI today for cp314 win_amd64: `torch 2.14.1` has a 124 MB CPU wheel (works). `torchvision 0.29`, `kornia 0.8.3`, `transformers 5.19`, `open_clip_torch 3.3`, `anomalib 2.7`, `garmentiq 0.0.4.11` (MIT, py>=3.11, pure wheel), `sam3 0.1.4`, `romav2 2.0.1` all resolve. A published wheel is not the same as "runs": pycocotools (sam3 dep), numpy pins and the ADK stack are the cp314 risks (not tested; mitigate with `uv` Python 3.12, which needs no admin).
- `lightglue` is **not on PyPI** (install is `git clone` + `pip install -e .`). kornia ships its own LightGlue + DISK, which is pip-installable (from memory, verify on day 1).
- SAM 3: README requires Python 3.12+, PyTorch 2.7+, **CUDA 12.6+ GPU**; checkpoints are **gated on Hugging Face (request access)**; 848M parameters (about 3.4 GB in fp32); "SAM License", not Apache.
- RoMa v2: `romav2` pip package, MIT code, "tested on Linux python 3.12". Its README excludes **DINOv3**, which has its own license and (my read) gated HF weights. CPU use is not documented; the fused CUDA kernel is Linux-only and optional.
- AnomalyDINO: research repo (dammsi/AnomalyDINO), not a pip package; timings in the paper are GPU (A40, ~60 ms). The method itself is simple (DINOv2 patch features + nearest-neighbour memory bank), so it is a 100-line reimplementation using ungated `facebook/dinov2-small/base`.
- **Nano Banana 2.1 exists** (`gemini-nano-banana-2.1`, listed as the recommended image model; also `gemini-3.1-flash-image` GA per Google's model page, release 28 May 2026). **The docs document no mask or inpainting parameter.** Editing is prompt-driven (image + text instruction). Mask-based edits are documented only for Imagen (`imagen-3.0-capability-001`) on the Vertex/Agent Platform path. So "mask-controlled" in v2 is **not supported as written**. The "GA 6 Oct" date in the roadmap could not be confirmed.
- **Gemini Agentic Vision** is real: Gemini 3 Flash + the code-execution tool (think/act/observe, crops and zooms). Announced Jan 2026, available via Gemini API / AI Studio / Vertex. Limits: code-execution timeout (about 30 s) and no file I/O. Check the current model ID and status on the day.
- Image generation on the Gemini API free tier is reported paid-only or zero quota (sources conflict), so assume billing is required for Nano Banana. Google Cloud free trial needs a card; India needs an INR billing account; one forum anecdote reports a surprise Rs 1,000 deposit and a "not in good standing" block.

## 1. Component verdicts

Days are realistic for one AI assistant working serially, including debugging in this environment, with a non-technical lead who has to supply photos, labels and accounts. They are not the v2 days.

| # | Component | Verdict | Why | Fix / cheaper substitute | v2 days | Realistic days |
|---|---|---|---|---|---|---|
| 1a | HF mirror 28k/3.4k + SigLIP 2 embeddings (CPU) | **Works** | torch cp314 CPU wheel exists; SigLIP 2 base is ungated. 14 cores: base model at 224 px is roughly 5-15 img/s, so 28k is a few hours as a background job. Dataset download size and licence not yet checked | Embed 5-8k stratified subset first; run overnight for the rest. Use Python 3.12 via `uv` to avoid cp314 surprises | 1.5 (with 1b) | 1.0 |
| 1b | CORN heads, calibration, split conformal sets | **Works** | Tiny models on frozen embeddings. Honest caveat: labels are marketplace-noisy, so conformal sets will be wide; "first published baseline" claim needs the paper-style split protocol | Keep; report set size honestly | (in 1.5) | 1.0 |
| 2 | Synthetic defects via Nano Banana 2.1 "masked" | **Risky** | No mask input exists; the model re-renders the whole image (colour shift, texture drift, resolution change). Used raw, every pixel differs, so it is useless as a planted-change ground truth. Needs billing (image gen is paid). Hundreds of images is about $20-40 and rate limits (429s on image models are common). Training use adds a domain gap and no clean labels | **Edit, then composite**: ask for the stain, then paste only the edited region (hand-drawn or box mask) back onto the original with feathering. That gives exact ground truth and an honest "mask". Drop training use (v2's own option b). Test bed of 100-150 pairs, not hundreds | 1.0 | 1.5 test bed only |
| 3a | Quality gate, nonce/QR, coverage | **Works** | Plain OpenCV (blur, exposure) + `qrcode`. Browser camera needs HTTPS (Cloud Run gives it) | Do blur/exposure in Python server-side | | 0.7 |
| 3b | SAM 3 text-prompted garment parts | **Won't work** (CPU laptop, Cloud Run CPU) | Needs CUDA by README; gated checkpoint with unknown approval latency; 3.4 GB weights would push the image to 6+ GB with 8 GB+ RAM and a slow cold start; Cloud Run GPU needs quota not available to a fresh account | **Gemini 3 Flash returns boxes / points / masks from a text prompt** ("left cuff"). Zero hosting, no gating. FASHN parser skipped | in 1.5 | 0.4 (Gemini boxes) |
| 3c | Planner agent (ADK), tag OCR | **Works** | Gemini does OCR and next-shot logic well; ADK is fine on Python 3.12 | Scripted fallback if ADK misbehaves. Hallucinated style codes need a "not visible" abstain | | 0.8 |
| 3d | Ghost overlay + auto-snap | **Risky** | This is the hardest front-end item and is hidden in "capture workflow". Browser camera + overlay is easy; "auto-snaps when aligned" needs live alignment scoring in JS (OpenCV.js / WASM, or a server round trip per frame) on mid-range phones | MVP: semi-transparent listing photo overlay + manual shutter + server-side alignment score shown after the shot ("aligned 87%"). Auto-snap becomes STRETCH | in 1.5 | 1.5 (MVP 0.7) |
| 4a | Agentic Vision inspector | **Works, with caveats** | Available on Gemini 3 Flash with the code-execution tool. Risks: 30 s timeout, latency 10-40 s per garment, cost per check, non-determinism, preview limits. "With vs without" comparison is cheap to run | Keep; log both arms; keep plain Gemini as fallback; pin model IDs in env | 1.0 | 1.0 |
| 4b | Crop classifier + reconcile | **Risky** | The labelled defect crops that the classifier would train on do not exist: the dataset has grade labels, not defect crops. Synthetic crops help only if comp. 2 works | Use Gemini as classifier, SigLIP heads only for global grade. No crop classifier | | 0.5 |
| 4c | Per-claim conformal filter (ConfLVLM) | **Risky** | Needs a calibration set of labelled *claims* (hundreds) made by a human; none exist. With ~100 labels the stated error bound is loose and a judge will probe it. The 87.8 to 10.0% figure is the paper's, not ours | Calibrate one threshold on ~150 human-labelled claims (the lead can label from crops); report the empirical rate with a Clopper-Pearson interval, not a "guarantee". Or cut to abstain-when-unsure | in 1.0 | 1.5 |
| 4d | Four-point demerit score | **Works** | Pure rules | | | 0.3 |
| 5 | Record, Condition Spec v0, multilingual render, Ask the garment | **Works** | Gemini structured output + pydantic. "Make it lie" refusal needs a grounding check against record fields | Keep; schema.org mapping is documentation, not code | 1.0 | 1.5 |
| 6a | RoMa v2 dense warp | **Risky to won't work** | Backbone weights (DINOv3) licensed/gated; Linux-tested only; CPU speed undocumented (my estimate 5-30 s per pair at useful resolution); Cloud Run CPU makes this worse; adds ~1 GB of weights | **OpenCV AKAZE/ORB + RANSAC homography, kornia LightGlue + DISK as the learned option**, TPS from tag/label landmarks as the fallback for folds. For ghost-overlay captures from the same pose, a homography is enough | in 1.5 | 0.8 |
| 6b | LightGlue (git install) | **Works with care** | Not on PyPI; SuperPoint weights carry a research-only licence; weights fetched from GitHub at runtime (bake into image) | Use kornia's LightGlue + DISK (pip, permissive) | | (in 6a) |
| 6c | AnomalyDINO change detection | **Works if reimplemented** | The repo is MVTec research code, not a library; it is "no fitting" only because it uses a memory bank of the reference image's patches. CPU: DINOv2-S at 448 px is roughly 1-3 s per image (estimate). Fold shadows, lighting and wrinkles will cause false alarms; a gate "calibrated on hundreds of planted pairs" measures planted-patch detection, not real handover drift, which the tests must disclose | 100-line DINOv2-S patch-diff after alignment + pixel diff, threshold on the synthetic set **and** on 20+ real same-garment re-shoots (honest negatives). Gemini compares the two aligned crops as the tie-breaker | in 1.5 | 1.0 |
| 6d | Blink comparator, declared-flaw and tag identity | **Works** | Front-end canvas toggle; identity from OCR + declared flaws | | | 0.7 |
| 6e | Calibrated gate (consistent / differs / can't tell) | **Risky** | See 6c: the calibration data is synthetic. Needs real garment pairs from the lead | Three-way gate with a wide "can't tell" band | | 0.5 |
| 7a | Model Armor fact quarantine | **Risky (setup, not code)** | Model Armor is a Google Cloud service: needs project, billing, API enablement, a template and a supported region; one more thing to fail on day 9 | Quarantine in code (strip free-text from structured claim fields; the judge sees only the typed record). Name Model Armor as the production path. Enable it only if the project exists by 11 Oct | in 1.0 | 0.3 |
| 7b | Meta-judge + Trust-or-Escalate | **Works** | Several Gemini calls and a vote. The "guaranteed agreement level" is a threshold on a validation set, not a guarantee | Three judge runs + agreement threshold + escalate to human | | 1.0 |
| 7c | Fair-wear schedule, remedy anchors, human approval | **Works** | Rules and a table. Needs the lead to author the schedule | | | 0.5 |
| 8 | Front end re-skin and wiring; deploy to Cloud Run + Agent Platform | **Risky (hidden dependencies)** | Not a re-skin: this is the first deployment, no gcloud, no Docker, no billing, no project. ADK 2.11 on Python 3.14 untested. Linux torch from PyPI pulls about 2.5 GB of CUDA libraries unless the CPU index is used. Image 2.5-3.5 GB (torch CPU, SigLIP 2 base, DINOv2-S, DISK/LightGlue), 4 GiB RAM, 2 vCPU, cold start 15-40 s (set min-instances=1 for the demo day). "Agent Platform" deploy (Agent Engine) needs the Agent Platform API, a staging bucket and extra IAM | Deploy a hello-world with a Gemini call to Cloud Run **tomorrow**. Single container (FastAPI + static front end + CPU models). Use ADK for the agent code and `adk deploy cloud_run`; call Gemini through the Agent Platform endpoint with ADC. Agent Engine is a stretch only if it works in 1 hour | 1.5 | 3.0 (2.0 with a teammate) |
| 9 | Eval run, results table, Forger vs Fieldwork | **Risky** | Needs ground truth you do not have: a human baseline (someone must label), real garment pairs, and AI-forged damage photos (Nano Banana again). A published "forger win rate" on 20 forgeries has a huge interval | Small, honest table with intervals; say n out loud | 0.5 | 1.5 |
| S1 | GarmentIQ measurement | **Risky** | Wheel installs (MIT, py>=3.11, torch/transformers/kornia deps) but pulls its own HF models; built for flat-lay on plain background; the ±2 cm claim on folded/hung garments is unlikely | Keep as stretch; tape reveal only if Day-1 test passes | 0.5 | 0.7 |
| S2 | fieldwork-mcp | **Works** | Small MCP server over the record | | 0.5 | 0.5 |

Anomalib: named in the task but not in section 3; skip it (heavy Lightning stack, cp314 risk, the PatchCore fit-per-item idea was already replaced).

## 2. Is the estimate realistic?

- v2 admits CORE is 10.5 Claude-days in 9 days. Applying the realistic column: components 1-9 sum to about **17-19 days**, plus about 2 days of lead-dependent waiting (photos, labels, account approvals) that does not parallelise with the assistant. With a web-dev teammate (component 8 at 2 days, and possibly UI work for 3d) it is about 15-17 days. In 9 calendar days (8-16 Oct), roughly **half of CORE ships**, which means everything must be cut to the minimal version below.
- Mandatory hidden work not costed anywhere: first-time cloud setup (0.5-1 day), HF access requests, dataset licence check, prompt iteration for each Gemini call (Gemini outputs vary; each lane needs 3-5 prompt/eval loops), and a rehearsal of the demo on a real phone.
- The "judge's own garment scanned live" blind swap depends on conference Wi-Fi, 20-40 s Agentic Vision latency and a cold-started CPU service. It cannot be a live-only dependency.

## 3. Hidden dependencies

1. **Google Cloud project + billing + gcloud** (card required; India needs an INR billing account; Meesho Workspace org policy may block project creation, so use a personal Gmail). Nothing in the plan can deploy without it. Check whether the hackathon provides credits.
2. **Gemini API key** from AI Studio, with billing attached for image generation (free-tier image quota is zero or unreliable). Rate-limit 429s on image models.
3. **Hugging Face account and token** for any gated weights (SAM 3, DINOv3 for RoMa v2). Approval latency is unknown; avoid.
4. **Dataset facts not verified**: the 28k/3.4k HF mirror's size, licence and label noise.
5. **Physical garments and a phone**: 20-40 garments, two shoots each (listing and handover, with planted real changes), by the lead. The roadmap schedules this on 9 Oct onward.
6. **Human labels**: roughly 150 claim labels (4c), about 60 defect crops (4a eval), a human grader baseline (9).
7. **Docker is absent**, so every image build goes through Cloud Build; each iteration costs 3-8 minutes.
8. Python 3.14 is too new for the ML + ADK stack; install `uv` (no admin) and pin Python 3.12 for both local and container.

## 4. Critical path (what actually gates the schedule)

1. **9 Oct (blocking everything):** Google Cloud project, billing, gcloud (user-level install), Gemini API key, enable Cloud Run, Cloud Build, Artifact Registry. Deploy hello-world with one Gemini call and the Agentic Vision call. If billing fails, nothing else matters; start the card step today.
2. **9-10 Oct, in parallel with 1:** lead photographs the first 20 garments in the ghost-overlay protocol (listing + handover, 5+ with real changes). The assistant starts the dataset download, SigLIP 2 embedding and the Day-1 tests (Nano Banana composite stain on 10 garments; Agentic Vision vs plain on 20 crops; AKAZE/LightGlue alignment on 3 pairs).
3. **10-12 Oct:** Inspector + record + capture (Gemini boxes) end to end in one deployed container. Planted-change test bed generation (needs billing) and calibration of the 6c gate.
4. **13 Oct:** feature freeze, as the roadmap says, but only after the deployed URL already works on a phone. Eval table + Forger vs Fieldwork on 14-15 Oct; video 15-16 Oct.

Single points of failure: billing/approval (9 Oct), first real garment pairs (10 Oct), Gemini image quota, Cloud Build iteration time, demo-day latency.

## 5. Minimal version that surely ships (about 7-8 realistic days, then 1-2 buffer)

Keep the pitch (record + ask + handover + dispute + honest numbers) and cut every heavy model.

- **One Cloud Run service** (FastAPI + static front end + small CPU models), built with Cloud Build. ADK agent code inside, Gemini via the Agent Platform endpoint.
- **Capture**: browser camera, listing photo overlay with manual shutter, server-side blur/exposure gate, QR nonce. Gemini 3 Flash for part boxes and tag OCR. No SAM 3, no auto-snap.
- **Inspector**: Gemini Agentic Vision (with and without arm logged), 4-point demerit score, abstain ("not in the photos") when unsure. Optional: one calibrated confidence threshold from ~150 labelled claims, reported with an interval.
- **Grade**: SigLIP 2 base embeddings, logistic/CORN head, split-conformal grade sets, trained offline on a 5-8k subset, head shipped in the image.
- **Record**: four lanes, Condition Spec v0 JSON, multilingual render, "Ask the garment" with grounding check.
- **Handover**: AKAZE (or kornia LightGlue + DISK) homography alignment, DINOv2-S patch difference + pixel difference, blink comparator in the browser, Gemini compares aligned crops, three-way verdict. Test bed of ~100 planted-change pairs built by edit-then-composite plus 20+ real re-shoots.
- **Dispute**: typed-record quarantine in code (Model Armor named only), three-run judge with agreement threshold and human escalation, fair-wear schedule, remedy slider, human approve button.
- **Eval**: small table with sample sizes and intervals; Forger vs Fieldwork on 20-30 faked photos.
- **Stage**: pre-recorded fallback video for each demo segment; blind swap only as an optional live segment with the video as backup.
- **Dropped or slide-only**: SAM 3, RoMa v2, anomalib, GarmentIQ unless Day-1 passes, Model Armor deployment, Agent Engine deployment unless trivial, auto-snap, cross-case registry, backlit shot.

## 6. Recommendations for Akshat today

1. Create the Google Cloud project and billing account on a personal account now; confirm whether the hackathon grants credits.
2. Decide on fallback (b) from v2 for component 2: test bed only, no training use.
3. Do not spend a day on SAM 3 or RoMa v2: both need a GPU and gated weights, and Gemini boxes plus OpenCV/kornia cover the need.
4. Block two photo sessions with garments this week; they are on the critical path ahead of any code.
