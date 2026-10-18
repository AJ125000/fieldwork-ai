# R9 - Plan challenge (BUILD-PLAN.md, 9 Oct 2026)

Blunt read: the architecture is sound, the schedule is not. Four things are wrong: cloud starts too late, there is no walking skeleton, Days 1 and 4 are overloaded, and the lead is a hidden critical path.

## A. Verification (web, briefly)

| # | Question | Answer | Evidence |
|---|---|---|---|
| 1a | Virtual Try-On via API on a normal GCP project? | **Yes, with caveats.** Model `virtual-try-on-001`, `POST https://REGION-aiplatform.googleapis.com/v1/projects/P/locations/R/publishers/google/models/virtual-try-on-001:predict`. Inputs: `personImage` + `productImages[]` (base64), `sampleCount` 1-4. The doc page lists no allowlist, only API enable + billing + auth. But: the docs page says Vertex docs are no longer updated; a preview ID `virtual-try-on-preview-08-04` exists (50 rpm); forum reports 429 "quota" errors on 001 and talk of it being superseded. It needs ADC, so it needs gcloud or a service-account key. Not reachable before the GCP project exists. | https://docs.cloud.google.com/vertex-ai/generative-ai/docs/image/generate-virtual-try-on-images ; https://discuss.ai.google.dev/t/virtual-try-on-001-429-error/118464 |
| 1b | Gemini image editing with garment + person image? | **Yes** (from prior knowledge, NOT re-fetched today). Gemini image models ("Nano Banana") take multiple input images plus a text prompt. Billing is likely required (R8 notes free-tier image quota is zero or conflicting). Day-1 smoke test settles it. | https://ai.google.dev/gemini-api/docs/image-generation |
| 2 | Public AP2 sample code with ADK in Python? | **Yes.** `google-agentic-commerce/AP2`, `samples/python`: ADK agents on Gemini 2.5 Flash, run as separate role servers (merchant, credentials provider, payment processor) via `uv run`. Mandates are IntentMandate (user intent), CartMandate (merchant-signed cart), PaymentMandate (user-signed payment). A minimal mandate is signed JSON: `contents` + `signature` + `timestamp`. I could not confirm exact field names from the repo. AP2 has **no escrow or conditional release**, so "release only if unbox matches" is our extension. Do not run the sample stack; mirror the shapes in pydantic. | https://dev.to/czmilo/ap2-agent-payments-protocol-usage-tutorial-57jc (secondary; read `src/ap2/types/mandate.py` in the repo before copying names) |
| 3 | Gemini 3 Flash code execution on images via google-genai + AI Studio key? | **Yes.** Model ID `gemini-3-flash-preview`; enable the code-execution tool in `config.tools`. Calls can run minutes (multi-round), so set a long HTTP timeout. Behaviour is not guaranteed: the model sometimes skips code, and rotation or math needs an explicit prompt nudge. I did not see the exact SDK call in the sources; the usual form is `types.Tool(code_execution=types.ToolCodeExecution())`. Verify on Day 1. | https://blog.google/innovation-and-ai/technology/developers-tools/agentic-vision-gemini-3-flash/ ; https://www.datacamp.com/tutorial/agentic-vision-in-gemini-3 |
| 4 | ADK agents calling a local MCP server via MCPToolset in Python? | **Yes, easy.** `McpToolset(connection_params=StdioConnectionParams(server_params=StdioServerParameters(command, args), timeout=30))` in `LlmAgent(tools=[...])`. Pitfalls: the class is `McpToolset` vs `MCPToolset` and the import path varies by version (pin it, check on the installed 2.x). Use an absolute interpreter path (the `.venv` python, not `uv run`). I did not confirm a 2.x-specific doc. | https://adk.dev/tools-custom/mcp-tools/ |

Unverified risk worth a Day-1 test: built-in tools (code execution) often cannot be combined with function-calling tools in one request. Do not give the ADK agent the code-execution tool. Call Agentic Vision inside your own plain `flaws.py` tool.

## B. Challenges

**Mis-ordered**
1. **GCP project, billing and gcloud ask is on Day 4 and deploy on Day 6.** R8 already flagged this as the top single point of failure (card, INR billing account, possible Meesho org policy, so use a personal Gmail). Move it to **today**. Do a hello-world Cloud Run deploy by Day 2. Cloud Build is the only build route (no Docker), at 3-8 min per iteration, so Day 6 is the first time you discover it.
2. **No walking skeleton.** The front end is on mock until Day 5 and the whole flow only works end to end on Day 6. Reverse that: Day 2 = every endpoint returns canned JSON that obeys section 2 contracts, and the buyer flow runs screen to screen on the public URL. Real modules then replace stubs one at a time. The demo is always shippable.
3. **Corporate TLS inspection is not in the plan.** pip/uv, HF downloads, google-genai (httpx), gcloud and Cloud Build uploads can all fail on the corporate CA. Day-1 checklist: `uv --native-tls`, `truststore`, `SSL_CERT_FILE` / `REQUESTS_CA_BUNDLE` pointed at an exported system bundle, `gcloud config set core/custom_ca_certs_file`, and test the HF download. Install gcloud from the user-level zip (no admin).
4. **Day 1 is 3 days of work.** Env + keys + gemini.py + HF subset + embeddings + heads + three experiments. Day 1 should be: TLS, keys, GCP, skeleton stub, the 3 verdict tests, plus the Nano Banana try-on smoke test. Start embeddings as a background job and train heads on Day 2 night.
5. **Eval data is collected last (Day 5) but defines the headline result.** The 150 relabels and the garment pairs should be requested now. Collect the planted-change pairs during Days 2-3 and double-use them as the eval set.

