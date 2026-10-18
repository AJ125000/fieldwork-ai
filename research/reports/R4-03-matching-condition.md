# R4-03: Condition grading and same-item matching (CV / ML stack)

Date: 7 Oct 2026. Scope: Problems (A) condition grading from seller photos and (B) same-item matching at handover, for a C2C second-hand trust layer in a low-margin category (clothing, footwear, books, kids' items, furniture).

Evidence labels: **[V]** = verified this session (GitHub API / project page / search result, URL given); **[M]** = from memory, not re-verified (check before relying); **[J]** = my engineering judgement.
Repo stats were read from the GitHub API on 7 Oct 2026.

---

## 0. Bottom line

1. **Do not train anything.** In 10 days the winning move is: classical CV and small open models for the *measurable, deterministic* parts (image quality gate, embeddings, local-feature geometric verification, difference heat-map), and Gemini for the *open-vocabulary, explainable* parts (defect typing, region-level explanation, pairwise adjudication). The decision layer (match / differs / can't tell) is a small calibrated model plus hard abstention rules, not an LLM opinion.
2. **Classic anomaly detection (anomalib PatchCore / EfficientAD) is the wrong tool for grading across arbitrary garments** (needs per-product "normal" training data; draped, wrinkled soft goods are the worst case for it). It **is** the right idea for handover: *the listing photos are the "normal" reference for this one item*, so arrival-vs-listing change detection is a one-shot anomaly problem.
3. **Best identity cues are not "global similarity".** Same-model-different-instance (two black H&M tees) is the hard case. Identity comes from *unique marks*: print/pattern alignment, stitching, labels, and above all **the seller's declared defects (stain, hole, missing button) used as fingerprints**. A plain, unmarked garment cannot be confirmed as the same instance from phone photos; the system must say "can't tell" (or "consistent with, not confirmed").
4. **Calibration must be honest about sample size.** With ~100 negative pairs you can certify a false-accept rate of only roughly 3-5% (rule of three) at 95% confidence. Say so in the demo; it is a credibility asset, not a weakness.
5. **Licence traps to avoid for a commercial-style product:** SuperPoint (non-commercial), MASt3R/DUSt3R (CC BY-NC-SA), VGGT weights (CC BY-NC 4.0), MVTec AD data (CC BY-NC-SA [M]). Use DISK or ALIKED with LightGlue instead.

---

## 1. Defect / anomaly detection (Problem A)

### 1.1 Landscape table

| Component | What it does | Licence | Latest activity / maturity | Compute | Use in 10-day build | Pitfalls |
|---|---|---|---|---|---|---|
| **anomalib** (Intel / Open Edge Platform) [github.com/open-edge-platform/anomalib](https://github.com/open-edge-platform/anomalib) | Library of ~23 anomaly detectors (PatchCore, EfficientAD, PaDiM, WinCLIP, ...), training, export (OpenVINO/ONNX) | Apache-2.0 [V] | Pushed 2026-10-07; 6.2k stars; v2.4.1 as of May 2026 [V, search] ([datature guide](https://datature.io/blog/visual-anomaly-detection-with-anomalib-a-hands-on-guide-2026)) | PatchCore: fit = forward pass on few images, no training, runs on CPU for small reference sets; EfficientAD: needs short GPU train, fast CPU inference | **Use PatchCore in one-shot "reference = listing photos" mode for the change map** (Section 3), not for grading | Trained for rigid industrial parts; wrinkles/folds/drape produce false positives; needs aligned/registered crops; memory bank grows with reference images |
| **PatchCore** (Roth et al., CVPR 2022, arXiv 2106.08265 [M]) and **EfficientAD** (arXiv 2303.14535 [M]) | Patch-feature memory bank / student-teacher anomaly maps | via anomalib | mature | as above | as above | as above |
| **WinCLIP** (Jeong et al., CVPR 2023, arXiv 2303.14814 [M]) | Zero/few-shot anomaly classification + segmentation using CLIP window prompts | implementation in anomalib (Apache-2.0) | mature | CPU/GPU OK | Optional zero-shot "is this region anomalous" baseline | Prompt-sensitive; trained on industrial-style semantics |
| **AnomalyCLIP** (ICLR 2024, [arXiv 2310.18961](https://arxiv.org/html/2310.18961v12)) [github.com/zqhang/AnomalyCLIP](https://github.com/zqhang/AnomalyCLIP) | Object-agnostic learned prompts for zero-shot anomaly detection, 17 datasets incl. industrial and medical | MIT [V] | Last push Jul 2025; 674 stars; research code | GPU preferred | Nice-to-have ablation only | Research code; trained on industrial defects; not validated on worn garments |
| **AdaCLIP** (ECCV 2024, [arXiv 2407.15795](https://arxiv.org/abs/2407.15795v1)), **AF-CLIP** (ACM MM 2025, [arXiv 2507.19949](https://arxiv.org/pdf/2507.19949)), FAPrompt (ICCV 2025) | Newer zero-shot AD variants | per repo (check) | research | GPU | Skip | Same domain gap; marginal gains on industrial benchmarks that will not transfer |
| **Grounding DINO** [github.com/IDEA-Research/GroundingDINO](https://github.com/IDEA-Research/GroundingDINO) | Text-prompted open-vocabulary detection | Apache-2.0 [V] | Last push Aug 2024 (stale; use the HF transformers port) | GPU preferred | Fallback box detector for "button", "stain" prompts | Detects objects, not "damage"; poor on abstract defects |
| **OWLv2** (Google, HF transformers) | Open-vocabulary detection | Apache-2.0 [V via search] | stable | GPU preferred, CPU slow | Fallback | same |
| **Florence-2** (Microsoft) | Detection, grounding, captioning, OCR | MIT [V via search] | stable | small, CPU-feasible | Good OCR for care labels / brand tags if not using Gemini | weak at fine defects |
| **SAM 2** [github.com/facebookresearch/sam2](https://github.com/facebookresearch/sam2) | Promptable segmentation (box/point to mask) | Apache-2.0 [V] | Pushed 2026-05-30; 20k stars | GPU preferred; CPU slow | Turn a Gemini box into a clean item or defect mask | Needs a prompt; no semantics |
| **SAM 3** [github.com/facebookresearch/sam3](https://github.com/facebookresearch/sam3), [arXiv 2511.16719](https://arxiv.org/pdf/2511.16719) | Promptable *concept* segmentation: text phrase or exemplar to all instances ("button", "stain") | "SAM License" (custom, commercial use permitted, no military/ITAR; gated on HF) [V via search: [LICENSE](https://huggingface.co/facebook/sam3/blob/main/LICENSE)] | Pushed 2026-10-07; 11.9k stars | GPU strongly preferred | Best open "text-to-mask" for item and part segmentation, if a GPU Cloud Run service is acceptable | Gated weights (HF approval step: do it on day 1); still object-centric, not damage-centric |
| **Gemini native detection and segmentation** [docs](https://ai.google.dev/gemini-api/docs/image-understanding) | Boxes `[ymin,xmin,ymax,xmax]` normalised 0-1000; segmentation returns `box_2d`, `mask` (base64 PNG probability map 0-255) and `label` | API (not open source) | Docs recommend setting thinking level minimal for segmentation [V] | none (API) | **Primary defect localiser and typer**; request JSON via response schema | Small/faint defects (pilling, fading) get loose boxes; mask must be resized to the box and binarised at ~127; coordinates are y-first; hallucinated defects; non-deterministic |
| **Gemma 4** (E2B / E4B / 26B-A4B / 31B) [Gemma 4 CV guide](https://datature.io/blog/gemma-4-what-computer-vision-engineers-actually-need-to-know), [release summary](https://rits.shanghai.nyu.edu/ai/google-releases-gemma-4-frontier-open-models-under-apache-2-0/) | Open-weight multimodal; JSON bounding boxes `[y1,x1,y2,x2]`, configurable image token budget (70-1120) | Apache-2.0 [V via search] (released 2 Apr 2026) | no paper yet, model card only | E4B edge-class; 26B/31B need GPU | Use only if the rules require a Gemma touchpoint or to run the cheap first-pass detector on a Cloud Run L4; otherwise Gemini | Slower and less accurate than a tuned detector; detection quality on faint defects unproven; coordinate-format differences |
| **Fashion embeddings:** Marqo-FashionSigLIP / FashionCLIP [github.com/marqo-ai/marqo-FashionCLIP](https://github.com/marqo-ai/marqo-FashionCLIP) | 150M-param fashion image-text embeddings; strong category/attribute retrieval | Apache-2.0 [V via search] | stable | CPU OK | Zero-shot garment type, colour, material, pattern attributes for the condition record; category routing | Category/attribute level, **not instance level**; do not use as identity signal |
| **DeepFashion2** [github.com/switchablenorms/DeepFashion2](https://github.com/switchablenorms/DeepFashion2), **Fashionpedia** ([arXiv 2004.12276](https://arxiv.org/pdf/2004.12276)) | Clothing detection/segmentation/landmarks; Fashionpedia adds garment parts and attributes | Fashionpedia CC BY 4.0 [V via search]; DeepFashion2 licence **not verified** (treat as research-only until checked) | datasets, 2019-2020 | n/a | Only to fine-tune a garment/part detector (skip in 10 days) | Attributes describe *design*, not damage [J]; no stain/hole/wear labels |

### 1.2 Datasets that matter for grading

- **RISE "Clothing Dataset for Second-Hand Fashion"** ([zenodo.org/records/12518734](https://zenodo.org/records/12518734)) [V]: ~32k real second-hand garments (26.9 GB), CC BY 4.0, 3 photos per item (front, back, label), overall condition 1-5, stains/holes/smell (none/minor/major), pilling 1-5, damage locations. **This is the single most useful asset**: use ~300-500 items to benchmark Gemini's condition grade and defect flags against human labels, and to calibrate severity. Photos are professional-ish sorting-line shots; expect a domain gap to seller phone photos.
- **Ljubljana surface-defect-on-clothing study** ([vicos.si, ERK 2025](https://vicos.si/publications/tabernik2025erk/)) [V]: 12k+ annotated clothing images, best model SuperSimpleNet reaches 72% AP; the authors flag variability and subtle or concealed defects as hard. Data/code not indicated as public. Use as a calibration of expectations: **supervised, even in-domain, tops out near 72% AP**, so promise "assist and flag", not "detect all defects".
- **AITEX** (~245 flat fabric images, 7 fabric types [M]) and **TILDA** (3200 TIFs, 8 textile types, 7 error classes, [Freiburg page](https://lmb.informatik.uni-freiburg.de/resources/datasets/tilda.en.html)) [V]: industrial roll-fabric under controlled light. Good for sanity-checking PatchCore, **poor proxy for phone photos of worn garments**. AITEX licence not found; TILDA licence terms not stated in results. **Skip for the demo.**
- **MVTec AD**: CC BY-NC-SA [M]; not needed.
- Fabric defect set, Mendeley Data (2,468 images; button, broken button, hole, colour defect, foreign yarn, sewing error; Mar 2025) ([data.mendeley.com/datasets/y62b4pfyz2](https://data.mendeley.com/datasets/y62b4pfyz2)) [V via search, licence unchecked]: possibly useful for missing-button / hole examples as few-shot prompts.

### 1.3 Recommended approach for (A) in 10 days

1. **Quality gate (classical):** blur (variance of Laplacian), exposure/clipping histogram, resolution, EXIF orientation fix, duplicate/stock-photo check (perceptual hash + DINO embedding vs seller's other listings). Reject early with a human-readable "retake" reason.
2. **Guided capture checklist** per category (the single biggest accuracy lever, and free): garment = front, back, label, inside, close-ups of each flaw; footwear = outsole, heel, toe box, inside; books = cover, spine, 3 random pages, edges; furniture = each face, joins, underside. Fixed checklist also makes the arrival capture comparable.
3. **Gemini condition record** (structured output via response schema, temperature 0, one call per item, all photos): item type, material, colour, brand if visible, `defects[] = {type from per-category taxonomy, severity 0-3, photo_id, box_2d, visible_from_front, confidence, evidence_text}`, overall grade 1-5, `unverifiable[]` (areas not shown). Force the model to list "not shown" areas; absence of evidence must not be recorded as "no defect".
4. **Verification pass (cheap, deterministic):** crop each claimed defect (box + 20% margin), and either (a) re-ask Gemini with the crop only ("is there a {type}? yes/no/unsure") to catch hallucinations, and/or (b) run SAM 2 with the box to get a clean mask and compute area fraction for severity. Keep only defects that survive; surviving ones become **fingerprints** for handover (Section 2.5).
5. **Self-consistency:** run 3 samples; keep defects found in >= 2 of 3; record agreement as confidence.
6. **Benchmark** on 300-500 RISE items: report per-defect precision/recall for stain/hole/pilling and weighted kappa on the 1-5 grade. Put the number in the pitch.

Pitfalls: faint pilling/fading is lighting-dependent (lower confidence, never auto-penalise); the model grades "overall impression" inconsistently, so derive the grade from the defect list by a deterministic rubric (per-category weights) rather than asking for a free grade; seller photos may be post-processed or cropped to hide flaws (the checklist and "unverifiable" list handle this).

---

## 2. Instance-level same-item matching (Problem B)

### 2.1 Local features and matchers

| Tool | What it does | Licence | Maturity | Compute | Notes |
|---|---|---|---|---|---|
| **LightGlue** [github.com/cvg/LightGlue](https://github.com/cvg/LightGlue), [arXiv 2306.13643](https://arxiv.org/pdf/2306.13643) | Fast sparse matcher with adaptive depth/width; confidence per match | Apache-2.0 code and weights [V] | Last push Feb 2026; 4.8k stars; stable | ~20 FPS at 512 keypoints on an i7-10700K CPU [V]; GPU much faster | Main matcher. `filter_threshold` raises match strictness |
| **SuperPoint** extractor | keypoints and descriptors | **Restrictive / non-commercial (MagicLeap)** [V: LightGlue README] | n/a | n/a | **Avoid** |
| **DISK** | learned keypoints + descriptors | Apache-2.0 [V] | stable | GPU preferred, CPU OK at 1024 px | Use with LightGlue (`features='disk'`) |
| **ALIKED** | keypoints + descriptors | BSD-3-Clause [V] | stable | CPU OK | Alternative to DISK |
| **XFeat** [github.com/verlab/accelerated_features](https://github.com/verlab/accelerated_features), [arXiv 2404.19174](https://arxiv.org/abs/2404.19174v1) | Very fast keypoints, sparse and semi-dense; real-time on CPU at VGA | Apache-2.0 [V] | Last push Jan 2025; 1.7k stars | CPU-friendly | Fallback if CPU latency is a problem |
| **kornia** [github.com/kornia/kornia](https://github.com/kornia/kornia) | One-stop Python API: LoFTR, DISK, LightGlue, homography RANSAC, colour ops | Apache-2.0 [V] | Pushed 2026-10-07; 11.4k stars | CPU OK | Convenient single dependency for the whole classical block (use cv2 for MAGSAC) |
| **LoFTR** (kornia port, Apache-2.0 [V via search]) | Detector-free dense-ish matcher | Apache-2.0 | mature | GPU preferred | Better on low-texture; heavier |
| **RoMa v2** [github.com/Parskatt/romav2](https://github.com/Parskatt/romav2), [arXiv 2511.15706](https://arxiv.org/html/2511.15706v2) | Dense matching with overlap/precision estimates, built on DINOv3 | Code MIT [V]; **DINOv3 weights custom licence** [V] | Last push Aug 2026; 736 stars; README targets Linux, Python 3.12, custom CUDA kernel | **GPU needed** | Best dense warp for non-rigid change-detection registration; optional (Cloud Run GPU). Risky for 10 days |
| MASt3R / DUSt3R [github.com/naver/mast3r](https://github.com/naver/mast3r) | 3D-grounded matching | **Non-commercial (NOASSERTION; CC BY-NC-SA [M])** | last push Jun 2025 | GPU | **Avoid** |
| VGGT [github.com/facebookresearch/vggt](https://github.com/facebookresearch/vggt) | Feed-forward 3D | **Weights CC BY-NC 4.0** [V via search] | active | GPU | **Avoid** |

**Domain pitfalls for local features on soft goods** [J]: matchers are trained on rigid outdoor scenes (MegaDepth); garments deform and fold, so a single homography/fundamental matrix will not explain all correct matches. Mitigations: (a) crop and mask the item, remove the background first (otherwise a shared table/floor produces false inliers); (b) fit a *loose* geometric model, accept consistency per local patch (e.g. grid of local affine fits), or use the **inlier count and spatial spread** rather than a strict ratio; (c) target **mark-anchored matching** (labels, prints, declared defects). Plain solid-colour items yield few keypoints: treat keypoint count below a threshold as "low identifiability" which forces abstain-leaning behaviour.

### 2.2 Global embeddings

| Model | Notes | Licence | Use |
|---|---|---|---|
| **DINOv2** [github.com/facebookresearch/dinov2](https://github.com/facebookresearch/dinov2), [arXiv 2304.07193](https://arxiv.org/pdf/2304.07193) | Self-supervised; strong instance retrieval (landmarks, artworks), good dense patch features | Apache-2.0 [V]; pushed 2026-10-06; 13.4k stars | **Default global instance embedding and dense patch features for difference maps.** ViT-S/B is CPU-feasible |
| **DINOv3** [github.com/facebookresearch/dinov3](https://github.com/facebookresearch/dinov3) | Larger-scale successor; better dense features | **Custom DINOv3 licence**: commercial use allowed, military/ITAR/weapons uses prohibited [V: [licence](https://ai.meta.com/resources/models-and-libraries/dinov3-license)]; gated; last push Jul 2026 | Optional upgrade; gate access takes time, so DINOv2 first |
| **SigLIP 2** ([HF google/siglip2-*](https://huggingface.co/google/siglip2-so400m-patch14-224), paper "SigLIP 2", Tschannen et al. 2025 [V via search]) | Multilingual, better localisation and dense features | Apache-2.0 [V via search] | Second embedding for ensemble diversity; zero-shot attribute scoring. Text-aligned spaces tend to lose fine instance detail relative to DINO [V via search summary] |
| CLIP / OpenCLIP | baseline | MIT / various | baseline only |
| **Gemini Embedding 2** ([docs](https://ai.google.dev/gemini-api/docs/models/gemini-embedding-2?authuser=0), [Google blog](https://blog.google/innovation-and-ai/technology/developers-tools/gemini-embedding-2/)) | Natively multimodal; `gemini-embedding-2-preview`, public preview since 10 Mar 2026; up to 6 images per request | API; image input $0.45/M tokens, **$0.00012 per image** [V: [pricing](https://ai.google.dev/gemini-api/docs/pricing)] | Cheap third ensemble member and a "uses Gemini" touchpoint; **unproven for instance-level discrimination: test it, do not assume** |
| Benchmark reference | "Visual Product Search Benchmark" ([arXiv 2603.17186](https://arxiv.org/pdf/2603.17186)) compares DINOv2, SigLIP, CLIP, Jina v4, Vertex AI embeddings, Cohere Embed-4 on instance-level product retrieval (CC BY 4.0 paper) [V] | | Read its results table on day 1 to choose the ensemble |

### 2.3 Pipeline mechanics (what to compute for each (listing photo, arrival photo) pair)

1. Item crop and background mask (Gemini box; optionally SAM 2/3 mask).
2. Global cosine: DINOv2-B (CLS + GeM-pooled patches), SigLIP 2, optionally Gemini Embedding 2. Take the **max over view pairs** and the **mean of top-k** (view mismatch lowers single-pair scores).
3. Local verification: DISK or ALIKED + LightGlue on the masked crops; geometric verification with **MAGSAC++ / USAC (cv2.USAC_MAGSAC)**; record inlier count, inlier ratio, inlier spatial coverage (convex-hull area / item area), and per-mark matches (label region, print region, declared-defect regions).
4. **Re-ranking / aggregation across views:** if a gallery of candidates exists (e.g., buyer has several items from different sellers on the same day, or to detect swap-for-another-seller's-item), rank by global score then re-rank top-k by inlier statistics (standard retrieve-and-verify, as in landmark retrieval).
5. Gemini pairwise adjudication (Section 5), which sees both photo sets and the classical evidence summary and must cite specific marks.

### 2.4 Textile patterns and marks as fingerprints [J]

- **Strong, phone-photo-feasible:** printed/woven pattern *placement* relative to seams (a print crop position is instance-specific for cut-and-sew garments), label text and stitching, visible repairs, wear patterns (collar fray, elbow shine, sole wear), existing stains and their shape, button set and thread colours, shoe-sole tread wear, book dog-ears and spine creases, furniture grain pattern and scratches (wood grain is a natural fingerprint).
- **Not feasible from phone photos:** fabric micro-weave fingerprints (need macro/microscopy and controlled capture); do not claim it.
- **Plain/solid items:** only label + declared defects can anchor identity; otherwise the correct output is "consistent with listing, identity not confirmable".
- **Declared-defect fingerprinting** is the key trick: the Section 1 condition record gives localized marks with crops; at handover check that each declared defect is present in the arrival photos (via local match on the crop). Matching declared defects confirms identity and condition simultaneously; *missing* declared defects is a strong "different item or concealed" signal.

### 2.5 Turning scores into MATCH / DIFFERS / CAN'T TELL (calibration)

Design:
- **Features** per pair set: max/top-k global cosines (DINO, SigLIP2, Gemini emb), local inlier count, coverage, declared-defect recovery rate, label-match flag, Gemini identity vote and 3-sample agreement, identifiability (keypoint count, texture), image-quality scores.
- **Model:** logistic regression (or small gradient boosting if >200 pairs) giving `p_same`; fit on the validation pairs. Keep it simple and monotone so it is explainable.
- **Two-threshold rule, risk-controlled:**
  - `SAME` only if `p_same >= tau_hi`, where `tau_hi` is chosen so the false-accept rate on held-out negatives is <= alpha with a finite-sample bound.
  - `DIFFERENT` only if `p_same <= tau_lo`, chosen so false-reject rate on held-out positives is <= beta.
  - Between: `CAN'T TELL`. Also forced `CAN'T TELL` by hard rules: poor image quality, low overlap/coverage, low identifiability, ensemble disagreement, or Gemini says unsure.
- **Methods:** split conformal / conformal risk control, and Learn-then-Test for non-monotone risks. Primary references: Angelopoulos and Bates, "A Gentle Introduction to Conformal Prediction" ([arXiv 2107.07511](https://arxiv.org/pdf/2107.07511)) [V]; "Learn then Test" ([arXiv 2110.01052](https://arxiv.org/pdf/2110.01052)) [V]; "Selective Conformal Risk Control" combining abstention with set-valued conformal guarantees ([arXiv 2512.12844](https://arxiv.org/pdf/2512.12844)) [V]; Conformal Risk Control (arXiv 2208.02814 [M]). Libraries: MAPIE (BSD-3-Clause, pushed 2026-10-07, [github.com/scikit-learn-contrib/MAPIE](https://github.com/scikit-learn-contrib/MAPIE)) [V] and the reference notebooks in [aangelopoulos/conformal-prediction](https://github.com/aangelopoulos/conformal-prediction) (MIT) [V]. For ~100 pairs, a hand-rolled Clopper-Pearson / binomial upper bound for the threshold is 15 lines and easier to explain than MAPIE.
- **Honest sample-size statement:** with n negative validation pairs and zero false accepts at the threshold, the 95% upper bound on FAR is about 3/n (n=100 gives ~3%; n=60 gives ~5%). Report coverage vs accuracy (the share of cases decided vs "can't tell") on a plot.
- **Ensemble and agreement:** require at least two of three independent signal families (global embedding, local geometry, Gemini adjudication) to agree for `SAME`; any strong contradiction (declared defect absent, label mismatch) forces `DIFFERENT` or `CAN'T TELL`. Agreement across diverse signals is what the demo should visualise.
- **Validation set (build it in days 2-4, this is the real deliverable):** 40-60 physical items across 2-3 categories; for each, "listing" shots on phone A in light 1, "arrival" shots on phone B in light 2 (different pose); 3 arrival conditions: unchanged, with a *new* defect staged (stain with tea, loosened button, etc.), and **hard negatives** (same-model different instance, ideally a teammate's identical-looking item). Label pair-level same/different and region-level change. Keep a locked test split (never tune on it).

---

## 3. Change detection between two photos (same object, different lighting/pose)

Recommended three-step classical + semantic approach [J, standard practice]:

1. **Register.** Use LightGlue inliers to fit a homography (rigid/flat items such as book covers, flat garment photos) or a thin-plate/piecewise affine warp (soft goods); for harder cases a dense warp from RoMa v2 (GPU, optional). Accept the registration only if inlier coverage is adequate; else abstain on region-level claims.
2. **Compare in a lighting-robust space.** Do *not* subtract pixels. Options: (a) cosine distance between **DINOv2 dense patch features** of the registered pair (semantic, tolerant to exposure/white balance); (b) Lab-space difference after histogram matching or local mean/variance normalisation, ignoring luminance for colour-fade checks; (c) **one-shot PatchCore**: build the memory bank from the listing item's patches, score arrival patches (anomalib) which yields an anomaly heat-map in a "normal = this item" sense. Combine (a) and (c); use (b) only for colour-shift claims.
3. **Region proposal then semantic filtering.** Threshold, connected-components, filter by size; for each region show Gemini the **registered crop pair** and ask: real physical change (stain, tear, missing part, new scratch) vs pseudo-change (shadow, fold/wrinkle, reflection, exposure, occlusion, different pose)? Pseudo-changes from viewpoint and illumination are the central difficulty named by recent benchmarks ([OmniDiff, arXiv 2503.11093](https://arxiv.org/html/2503.11093v2); [DiffCap-Bench](https://benchmarklist.com/benchmarks/diffcap_bench_a_comprehensive_challenging_robust_benchmark_for_image_difference_captioning/); VDiff-Bench, arXiv 2609.06245 [listed in search; paper not read]) [V via search].

Pitfalls: wrinkles and drape differ every time the garment is laid down, so a garment "unchanged" will light up the difference map. Always keep the Gemini filter and the "can't tell" path; show the heat-map only for regions that survive. For footwear and furniture (rigid), registration is much more reliable, so claims there can be stronger.

---

## 4. Preference-aware matching (buyer-specific acceptable condition)

Make condition acceptance a **separate, explicit decision layer** on top of identity and change evidence; never fold it into the matcher.

- **Defect taxonomy per category (YAML):** each defect type has default severity weights, "visibility zone" multipliers (garment: front/visible, inside/hidden, underarm; shoe: upper/outsole/inside; book: cover/spine/pages; furniture: top surface/legs/underside), and whether it is "functional" (hole, missing sole) or "cosmetic" (fading, pilling).
- **Buyer profile (elicited in 3-4 questions via Gemini chat, stored as JSON):** `deal_breakers` (e.g. "no stains on the front", "no loose pages"), `tolerance` per defect class (0-3), `priority` (looks vs function vs price), `min_grade`. Defaults by category and by buyer type (resale buyer vs end user vs gifting).
- **Decision:** per defect, `harm = severity * zone_weight * buyer_weight[defect_class]`; compare to the buyer's threshold and to the *listed* state. Three outcomes: `MATCHES_LISTING`, `WORSE_THAN_LISTED (regions, delta severity)`, `WORSE_BUT_WITHIN_YOUR_TOLERANCE`. The last one lets the product honour "I don't mind small pilling, I do mind stains".
- **Per-category calibration:** thresholds (`tau_hi`, `tau_lo`) and abstention rules are **parameterised per category** (Mondrian / group-conditional conformal: calibrate separately by category, or by identifiability class such as printed vs plain). Store them in a config file with provenance (calibration date, n, alpha). Rigid categories (footwear, furniture) can have tighter abstention; plain garments get a wider "can't tell" band.
- **Cost-sensitive view:** the cost of a false `SAME` (scam accepted) versus a false `DIFFERENT` (honest seller accused) is asymmetric and differs by price band; derive alpha/beta from a cost ratio rather than hard-coding. In a low-margin category, a wrongful dispute costs more than the item margin, so default to `CAN'T TELL` with a cheap human/chat fallback.

---

## 5. Hybrid architecture and cost per check

### 5.1 Split of responsibilities

| Concern | Classical / small open model | Gemini |
|---|---|---|
| Photo quality, duplicates, EXIF | Yes (deterministic, free) | No |
| Item crop / mask | Optional SAM 2 | Box via Gemini (fast, free-ish) |
| Defect detection and typing | PatchCore (one-shot, handover only) | **Primary** (open vocabulary, per-category taxonomy) |
| Defect verification | Crop re-check, SAM mask area | Yes (second-look call) |
| Identity evidence | DINOv2/SigLIP2 cosine, LightGlue + MAGSAC inliers | Pairwise adjudication, mark identification, explanation |
| Registration, difference map | Yes | No |
| Region classification (real vs pseudo-change) | No | **Yes** |
| Calibrated decision (match/differs/can't tell) | **Yes** (logistic + thresholds + hard rules) | Input feature only |
| Preference scoring | Yes (rules over JSON) | Elicits profile, writes explanation |
| Natural-language explanation | No | **Yes** (constrained to cite evidence IDs) |

Principle: any number that gates a decision must be reproducible and measured on the validation set; Gemini adds features and explanations, and its outputs are schema-constrained and sampled thrice.

### 5.2 Cost per handover check (estimates [J], using verified prices)

Assumptions: 4 listing + 4 arrival photos at ~1024 px; Gemini image tokens are 258 for images <=384 px and tiled 768x768 blocks at 258 tokens each above that [V: [image understanding docs](https://ai.google.dev/gemini-api/docs/image-understanding)], so roughly 1k tokens per photo at 1024 px; prompt + evidence ~1.5k tokens; structured output ~1.5k tokens.

- Prices [V: [pricing](https://ai.google.dev/gemini-api/docs/pricing), fetched via summariser, re-check before final costing]: Gemini 2.5 Flash $0.30 in / $2.50 out per 1M tokens; 2.5 Flash-Lite $0.10 / $0.40; "Gemini 3.8 Flash" (named in the current docs) $0.75 / $3.75 through 31 Dec 2026, then $1.50 / $7.50; 3.1 Pro preview $2 / $12; Gemini Embedding 2 $0.00012 per image.
- Adjudication call (~9.5k in, ~1.5k out, plus thinking tokens): 2.5 Flash ~ $0.0066; 3.8 Flash ~ $0.013; three samples for agreement: ~$0.02-0.04.
- Region-classification calls (up to ~5 region crop pairs, small): ~$0.002-0.005.
- Embeddings: Gemini Embedding 2 on 8 photos ~ $0.001; DINOv2/SigLIP2 on CPU: $0 marginal.
- Classical block on Cloud Run CPU (2-4 vCPU, ~16 photo pairs LightGlue + MAGSAC, DINOv2-B): ~3-10 s wall time, well under $0.001 of compute.
- **Total: ~$0.01-0.05 per handover check; ~$0.01-0.03 per listing grading pass.** Cheap enough that the viable business model is unit-economics-positive on a low-margin category if checks are only run when a buyer triggers them.

### 5.3 Deployment notes (Cloud Run + ADK)

- Wrap each stage as an **ADK tool** (`quality_gate`, `segment_item`, `embed`, `local_match`, `change_map`, `decide`), with Gemini as the planner/explainer. Deterministic stages are plain Python functions, so they are unit-testable.
- CPU-only Cloud Run is enough for: DINOv2 S/B, SigLIP 2 base, DISK/ALIKED + LightGlue, kornia/cv2, anomalib PatchCore inference at small scale. Pre-download weights into the image (avoid cold-start downloads); expect a 2-4 GB image with CPU PyTorch; set min-instances=1 for the demo.
- GPU options (Cloud Run with an NVIDIA L4) only if you want SAM 3, RoMa v2 or a Gemma 4 26B detector. Treat these as stretch.
- HF gated weights (SAM 3, DINOv3) require access approval; request on day 1 or avoid.
- Privacy: faces/addresses in photos; strip EXIF GPS, and tell users arrival photos are compared.

---

## 6. Risks (ranked)

1. **Identity of plain/common items is genuinely unresolvable** (same-model different instance). Mitigation: mark-anchored matching, declared-defect fingerprints, forced "can't tell", honest coverage-accuracy reporting. Never let Gemini's confident prose override the calibrated gate.
2. **No labelled handover data.** The calibration rests on a self-built 40-60-item set; the guarantees are weak and the lighting/phone diversity small. Mitigation: pre-register the test split, report intervals, use RISE for the grading half, and be explicit in the pitch.
3. **Pseudo-changes (wrinkles, shadows, pose) swamp true change signals**, and Gemini localisation of faint defects is loose and non-deterministic. Mitigation: registered crop pairs, three-sample agreement, size/agreement filters, per-defect confidence, never auto-penalise fade/pilling alone.
4. Licence/gating surprises (SuperPoint, MASt3R, VGGT, DeepFashion2, gated SAM 3/DINOv3). Mitigation: stack below avoids them.
5. Gemini model names/pricing are moving (docs now cite "Gemini 3.8 Flash", prices change on 1 Jan 2027, Embedding 2 is preview): isolate the model id in config, cache outputs, keep a 2.5 Flash fallback.
6. Adversarial users (stock photos, swapped item, photo of a screen). Mitigation: duplicate/stock check in the quality gate; capture inside the app, not from gallery, where possible.

---

## 7. Recommended pipeline (text diagram)

```
LISTING TIME (seller)
 photos --> [1 Quality gate: blur/exposure/EXIF/dup-check]  (cv2, DINOv2)
        --> [2 Guided checklist per category]
        --> [3 Gemini: structured condition record + boxes]   (Gemini Flash, schema, T=0, x3)
        --> [4 Verify each defect: crop re-ask + SAM2 mask]   (Gemini + SAM2 optional)
        --> STORE: condition JSON, item crops, DINO/SigLIP embeddings,
                   defect "fingerprint" crops, keypoint features

HANDOVER (buyer)
 arrival photos (same checklist)
        --> [1 Quality gate]  --fail--> "retake" or CAN'T TELL
        --> [2 Item crop + background mask]
        --> [3 Identity evidence]
              a. global cosine: DINOv2, SigLIP2, (Gemini Emb 2)       (max / top-k over view pairs)
              b. local: DISK/ALIKED + LightGlue + MAGSAC              (inliers, coverage, label match)
              c. declared-defect recovery (crop-anchored local match)
              d. Gemini pairwise adjudication x3 (cites marks)
        --> [4 Calibrated identity model] p_same + hard rules (quality, overlap, identifiability, disagreement)
              p_same >= tau_hi  -> SAME
              p_same <= tau_lo  -> DIFFERENT
              else / rule fired -> CAN'T TELL (with reason)
        --> [5 Change detection] (only if identity != DIFFERENT)
              register (LightGlue homography / piecewise) -> DINO patch diff + one-shot PatchCore
              -> regions -> Gemini real-vs-pseudo-change on crop pairs
        --> [6 Preference layer] buyer profile x category taxonomy x severity -> MATCHES / WORSE / WITHIN TOLERANCE
        --> [7 Explanation] Gemini writes verdict citing evidence IDs; overlay of differing regions
 OFFLINE: validation set -> logistic fit -> tau_hi/tau_lo per category -> config (with n, alpha, date)
```

## 8. Stack table

| Component | Tool | Why | Effort (days) |
|---|---|---|---|
| Orchestration | ADK agent + Python tools on Cloud Run | Required by rules; testable tool boundaries | 1.0 |
| Quality gate | OpenCV (Laplacian, histogram), imagehash, EXIF | Deterministic, free | 0.5 |
| Condition record + defect boxes | Gemini Flash with response schema, 3-sample agreement | Open vocabulary, per-category taxonomy, native boxes | 1.5 |
| Defect verification / masks | Gemini crop re-ask; SAM 2 (Apache-2.0) optional | Kills hallucinations; area for severity | 0.5-1.0 |
| Grading benchmark | RISE second-hand dataset (CC BY 4.0), 300-500 items | Real human labels for grade, stain, hole, pilling | 1.0 |
| Global embeddings | DINOv2-B + SigLIP 2 base (+ Gemini Embedding 2 preview) | Apache-2.0, CPU-OK, diversity for ensemble | 0.5 |
| Local matching | kornia/LightGlue + DISK or ALIKED (not SuperPoint); cv2 MAGSAC | Apache/BSD, CPU-OK, explainable inlier overlays | 1.0 |
| Change map | LightGlue homography + DINO patch diff + anomalib PatchCore one-shot | Lighting-robust, one-shot reference | 1.5 |
| Region filter | Gemini real-vs-pseudo-change on crop pairs | Handles wrinkles, shadows, exposure | 0.5 |
| Calibrated decision | scikit-learn logistic + binomial/LTT thresholds (MAPIE optional) | Measurable, honest abstention | 1.0 |
| Validation data | 40-60 items x 2 phones/lights + hard negatives | The thing that makes the claims defensible | 2.0 (spread over days 2-5) |
| Preference layer | YAML taxonomy + buyer JSON profile + scoring rules | Per-buyer, per-category, no ML | 0.5 |
| UI explanation | Overlay of matched marks and differing regions | Trust/demo value | 1.0 |
| Stretch | SAM 3 / RoMa v2 on Cloud Run L4; Gemma 4 detector | Only if ahead of schedule | 1.0+ |

Total core effort is roughly 11-12 person-days; parallelise with the AI coding assistant (validation-data collection runs in parallel with code), and cut the stretch items and the PatchCore step first if behind.

## 9. Sources

Verified fetches: [anomalib](https://github.com/open-edge-platform/anomalib), [LightGlue](https://github.com/cvg/LightGlue), [romav2](https://github.com/Parskatt/romav2), [sam3](https://github.com/facebookresearch/sam3), [sam2](https://github.com/facebookresearch/sam2), [dinov2](https://github.com/facebookresearch/dinov2), [dinov3](https://github.com/facebookresearch/dinov3), [kornia](https://github.com/kornia/kornia), [XFeat](https://github.com/verlab/accelerated_features), [AnomalyCLIP](https://github.com/zqhang/AnomalyCLIP), [GroundingDINO](https://github.com/IDEA-Research/GroundingDINO), [MASt3R](https://github.com/naver/mast3r), [VGGT](https://github.com/facebookresearch/vggt), [MAPIE](https://github.com/scikit-learn-contrib/MAPIE), [conformal-prediction notebooks](https://github.com/aangelopoulos/conformal-prediction), [RISE dataset](https://zenodo.org/records/12518734), [Ljubljana clothing defects](https://vicos.si/publications/tabernik2025erk/), [Visual Product Search Benchmark](https://arxiv.org/pdf/2603.17186), [Gemini image understanding](https://ai.google.dev/gemini-api/docs/image-understanding), [Gemini pricing](https://ai.google.dev/gemini-api/docs/pricing), [Gemini Embedding 2](https://ai.google.dev/gemini-api/docs/models/gemini-embedding-2?authuser=0), [DINOv3 licence](https://ai.meta.com/resources/models-and-libraries/dinov3-license), [SAM licence](https://huggingface.co/facebook/sam3/blob/main/LICENSE), [Gemma 4 CV guide](https://datature.io/blog/gemma-4-what-computer-vision-engineers-actually-need-to-know), [Marqo FashionCLIP](https://github.com/marqo-ai/marqo-FashionCLIP), [TILDA](https://lmb.informatik.uni-freiburg.de/resources/datasets/tilda.en.html), [OmniDiff](https://arxiv.org/html/2503.11093v2), [Learn then Test](https://arxiv.org/pdf/2110.01052), [Gentle intro to conformal prediction](https://arxiv.org/pdf/2107.07511), [Selective Conformal Risk Control](https://arxiv.org/pdf/2512.12844).

Items marked [M] (PatchCore/EfficientAD/WinCLIP arXiv ids, AITEX size, MVTec licence, Conformal Risk Control id, MASt3R exact licence, DeepFashion2 licence) were not re-verified and should be checked before they appear in the submission. Pricing and the "Gemini 3.8 Flash" name came through a summarising fetch; re-check on the live pricing page.
