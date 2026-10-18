# R7-03: Open-source and Google-native sweep (idea cards)

**Date:** 8 Oct 2026 · **Scope:** only items NOT already in ROADMAP-APPAREL.md. Best first.
**Method:** about 36 web searches/fetches. Facts below come from search snippets and a few page fetches. Anything I could not confirm is marked **(unverified)**; check it before building.
**Stages:** A capture · B condition · C record · D search · E handover · F dispute.
**Effort** = engineer-days. **Wow** = judge impact, 1-5 (5 = high).

## Three things worth knowing before the cards

1. **Naming has changed.** Google renamed Vertex AI to **Gemini Enterprise Agent Platform** at Cloud Next, 22 Apr 2026. Agent Engine, Memory Bank, Agent Sandbox and Agent Gateway now sit under it. Use the new name in the deck and README; the old APIs still work.
2. **The model line moved on.** Per the Gemini API changelog: `gemini-3.5-flash` GA 19 May; `gemini-3.7-flash` GA 13 Aug; `gemini-3.8-flash` GA 2 Sep; Nano Banana 2.1 (`gemini-nano-banana-2.1`) GA 6 Oct; `gemini-embedding-2` GA 22 Apr; `gemini-3.8-live` GA 15 Sep. The roadmap's "Gemini 3.x" should pin one of these by env var. The Gemini 2.5 Flash tuning plan is already flagged risky; I found nothing that rescues it.
3. **Google already ships a resale feature.** Lens "Estimated Resale Value" and Lens-to-Virtual-Try-On for thrift (blog, 3 Jun 2026; India post Oct 2026). Google's post does not mention condition grading or handover checks. That gap is our position (card 21).

---

## Cards

### 1. AP2 + UCP agentic remedy
- **What:** When the case engine proposes a "keep it, get 20% back" remedy, emit it as a signed **AP2 mandate** (Agent Payments Protocol), discovered via **UCP** (Universal Commerce Protocol) `/.well-known/ucp`. Use Google's ADK codelab scaffold, including `FunctionTool(require_confirmation=True)` for the human-approval step. The demo uses mock merchants; no real money moves.
- **Stage:** F (also E: the handover result becomes the order-evidence payload).
- **Why new:** Roadmap has a remedy engine but no payment or commerce protocol. This is the Google-judge hook.
- **URL:** https://codelabs.developers.google.com/next26/adk-agent-commerce · https://github.com/google-agentic-commerce/AP2 · https://github.com/Universal-Commerce-Protocol/python-sdk
- **Licence:** AP2 Apache-2.0. UCP repos: not confirmed (unverified).
- **Maturity:** AP2 announced Sep 2025, about 665 stars (third-party figure, date unknown). UCP released Jan 2026. Core AP2 types not on PyPI; install from git. UCP post-purchase/returns support was reported as a late-2026 phase (secondary source).
- **Effort:** 2 d (codelab is about 30 min and under $5; adapt tools to a refund mandate).
- **Wow:** 5. **Risk:** looks bolted on if the demo does not need payment. Frame it as "the dispute outcome is machine-executable".

### 2. Nano Banana 2.1 synthetic flaw edits
- **What:** Use Google's image-edit model to add a stain, snag, fade or pilling patch to clean garment photos, one flaw per call. This gives labelled positives for the stain/hole heads, where your own data is 71% / 95% blank. Log prompt, model ID and the mask region for each edit.
- **Stage:** B (also E: generate "planted change" test pairs for the handover gate).
- **Why new:** Roadmap has no synthetic-data path; this attacks deal-breaker #3 directly.
- **URL:** https://docs.cloud.google.com/vertex-ai/generative-ai/docs/multimodal/gemini-edit-images
- **Licence:** Google API terms; generated images carry watermarking (SynthID; free tier also adds a visible mark, per one secondary source).
- **Maturity:** `gemini-nano-banana-2.1` GA 6 Oct 2026; `gemini-3.1-flash-image` and `gemini-3-pro-image` GA 28 May.
- **Effort:** 1.5 d (script plus human spot-check of about 100 outputs).
- **Wow:** 4. **Honesty rule:** report synthetic-trained numbers separately from real-photo numbers; edited stains may not look like real ones. I found no measured accuracy for this use.