**Riskiest day: Day 6.** It has the first-ever deploy, two services, the Unbox and Case screens, and a feature freeze, all on the same day. Day 4 is a close second (ADK 2.x unknowns, MCP stdio, AP2 shapes, two agents, marketplace seed, case flow, all untested). Both shrink once the skeleton is deployed on Day 2. Serve the Next.js static export from FastAPI to make it **one** Cloud Run service, not two.

**Dependencies that will block**
- **The lead filming.** A non-technical lead producing 12-second takes, planted-change re-films and 30 garments is a serial dependency the assistant cannot parallelise. Missing from the plan: a one-page capture protocol (lighting, the 6 views, how the one-time code is shown on a phone or paper in frame, tag visible, no zoom), plus a same-night check on the first clip. Day 1 evening's 5 garments decide whether the unbox accuracy claim has any data.
- **Gemini quotas and latency.** Agentic Vision calls can take minutes, and image generation may need billing. Precompute and cache outputs for every demo garment (`store` keyed by take_hash). The live path is a bonus, not the demo.
- **Teammate** (min. 2 per rules) is only listed "before submission". Resolve by Day 3, since registration or eligibility could fail.
- **Gemini 3 Flash is a preview model.** The `config.py` model-ID rule is good; add a fallback model per call and a recorded-response replay mode for the demo.

**Missing**
- The demo script and a phone rehearsal on the public URL (Day 6 at the latest, not Day 7).
- A prompt-iteration budget: each Gemini lane needs 3-5 loops. The plan prices zero.
- The Yuki/Tokyo story assets: the JA listing text and a native-reader check. The lead may not read JA, so decide who validates.
- Result-table definition now: which metrics, N, baseline (majority, plain Gemini without our pipeline). The headline needs the plain-Gemini baseline or it is not a result.
- Error and "can't tell" paths on every endpoint (the plan celebrates them in the demo, but no day tests them).
- The honest-limits slide: escrow, try-on and AP2 are simulated or labelled previews.

**Over-scoped**
- SigLIP 2 heads + conformal sets + calibration (`train/` four files) for a grade that Gemini can give. Time-box to half a day: a single logistic head, a split-conformal threshold, and report it. If it does not beat majority by Day 2 evening, drop it and use Gemini grade with a documented uncertainty rule.
- Unbox stack: AKAZE + kornia LightGlue + DINOv2 patch diff + pixel diff + judge. Ship AKAZE + pixel diff + Gemini judge first. Add DINOv2 only if the Day-3 pairs show it is needed.
- Case x3 agreement for the demo path: do one run plus escalate; make 3x a flag.
- Seller ADK agent: a static function that serves the record gives the same demo effect.
- Forger ladder on Day 7: one forger rung (pasted stain, from the Day-1 composite test) is enough.

**Fake or simulate earlier (Day 2)**
- **Escrow/mandate:** pydantic classes mirroring AP2's three mandate shapes, hash-signed. 40 lines, zero deps. Do not install the AP2 samples.
- **Marketplace:** 6 real garments + 24 synthetic listings (reuse photos) for search. Search is by embedding or Gemini rerank over records, not a database.
- **Try-on:** Gemini image edit only, labelled "preview". Do not touch Vertex Virtual Try-On (needs ADC, quota risk, possibly superseded).
- **Buyer agent:** scripted tool order with Gemini filling slots; ADK + MCP stay but behind a recorded-replay fallback.
- **Cloud store:** keep LocalStore baked into the image for the demo; Firestore/GCS is not needed for a judged demo.

## C. Sharper cut order (cut from the top when late)
1. Remedy slider and Case x3 (escalate always)
2. Extra languages (EN + JA)
3. Try-on (slide + one cached image)
4. Seller agent (static function)
5. SigLIP head (Gemini grade + stated uncertainty)
6. DINOv2 / LightGlue in unbox
7. MCP (direct calls)
8. Live Cloud storage (baked-in LocalStore)

**Never cut:** public-URL walking skeleton; One Take -> record; Ask the garment; Unbox verdict with the three outcomes; buyer flow + simulated mandate; results table WITH the plain-Gemini baseline; 90-second recorded video with cached outputs.

## D. Revised near-term schedule
- **Day 1 (today):** TLS fix, API key, GCP + billing + gcloud (user zip), stub FastAPI with canned contract JSON, 3 verdict tests + try-on smoke, ask lead for protocol + 5 garments.
- **Day 2:** hello-world and then stub API deployed to Cloud Run; take/ pipeline real; embeddings finish in background.
- **Day 3:** unbox real; pairs from lead; heads time-boxed.
- **Day 4:** case-lite, mandate, buyer agent (+MCP if ADK import works in 30 min), seller static.
- **Day 5:** front end real screens against real API; try-on (Gemini).
- **Day 6:** freeze at midday; phone rehearsal; cache all demo outputs; eval run starts.
- **Day 7-9:** as in plan, with video fallback clips recorded from Day 6 rehearsal.
