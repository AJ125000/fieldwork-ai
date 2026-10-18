# R6-01: Seller capture of a used garment (7 Oct 2026)

Scope: garment-specific capture for the C2C trust layer (jackets, denim, hoodies, shirts, dresses). Builds on R4-02 (generic quality gates, nonce, C2PA, detectors) and R4-00 (architecture). This report does not repeat those; it adds what is specific to clothing.

Evidence labels: **[V]** = read/fetched this session (URL given; fetch summaries came from a small model, so check gating facts such as licences). **[S]** = from search-result snippets only. **[K]** = my background knowledge, not re-verified. **[E]** = my estimate or judgement. Licence and maturity are given for every repo.

---

## 0. Summary (what matters)

1. **Fit is the strongest differentiator and it is feasible.** A printed QR/ArUco card lying in the garment plane gives scale. A published ArUco-based garment measurement system reached 6.45% mean relative error, 4.07% after a learned correction, with a single marker at varying camera distance [V]. With a card in the same plane as the flat-lay, the correction should be unnecessary. That is about 2 to 3 cm on a 60 cm length [E]. Fit/size is 42-53% of apparel returns in two surveys [S]. An iOS app, Saisun, already does QR-scale flat-lay measurement for resale, so the idea is proven but not on any major platform [V].
2. **No major platform guides garment capture or flags flaws.** Vinted's AI suggests category/brand/colour from the first photo and has no flaw detection [V, secondary blog]. eBay, Poshmark, Depop and Mercari AI all aim at "less seller effort" listing text, not capture quality or condition [V/S]. Fleek Sort is the closest analogue, but it serves B2B sorting hubs, not C2C [V].
3. **Live coaching can use Gemini Live API through ADK**, but ADK's live toolkit is marked Experimental and Live sessions have limits (section 2.4). Cheap deterministic checks stay in the browser; Gemini handles language and judgement.
4. **The AI-fake-damage refund scam on Vinted (March 2026) is a live, public example** that makes verified capture a concrete need, not a hypothetical [V].
5. **Biggest product risk is seller friction**, not any model (section 7).

---

## 1. Which shots a used garment needs, and how platforms standardise

### 1.1 What the platforms do (evidence)