### 3. Gemini Agentic Vision (code execution on images)
- **What:** Turn on the code-execution tool so Gemini crops, zooms and measures inside the image before answering. Use it for the flaw ledger ("3 cm from the seam"), care-label reading, and re-checking a defect box against the full image.
- **Stage:** B, C, E.
- **Why new:** Roadmap uses Gemini boxes and classifier confirmation; it does not use the think-act-observe code loop. Google reports a 5-10% quality gain on vision benchmarks.
- **URL:** https://www.datacamp.com/tutorial/agentic-vision-in-gemini-3 · https://9to5google.com/2026/01/27/gemini-3-flash-agentic-vision/
- **Licence:** Google API terms.
- **Maturity:** announced 27 Jan 2026 for Gemini 3 Flash. I did not confirm it on 3.5-3.8 Flash. Sandbox: about 30 s per block, up to 5 retries. One tutorial reports single requests of about 4 minutes, so raise client timeouts and do not put it in a live capture loop.
- **Effort:** 1 d.
- **Wow:** 4. **Risk:** latency and cost; keep it to "confirm this one flaw" calls.

### 4. GarmentIQ (measurement pipeline)
- **What:** `pip install garmentiq` gives garment classification (TinyViT, Inditex fine-tuned), BiRefNet segmentation, HRNet landmarks, and 9 predefined measurement schemas plus custom ones. Use it as the HRNet baseline in the Day-1 "Gemini points vs tape" test instead of wiring HRNet by hand.
- **Stage:** A / C.
- **Why new:** Roadmap names HRNet and the ArUco paper but not a packaged, runnable pipeline.
- **URL:** https://github.com/lygitdata/garmentiq · https://garmentiq.ly.gd.edu.kg/
- **Licence:** code MIT (README); paper CC BY 4.0. Check each weight file's licence separately (BiRefNet, HRNet weights) because the training set (23,266 Nordstrom/Myntra images) is not released.
- **Maturity:** ETH Zurich with Inditex, preprint (not peer reviewed); 37 stars, 14 commits at snapshot; last-commit date not seen. Weights partly on Hugging Face (`lygitdata/garmentiq`); landmark weight download links were not clear.
- **Effort:** 1 d to run on 5 garments.
- **Wow:** 4 for the demo if it works; low wow if it only matches Gemini.

### 5. Agent Engine + Memory Bank + Sessions
- **What:** Host the ADK agents on **Agent Engine** (Gemini Enterprise Agent Platform) and store per-user memory in **Memory Bank**: the buyer's own garment measurements (for "fits like"), and which defects this buyer accepts (the stretch "buyer-preference weights"). Memory Bank is persistent and managed, so it removes a Firestore schema.
- **Stage:** C, E.
- **Why new:** Roadmap runs ADK on Cloud Run with Firestore; it names neither Agent Engine nor Memory Bank. This also scores the "Google stack" criterion.
- **URL:** https://docs.cloud.google.com/agent-builder/agent-engine/develop/overview · https://discuss.google.dev/t/building-bridges-deploy-agents-with-a2a-on-vertex-ai-agent-engine/264044
- **Licence:** Google Cloud service (billed; sessions, memory and sandbox billed separately since 28 Jan 2026, per a secondary source).
- **Maturity:** GA services; Memory Bank embedding SKUs are changing (release note 1 Sep 2026). A 4-pillar Build/Scale/Govern/Optimize platform since Apr 2026.
- **Effort:** 1.5 d (deploy plus memory read/write). Keep Cloud Run as fallback.
- **Wow:** 4.

