# R6-04: Handover check for a deformable garment (same garment? same condition? where did it change?)

Date: 7 Oct 2026. Stage: buyer's arrival photos vs seller's listing photos. Output: SAME GARMENT and SAME CONDITION / DIFFERS (what, where) / CAN'T TELL.
Evidence labels: **[V]** = read this session (URL given); **[M]** = from memory, check before relying; **[J]** = my engineering judgement. Repo stars/dates not re-pulled this session (sandbox had no direct GitHub API access); licences below are from repo pages or model cards fetched today unless marked [M].
Background used: R4-00 (pipeline spine), R4-03 (matcher licences, rule-of-three). I do not repeat R4-03's matcher table; only deltas.

---

## 0. Bottom line (read this first)

1. **Split the question in two, because the physics differ.** *Identity* ("same physical unit") is decided by small **rigid-at-small-scale marks** (care label, tag, declared flaws, print edges, a macro patch), not by whole-garment similarity. *Condition change* ("what, where") is decided on a **canonical garment region map**, not by pixel differencing. Whole-garment embedding similarity (DINOv2/SigLIP) answers "same product design", which is useless for identical mass-produced items [J].
2. **A plain, unmarked, mass-produced garment cannot be proven to be the same unit from phone photos. No open method or product claims this for phone photos of worn apparel** (see section 1.4: Alitheon/Entrupy claim it only under their own capture and for their own use cases). The right product promise is *"consistent with the listing / differs / can't tell"*, never *"proven same unit"*. This is a **reposition, not a category change** (section 8).
3. **Stains are albedo changes; wrinkles and shadows are shading changes** [J, standard intrinsic-image reasoning]. Compare chromaticity / local-contrast-normalised patches inside registered regions, not raw RGB. This one idea removes most pseudo-change at near-zero cost.
4. **Do not ask Gemini to compare two whole photos for subtle change.** A 2026 benchmark shows MLLMs frequently "register no change" on low-level differences (texture, noise): 7-8B open models score 8.7-33.3% on low-level change vs 52-71% on semantic change ([VDiff-Bench, arXiv 2609.06245](https://arxiv.org/abs/2609.06245) [V]; Gemini was not singled out in the summary I read, so treat as a warning about the class, not a Gemini measurement). Use CV to *propose* candidate regions, then give Gemini small **aligned crop pairs** to adjudicate "real change vs wrinkle/shadow/pose".
5. **Calibrate with Learn-then-Test style risk control, and report the honest bound.** With 60-100 hard negative pairs the best certifiable false-match rate is about 3-5% (rule of three). Say it on stage.

---

## 1. Findings

### 1.1 Instance-level identification: what exists

| Approach | What it uses | Evidence | Fit for a phone, worn garment |
|---|---|---|---|
| **Alitheon FeaturePrint** | Microscopic surface micro-features of the item, no tag; fingerprint <=500 KB; "insensitive to partial views and degradation between induction and authentication"; claims >99.9% accuracy, zero false positives; any phone camera can enrol/verify ([alitheon.com](https://alitheon.com/), [GlobeNewswire 2026](https://www.globenewswire.com/news-release/2026/06/26/3318367/0/en/alitheon-featureprint-named-overall-authentication-solution-of-the-year-in-2026-ai-breakthrough-awards-program.html), [Authentique licence](https://www.theordregroup.com/press/authentique-announces-strategic-partnership-with-leader-in-vision-ai-alitheon)) [V, vendor claims] | Exclusively licensed to Authentique for luxury/fashion [V]. Proprietary; no public worn-garment benchmark found. **Borrow the idea (micro-feature match at a known location), not the claim.** |
| **Entrupy Apparel Authentication** (launched Mar 2025) | Microscopic imaging + ML on fabric texture, stitching, print alignment, tags; 50M+ reference images; 99.86% claimed accuracy; covers named streetwear/luxury brands only; "if a product is too worn, we may not authenticate it"; $139-1,049/month tiers ([Entrupy apparel](https://www.entrupy.com/apparel-authentication), [launch note](https://www.entrupy.com/ja/entrupy-expands-ai-authentication-to-streetwear-and-apparel/)) [V] | It answers "is this brand's genuine article", **not** "is this the same unit as listing photo". Explicitly fails on heavily worn items, which is our category. **Borrow: the list of cues (texture, stitch, print alignment, tag) as our identity-evidence checklist.** |
| **Certilogo** (acquired by eBay, completed 11 Jul 2023) | Unique code per garment, digital ID / product passport, consumer scan check ([SGI Europe](https://www.sgieurope.com/ebay-acquires-italian-tech-firm-certilogo/102868.article), [Retail Bulletin](https://www.theretailbulletin.com/general-merchandise/ebay-completes-acquisition-of-certilogo-13-07-2023/)) [V] | Brand-side tag identity; needs the brand to enrol. Our Fieldwork tag is the seller-side, post-hoc version of this. |
| **EON** | Cloud-connected digital identity (QR/NFC/RFID) for garments; DPP and digital certificates of ownership; "instant resale" with Coach/Coachtopia + Poshmark ([EON docs](https://docs.eon.xyz/brand-protection), [Eon Instant Resale](https://eon.xyz/blog/introducing-eon-instant-resale)) [V] | Same: brand-enrolled. **Borrow: resale-time scan flow and passport schema.** |
| **Fabric PUF research** | Native silk fibre diffraction ("lens-free optical PUF") as unclonable tag ([PMC8752800](https://www.ncbi.nlm.nih.gov/pmc/articles/PMC8752800/)) [V]; printed-PUF patents for phone-captured patterns | Needs special illumination/optics; shows textile fibre randomness is real but is not a phone-photo method for worn clothing. |
| **Fabric retrieval with SIFT+VLAD** | Rank-1 95.03% on a fabric image set ([Signal Processing, 2019](https://signal.ejournal.org.cn/en/article/doi/10.16798/j.issn.1003-0530.2019.10.013)) [V] | Retrieves fabric *types/designs*, not individual units. Do not cite as instance identification. |

**Finding:** there is no public, validated method for phone-photo instance identification of worn plain apparel. What is real: (a) tag/label identity, (b) unique wear/flaw marks, (c) micro-texture matching under controlled capture. Our 10-day contribution can legitimately be (a)+(b) plus a measured experiment on (c).

### 1.2 Why local features work at the mark scale but not the garment scale [J]

- At **garment scale** a T-shirt is non-rigid: one homography/fundamental matrix fails; a fold changes which fabric is visible. LightGlue/RoMa trained on rigid scenes will still return many correct local matches on prints/labels, but inlier counts are not comparable between folded and flat poses.
- At **mark scale** (a 2-3 cm care label, a cuff seam, a print edge, a 2x2 cm weave patch) the surface is nearly planar, so homography + MAGSAC is valid and inlier statistics are interpretable. **Hierarchy: coarse non-rigid for semantics, fine rigid for identity.**
- Plain solid-colour knit has few keypoints; treat low keypoint count as "low identifiability" which pushes the gate to CAN'T TELL rather than to a guess.

### 1.3 Change detection on a deformable object under different light

- **Pseudo-change is the dominant failure mode.** The change-detection literature defines pseudo-change as appearance variation without physical modification (cast shadows, illumination, colour balance) and tests robustness by perturbing exactly those factors ([FAF-CD, arXiv 2606.03114](https://arxiv.org/pdf/2606.03114); [arXiv 2606.28012](https://arxiv.org/pdf/2606.28012)) [V]. Rigid-object methods (e.g. [3DGS-CD, arXiv 2411.03706](https://arxiv.org/pdf/2411.03706)) explicitly do not handle non-rigid change [V].
- **Object-level zero-shot change detection with correspondence** ([Nguyen et al., WACV 2025, arXiv 2501.05555](https://arxiv.org/abs/2501.05555); [code anguyen8/image-diff](https://github.com/anguyen8/image-diff), MIT, 11 stars, needs CUDA 11.3 / PyTorch 1.10 / Detectron2 / SuperGlue) [V]: its idea (predict change correspondences between the two views and drop unmatched detections to cut false positives) is the useful part; the code is too old and heavy to adopt. Re-implement the idea with our own crops.
- **Reference-based anomaly detection** (listing = "normal" for this item): PatchCore via anomalib (Apache-2.0; R4-03). **UniVAD** ([CVPR 2025](https://openaccess.thecvf.com/content/CVPR2025/html/Gu_UniVAD_A_Training-free_Unified_Model_for_Few-shot_Visual_Anomaly_Detection_CVPR_2025_paper.html), [code](https://github.com/FantasticGNU/UniVAD), 226 stars) is training-free few-shot AD with component segmentation (patch matching within components), but depends on SAM-HQ ViT-H + GroundingDINO and per-folder scripts [V]: too heavy for 10 days; borrow *component-aware patch matching* (match patches only within the same garment part) as a design principle, implemented with the part masks in 1.5.
- **Garment flattening / canonicalisation** (robotics): [Cloth Funnels, ICRA 2023, arXiv 2210.09347](https://arxiv.org/pdf/2210.09347) defines "canonicalized-alignment": drive a cloth to a predefined flat configuration; [UniGarmentManip, CVPR 2024, arXiv 2405.06903](https://arxiv.org/pdf/2405.06903) learns self-supervised dense (point-level) topological correspondence among garments across deformation [V]. These need a robot or simulation; **we do not flatten the garment, we ask the buyer to flat-lay it** (a human performing "Cloth Funnels") and then register in 2D. UniGarmentManip's public repo is a project-page stub that redirects to another repo (`luhr2003/UniGarmentManip`, not inspected) [V partial]; treat as unavailable.
- **Sewing-pattern / template space:** [GarmentCodeData, ECCV 2024, arXiv 2405.17609](https://arxiv.org/pdf/2405.17609): 115,000 synthetic 3D garments with sewing patterns (tops, shirts, dresses, jumpsuits, skirts, pants) [V]. Its *parametric flat pattern as canonical space* is the right concept; running the pipeline (XPBD drape, body model) is out of budget. Practical canonical space for us: **a 2D part-layout template per category** (tee, shirt, trousers, dress, jacket) with named regions.

### 1.4 Dense correspondence tools (for registration to the template)

| Tool | Use | Licence / maturity | Verdict |
|---|---|---|---|
| **LightGlue + ALIKED/DISK** (R4-03) | Mark-scale identity, label/print matching | Apache-2.0 / BSD | **Core, CPU-capable.** |
| **kornia** TPS (`get_tps_transform`, `warp_points_tps`) [M]; **OpenCV** `ThinPlateSplineShapeTransformer` (contrib) [M] | Landmark-driven thin-plate warp of the photo to the template | Apache-2.0 | **Core**; landmark-driven TPS is the standard way landmarks are used as control points in warping ([LGVTON, arXiv 2004.00562](https://arxiv.org/pdf/2004.00562) [V]). |
| **DINOv3** ([github](https://github.com/facebookresearch/dinov3), 11.5k stars, updates through Jun 2026) [V] | Dense patch features (sharper than DINOv2) for cross-image patch matching | **Custom "DINOv3 License"**, weights gated via Meta portal [V]; HF Transformers >= 4.56 [V] | Optional upgrade over DINOv2 (Apache-2.0 [M]); request access day 1 if wanted. Non-commercial is acceptable for us but this is custom, read it. |
| **DIFT** ([Tsingularity/dift](https://github.com/Tsingularity/dift), MIT, 775 stars, NeurIPS 2023) [V] | Training-free semantic correspondence from diffusion features | GPU, 768x768, ensemble 8 | Stretch only. |
| **RoMa v2** (R4-03) | Dense warp + overlap estimate | MIT code, DINOv3 weights custom | GPU, optional. |
| **Depth Anything V2 Small** | Relative depth for wrinkle/fold mask | **Apache-2.0** (Base/Large/Giant are CC-BY-NC-4.0) [V via search] | Optional wrinkle-aware down-weighting. DSINE normals: licence `NOASSERTION` [V], avoid. |
| **Marigold-IID (Lighting)** ([HF prs-eth](https://huggingface.co/prs-eth/marigold-iid-lighting-v1-1)) | Albedo / shading / residual split, `I = A*S + R` | OpenRAIL++-M [V via search] | Diffusion: GPU, slow. Stretch version of idea 5 (section 5). |

### 1.5 Canonical garment map: what is actually available

- **Part segmentation, ready to use:** [`resoa/garment-detector-seg`](https://huggingface.co/resoa/garment-detector-seg) [V]: RF-DETR-Seg-Small (DINOv2 backbone, 33.6M params), **weights Apache-2.0, trained on Fashionpedia (CC BY 4.0)**; 46 classes = 13 garments + 14 accessories + 19 parts incl. **collar, lapel, sleeve, pocket, neckline, zipper, buckle, cuff, hem**. Self-reported mask mAP 0.352 (box 0.419) at epoch 8; strong on whole garments (dress 0.87, pants 0.84), weak on small trims (zipper 0.10). Maturity: single-author model card, undertrained (8 epochs): **validate on 20 of our own flat-lays before trusting cuff/hem masks.** Fallback: Gemini pointing/boxes with part names.
- **Landmarks:** [DeepFashion2](https://github.com/switchablenorms/DeepFashion2) has 294 landmarks over 13 categories (e.g. 39 for long-sleeve outerwear), COCO-style keypoints, but data is released behind a request form (research access) and the repo was last updated Feb 2020 [V]. No pretrained, maintained, openly licensed DeepFashion2 landmark model was found in this search. **Decision: do not depend on DeepFashion2.** Get landmarks from (a) part-mask extremes (cuff centroid, hem midpoint, collar centre) and (b) Gemini pointing (points as `[y, x]` on a 0-1000 grid; [Gemini image understanding docs](https://ai.google.dev/gemini-api/docs/image-understanding) [V]).
- **Left/right and front/back:** garment-left is the wearer's left; on a flat-lay front view the wearer's left is on image right. Fix with a deterministic rule keyed to neckline/label side and verify with Gemini; **store regions as "wearer-left/right", never image-left/right.**

### 1.6 Calibrated three-way decision

- **Learn then Test** ([Angelopoulos, Bates, Candes, Jordan, Lei, arXiv 2110.01052](https://arxiv.org/abs/2110.01052)) turns threshold choice into multiple hypothesis testing so the *chosen* threshold carries a finite-sample guarantee on a user-chosen risk (e.g. false-match rate), model-agnostic, no refitting. **MAPIE implements it** with Hoeffding-Bentkus p-values and Bonferroni/FWER over the threshold grid ([MAPIE risk-control theory](https://mapie.readthedocs.io/en/latest/theory/risk-control/)) [V]. MAPIE licence BSD-3 [M].
- **Selective Conformal Risk Control** ([arXiv 2512.12844](https://arxiv.org/pdf/2512.12844), Dec 2025) combines abstention (stage 1: choose which samples to answer) with conformal risk control on the answered set (stage 2) [V]; this is precisely "CAN'T TELL" + risk bound. Research code only; implement the two-stage idea with LTT/MAPIE rather than adopting their repo.
- **Practical design (small data):** two scores with a monotone "same" direction: `S_id` (identity evidence, section 3) and `S_chg` (max region change score after pseudo-change suppression). Decision regions: MATCHES if `S_id >= t_hi` and `S_chg <= c_lo`; DIFFERS if `S_id <= t_lo` or `S_chg >= c_hi` with Gemini-confirmed crop; else CAN'T TELL. Choose `t_hi` by LTT so false-match <= alpha; choose `c_hi` so false-"new defect" <= beta on *same-garment* negatives pairs re-photographed after folding. Report Clopper-Pearson intervals.
- **Rule-of-three numbers (computed):** zero errors in 60 hard negatives -> 95% upper bound 4.8%; in 100 -> 2.9%; in 200 -> 1.5%. Cross-garment "easy negatives" are cheap (n garments give n(n-1)/2 pairs, not independent), but **hard negatives need physically identical items**: buy ~8-10 pairs of identical cheap garments (two of the same tee) = 8-10 hard pairs only, so state hard-pair certification is out of reach in 10 days and report the stratum separately.
- **Buyer preference weights** go in the *condition* gate only, never the identity gate: each defect type (stain, hole, pilling, fading, missing button, odour-unverifiable) has a buyer-set tolerance; DIFFERS fires if a new defect's weighted severity exceeds that buyer's threshold, otherwise the message is "new minor pilling on cuff (within your tolerance)". Weights shift the message and the action, not the certified identity risk.

### 1.7 EU Digital Product Passport (relevance for textiles)

- ESPR (Regulation (EU) 2024/1781) entered into force July 2024; textiles are an early priority product group in the ESPR Working Plan 2025-2030; textile **delegated act expected around 2027 (second half), with a minimum 18-month lead time, so textile DPP duties land ~2028-2029** ([cosh.eco explainer](https://cosh.eco/en/articles/eu-digital-product-passport-espr-explained-fashion-textiles), [Renoon status](https://www.renoon.com/blog/delegated-acts-for-digital-product-passport-explainer-and-current-status)) [V, secondary sources]. Exact scope and date are not fixed until the act publishes.
- Likely carriers: QR, NFC, RFID; the Commission has referenced GS1 standards, and **GS1 Digital Link** (a resolvable URL embedding GTIN + serial/batch in a QR) is a prime candidate ([GS1 DL overview](https://www.unitag.io/gs1-digital-link), [DPP for textiles](https://www.cleverence.com/articles/business-blogs/strategic-pivot-toward-digital-product-passports-for-textiles-4827/)) [V, secondary]. Open issue named in the explainer: carrier durability through resale cycles [V].
- **What to borrow:** (1) encode the Fieldwork tag as a **GS1-Digital-Link-shaped URL** (`https://tag.<ours>/01/<GTIN-or-placeholder>/21/<serial>`), so the tag is DPP-compatible by construction and a brand DPP can later attach to it; (2) keep our "defect map + handover log" as the *use-phase / condition* layer that brand DPPs do not cover (DPP data is mostly composition, origin, repairability, not per-unit wear) [J]; (3) say "DPP-ready", not "DPP compliant": no delegated act exists yet.

---

## 2. Recommended pipeline (text diagram)

```
LISTING (already in R4-00; additions marked +)
  guided flat-lay + care label + tag-in-frame + close-up per flaw
  + QR tag (GS1-DL URL + serial + random border) decoded; tag corners -> scale/orientation/colour reference
  + garment-part masks (resoa RF-DETR-Seg; fallback Gemini boxes) -> region IDs {wearer-left cuff, hem, collar, ...}
  + landmarks (part extremes + Gemini points) -> TPS warp of photo to category TEMPLATE
  + DEFECT MAP: each declared/found defect = {type, region id, template (u,v), size_cm, crop, embedding}
  + IDENTITY MARKS stored: label crop, print crops, flaw crops, optional macro patch (ALIKED keypoints)

HANDOVER (buyer, same guided protocol)
  0 [code] quality gate (blur/exposure/framing) + tag decode. Fail -> ask retake, never "DIFFERS"
  1 [code] same segmentation + landmarks + TPS warp to template  -> region-by-region crops
  2 IDENTITY evidence (rigid, mark-scale)                          -> S_id + low-identifiability flag
       a) tag: decoded serial == listing serial; tag print/wear match (LightGlue, homography)
       b) label/print/stitch crops: ALIKED+LightGlue, MAGSAC inliers vs impostor distribution
       c) declared-flaw recovery: each declared flaw found at same region (found = +, absent = strong -)
       d) global DINO/SigLIP cosine: sanity only (design match), tiny weight
  3 CONDITION change per region                                    -> S_chg + candidate list
       registered crop pairs -> albedo-space diff (Lab chroma + local-contrast-normalised) 
       + PatchCore(anomalib) fitted on listing crop of THAT region  -> anomaly heat-map
       - suppress: fold/wrinkle mask (Depth Anything V2 Small or edge-density), tag-based colour normalisation
       -> candidate defects {region, type?, size_cm via tag/garment-width scale}
  4 [Gemini Flash] cross-examine ONLY candidates: aligned listing/handover CROP PAIRS + prompt
       "real change (stain/hole/fade/missing part) or wrinkle/shadow/pose?" x3 samples, keep if >=2
  5 [code] 3-way gate (thresholds chosen by LTT/MAPIE on our pairs; Clopper-Pearson reported)
       MATCHES  = S_id>=t_hi and no confirmed change
       DIFFERS  = identity contradicted OR confirmed change (+ buyer weights: tolerated vs not)
       CAN'T TELL = low identifiability, weak photos, or conflicting evidence -> 6
  6 [ADK agent] active re-ask: pick the single region with highest uncertainty, overlay listing crop,
       ask buyer for ONE targeted close-up; re-run steps 1-5 on that region only (max 2 loops)
  7 output: human line ("New ~2 cm stain on wearer-left cuff; declared collar flaw still present;
       identity: tag serial matches, label wear matches") + evidence crops; DIFFERS goes to dispute service
```

ADK mapping: steps 0-3 are plain Python tools behind one Cloud Run CV service (CPU is enough: ALIKED+LightGlue, anomalib PatchCore, OpenCV/kornia TPS; ~20 FPS LightGlue at 512 keypoints on CPU per R4-03); step 4 is a Gemini call; step 6 is the only agentic loop; step 5 is deterministic code. Keep the LLM out of the identity decision.

---

## 3. Identity evidence: how the signals combine

| Signal | Strength on plain mass-produced garment | Failure mode | Notes |
|---|---|---|---|
| Tag serial decodes and matches | High for the tag, **zero for the garment** (tag could be moved) | Tag swap / transplant | Must be paired with a garment-bound mark |
| Tag-on-label geometry: how the tag is looped through the label, label fray, ink wear | Medium-high | Rework by a determined cheat | Photograph the tag in situ at listing (loop style is quasi-unique) |
| Declared-flaw recovery (stain shape, hole, missing button, pilled patch) | **High**, the best open signal | Brand-new item with no flaws | Flaw *disappearing* is a strong negative: cleaned or swapped |
| Print/embroidery/label-edge keypoint match | High if present | Solid plain item | Count inliers vs impostor (same-model) distribution, not vs random |
| Macro weave patch (2x2 cm near the label) | **Unknown**: experiment | Wash/wear changes pilling and fuzz; blur | Alitheon claims this works with micro-features; replicate only as a measured bet |
| Global embedding cosine | Low (design-level, saturates for identical items) | Same product, different unit | Sanity only |

Combine as a naive-Bayes-style log-likelihood ratio on a small number of hand-set, calibrated terms (not a trained classifier on 40 pairs) [J]. Output `low_identifiability = True` when no flaw, no print and no label wear is available; then the best possible verdict is "consistent with, tag matches", capped at CAN'T TELL for the strict "same unit" claim.

---

## 4. Startups: what to borrow (summary)

| Company | Borrow | Do not borrow |
|---|---|---|
| Alitheon | Known-location micro-feature matching; "partial view / degradation tolerant" framing; compact fingerprint (<=500 KB) stored per item | Claims of >99.9% / zero false positives; optics we lack |
| Entrupy | Cue checklist (texture, stitch, print alignment, tag); guided capture; money-back-style guarantee tied to a measured error bound | Brand database approach (no per-brand data); "too worn" exclusion is our core use case |
| Certilogo | Per-garment code + consumer scan; eBay now owns it, so marketplace-native verification is proven demand | Needs brand enrolment |
| EON | Resale-time passport scan; DPP + ownership certificate schema; QR/NFC carrier choice | Brand-side enrolment, blockchain framing |
| Verisart | Not verified this session (no result found for garments); skip unless a fact is needed [unverified] | n/a |

---

## 5. INNOVATION IDEAS (ranked by wow x feasibility-in-10-days)

Scores 1-5; product shown.

| Rank | Idea | Names | Wow | Feas | Score | Why it's novel / how |
|---|---|---|---|---|---|---|
| 1 | **Declared-flaw fingerprints with asymmetric evidence**: every flaw the seller confirmed at listing becomes an identity mark; handover must *recover* each, in the same region; a vanished declared flaw is flagged as stronger evidence of swap/cleaning than a missing keypoint | LightGlue + ALIKED (R4-03), MAGSAC (OpenCV), Gemini crops | 4 | 5 | **20** | Turns the seller's honesty into the identity key; no marketplace does this. Needs no extra hardware. |
| 2 | **Garment Defect Map in template space** ("new ~2 cm stain, wearer-left cuff"): part masks + Gemini landmark points -> TPS to category template; region-by-region compare; size in cm from garment-width scale or tag | `resoa/garment-detector-seg` (Apache-2.0, Fashionpedia), kornia/OpenCV TPS, Gemini pointing; concept from GarmentCodeData (sewing-pattern canonical space) and Cloth Funnels "canonicalized alignment" | 5 | 4 | **20** | The headline demo sentence. The robotics papers canonicalise in 3D with a robot; we canonicalise in 2D with a human flat-lay. |
| 3 | **Active evidence acquisition ("one more photo, here")**: when CAN'T TELL, ADK agent picks the highest-uncertainty region and asks for a single overlay-guided close-up (listing crop ghosted over camera view) | ADK agent loop; region uncertainty from steps 2-3; overlay via OpenCV.js | 4 | 4 | **16** | Converts abstention into progress; strong agentic story; cheap because the CV service already scores per region. |
| 4 | **Risk-certified three-way gate with a published bound**: LTT picks the "MATCHES" threshold so false-match <= alpha with probability 1-delta; Clopper-Pearson CIs on the slide; stratified easy/hard negatives | Learn-then-Test (arXiv 2110.01052), MAPIE risk control (Hoeffding-Bentkus), Selective Conformal Risk Control (arXiv 2512.12844) for the two-stage design | 4 | 4 | **16** | Few startups quote a certified bound; judges reward honesty. The bound is modest (3-5%), which is the point. |
| 5 | **Albedo-space change detection ("stains change colour, wrinkles change light")**: diff on Lab chroma / local-contrast-normalised registered crops, with PatchCore fitted on the *listing crop of the same region* (one-shot reference-based AD); stretch: Marigold-IID albedo | anomalib PatchCore (Apache-2.0), OpenCV; stretch Marigold-IID-Lighting (OpenRAIL++-M, GPU) | 4 | 4 | **16** | Principled pseudo-change suppression; ablation (RGB diff vs albedo-space diff false-change rate) is a clean results table row. |
| 6 | **Tag as ruler, colour card and anchor**: QR tag corners give homography, physical scale (cm), white-balance/exposure reference, and a fixed anchor on the care label; DPP-shaped GS1 Digital Link payload | OpenCV QR/ArUco detection (Apache-2.0), GS1 Digital Link | 3 | 5 | **15** | Makes "2 cm" a measurement, not a guess; DPP story for the EU/JAPAC pitch. |
| 7 | **Label / macro-patch micro-fingerprint ("FeaturePrint-lite")**: macro photo of care label + 2x2 cm weave next to the tag; rigid homography at that scale; inliers vs same-model impostor distribution | ALIKED/DISK + LightGlue; Alitheon (concept only) | 5 | 3 | **15** | Biggest wow if it works; honest experiment: day-2 feasibility on 8 identical-pair garments, drop if impostors overlap genuine. Do not promise it. |
| 8 | **Dense non-rigid registration (no flat-lay needed)**: DINOv3/DIFT/RoMa v2 dense warp to template to compare even folded/hanging photos | RoMa v2 (MIT code; DINOv3 custom weights), DIFT (MIT), DINOv3 | 3 | 2 | **6** | Needs GPU and tuning; stretch only; flat-lay protocol is the cheaper path. |

Recommended build order: 1, 2, 6 (core), then 4, 3, 5; run 7 as a day-2 experiment; 8 is a slide ("next").

---

## 6. 10-day cut for this stage [J]

- Day 1-2: protocol + tag payload + QR/scale detection; collect **40 garments x (listing session, handover session)** with different lighting and folding, plus **8-10 identical-pair garments** (hard negatives) and ~10 garments with a deliberately added stain/hole/pull for planted changes. Run the label/macro-patch feasibility test here (idea 7).
- Day 3-5: part masks + landmarks + TPS template (idea 2); flaw fingerprints (idea 1); region diff + PatchCore (idea 5).
- Day 6-7: Gemini crop-pair cross-exam; LTT thresholds; results table.
- Day 8-9: active re-ask loop; ADK/Cloud Run wiring; demo script.
- Day 10: buffer. Never move the defect-map demo sentence to the stretch list.

Results table to ship: (i) identity: genuine vs hard-negative score histograms, certified false-match bound per stratum; (ii) condition: planted-change detection rate and false-change rate per image pair, RGB-diff vs albedo-space vs +Gemini filter; (iii) abstention rate (CAN'T TELL %), because a gate that abstains 80% is useless.

---

## 7. Licence and maturity summary

| Component | Licence | Maturity | Note |
|---|---|---|---|
| LightGlue, ALIKED, DISK, kornia, OpenCV | Apache-2.0 / BSD | Mature | R4-03 |
| anomalib (PatchCore) | Apache-2.0 | Mature | R4-03 |
| resoa/garment-detector-seg | Apache-2.0 weights; Fashionpedia CC BY 4.0 data | Immature (8 epochs, single author) | Validate on own flat-lays |
| Depth Anything V2 Small | Apache-2.0 | Mature | Larger sizes CC-BY-NC |
| DINOv3 | Custom DINOv3 License, gated | Mature | Read licence; DINOv2 is the safe default |
| RoMa v2 | MIT code; DINOv3 weights custom | New | GPU |
| DIFT | MIT | Research | GPU |
| MAPIE (LTT risk control) | BSD-3 [M] | Mature | |
| UniVAD | Licence not read | Research | SAM-HQ + GroundingDINO, heavy |
| image-diff (object change) | MIT | Stale (PyTorch 1.10, 11 stars) | Idea only |
| Marigold-IID | OpenRAIL++-M | Research | GPU |
| DeepFashion2 | Request-form research access | Dormant since 2020 | Avoid |
| UniGarmentManip | Repo is a redirect stub | Research | Avoid |

---

## 8. DEAL-BREAKERS (severity; category-change?)

| # | Risk | Severity | Forces category change? | Mitigation |
|---|---|---|---|---|
| 1 | **Plain mass-produced garment + no marks: same-unit identity cannot be established from phone photos**, and the tag only proves the tag (tag transplant). | **HIGH** (it is the headline "SAME GARMENT" claim) | **No.** It forces a **claim change**: "consistent with listing / tag intact / flaws recovered", with CAN'T TELL as the honest answer for unmarked items. It would force a category change only if the product had to *guarantee* same-unit for plain items, which no competitor can either. Books/footwear would not fix it (also mass-produced); a category with serial numbers (electronics) would. | Bind tag to garment with in-situ photo of tag loop + label wear + declared flaws; low-identifiability flag; sell the dispute outcome, not a certificate. |
| 2 | **Pseudo-change at "2 cm on a cuff" precision** under phone lighting and non-flat laying. | MEDIUM-HIGH | No | Flat-lay protocol, albedo-space diff, Gemini crop adjudication, size in cm only when scale reference visible, otherwise say "small/medium/large". |
| 3 | **Validation set too small to certify hard-negative false-match** (3-5% best case with 60-100 pairs; with ~10 identical-pair items, hard-stratum bound is weak). | MEDIUM (credibility, not feasibility) | No | State bounds openly; report strata separately. |
| 4 | **Adversarial buyer**: takes poor photos or crops flaws to force "DIFFERS" and a refund; or seller swaps. | MEDIUM-HIGH | No | Quality gate first (never DIFFERS on a failing photo); DIFFERS requires evidence crops + human approval in dispute service (R4-00); symmetric protocol and timestamps/nonce. |
| 5 | **Part-mask quality** (cuff/hem mIoU unverified; model undertrained) and left/right ambiguity. | MEDIUM | No | Fallback to Gemini pointing; wearer-left convention; 20-garment sanity check on day 3. |
| 6 | **Gemini low-level change blindness** if used on whole-image pairs. | MEDIUM | No | Only crop pairs from CV candidates; CV is the detector, Gemini the cross-examiner. |
| 7 | **Micro-texture fingerprint (idea 7) fails** on phone photos. | LOW (optional) | No | It is a day-2 experiment, not a dependency. |
| 8 | **DPP over-claim**: textile delegated act not yet adopted; carrier/scope may change. | LOW | No | Say "DPP-ready" (GS1 DL payload). |
| 9 | **Meesho fashion conflict** (R4-00) | Not CV; policy | Possibly (employer policy) | Already flagged in R4-00; not repeated. |

**Single high-severity item: #1.** It is the only one that threatens the *headline* promise; it is handled by changing the wording and the abstain behaviour, not the category. If the team insists the tagless "same unit" proof must hold, the honest answer is that it cannot with phone photos today.

---

## 9. Sources

- Alitheon: https://alitheon.com/ ; https://www.globenewswire.com/news-release/2026/06/26/3318367/0/en/alitheon-featureprint-named-overall-authentication-solution-of-the-year-in-2026-ai-breakthrough-awards-program.html ; https://www.theordregroup.com/press/authentique-announces-strategic-partnership-with-leader-in-vision-ai-alitheon
- Entrupy: https://www.entrupy.com/apparel-authentication ; https://www.entrupy.com/ja/entrupy-expands-ai-authentication-to-streetwear-and-apparel/
- Certilogo/eBay: https://www.sgieurope.com/ebay-acquires-italian-tech-firm-certilogo/102868.article ; https://www.theretailbulletin.com/general-merchandise/ebay-completes-acquisition-of-certilogo-13-07-2023/
- EON: https://docs.eon.xyz/brand-protection ; https://eon.xyz/blog/introducing-eon-instant-resale
- Silk PUF: https://www.ncbi.nlm.nih.gov/pmc/articles/PMC8752800/
- Cloth Funnels: https://arxiv.org/pdf/2210.09347 ; UniGarmentManip: https://arxiv.org/pdf/2405.06903 ; GarmentCodeData: https://arxiv.org/pdf/2405.17609
- Change detection: https://arxiv.org/abs/2501.05555 ; https://github.com/anguyen8/image-diff ; https://arxiv.org/pdf/2606.03114 ; https://arxiv.org/pdf/2606.28012 ; https://arxiv.org/pdf/2411.03706
- UniVAD: https://openaccess.thecvf.com/content/CVPR2025/html/Gu_UniVAD_A_Training-free_Unified_Model_for_Few-shot_Visual_Anomaly_Detection_CVPR_2025_paper.html ; https://github.com/FantasticGNU/UniVAD
- VLM change blindness: https://arxiv.org/abs/2609.06245
- Garment parts: https://huggingface.co/resoa/garment-detector-seg ; DeepFashion2: https://github.com/switchablenorms/DeepFashion2
- Dense features: https://github.com/facebookresearch/dinov3 ; https://github.com/Tsingularity/dift
- Intrinsics: https://huggingface.co/prs-eth/marigold-iid-lighting-v1-1 ; https://arxiv.org/pdf/2405.00666
- Calibration: https://arxiv.org/abs/2110.01052 ; https://mapie.readthedocs.io/en/latest/theory/risk-control/ ; https://arxiv.org/pdf/2512.12844
- EU DPP: https://cosh.eco/en/articles/eu-digital-product-passport-espr-explained-fashion-textiles ; https://www.renoon.com/blog/delegated-acts-for-digital-product-passport-explainer-and-current-status ; https://www.unitag.io/gs1-digital-link
- Gemini pointing/boxes: https://ai.google.dev/gemini-api/docs/image-understanding