| Source | What it standardises | Ref |
|---|---|---|
| **Vinted** | Up to 20 photos; "show any flaws or defects in the photos"; photograph care labels (materials); first photo shows the whole item; own photos, not stock. No mandated angles. AI looks only at the first image (category, brand if logo visible, colour). Has no flaw detection. Measurements go in the free-text description (no dedicated field found). | [V] https://www.vinted.co.uk/help/375-uploading-step-by-step ; https://fripio.app/blog/vinted-ia-fonctionnalites-integrees-2026 ; [S] https://www.vinted.co.uk/help/1551 |
| **Vestiaire Collective** | Item-specific required photo set in a fixed order set by the platform; brand tag and serial close-ups; no props; stock photos rejected; curation team checks images first, then physical authentication. | [S] https://blog.vendoo.co/expert-tips-how-does-vestiaire-collective-work-for-sellers |
| **ThredUp** (sorting hub) | Items routed to photography; higher-value on mannequin, lower-value flat; photos QA'd; 360-degree images; AI extracts attributes from the image; inbound automation for "identification and measurements". | [S] https://www.supplychain247.com/article/hanging_it_up_at_thredup/automation ; https://www.modernretail.co/operations/how-ai-is-transforming-inventory-management/ |
| **The RealReal** | Mannequin shot from multiple angles with pre-programmed camera settings; condition report; authenticators. Little public detail on detail-shot standards. | [S] https://www.therealreal.com/products/10779171/condition_report |
| **Poshmark** (Smart List AI) | AI reads title/size/brand/colour from photos; tells sellers to use well-lit multi-angle photos on a contrasting background and include a close-up of the tag; reports poor light degrades results. | [S] https://www.valueaddedresource.net/poshmark-smart-list-ai/ |
| **Depop** | One-photo "Generate Description" (category, colour, brand, hashtags), Sept 2024. | [V] https://thenextweb.com/news/depop-ai-generates-listings-from-one-photo |
| **eBay Magical Listing** | Snap a photo; AI does photo selection, title, category, item specifics, pricing; >500M AI-assisted listings, +50% listings per lister, UK/AU/DE from Q2 2026. | [S] https://innovation.ebayinc.com/tech/features/magical-listing-tool-harnesses-the-power-of-ai-to-make-selling-on-ebay-faster-easier-and-more-accurate/ |
| **Mercari** | Beta image-based listing ("a pic, a price, a title"); brand/category suggestions with mixed accuracy. Older (beta write-up). | [V] https://www.valueaddedresource.net/mercari-image-ai-listing-tool-beta/ |
| **Fleek** | Fleek Sort: custom vision-language model, input is a single smartphone photo or video, outputs category, brand, defects, grade, predicted sell-through price; used in hubs in Pakistan, India, Dubai; trained on millions of transactions; $25M Series B (July 2026), eBay an investor; 12M items processed. | [V] https://thenextweb.com/news/fleek-25m-series-b-secondhand-fashion-ai |
| **Trove** | CV on check-in images, matched against millions of records, to classify, price, route, list. | [S] https://trove.com/how-it-works/ |
| **Kidihub** (Poland, children's resale; paper) | Garments ironed and arranged for photo; contrast background (dark garment on white, light garment on black); 76 of 900 photos rejected for contrast/rotation. | [V] https://doi.org/10.15439/2022F8 |
| Reflaunt, Treet, Archive, 2nd Street, Faircado, Lalaland | **Not found:** no public capture-protocol or capture-AI detail surfaced. Treet/Archive/Reflaunt are brand-resale SaaS (listing from order history, stock photos), so they are not capture references. Do not cite them as capture precedents. | [S] cbinsights listings only |
| Japanese resale | Standard flat-measure set (the 採寸 convention): 着丈 length, 肩幅 shoulder, 身幅 body width (chest = width x 2), 袖丈 sleeve. Useful as a JAPAC-native measurement standard. (Source is a general Japanese sizing page, not ZOZOUSED.) | [S] search result set for "ZOZOUSED 採寸" |

### 1.2 Recommended garment protocol [E]

Tiered, so the minimum is fast and extras are requested only when needed:

| Tier | Shots | Trigger |
|---|---|---|
| **Core (about 60 s, 4 photos)** | 1 front flat-lay with card; 2 back flat-lay with card; 3 brand/size label; 4 care/composition label | Always |
| **Condition (conditional, up to 6)** | collar/neckline inside; each cuff; underarms (inside and out); hem; fastener (zip/buttons/waistband); fabric macro (about 5 cm patch, raking light) | Garment type and value; always for higher-value items |
| **Flaw close-ups (as needed)** | for every defect Gemini or the seller flags: one context shot and one close-up with the card or a coin-size reference | Defect found |

Type-specific additions: **denim** waistband inside, crotch/inner-thigh wear, knees, hem fray; **jackets/coats** lining and sleeve lining, zip, collar; **hoodies** cuffs, hem rib, side-seam pilling, drawstring; **shirts** collar band, cuffs, placket; **dresses** zip, underarm lining, hem, lining. Dark or black garments need a lighter background (Kidihub rule) or flaw boxes will fail [V].

Evidence is thin on exactly which set best predicts disputes; this is my synthesis of Vinted/Vestiaire/ThredUp practice plus RISE's three-photo setup in R4-00. Treat it as a hypothesis to test on the 40-60 wild-photo set.

---

## 2. Real-time guidance on a phone browser

### 2.1 Garment detection and segmentation (what exists, licences, maturity)

| Option | What it gives | Licence / maturity | Verdict |
|---|---|---|---|
| **Gemini 2.5/3.x Flash boxes and masks** | `box_2d` [ymin,xmin,ymax,xmax] normalised 0-1000, label, base64 PNG mask via prompt; very cheap (about 0.01 cent per call) | API; documented at https://ai.google.dev/gemini-api/docs/image-understanding ; https://simonwillison.net/2025/Apr/18/gemini-image-segmentation/ [V] | **Use on shutter** (not live per-frame) |
| **resoa/garment-detector-seg** | RF-DETR-Seg-Small (33.6M params), 46 Fashionpedia classes (garment parts: collar, sleeve, pocket, zipper...), mask mAP 0.352, box 0.419; zipper AP 0.10; no baseline/failure analysis | Weights Apache-2.0; Fashionpedia data CC BY 4.0; HF model, single-author, early-epoch checkpoint [V] https://huggingface.co/resoa/garment-detector-seg | **Server-side only, optional**; weak on small trims |
| **YOLOS-Fashionpedia / SegFormer clothes (HF)** | Older fashion detectors | HF community models, licences vary [S] | Skip |
| **Ultralytics YOLO26 (seg/pose)** | Fast, NMS-free, ONNX export; train on Fashionpedia/DeepFashion2 yourself | **AGPL-3.0**, mature, large community [S] https://github.com/ultralytics/yolo26 | OK for a prototype, but training time is the cost; not needed if Gemini boxes suffice |
| **SAM 3** | Text-prompt concept segmentation ("grey hoodie"), 848M params, SA-CO benchmark | "SAM License"; GitHub 11.9k stars; SAM 3.1 Mar 2026; **gated HF checkpoints**; needs CUDA GPU [V] https://github.com/facebookresearch/sam3 | Server-side GPU only; not for a 10-day Cloud Run CPU build |
| **SAM 2 / EdgeTAM / SlimSAM in browser** | Tap-to-segment via WebGPU (Transformers.js demos); EdgeTAM 16 FPS on iPhone 15 Pro Max (native) | EdgeTAM Apache-2.0; SAM 2 Apache-2.0 [K]; browser demos at https://huggingface.co/spaces/webml-community/segment-anything-webgpu [S] | Optional "tap the garment" refinement; WebGPU on iOS Safari is unreliable [E] |
| **MediaPipe Tasks Web** (Image/Interactive Segmenter) | In-browser segmentation, no server | Apache-2.0, mature (R4-02) | Good fallback for live mask without a server call |

**Practical design:** live loop in the browser uses cheap heuristics (blur, exposure, glare, card-found, garment-fills-frame from a coarse colour/edge mask or MediaPipe). Gemini boxes/masks on each shutter press for garment extent and coverage. Do not run per-frame object detection for fashion in-browser; no off-the-shelf small model does it well (R4-02 [K]).

### 2.2 Flat-lay landmarks (the measurement points)

| Option | Details | Licence / maturity |
|---|---|---|
| **DeepFashion2** dataset | 491K images, 801K items, 13 categories, **294 landmarks** (e.g. 39 for long-sleeve outwear) | Access via form + password; research use implied, not explicit; 2.6k stars [V] https://github.com/switchablenorms/DeepFashion2 |
| **HRNet for fashion landmarks** | HRNet-W48 384x288, DeepFashion2 val AP 0.702 (AP.5 0.956, AP.75 0.801); needs a detector crop; weights on OneDrive; 3rd place 2020 challenge | **MIT**, 152 stars, 2020-era, PyTorch >=1.2 [V] https://github.com/svip-lab/hrnet-for-fashion-landmark-estimation.pytorch |
| **Aggregation & finetuning for clothes landmarks** | 1st place 2020, AP 0.590 test / 0.615 val (different protocol) | Repo https://github.com/lzhbrian/deepfashion2-kps-agg-finetune ; licence not checked [S] |
| **DeepMark / DeepMark++** | CenterNet-based one-shot clothing detection plus landmarks, edge-oriented | arXiv 1910.01225 / 2006.00710; code status unchecked [S] |
| **Gemini points** (zero-shot) | API supports `point` in [y,x] 0-1000 (documented for robotics ER models; docs list `gemini-robotics-er-2-preview`, `gemini-3.5-flash`) [V] https://ai.google.dev/gemini-api/docs/robotics-spatial | Whether Gemini can place **garment** landmarks (shoulder tip, armpit seam, hem corner) accurately is **not verified**. This is a day-1 experiment (idea 1). |
| **Gemma 4** | "Pointing" and object detection listed as image-understanding capabilities; Apache-2.0; E2B/E4B edge sizes; 128K context [V] https://edge-ai-vision.com/2026/04/google-pushes-multimodal-ai-further-onto-edge-devices-with-gemma-4 | Gemma-on-device route is possible but the web LLM engine is in maintenance mode [S]; do not bet the build on it |

DeepFashion2 landmarks are **defined** for worn and flat garments with occlusion flags, so the flat-lay case is the easy end of its distribution [E]. The 2024 ECU master's thesis combined DepthAnything depth and Keypoint R-CNN for measurements "in the wild" (no accuracy or scale reference found in the available text) [V] https://thescholarship.ecu.edu/items/7a31dc61-8270-42da-926c-0cd169e2e664/full .

### 2.3 Coverage, auto-crop, AR overlay

- **Template ghost overlay:** per garment type, a translucent silhouette plus landmark target dots on the live preview ("lay the hoodie so the shoulders touch the dots"). Auto-shutter fires when sharp, card detected, mask inside the ghost with margin, tilt small (gyro) [E].
- **Coverage check:** after each shot, compare the Gemini mask against the template; require all measurement landmarks to be visible, no cropping at frame edges, no fold over a sleeve [E].
- **Auto-crop:** crop to the mask bounding box with a margin; keep the full original in the evidence record (the crop is for display only).
- **Coaching text:** "Move closer to the cuff", "Smooth the left sleeve", "Card is cut off" come from the deterministic check state, spoken or shown. Gemini adds free-form advice only when asked.

### 2.4 Live voice/video coach with Gemini Live API and ADK

- ADK's Gemini Live API Toolkit gives low-latency bidirectional audio/video, interruptions, session resumption; docs mark it **Experimental** (Python v0.5.0, Java v0.2.0) [V] https://adk.dev/live/ . It runs on the Gemini Live API.
- Video goes in as discrete JPEG frames at about 1 frame per second, 768x768 recommended; session context 128k tokens; **video+audio sessions are limited to 2 minutes** unless using session resumption/context compression [S, Firebase Live limits page] https://firebase.google.com/docs/ai-logic/live-api/limits-and-specs ; https://docs.cloud.google.com/vertex-ai/generative-ai/docs/live-api/send-audio-video-streams . The Live API doc page shows a "Gemini 3.8 Live" model with async function calling [V], model ID to confirm.
- Browser can connect directly with **ephemeral tokens** (default 1 minute to start a session, 30 minutes of messaging) [V] https://ai.google.dev/gemini-api/docs/live-api/ephemeral-tokens ; your Cloud Run service issues the token.
- 1 fps means it cannot judge motion blur; keep blur/glare/framing in the on-device loop and let the coach read those results via tool calls (`get_quality_state()`, `get_checklist()`, `request_shot(name)`).

---

## 3. Scale and measurement from photos

### 3.1 Evidence

| Source | Method | Accuracy | Notes |
|---|---|---|---|
| Kowaleczko, Rokita, Szczuka 2022, FedCSIS (Kidihub) | Contour + feature points, one 10 cm ArUco marker, NN error correction; 824 usable photos; tops, skirts, trousers | Mean relative error 6.45% baseline, **4.07% after NN** (skirts 4.56% to trousers 7.13% baseline); ground-truth resolution of 1 cm alone contributes 3.16% | Error is mostly **camera-distance/perspective**, because a single marker was used at varying distances; authors say a calibrated setup would give about 2-3% [V] https://doi.org/10.15439/2022F8 |
| MDPI Applied Sciences 2022 (blazers/dresses/skirts) | UNet mask + keypoints | Average 1.27 cm blazers, 0.747 cm dresses, 1.012 cm skirts | Could not open the page (HTTP 403); figures from a search snippet only [S] https://www.mdpi.com/2076-3417/12/10/5286 |
| LiDAR point-cloud method | Deep learning on LiDAR | 1.59% / 2.08% relative error | Snippet only; needs LiDAR iPhone (not browser) [S] |
| ECU thesis Dec 2024 | DepthAnything + Keypoint R-CNN, DeepFashion2 | not found | [V] |
| **Saisun** (iOS app, 2025) | Lay flat, photograph, AI detects parts; **QR marker for scale**; shoulder, body width, length, sleeve, waist, inseam; says results vary with placement, marker position, distortion; free, $2.99 premium | no accuracy published; too few ratings | Direct precedent [V] https://apps.apple.com/us/app/%E8%B5%9B%E5%AF%B8-ai%E8%A1%A3%E7%89%A9%E5%B0%BA%E7%A0%81%E8%87%AA%E5%8A%A8%E6%B5%8B%E9%87%8F%E5%BA%94%E7%94%A8/id6746278475 |
| Industry tolerance | Fashion tolerates about 2 cm / about 2% | | [S] snippet via the same search |

**Fit as a return driver:** size/fit was 53% of apparel returns (Coresight 2023) or 42% (Narvar) [S] https://3dlook.ai/content-hub/apparel-return-rates-the-stats-retailers-CANNOT-ignore/ (vendor blog, so quote the range, not a point).

### 3.2 How to do it in the 10-day build [E]

1. Card has four ArUco markers at known spacing (R4-02 card design) plus the session QR. Detect markers, compute the **homography** to a metric plane. Because the card lies in the garment plane when flat-laid on a surface, perspective is removed by the homography and the main error source in the Kidihub paper largely disappears.
2. Segment garment (Gemini mask), find landmarks (Gemini points vs HRNet crop), compute pit-to-pit (chest half-width), centre-back length, shoulder width, sleeve length (shoulder seam to cuff), waist/hem width, inseam for denim.
3. Report as **ranges** ("chest 52 cm, plus or minus 2") and mark unmeasurable (card missing, garment folded, stretch fabric laid under tension).
4. **Validate honestly:** tape-measure 20 to 30 garments yourself (jackets, denim, hoodies), report MAE and 90% error per measurement. Put the table in the pitch. This is the evidence judges will remember.
5. Fit product: show "Chest 52 cm" next to "your favourite hoodie: 54 cm" if the buyer measures one of their own garments the same way (same card, same flow).

Known limits: stretch knits distort when pulled flat; garments on hangers are not planar (no scale); a dark garment on dark floor fails segmentation; seller mis-placement (sleeves bent) corrupts sleeve length. All are detectable by coverage and symmetry checks (left/right half-widths should agree) [E].

---

## 4. Colour fidelity and texture

### 4.1 Colour

- Colour-related mismatch is cited as 20-30% of fashion returns (vendor/marketing source; weak) [S] https://levelup.gitconnected.com/the-color-calibration-issue-thats-costing-e-commerce-billions-298c0a435892 . Over 70% of products are neutral/basic colours, which are hard to photograph [S, same].
- Commercial precedent: X-Rite Color-Eye uses a smartphone plus a calibration card for shoppers to match colours [S] https://www.xrite.com/about-us/news-events/press-releases/color-eye-launch .
- Practical method (from R4-02, kept short): detect card patches, compute white-balance gains in linear RGB, report a **colour-corrected estimate**. For a multi-patch card, **colour-science** (BSD-3 [K]) offers `colour_correction_Finlayson2015` root-polynomial correction [V] https://colour.readthedocs.io/en/latest/_modules/colour/characterisation/correction.html . OpenCV `mcc` can detect a Macbeth chart [K].
- **Honesty point:** a home-printed card has uncalibrated printer colour. Rely on neutral grey for white balance and treat colour patches as relative checks, not truth. Do not reject listings on colour.
- Clothing-specific use: output a dominant fabric colour in CIELAB and a plain-language name plus "match confidence", so a buyer sees "mid-grey heather" rather than a mood-lit photo. Also flag fade only relative to seams/inside-fold area (inner seam allowance vs outer face) [E]: a within-garment comparison is robust to lighting.

### 4.2 Texture, pilling, identity

- Pilling grading from image is well studied (CNN accuracies of 94-100% reported on lab-controlled fabric images; 3D point-cloud approaches such as TextileNet8 emerging) but on **standard test rigs**, not phone photos [S] https://emerald.com/insight/content/doi/10.1108/IJCST-02-2020-0024/full/html ; https://journals.ekb.eg/article_125351.html . Do not quote those numbers for phone use. R4-00's plan (SigLIP 2 heads trained on RISE's pilling labels) is the realistic path; a macro shot adds a better view than the standard 3-photo set.
- **Weave/fibre as identity:** fabric texture has a regular (weave) and a random (fibre) component [S] https://eprints.whiterose.ac.uk/id/eprint/116192/ ; silk-based optical PUFs exist [S] https://www.ncbi.nlm.nih.gov/pmc/articles/PMC8752800/ . No paper I found demonstrates smartphone macro-photo identification of individual used garments. **Treat as a research bet, not a feature.** A cheap test: photograph the same 5 hoodies' hem rib twice at different times and match with ALIKED + LightGlue; measure inlier counts on same vs different garments [E].
- Macro capture needs distance (about 8-12 cm) and raking light; many phones focus poorly at that distance. Sort this by guidance ("hold card edge against the fabric, then step back until the shutter turns green").

---

## 5. Live-capture proof and AI/stock-photo detection for clothing

### 5.1 Why clothing specifically

- Vinted requires sellers' own photos rather than stock/advertising images [S] https://marszalstudio.pl/en/vinted-photos-tips/ . Vestiaire rejects stock photos [S].
- Vinted's position on AI photos: allowed unless deceptive; "AI can enhance, not replace" [S] https://friptadium.com/blogs/actualites/photos-ia-vinted . Vinted has said "the use of AI is not prohibited" in response to the refund-scam reports [V, OECD incident page].
- **March 2026 refund-fraud incident:** buyers use generative AI to add holes/stains to received items and submit as damage evidence; automated moderation and human support struggle to tell fake from real damage [V] https://oecd.ai/en/incidents/2026-03-02-16b3 ; https://www.nssmag.com/en/fashion/45705/artificial-intelligence-ai-vinted-scams-fake-listings [S]. Also sellers using AI images to pass off low-quality new items [S]. This is evidence that damage claims need provenance, which is exactly a listing-time condition record plus handover capture.

### 5.2 Detection tools for clothing listings

| Need | Tool | Licence / maturity | Fit |
|---|---|---|---|
| Brand stock/catalogue photo reuse; stolen photos | **Cloud Vision Web Detection** (Google image search matches) | $3.50 per 1,000 after 1,000 free per month [S] https://cloud.google.com/vision/pricing ; GA, Google-native | **Use.** Seller photos should have no web matches; matches to retailer sites flag stock use |
| Duplicates across listings/sellers | PDQ + embedding index; SSCD copy-detection descriptor (https://github.com/facebookresearch/sscd-copy-detection, [S]; licence unverified) ; DINOv2 for near-duplicates | Open, mature | Use PDQ + Marqo-FashionSigLIP (Apache-2.0, 150M params [S] https://www.marqo.ai/blog/search-model-for-fashion ) or DINOv2 |
| "Is this a studio/catalogue shot, mannequin, model?" | Gemini classification of shot type (flat-lay, mannequin, studio, home, screen) | API | Use as a low-risk flag |
| AI-generated garment images | VTONGuard (775K real/synthetic try-on images, Jan 2026; code release unconfirmed) ; MIRAGE in-the-wild AI detection (arXiv 2508.13223) | Papers, no licence/code verified [V/S] https://arxiv.org/abs/2601.13951 | Cite as research context; do not depend on it |
| Google-made AI images | **SynthID** detection works only for Google AI content (Gemini, Imagen, Veo), and the portal is not an API [V] https://blog.google/innovation-and-ai/products/google-synthid-ai-content-detector/ ; the Gemini app can check uploads [S] | Waitlist/portal | Mention only; cannot automate |
| Recapture, nonce, signed manifest | See R4-02 | | Reuse as designed |

**Conclusion:** the credible stance is R4-02's: positive provenance (live nonce in frame, card, signed manifest) plus a duplicate/stock screen, with AI-generated detection as a weak flag. For clothing, add: (a) the card and flaw close-ups make a fabricated "damage added later" claim comparable against the **listing-time flaw ledger** (idea 2); (b) an AI-edited damage photo that adds a hole where the listing-time garment crop was intact is a registration + local-difference check, not an "AI detector" problem.

---

## 6. What to borrow

| From | Borrow |
|---|---|
| Fleek Sort | Single-video intake; model reads brand, defects, grade; learns from what sells. Borrow: the **defect + grade from one capture** framing and the sorting-hub deployment story (JAPAC relevance: India, Pakistan, Dubai hubs) |
| ThredUp | Split by value: more shots (mannequin/ghost) only for higher-value items; QA on photos |
| Vestiaire | Mandated order and shot list per category; no props; no stock |
| Poshmark | Contrast background; always a tag close-up |
| Kidihub paper | Dark-on-light/light-on-dark background rule; reject by contrast and rotation |
| Saisun | QR-scale flat-lay measurement; say "confirm with a tape for exact" |
| eBay / Depop / Mercari / Poshmark | One-photo auto-fill (category, colour, brand, size): worth copying only as a **second step** after capture, since all of them stop at text and do none of flaw detection or measurement |
| Vinted | Own-photos rule; AI allowed if not deceptive; their stated AI-training use of listing photos (Sept 2025) is a privacy talking point [V] https://androidworld.nl/nieuws/de-vinted-app-traint-straks-zijn-ai-met-jouw-oude-t-shirts/ |

---

## 7. INNOVATION IDEAS (ranked by wow for judges x feasibility in 10 days)

Scores 1-5; product = wow x feasibility.

| # | Idea | Wow | Feas | Score | Builds on |
|---|---|---|---|---|---|
| 1 | **"Tape-free fit": measure from the card** | 5 | 4 | **20** | Kowaleczko 2022 ArUco garment measurement (4.07% after correction); Saisun QR precedent; OpenCV ArUco homography; Gemini points vs HRNet-W48 (MIT) landmarks; DeepFashion2 landmark definitions |
| 2 | **Flaw ledger in garment coordinates** | 4 | 4 | **16** | Gemini boxes/masks; card-based mm sizing; garment landmarks as the coordinate frame |
| 3 | **Capture-proof defence against AI-fake-damage claims** | 4 | 4 | **16** | Vinted March 2026 incident; R4-02 nonce/manifest; Cloud Vision Web Detection; PDQ/SSCD/DINOv2; Marqo-FashionSigLIP |
| 4 | **Gemini Live "capture coach"** | 5 | 3 | **15** | Gemini Live API + ADK live toolkit; ephemeral tokens; tool calls into the deterministic quality gate |
| 5 | **Ghost-template auto-shutter and coverage meter** | 3 | 5 | **15** | OpenCV.js blur/glare/gyro; Gemini mask vs template; DeepFashion2 category templates |
| 6 | **Colour-true swatch with confidence** | 3 | 4 | **12** | colour-science Finlayson2015; card neutral patch; within-garment fade comparison |
| 7 | **Care-label reader with multilingual fibre/wash fields** | 2 | 5 | **10** | Gemini OCR; JAPAC label languages; QR tag attached through care label (R4-00 tag) |
| 8 | **Fabric-weave macro fingerprint ("same unit")** | 5 | 2 | **10** | ALIKED (BSD-3) + LightGlue (Apache-2.0) local features; textile PUF literature; unproven on phones |

Details:

1. **Tape-free fit.** Seller lays garment on a floor/bed with the card in the same plane; app returns chest, length, shoulder, sleeve, with a stated error range and "can't measure" fallbacks. Day-1 experiment: 5 garments, Gemini point prompt for landmarks versus HRNet crops, compare to a tape. Pitch: fit is the top return reason, and nobody in C2C measures. Show the MAE table.
2. **Flaw ledger.** Each defect becomes a record: type, size in mm (from the card), position relative to landmarks ("left cuff, 3 cm from the seam"), close-up evidence ID. It becomes the buyer-facing condition record and the fingerprint set for handover (R4-00). The ADK planner loops: first pass finds candidate defects, then asks for the close-ups, then reconciles with the seller.
3. **Provenance-based defence.** Listing-time garment images carry nonce, card and manifest. At dispute time the claimant's damage photo is registered to the listing-time crop of the same region: "no defect there at listing", or "that defect was declared", or "can't tell". Link to R4-04's dispute stage. Say clearly: it flags, it does not prove AI editing.
4. **Live coach.** Voice and video, "turn the hoodie over", "card is hidden by the sleeve". Fallback if Live is flaky: 1 fps frames to Gemini Flash plus text-to-speech, or on-screen text only. Use session resumption; budget for 2-minute video sessions.
5. **Ghost template and auto-shutter.** Lowest risk, instantly visible in the demo; also the foundation for ideas 1 and 2.
6. **Colour swatch.** Gives "colour-corrected estimate" and compares inner-seam colour to outer face for fading. Don't sell it as colorimetry.
7. **Care-label reader.** Quick win; supports multilingual JAPAC rendering.
8. **Weave fingerprint.** High upside, unproven; run a one-hour feasibility test on day 3 and drop it if inlier separation is poor.

---

## 8. DEAL-BREAKERS for clothing at this stage

| # | Issue | Severity | Forces a category change? | Mitigation |
|---|---|---|---|---|
| 1 | **Seller friction.** C2C sellers expect "a pic, a price, a title" (Mercari) or eBay's snap-and-go; a printed card plus 4 to 10 shots may cause drop-off [V/S] | **High** (for adoption, not for the hackathon demo) | **No**, but it forces positioning: tiered capture (4-shot core), card optional (no-card mode with lower badge), target higher-value items first | Time the capture flow (aim under 90 s); show the tier ladder; put "optional upgrade for items above a price threshold" in the pitch |
| 2 | **Measurement accuracy claims.** Single-card flat-lay may reach 2-4% but stretch knits, folds, and bent sleeves break it; the hackathon dataset for this does not exist | Medium | No | Tape-validated MAE on your own 20-30 garments; show ranges; refuse when uncertain |
| 3 | **ADK live toolkit is Experimental; Live video sessions limited (about 1 fps, 2-minute video+audio)** | Medium | No | Keep a non-Live fallback; keep gates deterministic |
| 4 | **Dark, black, patterned garments hide stains and pilling** in home light; macro shots on phones may not focus | Medium | No | Raking-light prompt, lighter background, "can't tell" abstention |
| 5 | **Smell, hand-feel, true fit on body, hidden wear (lining, odour) are not capturable** | Medium | No (category known limit; R4-00) | Say so in the record: "not assessed" fields |
| 6 | **Home-printed card has uncalibrated colour** | Low-Medium | No | Use only grey for white balance; "estimate" wording |
| 7 | **Domain gap** (sorting-line RISE photos versus home phone photos) | Medium (carried from R4-00) | No | Wild test set; abstain |
| 8 | **Licences and gated assets:** DeepFashion2 requires a form/password and is research-oriented; SAM 3 checkpoints gated; YOLO26 is AGPL-3.0; VTONGuard code unconfirmed; LightGlue's SuperPoint extractor is restrictive (use ALIKED/DISK) | Low (hackathon, non-commercial OK) | No | Prefer Gemini + Apache/MIT assets (HRNet MIT, garment-detector-seg Apache-2.0, Marqo Apache-2.0, EdgeTAM Apache-2.0) |
| 9 | **Meesho conflict** (from R4-00; fashion is about half of Meesho sales) | Not re-assessed here (outside this stage) | Only if policy blocks it | Carried from R4-00; check before 11 Oct team formation |

No deal-breaker at this stage forces a change from clothing to books. The one high-severity item is adoption friction, which is solved by tiering and positioning rather than by changing category.

---

## 9. Recommended stack (capture stage)

| Layer | Choice | Licence / maturity |
|---|---|---|
| Browser | PWA with `getUserMedia`, OpenCV.js (blur, exposure, glare, QR; ArUco via OpenCV.js build or `js-aruco2`, to confirm) | Apache-2.0 / mature; confirm the ArUco build |
| Live segmentation (optional) | MediaPipe Tasks Web segmenter; or Transformers.js SlimSAM/SAM with WebGPU for tap-to-segment | Apache-2.0 / Experimental on iOS |
| Coach | Gemini Live API via ADK live toolkit, browser connects with ephemeral token; fallback 1 fps frames + Gemini Flash + TTS | Preview/Experimental in ADK |
| Agent spine | ADK on Cloud Run: capture-planner agent (next required shot), flaw-ledger agent, reconcile step in code | ADK (R4-00) |
| Garment extent and parts | Gemini Flash boxes/masks on shutter; server-side garment-detector-seg (RF-DETR-Seg, Apache-2.0) as a second opinion | API / HF early-stage |
| Landmarks | Gemini points (test) with HRNet-W48 DeepFashion2 weights (MIT) as comparator | Experimental / 2020-era |
| Scale | OpenCV (Python) ArUco homography on the card; metric measurements; tape validation | Apache-2.0 / mature |
| Colour | Neutral-patch white balance (linear RGB) + colour-science Finlayson2015 for multi-patch | BSD-3 [K] / mature |
| Authenticity | Cloud Vision Web Detection, PDQ, DINOv2 or Marqo-FashionSigLIP embeddings, R4-02 nonce and manifest | Google-native / mature; Apache-2.0 |
| Identity bet | ALIKED + LightGlue local features (avoid SuperPoint) | BSD-3 / Apache-2.0 |
| Condition | As in R4-00 (SigLIP 2 heads on RISE + Gemini) | CC-BY 4.0 data |

**Build order (10 days, capture slice only):** day 1 Gemini-points vs tape experiment and card/homography proof; days 2-3 core 4-shot PWA with ghost template and quality gate; day 4 flaw loop (planner + close-ups + mm sizing); day 5 authenticity screen; days 6-7 Live coach (or fallback); day 8 colour; day 9 validation table (tape vs app MAE, wild-photo test); day 10 polish. Drop ideas 7 and 8 first.

---

## 10. Sources

Read/fetched: https://thescholarship.ecu.edu/items/7a31dc61-8270-42da-926c-0cd169e2e664/full ; https://doi.org/10.15439/2022F8 (PDF, read); https://apps.apple.com/us/app/%E8%B5%9B%E5%AF%B8-ai%E8%A1%A3%E7%89%A9%E5%B0%BA%E7%A0%81%E8%87%AA%E5%8A%A8%E6%B5%8B%E9%87%8F%E5%BA%94%E7%94%A8/id6746278475 ; https://github.com/switchablenorms/DeepFashion2 ; https://github.com/svip-lab/hrnet-for-fashion-landmark-estimation.pytorch ; https://huggingface.co/resoa/garment-detector-seg ; https://github.com/facebookresearch/sam3 ; https://adk.dev/live/ ; https://edge-ai-vision.com/2026/04/google-pushes-multimodal-ai-further-onto-edge-devices-with-gemma-4 ; https://simonwillison.net/2025/Apr/18/gemini-image-segmentation/ ; https://thenextweb.com/news/fleek-25m-series-b-secondhand-fashion-ai ; https://thenextweb.com/news/depop-ai-generates-listings-from-one-photo ; https://oecd.ai/en/incidents/2026-03-02-16b3 ; https://androidworld.nl/nieuws/de-vinted-app-traint-straks-zijn-ai-met-jouw-oude-t-shirts/ ; https://www.vinted.co.uk/help/375-uploading-step-by-step ; https://fripio.app/blog/vinted-ia-fonctionnalites-integrees-2026 ; https://blog.google/innovation-and-ai/products/google-synthid-ai-content-detector/ ; https://arxiv.org/abs/2601.13951 ; https://www.valueaddedresource.net/mercari-image-ai-listing-tool-beta/ .

Search snippets only: the [S] URLs in the tables above (ThredUp, Vestiaire, RealReal, Poshmark, eBay, Trove, Vision pricing, Live API limits and ephemeral tokens, return-rate stats, colour/pilling/texture sources, Marqo, LightGlue licence, EdgeTAM, YOLO26).

**Not verified (flag before relying):** whether Gemini can place accurate garment landmarks (key experiment); exact current Live model ID and limits; ArUco availability in the OpenCV.js build; SSCD, colour-science, DeepMark licences; whether VTONGuard/MIRAGE code is released; accuracy of the MDPI 2022 figures; Reflaunt/Treet/Archive/2nd Street/Faircado/Lalaland capture practices (nothing public found); the Vinted capture tips on third-party blogs.