### 6. Two-sided dispute over A2A
- **What:** Run the seller's agent and the buyer's agent as separate **A2A** (Agent2Agent) services, each seeing only its own party's data, exchanging claims and evidence IDs, with the adjudicator as a third agent. Strengthens the order-swap and injection story: the agents cannot read each other's prompts.
- **Stage:** F.
- **Why new:** Roadmap's claim/policy/skeptic agents are internal; this makes the parties first-class and uses the open standard.
- **URL:** https://discuss.google.dev/t/launched-the-a2a-protocol-is-now-natively-integrated-on-vertex-ai-agent-engine/264045
- **Licence:** A2A is open (Linux Foundation, donated Jun 2025); Agent Engine support listed Sep 2025.
- **Maturity:** supported in ADK and Agent Engine; I did not check the current ADK version.
- **Effort:** 1.5 d.
- **Wow:** 4. **Risk:** more moving parts in a 10-day plan; do after the core case card works.

### 7. Voice coach on Gemini 3.8 Live (GA)
- **What:** Replace the "experimental ADK live toolkit, scripted fallback" plan with the Live API model `gemini-3.8-live` (and `-extended-thinking`), now **GA since 15 Sep 2026**. Spoken guidance in the seller's language ("show the left cuff closer") plus a live-camera mode.
- **Stage:** A.
- **Why new/better:** Roadmap treats the voice coach as risky stretch. GA status lowers the risk. Google also pitches Gemini Live camera sharing for thrifters, so it fits the judges' mental model.
- **URL:** https://ai.google.dev/gemini-api/docs/changelog · https://ai.google.dev/gemini-api/docs/models/gemini-3.1-flash-live-preview (predecessor docs)
- **Licence:** Google API terms.
- **Maturity:** GA Sep 2026. The earlier 3.1 Flash Live listed caching and structured outputs as not supported; check 3.8.
- **Effort:** 1.5 d. Still first on the cut list.
- **Wow:** 4.

### 8. FASHN Human Parser (SegFormer-B4)
- **What:** 18-class parser (top, dress, skirt, pants, belt, scarf, bag, hat, glasses, jewelry, plus body parts). Use it to mask out hands, arms, hair and background in capture photos, and as a second opinion against `garment-detector-seg`.
- **Stage:** A, E.
- **Why new:** Roadmap lists only `garment-detector-seg` / Gemini masks. This is newer and cleans known label noise in ATR/LIP/iMaterialist (FASHN's claim; no benchmark numbers given).
- **URL:** https://fashn.ai/blog/open-sourcing-fashn-human-parser · https://huggingface.co/fashn-ai/fashn-human-parser · https://github.com/fashn-AI/fashn-human-parser
- **Licence:** **not stated in the blog (unverified)**; check repo. (Older option: `mattmdjaga/segformer_b2_clothes`, ATR-trained, mIoU 0.69, licence unconfirmed.)
- **Maturity:** released 11 Jan 2026; about 244 MB; `pip install fashn-human-parser`; input 384x576. Parts like cuff or collar are not classes; it is a whole-garment parser.
- **Effort:** 0.5 d.
- **Wow:** 2 (utility, not a demo moment).

### 9. SAM 3 (text-prompted concept segmentation)
- **What:** Prompt with short phrases ("cuff", "collar", "hem", "zipper", "stain") and get masks for every instance. Gives part-level regions for flaw localisation without training, and a fallback when the parsers miss.
- **Stage:** B, E.
- **Why new:** Roadmap mentions Gemini masks and Fashionpedia-trained segmentation only. I found no source testing SAM 3 on garments, so this is an inference to test.
- **URL:** https://github.com/facebookresearch/sam3 · https://blog.roboflow.com/what-is-sam3/
- **Licence:** SAM License (custom; weights not Apache/MIT). Check terms; fine for a prototype.
- **Maturity:** Meta release; star count not captured; Hugging Face weights are gated.
- **Effort:** 1 d (need GPU or Colab; heavy for the CPU vision service).
- **Wow:** 3.

### 10. Defect datasets with boxes (Rocha YOLOv5, FabricSpotDefect)
- **What:** Two public sets with annotated garment/fabric defects: the Rocha et al. 2023 clothing-defect set (holes, stains; YOLOv5; released with the paper, hosted on Zenodo per search) and **FabricSpotDefect** (1,014 raw images, 3,288 annotated spots; stains, discolouration, oil marks; YOLOv8 export on Roboflow). Use for the **crop classifier** that confirms Gemini's defect boxes.
- **Stage:** B.
- **Why new:** The condition model has sparse stain/hole labels; these add box-level examples. Wargön/RISE (already in roadmap) is not box-labelled as far as I could confirm.
- **URL:** https://www.ncbi.nlm.nih.gov/pmc/articles/PMC11648198/ · https://www.ncbi.nlm.nih.gov/pmc/articles/PMC10181740/
- **Licence:** **unverified** for both; check the Zenodo and Roboflow pages. FabricSpotDefect is fabric swatches, so a domain gap to worn garments is likely.
- **Maturity:** 2023 and Nov 2024; no active repo.
- **Effort:** 1 d.
- **Wow:** 2 (but fixes the data gap).

### 11. Vector Search 2.0 with auto-embeddings (Gemini Embedding 2 GA)
- **What:** Create a **Collection** with Gemini Embedding 2 auto-embedding images, then run one hybrid query (vector + full-text + semantic ranker) for "grade at least 4, cuffs shown clean". Replaces self-hosting a vector index for stretch Stage D and the duplicate check.
- **Stage:** D (also A duplicates).
- **Why new:** Roadmap uses Gemini Embedding 2 only for duplicates, and Marqo-FashionSigLIP for search. This is managed, serverless and Google-native.
- **URL:** https://docs.cloud.google.com/vertex-ai/docs/vector-search-2/embeddings/autogenerating-embeddings · https://codelabs.developers.google.com/vector-search-2-intro
- **Licence:** Google Cloud service.
- **Maturity:** Vector Search 2.0 GA 5 Mar 2026; `gemini-embedding-2` GA 22 Apr 2026; 3,072-dim default (reducible). Docs disagree on whether audio is supported; irrelevant here.
- **Effort:** 1.5 d. Compare retrieval quality against Marqo on 100 queries before committing.
- **Wow:** 3.

### 12. Gemini File Search with multimodal visual citations
- **What:** Index the item record plus photos in **File Search** (multimodal search with `gemini-embedding-2`, 5 May 2026). Answers return `media_id` for visual citations, which maps onto "Ask the garment" returning the crop behind each claim.
- **Stage:** C.
- **Why new:** Roadmap builds the cited Q&A by hand with claim IDs. This gives a managed citation path, and a fallback if the hand-built one slips. Abstention ("Not in the photos") must still be enforced in your code.
- **URL:** https://ai.google.dev/gemini-api/docs/changelog
- **Licence:** Google API terms.
- **Maturity:** May 2026 release note; I did not read the full docs (unverified details).
- **Effort:** 1 d.
- **Wow:** 3.

### 13. Agentic video understanding for arrival unboxing
- **What:** Let the buyer film a 20-30 s unboxing and flat-lay at arrival. Gemini's agentic video mode picks the frames; you then run the normal handover gate on those frames. Gives a time-stamped, hard-to-fake record that the parcel was opened on camera.
- **Stage:** E, F.
- **Why new:** Roadmap handover is stills only. Release note (1 Sep 2026): agentic video understanding on 3.7 / 3.6 Flash and 3.5 Flash-Lite, using up to 88% fewer tokens on long video.
- **URL:** https://ai.google.dev/gemini-api/docs/changelog
- **Licence:** Google API terms.
- **Maturity:** about 5 weeks old.
- **Effort:** 1.5 d. Frame quality may be below the stills pipeline's needs; treat video as supplementary evidence, not the gate input.
- **Wow:** 3.

### 14. Model Armor on the fact extractor
- **What:** Attach a Model Armor template (prompt-injection and jailbreak filters) to the quarantined extractor and the case agents. Publish the block rates next to your own injection test suite.
- **Stage:** F.
- **Why new:** Roadmap defends with quarantine and a test suite; Model Armor is Google's managed layer and is a named Google security product.
- **URL:** https://docs.cloud.google.com/model-armor/model-armor-vertex-integration
- **Licence:** Google Cloud service (free during the integration's preview; current pricing unverified).
- **Maturity:** sample docs reference `gemini-2.0-flash-001`; I could not confirm it screens **images** (the main injection risk here: text written on a garment label or card). Endpoint regions listed: us-central1, us-east4, us-west1, europe-west4 only.
- **Effort:** 0.5 d.
- **Wow:** 3. Do not claim image-injection protection without testing it.

### 15. Merchant Center / schema.org condition export
- **What:** Export each record as `condition: used` (Merchant Center) and schema.org `Offer.itemCondition` (`UsedCondition` or `DamagedCondition`), so a Fieldwork listing is Shopping-feed-ready. Carry the 1-5 grade and the four lanes as extra attributes, since Google's condition field has only new / used / refurbished.
- **Stage:** C, D.
- **Why new:** Roadmap has the GS1 Digital Link tag but no Google Shopping output. It is cheap and shows ecosystem fit.
- **URL:** https://support.google.com/merchants/answer/6324469
- **Licence:** n/a.
- **Maturity:** stable; field names are migrating to Merchant API. Merchant Center requires `condition` for used items; values must be English. I found no 2026 apparel-specific second-hand policy.
- **Effort:** 0.5 d.
- **Wow:** 3.

### 16. Try-on previews: Google Virtual Try-On API (and FASHN VTON 1.5)
- **What:** `virtual-try-on-001` (GA) takes a person photo plus product images. Offer a buyer preview on the listing page. Open alternative: **FASHN VTON v1.5**, Apache-2.0, 972M parameters, about 5 s on an H100, pixel-space (no masks).
- **Stage:** C / D.
- **Why new:** Roadmap marks fit as measurement comparison only. Try-on shows drape, not fit; label it "look, not size" so it does not contradict the evidence story.
- **URL:** https://docs.cloud.google.com/vertex-ai/generative-ai/docs/image/generate-virtual-try-on-images · https://github.com/fashn-AI/fashn-vton-1.5
- **Licence:** Google API terms; FASHN VTON Apache-2.0 (per search; HF card not opened).
- **Maturity:** Google model GA 20 Jan 2026, retirement 20 Jan 2027, English prompts only, 50 requests/min quota; FASHN released 27 Jan 2026. Docs disagree on input limits (2 vs 4 images).
- **Effort:** 0.5 d (Google API) / 1.5 d (self-hosted, needs GPU).
- **Wow:** 3. Risk of diluting the message; build only if the core is done.

### 17. Metric depth for scale backup (Depth Anything 3 Metric, MoGe-2)
- **What:** When the card is missing or occluded, a monocular metric-depth model gives an approximate scale for the flat-lay, as a cross-check on the card homography. Report as a lower-confidence tier.
- **Stage:** A.
- **Why new:** Roadmap scale comes only from the card.
- **URL:** https://huggingface.co/APaul1/DA3METRIC-LARGE · https://github.com/microsoft/moge
- **Licence:** DA3 Metric-Large: Apache-2.0 (0.35B). **Other DA3 checkpoints are CC BY-NC.** MoGe-2: MIT per a repackaged card (unverified on the official repo); depends on DINOv2 (Apache-2.0).
- **Maturity:** MoGe-2 is NeurIPS 2025; DA3 about late 2025. Needs focal length in pixels; the conversion formula differs between sources.
- **Effort:** 1 d. Expect worse error than the card; only worth it if the card is optional in your final UX.
- **Wow:** 3.

### 18. Gemini Computer Use for marketplace form filing
- **What:** An ADK Computer Use agent (Playwright) files the dispute outcome into a mock marketplace "resolution centre" form after human approval. Gemini 3.5 Flash adds an `intent` field per action, configurable safety policies, and opt-in prompt-injection screening of screenshots.
- **Stage:** F.
- **Why new:** Closes the loop from "decision" to "action" without a marketplace API.
- **URL:** https://adk.dev/integrations/computer-use/
- **Licence:** Google API terms; ADK toolset is Preview.
- **Maturity:** public preview on 3.5 Flash since 24 Jun 2026. The ADK example still hard-codes `gemini-2.5-computer-use-preview-10-2025`, so swap the model ID yourself.
- **Effort:** 2 d.
- **Wow:** 3. Use a mock site only; filing on real platforms is a terms-of-service problem.

### 19. Care-label symbols: Roboflow datasets plus a lookup table
- **What:** No Hugging Face care-symbol model exists that I could find. Practical route: read symbols with Gemini and map them to ISO 3758 / GINETEX codes in a lookup table (the output is a "Declared on label" claim). Use the Roboflow Universe sets as an eval set: "laundry symbol classification" (204 images, CC BY 4.0) and the "laundry-symbol" publisher (about 1.2k images across 10 projects; licence per project, unverified).
- **Stage:** A, C.
- **Why new:** Roadmap captures the label as a shot but names no reading method for the symbols.
- **URL:** https://universe.roboflow.com/formulae/laundry-symbol-classification-oohtu · https://universe.roboflow.com/laundry-symbol
- **Licence:** CC BY 4.0 for the first; others unverified.
- **Maturity:** small, community-labelled; not suitable for training, only for a small accuracy number.
- **Effort:** 0.5 d.
- **Wow:** 2.

### 20. Cost levers: per-part `media_resolution` and context caching
- **What:** Set `media_resolution` per image part (ultra-high for label and cuff crops, low for overviews), and use `thinking_level`. Cache the long dispute policy so the two order-swapped adjudication runs share it. Feeds the "cost per listing / handover / case" rows of the results table.
- **Stage:** all.
- **Why new:** Roadmap reports cost but names no levers.
- **URL:** https://ai.google.dev/gemini-api/docs/gemini-3 · https://ai.google.dev/gemini-api/docs/generate-content/caching
- **Licence:** n/a.
- **Maturity:** one doc snapshot said per-part resolution was v1alpha-only; check. Cached input on 3.5 Flash is listed at $0.15 vs $1.50 per million tokens (one source). Caching minimum is 1,024 or 4,096 tokens depending on the doc.
- **Effort:** 0.25 d.
- **Wow:** 2.

### 21. Positioning card: Google Lens resale value and where we differ
- **What:** Google Lens now shows "Estimated Resale Value" and a count of similar listings; Circle to Search and Virtual Try-On cover thrift. Their post does not cover grading condition or checking handover. Put one slide on "Lens tells you what it's worth; Fieldwork tells you what you're actually getting".
- **Stage:** all (deck).
- **Why new:** Roadmap positions against Carousell, Fleek and others, not against Google's own features, which the judges will know.
- **URL:** https://blog.google/products-and-platforms/products/search/thrifting-tips/ · https://blog.google/intl/en-in/thrifting-hits-an-all-time-high-on-google-search-in-india/
- **Licence:** n/a. **Maturity:** 3 Jun 2026.
- **Effort:** 0.25 d.
- **Wow:** 3.

### 22. Firebase AI Logic hybrid on-device inference
- **What:** In the capture web app, run quick checks (angle, "is the label in frame") on **Gemini Nano in Chrome** (`prefer_on_device`, image input now supported), falling back to cloud Gemini. Photos stay on the device until the seller submits.
- **Stage:** A.
- **Why new:** Roadmap quality gate is OpenCV.js plus cloud Flash-Lite.
- **URL:** https://firebase.google.com/docs/ai-logic/hybrid-on-device-inference · https://developer.chrome.com/docs/ai/firebase-ai-logic
- **Licence:** Firebase terms.
- **Maturity:** **desktop Chrome v139+ only**, so it does not run on a phone browser. Image input limited to JPEG/PNG and needs a flag.
- **Effort:** 1 d.
- **Wow:** 2. Weak for a phone-first flow; skip unless the demo is on a laptop.

### 23. Cloud Run GPUs
- **What:** Move the vision service (SigLIP 2, LightGlue, PatchCore, possibly SAM 3 or Gemma 4 E4B) to a Cloud Run GPU service with scale-to-zero.
- **Stage:** B, E.
- **Why new:** Roadmap vision service is CPU-only.
- **URL:** https://cloud.google.com/blog/products/serverless/cloud-run-gpus-are-now-generally-available · https://docs.cloud.google.com/run/docs/configuring/services/gpu
- **Licence:** Google Cloud service.
- **Maturity:** L4 GPU is GA (24 GB; at least 4 vCPU / 16 GiB; asia-southeast1 supported). RTX PRO 6000 Blackwell was preview as of the launch post (I did not find GA). Cold start about 5 s plus model load (11-35 s reported by a third party).
- **Effort:** 0.5 d.
- **Wow:** 2.

### 24. Gemini Robotics-ER 2 (spatial pointing test)
- **What:** Add one more arm to the Day-1 "Gemini points vs tape" test: the Robotics-ER models are built for spatial reasoning and pointing, so they might locate garment landmarks better than the general model.
- **Stage:** A.
- **Why new:** Roadmap tests only general Gemini points and HRNet.
- **URL:** https://ai.google.dev/gemini-api/docs/changelog
- **Licence:** Google API terms (preview).
- **Maturity:** `gemini-robotics-er-2-preview` released 30 Jul 2026 (image and video input). **No source ties it to garments; this is a hypothesis.**
- **Effort:** 0.25 d.
- **Wow:** 2.

### 25. Brand-logo datasets (LogoDet-3K, Open Brands, OpenLogo)
- **What:** Datasets for training or testing a brand/logo detector, for "brand shown on label" claims. LogoDet-3K: 3,000 classes, about 158k images; Open Brands: over 1.4M images; QMUL-OpenLogo: 27k images, only 32 classes boxed (HF mirror `Voxel51/OpenLogo`). FashionLOGO (arXiv 2308.09012) shows an embedding approach but I could not confirm public weights.
- **Stage:** A, C.
- **Why new:** Roadmap has no brand reading step beyond the label photo.
- **URL:** https://docs.voxel51.com/dataset_zoo/datasets_hf/openlogo.html · https://arxiv.org/pdf/2008.05359
- **Licence:** **unverified** for all three; OpenLogo's card says "More Information Needed".
- **Maturity:** 2018-2020 data; no pretrained clothing-brand model found on Hugging Face.
- **Effort:** 2 d to train; 0.25 d if you just let Gemini read the label.
- **Wow:** 1. Recommend skipping: authenticity is out of scope and Gemini reads labels well enough.

---

## Considered and rejected

| Item | Why not |
|---|---|
| Hugging Face "Textile-Defect" Spaces, fabric classifiers (`fabric_classifier`, `sinarck/tessera`) | Unmaintained or unclear labels; fibre content should come from the label, not the image |
| `AI4Manufacturing/180-grounding` (woven-fabric defects) | Gated; factory fabric strips, not worn garments |
| iMaterialist / Fashionpedia attributes | Gemini already handles attributes; useful only as an evaluation set (licence per project site, unverified) |
| MV-Fashion (CVPR 2026), Fashion-1K, Flat'n'Fold (CC BY 4.0, RGB-D) | Possible later for size or wrinkle tests; none give landmark or measurement labels |
| Colour naming | Searched nothing specific; roadmap's Lab-space colour reference from the tag already covers the need |
| `awesome-fashion-ai`, `awesome-virtual-try-on` | Found, but the try-on list's last push was Mar 2024 (mirror); no new tools surfaced from them |

## Suggested adds to the plan (my read)

1. **Add now (under 2 days total):** cards 2, 14, 15, 20, 21. All cheap and address real gaps (sparse labels, injection story, cost table, positioning).
2. **Add if the core works by 12 Oct:** cards 1, 3, 4, 5.
3. **Use the cut list order for the rest:** cards 6, 7, 11, 12, 13 are the next tier.
