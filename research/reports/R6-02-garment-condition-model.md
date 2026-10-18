# R6-02: Garment understanding and condition grading (ML stack, training plan, risks)

Date: 7 Oct 2026. Stage: garment understanding and condition grading for a C2C second-hand apparel trust layer (global/JAPAC), 10-day build, Gemini/Gemma + ADK + Cloud Run, lead wants real training/fine-tuning.

Evidence labels: **[V]** verified this session (URL given); **[M]** from memory, not re-verified; **[J]** my engineering judgement / estimate.
Tooling note: the WebSearch budget ran out mid-session (200/200), so a few items are tagged [M] or listed under "Not verified" (section 9). All numbers tagged [V] come from pages or APIs fetched in this session.

---

## 0. Bottom line (read this first)

1. **Almost nobody has published results on the RISE/Nauman dataset.** I found exactly two papers that train or evaluate on it: (a) Tabernik and Skocaj, ERK 2025, binary "damaged garment" detection on a curated 12,238-image subset, best AP 71.7%, AUC 91.6% [V]; (b) a July 2026 Preprints/MDPI paper that uses it for a YOLO + Qwen2.5-VL-3B + ConvNeXt pipeline with n=10 end-to-end tests and no condition metrics [V]. OpenAlex lists 0 citations for the Zenodo record [V]. **There is no published baseline for the 1-5 condition grade, pilling grade, stains or holes. Our numbers will be the baseline; do not claim "beats SOTA".**
2. **The defect labels are much noisier than the headline suggests.** Tabernik et al. could visually confirm a defect on the front photo for only 258 train + 98 test garments out of ~31k, because "the original damage attributes often did not reflect what is visible in the image" (damage on the back, or too small) [V, ERK paper]. Hole positives in the front-only HF split are 1,363 of 28,248 (4.8%); stains are 71% NaN [V, HF statistics]. So: **condition (1-5) and pilling (1-5) are the learnable, dense labels; stains and holes are weak/sparse labels.**
3. **Use a 31.6k-image HF mirror, not the 26.9 GB zip, for the model.** `fnauman/fashion-second-hand-front-only-rgb` is CC-BY-4.0, 28,248 train / 3,389 test, 720x1080, background removed with BiRefNet, parquet [V]. This also hands us a ready domain-adaptation trick (background removal on phone photos, section 5).
4. **Recommended build (T = trained, G = Gemini):** frozen SigLIP 2 / fashion-SigLIP features → multi-task ordinal heads (CORN) trained on RISE (T) → split-conformal grade *sets* with abstention (T) → Gemini 3.x Flash for open-vocabulary defect localisation (boxes), brand/size/care-label OCR and the human-readable evidence record (G). Gemma 4 E4B LoRA producing a JSON defect record is a parallel stretch arm, not the critical path.
5. **No category-change deal-breaker found.** Severity-high items are about *claims we can make* (defect detection must be "flag and ask for another photo", not "verdict"), see section 8.

---

## 1. Who has used the RISE / Nauman dataset

### 1.1 The dataset (facts that matter for the plan)

| Fact | Value | Source |
|---|---|---|
| Zenodo v3 (Sep 2024) | 31,638 items (+~100 "test100" gold items), single `clothing_v3.zip` 26.8 GB, 114.2 GB total volume; v2 was 31,997 | [zenodo.org/records/12518734/latest](https://zenodo.org/records/12518734/latest) [V] |
| Images | 3 per item: front, back, brand label; mostly 1280x720 or 1920x1080; 4-5k brand images removed for privacy; grid background after Jan 2023, measuring tape before | [zenodo.org/records/12518734](https://zenodo.org/records/12518734) [V] |
| Licence | CC-BY 4.0 (commercial use allowed with attribution) | same [V] |
| Labels | condition 1-5, pilling 1-5 ("ISO standards followed where applicable"), stains/holes/smell none/minor/major, damage text + location, material (mostly NIR scanner), price (bucket), trend, usage (reuse/export/recycle/...) | same [V] |
| Annotation | professional sorters at Wargon Innovation AB and Myrorna AB; 100 gold garments multiply annotated (inter-annotator study possible) | same [V] |
| Label history | stains were Yes/No before being 3-level; holes and smell introduced after Nov 2022 | v3 page [V] |
| Annotator subjectivity | author states labels "are often specific to the annotators and the scope of the facility" | [fnauman.com/posts/2023-12-16-second-hand-fashion](https://fnauman.com/posts/2023-12-16-second-hand-fashion/) [V] |
| Author left RISE Aug 2025; project page: hosted at fnauman.com | | [fnauman.com/second-hand-fashion](https://fnauman.com/second-hand-fashion/) [V] |

**Front-only HF mirror** (use this): [huggingface.co/datasets/fnauman/fashion-second-hand-front-only-rgb](https://huggingface.co/datasets/fnauman/fashion-second-hand-front-only-rgb), CC-BY-4.0, 28.2k train / 3.39k test, 720x1080, background removed, columns include condition, pilling, stains, holes, smell, damage, brand, type (30), pattern (15), colors (list), material, price (7 buckets), trend, season, cut (210), usage (7) [V].

**Second HF mirror**: [wargoninnovation/clothingdatasetsecondhand](https://huggingface.co/datasets/wargoninnovation/clothingdatasetsecondhand), 43.1k rows (30.2k train / 12.9k test), front and back, **images resized to 224x224**, 39 columns incl. `annotator`, `damage2/3`, `damageloc`, `price_confidence`, `usage_confidence`, `brandtext`, `sizetext` [V]. 224 px is too small for defects; useful for annotator-bias analysis and back-view experiments only.

### 1.2 Label statistics (computed from the HF datasets-server statistics API, 7 Oct 2026) [V]

Train split (n = 28,248):

| Field | Distribution |
|---|---|
| condition 1/2/3/4/5 | 929 / 4,530 / 8,427 / 7,053 / 7,309 (3.3% / 16.0% / 29.8% / 25.0% / 25.9%) |
| pilling 1/2/3/4/5 | 628 / 2,077 / 4,280 / 6,914 / 14,349 (5 = no pilling = 50.8%) |
| stains | Minor 3,743; Major 2,315; No 1,421; Yes 694; NaN 20,070 (71.0%) |
| holes | Major 560; Minor 803; none 2; NaN 26,883 (95.2%) |
| smell | Minor 1,394; Major 231; NaN 94.2% |
| damage text | non-empty for 19.8% |
| price buckets | <50: 13,745; 50-100: 11,062; 100-150: 2,406; 150-250: 774; 250-400: 210; >400: 50 (currency not stated; almost certainly SEK [J]) |
| usage | Reuse 17,281; Export 8,674; Recycle 1,969; Repair 117; Remake 147 |
| category | Ladies 19,431; Men 3,856; Children 3,733; Unisex 1,225 |
| top types | Top 3,812; T-shirt 3,039; Trousers 2,883; Dress 2,548; Sweater 2,383 |

Test split (n = 3,389): condition 125 / 465 / 1,277 / 677 / 846 (class 3 = 37.7%, vs 29.8% in train: **the test split is not distributed like train**, likely station/time shift); pilling 59 / 164 / 637 / 671 / 1,859.

Trivial baselines I computed from these counts: always-predict-3 on test condition = 37.7% exact; within-1 of the 2/3/4 band in train = 70.8%; always-predict-5 pilling = 50.8% (train) / 54.8% (test).

### 1.3 Papers and repos that used it

| Work | What | Result | Link | Maturity |
|---|---|---|---|---|
| Tabernik and Skocaj, "Supervised Deep Learning for Surface Defect Detection in Recyclable Garments", ERK 2025 | Binary damaged vs not (stain/tear/hole) on 12,238 front images; train 10,943 neg + 258 pos, test 939 neg + 98 pos, positives manually verified and **segmented**; 640x640 input, 500 epochs, SGD, pos/neg balanced sampling | **SuperSimpleNet with seg supervision: AP 71.7, AUC 91.6, acc 94.3, F1 69.6**; ViT-B 61.6 AP / 87.6 AUC; Swin-B 57.8; SuperSimpleNet without seg 57.4; ConvNeXt-B 51.9; DINOv2-B+reg 42.7; SegDecNet 31-39; **DINOv2-B 24.9 AP / 70.1 AUC** | [vicos.si/publications/tabernik2025erk](https://vicos.si/publications/tabernik2025erk/), [PDF](https://erk.fe.uni-lj.si/2025/papers/tabernik%28detekcija_povrsinskih%29.pdf) (Slovenian text, English abstract) [V] | Workshop paper, no code or data link stated. SuperSimpleNet repo is MIT, 180 stars, pushed Oct 2025 ([github.com/blaz-r/SuperSimpleNet](https://github.com/blaz-r/SuperSimpleNet)) [V] |
| "Image-Only Automated Garment Sorting for Textile Reuse and Recycling Using a Multi-Model AI Framework", Preprints Jul 2026 / MDPI Applied Sciences 16(16):8058 | YOLOv8m-cls garment type + Qwen2.5-VL-3B JSON condition + ConvNeXt-T material/structure (the last two on TextileNet, not RISE) | type top-1 78.6% (11 classes); material-family 56.4% acc from RGB; **end-to-end triage "80%" on n=10**; no VLM condition metric; **QLoRA on 10 examples = outputs identical to base model** | [preprints.org/manuscript/202607.1194](https://www.preprints.org/manuscript/202607.1194), [mdpi.com/2076-3417/16/16/8058](https://www.mdpi.com/2076-3417/16/16/8058) (read via proxy, 403 direct) [V] | Weak evidence; useful mainly as a cautionary tale |
| Nauman blog posts | roadmap, zero-shot CLIP with SigLIP 2 / jina-clip-v2 / marqo-fashionSigLIP, data exploration | **no accuracy numbers published** | [fnauman.com/second-hand-fashion](https://fnauman.com/second-hand-fashion/) [V] | Blog |
| Warwick / Innovate UK "AI for circular fashion" (Depop, Selfridges partners, PAIS 2025) and arXiv 2509.24477 | Representative-subset selection for fashion retrieval (Marqo-FashionCLIP best, 62.66% top-1 on DeepFashion Attribute; 38,707 → 8,754 images with 57% → 68% top-1 in a company DB) | Retrieval, **does not use RISE** | [warwick.ac.uk case study](https://warwick.ac.uk/fac/sci/camacs/casestudies/ai-circular-fashion), [arXiv 2509.24477](https://arxiv.org/html/2509.24477v1) [V] | Not relevant to grading |
| OpenAlex record for the dataset | cited_by_count = 0 | | [api.openalex.org/works/doi:10.5281/zenodo.12518734](https://api.openalex.org/works/doi:10.5281/zenodo.12518734) [V] | |
| fnauman/second-hand-fashion GitHub | Quarto website only, MIT, 0 stars, no model code | | [github.com/fnauman/second-hand-fashion](https://github.com/fnauman/second-hand-fashion) [V] | No baselines to reuse |

**What accuracy is achievable (literature-anchored, with caveats):**
- Binary visible-damage detection: AP ~0.62 (fine-tuned ViT-B) to 0.72 (SuperSimpleNet with pixel masks), AUC 0.88-0.92, on a *verified* small subset [V]. This is the only hard anchor.
- Frozen DINOv2-B did badly in that setup (AP 24.9) [V], so do not assume a frozen self-supervised backbone detects stains. Use language-aligned (SigLIP 2) features and test, and rely on Gemini localisation for defects (section 4).
- Condition 1-5, pilling 1-5: **no published number.** My target ranges are in section 6.3 and are [J].

### 1.4 Other related datasets worth knowing

| Dataset | Content | Licence | Why it matters | Source |
|---|---|---|---|---|
| **Pettersen et al., Data in Brief 2026, 16,464 post-consumer garments, Norway** | photos (Kodak Pixpro, tripod ring light, light backgrounds, **not standardised**), 79 columns, condition 1-5 where 4-5 = reuse, brand, fibre blends, hole counts; no ML baseline; authors warn image ML needs care | CC BY 4.0; Zenodo 10.5281/zenodo.18821900 | **A second, differently-photographed condition-labelled set: ideal for a cross-dataset domain-shift test** (train RISE, test Norway) | [PMC13474385](https://pmc.ncbi.nlm.nih.gov/articles/PMC13474385/), via [Europe PMC XML](https://www.ebi.ac.uk/europepmc/webservices/rest/PMC13474385/fullTextXML) [V] |
| Sorting for Circularity "Rewear" study | 8,280 garments, 4 EU sorters: 37% no damage, 41% one minor defect; **brand and trend, not physical condition, drive resale value**; 16% brand unidentifiable; 2,660 unique brands, H&M only 3.3% | report (public); microdata availability unknown | Calibrates how much price depends on condition; brand long tail kills closed-set brand classifiers | [Project Rewear PDF, May 2026](https://circulareconomy.europa.eu/platform/sites/default/files/2026-06/FFG_x_Circle_Economy_Project_Rewear_fa69e780ee%20(1).pdf) [V] |
| OpenTextile-NIR | 71 samples, NIR hyperspectral + phone photos | open (PMC12925456) | material from NIR, not usable for phone RGB | [PMC12925456](https://www.ncbi.nlm.nih.gov/pmc/articles/PMC12925456/) [V] |

---

## 2. Other defect / condition datasets and models

| Resource | What | Licence / access | Fit for us | Source |
|---|---|---|---|---|
| **Ljubljana ViCoS clothing defects** | There is no separate public "Ljubljana clothing defect dataset": it is the Tabernik ERK 2025 curated subset *derived from RISE*; not released as far as I could tell | n/a | The recipe (verify defects by eye, segment them) is the thing to copy; we should do a mini version (150-300 images) | [V] ERK paper |
| AITEX (Aitex fabric defect DB) | 245 images, 7 fabrics, 4096x256, 105 defective; flat unworn fabric | CC0 1.0 per [Dataset Ninja AFID](https://datasetninja.com/afid) [V] | Low: production-line fabric, not worn garments | |
| TILDA | 3,200 grayscale 768x512 textile textures | original site historically restricted [M] | Low | [V] size only |
| Mendeley "Fabric Defect" (Mar 2025) | 2,468 images, 6 classes (hole 556, colour-defect 384, sewing-error 317, ...) | open on Mendeley (licence not checked) | Low-medium: garment-ish holes | [data.mendeley.com/datasets/y62b4pfyz2/1](https://data.mendeley.com/datasets/y62b4pfyz2/1) [V] |
| FabricSpotDefect | 1,014 RGB images, 3,288 spot annotations, YOLO format | CC (PMC article) | Medium for stain-like spot pretraining | [PMC11648198](https://pmc.ncbi.nlm.nih.gov/articles/PMC11648198/) [V] |
| Mendeley "Fabric Defects" (Oct 2024) / Kaggle multi-class (3,077 images, 9 classes incl. hole, stain) | production-line fabric | open | Low | [Mendeley](https://data.mendeley.com/datasets/663j22s43c/3) [V] |
| ZJU-Leaper, Tianchi fabric | industrial fabric | [M] | Low | not verified |
| Pilling grading | Lab image analysis on swatches under ISO 12945-2 / ASTM photographic standards reports **94-100% grade accuracy** (hybrid-feature DL 96.26%, image-analysis+DL 94.2%, DPCANN 99.7%) | papers | **Not transferable**: macro images of flat swatches under controlled light; our pilling labels come from sorters' eyes on whole garments | [PMC12407393](https://www.ncbi.nlm.nih.gov/pmc/articles/PMC12407393/), [IJCST 2020](https://emerald.com/insight/content/doi/10.1108/IJCST-02-2020-0024/full/html) [V snippets] |
| Fashionpedia | 27 apparel categories, 19 garment parts, 294 attributes, segmentation masks | CC BY 4.0 per HF datasets mirror [V]; CVDF page does not state licence | Garment parts (collar, sleeve, hem, cuff) for **part-aware defect location**; images are not second-hand | [github.com/cvdfoundation/fashionpedia](https://github.com/cvdfoundation/fashionpedia) |
| DeepFashion2 | 491K images, 801K items, 13 categories, landmarks, masks, 873K consumer-shop pairs | password-gated form, research use [V]; treat as non-commercial | Consumer-vs-shop pairs useful for photo-domain robustness only | [github.com/switchablenorms/DeepFashion2](https://github.com/switchablenorms/DeepFashion2) |
| Anomaly libs | anomalib (Apache-2.0, 6.2k stars), SuperSimpleNet (MIT) | see R4-03 | Reuse R4-03's finding: anomaly detectors need a per-item "normal" reference; for grading use supervised heads | R4-03 [V] |

**Takeaway:** no open dataset gives labelled *worn-garment* defects at scale except RISE (noisy) and the Norway set (condition only). Production-line fabric sets teach the wrong distribution. Spend the labelling budget on a 150-300 image verified-defect set of our own (section 6).

---

## 3. Attribute extraction for listings

| Attribute | Recommended method | Evidence | Notes |
|---|---|---|---|
| Garment type | SigLIP 2 / Marqo-FashionSigLIP linear head on RISE `type` (30 classes), Gemini as fallback | YOLOv8m-cls got 78.6% top-1 on 11 RISE types [V, MDPI preprint]; Gemini 2.0 Flash zero-shot macro-F1 56.8% over 18 DeepFashion attributes, GPT-4o mini 43.3% [V, [arXiv 2507.09950](https://arxiv.org/abs/2507.09950), CC BY] | Trained head should beat zero-shot Gemini on type; cheap win to show |
| Style / pattern / cut / trend | Same heads (pattern 15 classes, trend 10, cut 210) + Gemini for open vocabulary | RISE columns [V] | Skip trend (84.5% NaN) |
| **Brand** | Gemini structured output on label crop + logo on the garment; confidence-gated free text, then fuzzy match to a brand list | Rewear: 2,660 unique brands in 8,280 garments, top brand 3.3%, 16% unidentifiable [V] → closed-set classifier is useless, OCR/open vocab is right. LogoDet-3K (3,000 logo classes, 158k images, CC BY 4.0) [V, [arXiv 2008.05359](https://arxiv.org/abs/2008.05359)] only if you want a trained logo detector | **Eval no one has published:** RISE brand label images + `brand` text give a free ground truth for Gemini label-OCR accuracy. Pull ~300 items from the zip with HTTP range requests (`remotezip`) [J, Zenodo range support is [M]] rather than the full 26.8 GB |
| Material | Care-label OCR via Gemini (percentages) is the honest source; RGB-only material is weak (56.4% material-family accuracy [V]) | RISE material came from a **NIR scanner**, so it is not what a phone sees | Never infer fibre from the garment photo; say "label says X" |
| Size | Gemini OCR on size tag (S/M/L, EU/US/JP numerics, tag text like "M 38") | [M] | Add a normaliser for JAPAC sizing (JP numeric 7/9/11, EU, UK); no RISE ground truth beyond `sizetext` in the Wargon mirror |
| Colour | Deterministic: k-means in CIELAB on the foreground mask (BiRefNet) → nearest named colour; Gemini only for naming; RISE `colors` list is multi-label | [J] | Gives a measurable colour (also reused for match-at-handover) |
| Embeddings (search/dedupe/anchor) | Marqo-FashionSigLIP (Apache-2.0, ViT-B/16 SigLIP fine-tune, +57% MRR/recall over FashionCLIP per Marqo, 421k downloads/month) [V, [HF card](https://huggingface.co/Marqo/marqo-fashionSigLIP)]; repo [marqo-ai/marqo-FashionCLIP](https://github.com/marqo-ai/marqo-FashionCLIP) Apache-2.0, 146 stars, **last push Sep 2024** [V] (stale; model usable). Marqo advertises a "Fashion SigLIP 2" (+78%) but I did not verify | LookBench: many models below 60% Recall@1 on live e-commerce retrieval; CC BY 4.0 benchmark [V, [arXiv 2601.14706](https://arxiv.org/abs/2601.14706)] | Use as one of the frozen backbones to compare |

---

## 4. Fine-tuning and training options (3 days)

### 4.1 Backbones (frozen features first)

| Model | Licence | Size | Verdict |
|---|---|---|---|
| **SigLIP 2** (B/16, L/16, So400m; Feb 2025; captioning + self-distillation + masked prediction → better dense/localisation) | Apache-2.0 [V, [HF so400m-384](https://huggingface.co/google/siglip2-so400m-patch14-384); [arXiv 2502.14786](https://arxiv.org/abs/2502.14786)] | 86M / 303M / 400M / 1B | **Default.** Same family as the Gemma/Gemini stack. Try B/16@384 first, So400m if time |
| Marqo-FashionSigLIP | Apache-2.0 | ViT-B/16 | Fashion prior; compare against SigLIP 2-B |
| DINOv2 | Apache-2.0 [M] | S/B/L/g | Baseline only: it scored worst in the Tabernik study (AP 24.9) [V] |
| DINOv3 (Aug 2025) | custom "DINOv3 License", gated HF [V, [HF card](https://huggingface.co/facebook/dinov3-vitl16-pretrain-lvd1689m)] | ViT-S/B/L/H+, ConvNeXt | Dense features are excellent for localisation, but gating and licence make it a "maybe"; optional |
| Gemma 4 (released 2 Apr 2026) E2B/E4B/12B/26B-A4B/31B, multimodal, Apache-2.0; E4B = 4.5B effective params, ~150M vision encoder, configurable image token budgets 70-1120, MMMU-Pro 52.6 | Apache-2.0 [V, [HF E4B](https://huggingface.co/google/gemma-4-E4B)] | | The VLM to LoRA-tune (below) |
| Unsloth Gemma 4 training | Apache-2.0, 77k stars, pushed 7 Oct 2026; Gemma 4 E2B trains in 8 GB VRAM, E4B in ~10 GB (vendor claim) | [V, [unsloth.ai/docs/models/gemma-4/train](https://unsloth.ai/docs/models/gemma-4/train), [github.com/unslothai/unsloth](https://github.com/unslothai/unsloth)] | Fits a free Colab / Kaggle / small Vertex GPU |

### 4.2 Heads on frozen features (the core, ~1 day)

- Extract SigLIP 2 patch-pooled + CLS features for all 31.6k images once (with hflip TTA). Rough cost [J]: B/16@384 on an L4/T4 ≈ 20-50 min for the whole set; So400m ≈ 3-4x that.
- **Ordinal heads for condition, pilling (1-5), price bucket (7)**: CORN loss, rank-consistent, ~15 lines, `coral-pytorch` (MIT, 280 stars, pushed Sep 2025) [V, [github.com/Raschka-research-group/coral-pytorch](https://github.com/Raschka-research-group/coral-pytorch); paper [arXiv 2111.08851](https://arxiv.org/pdf/2111.08851)]. CORN removes CORAL's weight-sharing restriction and was shown to perform better [V snippet]. Alternative CONDOR [arXiv 2110.07470].
- **Masked multi-task losses**: stains (none / minor / major ordinal), holes (binary), smell, type (30-way CE), pattern (15-way), with **loss masks where the label is NaN** (NaN != "none" for stains/holes, since 71% / 95% are NaN and stains were introduced as Yes/No) [J]. Weight positives for holes (4.8% prevalence).
- **Annotator-aware cutpoints** (if the `annotator` id is available in the Zenodo JSON or the Wargon HF mirror [V column exists]): learn per-annotator ordinal thresholds (an offset on the CORN logits) during training, drop it at inference → partial de-noising of subjective grades [J; ties to the label-subjectivity statement in Nauman's post [V]].
- Optional **LP-FT** step: after the linear probe converges, unfreeze the last 2-4 blocks with a small LR for 2-3 epochs. LP-FT reported +1% ID / +10% OOD vs plain fine-tuning across 10 shifts [V, [arXiv 2202.10054](https://arxiv.org/abs/2202.10054), ICLR 2022]; **WiSE-FT** (interpolate zero-shot and fine-tuned weights) gives +4-6 pts on shifted sets at zero cost [V, [arXiv 2109.01903](https://arxiv.org/abs/2109.01903)]. Both address exactly the sorting-line → phone gap.
- Multi-view: concatenate front + back features (back images exist only in the zip / Wargon mirror at 224 px). Tabernik found many labelled damages were on the other side [V], so a back view should lift stain/hole recall. Treat as an ablation.

### 4.3 VLM tuning options (the "genuine fine-tuning" showcase)

| Option | What | Evidence / constraints | Verdict |
|---|---|---|---|
| **Gemma 4 E4B + LoRA (Unsloth)** emitting a structured defect record `{condition, pilling, stains, holes, damage_text, damage_location}` | Build 6-10k (image → JSON) pairs directly from RISE labels (`damage`, `damageloc` text exist for ~20%) | Only one comparable experiment exists: Qwen2.5-VL-3B QLoRA on **10** examples produced outputs "practically identical" to base [V]. With thousands of examples this should change, but nobody has shown the win | **Stretch arm.** Include a numeric ablation versus untuned Gemma 4 and versus the frozen-feature heads so the lead can see the difference |
| **Vertex AI supervised tuning of Gemini 2.5 Flash** on images | Image tuning is supported; limits: 300K multimodal examples, 1 GB JSONL, 131k tokens/example; jobs take 30 min to a few hours; Google's own demo used 200 images to tune a defect inspector that outputs "Defect - Discoloration detected..." [V, [discuss.google.dev](https://discuss.google.dev/t/image-tuning-gemini-as-genai-quality-control-inspector/283269)] | Whether Gemini 3.x Flash is tunable, price per token, and ADK wiring to a tuned endpoint were not verifiable this session | **Strong "uses Gemini + real tuning" story** if it works in a day; run 2-5k examples as a side job. Confirm model availability first |
| Prompting-only Gemini | rubric prompt, few-shot, `response_schema` | the untuned baseline | Required as baseline |

### 4.4 Calibration and abstention

1. **Temperature scaling** per head on a held-out validation split (RISE val), report ECE.
2. **Split conformal for ordinal grades**: use the RPS non-conformity score to get *contiguous* prediction sets, e.g. condition ∈ {3,4} [V, [arXiv 2606.24959](https://arxiv.org/abs/2606.24959), Jun 2026]; or the NeurIPS 2023 framework with unimodal modelling (≈ +4% Accuracy@K, −8% set size) [V, [Dey et al.](https://proceedings.neurips.cc/paper_files/paper/2023/hash/029f699912bf3db747fe110948cc6169-Abstract.html)]. Implementation is ~30 lines of numpy; **TorchCP is LGPL-3.0** (479 stars, pushed Aug 2026) [V, [github](https://github.com/ml-stat-Sustech/TorchCP)], so prefer hand-rolled split conformal for a prototype.
3. **Abstain when**: set width ≥ 3 grades, OR embedding OOD score high (Mahalanobis in SigLIP space vs RISE), OR Gemini and trained head disagree by ≥ 2 grades → ADK agent asks for a specific extra photo (back, close-up of the flagged region, label).
4. Caveat from R4-03 stands: with ~40 phone garments you cannot certify coverage; say so, and report empirical coverage on the phone set honestly.

---

## 5. Domain adaptation: sorting-line → phone photos

What differs: sorting-line photos are garments **spread flat, frontal, on a grid mat, fixed lighting**, resized to 720x1080; phone photos have arbitrary background, light, perspective, hands, hangers. Good news: **if the garment is laid flat the geometry is already close.** The gap is background + colour/lighting + sharpness.

| Technique | Cost | Evidence | Use |
|---|---|---|---|
| **Match preprocessing: BiRefNet background removal on phone photos** (the HF training images were produced this way) | 0.5 h | BiRefNet MIT, 4.3k stars, pushed Sep 2026 [V, [github](https://github.com/ZhengPeng7/BiRefNet)]; the Tabernik team notes removal was "not always perfect, tape sometimes visible" [V] | **Do first.** Removes the biggest shift for free |
| Train-time augmentation that mimics phones: colour/white-balance jitter, exposure gradients, JPEG + blur + noise, random perspective/rotation, scale crop, random solid/wood/bed backgrounds pasted under the matte | 0.5 day | standard | Do |
| **LP-FT / WiSE-FT** (preserve pretrained features) | 0.5 day | [arXiv 2202.10054](https://arxiv.org/abs/2202.10054), [2109.01903](https://arxiv.org/abs/2109.01903) [V] | Do if fine-tuning at all |
| **Cross-dataset test**: train RISE, test the Norway set (different camera, ring light, light background, 16.4k garments, condition 1-5) | 0.5 day | [V, PMC13474385] | **Best honest measurement of domain gap you can do before shooting your own garments** |
| Few-shot with ~40 own garments: **do not train on them.** Use them as (a) a target-domain calibration set for temperature + per-grade prior offset (a 5-number logit bias), (b) a conformal calibration check, (c) a "domain-gap report" (QWK on RISE test vs Norway vs own-40). | 0.5 day | [J] | 40 × 3 photos is too few for training, enough for bias and honesty |
| Test-time prompt/entropy tuning (TPT: +3.6% avg on natural shifts for CLIP [V, [arXiv 2209.07511](https://arxiv.org/abs/2209.07511)]; CLIPArTT [arXiv 2405.00754]) | 0.5 day | works on CLIP-style zero-shot heads, not on our trained ordinal heads | Skip unless time; it is a "wow" slide at best |
| Domain-adversarial training (DANN) / unlabeled target images | 1 day | [M] | Skip; no unlabeled phone corpus yet |
| Capture protocol (lay flat, plain surface, daylight, full garment in frame, back photo, label close-up) | 0 | Gemini-driven photo checklist in the ADK flow | **Part of the product**, it shrinks the gap by construction |

Also note: annotation was done by sorters who handle, smell and turn garments over; a front-only photo cannot recover that information. That is a label-side gap that no image adaptation fixes (section 8).

---

## 6. TRAINING PLAN (3 days of ML inside the 10-day sprint)

### 6.1 Data

- **Primary**: HF `fnauman/fashion-second-hand-front-only-rgb` train 28,248 / test 3,389 [V]. Hold out a 10% validation slice from train, split **by garment** (no duplicates; confirm dedupe since v2→v3 removed duplicates [V]). Use the official test only for final numbers (note its distribution shift, section 1.2).
- **Subset for fast iteration**: 8k train / 1.5k val. Full set for the final heads (embedding extraction is a one-off cost).
- **Secondary**: Norway dataset for cross-domain test; Wargon HF mirror (43.1k, 224 px) for annotator-bias analysis; ~300 items pulled from the zip (back + brand label) for OCR evaluation.
- **Own data**: 40 garments × (front, back, label, 2 defect close-ups) photographed on phone in two sessions (home lighting, a "careless" take). Label each by 2 raters with the RISE rubric (grade 1-5, pilling 1-5, stains/holes none/minor/major); compute inter-rater QWK (this is your human ceiling).
- **Verified-defect mini-set** (the Tabernik recipe): 150-300 RISE front images where a labelled stain/hole is visible, with box or mask; 2-3 hours using Gemini boxes as pre-labels then human correction. Use as test (not train) for defect heads and for the Gemini-localiser evaluation.

### 6.2 Models and heads

| Component | Spec |
|---|---|
| Backbone | SigLIP 2 B/16 @384 (frozen) → compare Marqo-FashionSigLIP, SigLIP 2 So400m, DINOv2-L; choose on val QWK |
| Heads | MLP (1 hidden, 512) per task; **CORN** for condition, pilling, price bucket; masked 3-way ordinal for stains; masked binary for holes; CE for type; class-balanced sampler; label smoothing 0.05 |
| Optional | LP-FT of last 2-4 blocks (LR 1e-5, 2-3 epochs); WiSE-FT interpolation α chosen on Norway/own-40 |
| Calibration | temperature scaling, then split-conformal RPS sets (α = 0.1) on val; OOD Mahalanobis threshold at 95th percentile of val |
| Defect localiser | Gemini 3.x Flash with the documented box output (`[ymin,xmin,ymax,xmax]`, normalised 0-1000) or polygon masks [V, [ai.google.dev image understanding](https://ai.google.dev/gemini-api/docs/image-understanding)], crop → SigLIP 2 crop-classifier (stain / hole / pilling / fading / none) trained on the verified-defect set + RISE damage text weak labels |
| VLM arm (stretch) | Gemma 4 E4B + LoRA r=16 via Unsloth, 6-10k (front image → JSON) pairs built from RISE labels, 1 epoch; and/or Vertex SFT of Gemini 2.5 Flash on 2-5k examples |
| Serving | embedding model + heads on Cloud Run (CPU is adequate for B/16 at ~0.3-1 s/image [J]; Cloud Run GPU L4 optional [M]) as an ADK tool `grade_garment(images)`; Gemini calls for OCR/boxes/explanation |

### 6.3 Metrics, baselines and expected numbers

Targets are [J] unless anchored; every one must be measured, not asserted.

| Task | Metrics | Trivial baseline (computed) | Untuned Gemini baseline (to measure on 300 test items) | Target for frozen SigLIP 2 + CORN | Literature anchor |
|---|---|---|---|---|---|
| Condition 1-5 | QWK, MAE, exact, within-±1, macro-F1, ECE | exact 37.7% (always 3), within-1 ~70% | rubric-prompted; expect QWK ~0.3-0.5, exact ~30-38% [J] | **QWK 0.55-0.65, exact 42-50%, within-1 ≥ 88%, MAE ~0.7** | none published; grading is subjective, label noise is annotator-specific [V] |
| Pilling 1-5 | same | always-5: 54.8% exact | likely near majority class [J] | QWK 0.35-0.5, within-1 ≥ 85% | lab swatch methods 94-100% [V] are not comparable |
| Stains (≥ minor) | AP, AUC, recall at 90% precision | AP = prevalence | Gemini box + judge; measure on verified-defect set | AUC 0.80-0.90; AP 0.45-0.65 on verified set | defect (any) AP 0.62-0.72, AUC 0.88-0.92 on verified subset [V] |
| Holes | AP, AUC | AP = ~5% | same | AP 0.30-0.50 (hard: small, ~1.4k positives) | same anchor |
| Type (30-way) | top-1, macro-F1 | | zero-shot Gemini | top-1 ≥ 75% | YOLOv8m-cls 78.6% on 11 classes [V] |
| Price bucket (7) | QWK, within-1 | always <50: 48.7% | | within-1 ≥ 90% | see section 7 |
| Selective prediction | risk-coverage curve, AURC; at 80% coverage grade MAE | | | MAE falls ≥ 25% vs no abstention | [J] |
| Conformal | marginal coverage (target 90%), mean set size | | | coverage 88-92% on val; **expect a drop on own-40 and Norway; report it** | |
| Domain gap | ΔQWK RISE test → Norway → own-40 | | | Δ ≤ 0.15 after BiRefNet + augmentation (aspiration) | |
| Brand OCR (label crop) | exact / fuzzy match vs RISE `brand` | | Gemini zero-shot | report; no published number | Rewear: 16% unidentifiable by humans [V] |

Ablations that make the report convincing: (i) frozen vs LP-FT vs WiSE-FT; (ii) with vs without BiRefNet at inference; (iii) front vs front+back; (iv) heads vs Gemma-4-LoRA vs Gemini-tuned vs prompted Gemini; (v) with vs without annotator-aware cutpoints; (vi) with vs without abstention.

### 6.4 Schedule inside the 10 days

- D1: pull HF data, pipeline, embed all images with 2-3 backbones, trivial + untuned-Gemini baselines on 300 test items. Photograph own-40 (in parallel by a teammate).
- D2: multi-task CORN heads, backbone choice, calibration, conformal, OOD score. Build verified-defect mini-set.
- D3: domain tests (Norway, own-40), LP-FT/WiSE-FT, Gemini box → crop-classifier, packaging as ADK tool + Cloud Run. Stretch arm (Gemma 4 / Vertex tuning) runs unattended in the background during D2-D3.
- Gate: if D1 untuned Gemini ≥ heads on condition QWK, switch the story to "Gemini grades, trained model calibrates/abstains" (still honest ML depth).

---

## 7. Pricing a used garment from condition, brand and type

What exists:
- **RISE gives price as 7 coarse buckets** (<50 ... >400, probably SEK [J]), 87.9% of items fall in <50 or 50-100 [V]. Treat as an ordinal bucket prediction; do not claim a currency price.
- **Han et al. (Alibaba Xianyu), "Vision-based Price Suggestion for Online Second-hand Items"**: classifier decides whether images are usable for pricing, then a regressor prices; joint objective + warm-up; ACM MM 2019, arXiv 2012.06009, ICPR 2021 [V, [arXiv](https://arxiv.org/abs/2012.06009)]. Closest academic precedent; their "is this photo usable?" gate is the same idea as our abstention.
- **ThredUp**: computer-vision/ML pricing from estimated retail price, fair market value, age, quality, style, local inventory and seasonality; 60-90% fee on proceeds; operations still human-inspected [secondary sources, not ThredUp primary; V as search summary only]. ThredUp launched "Direct Listing" for P2P in Jun 2026 ([chartmill, 403 on fetch] not verified in detail).
- **Fleek**: "Fleek Sort", a custom vision-language model "trained on millions of secondhand transactions", identifies, categorises, grades garments from photos/video, then does AI pricing/matching; used by graders in Pakistan, India, Dubai; $25M Series B (Jul 2026, Burda Principal Investments lead, eBay among investors); no accuracy numbers published [V, [TNW](https://thenextweb.com/news/fleek-25m-series-b-secondhand-fashion-ai), [tech.eu](https://tech.eu/2026/07/08/fleek-secures-25m-to-digitise-secondhand-fashion/)].
- **Project Rewear**: value is driven by **brand and fashion trend**, not physical condition; "no significant correlation" between material composition and grade; value distribution per kg (vintage ~€13, cream ~€5, export ~€0.60, recycling ~€0.15) [V].
- Mercari Price Suggestion Kaggle, eBay/Poshmark price guidance [M, not verified].

Implication: a condition grade alone will not predict price. Features should be **brand tier (from OCR) × type × condition set × season**. For the prototype: a gradient-boosted or small ordinal model over [type, brand-tier, condition expectation, pilling, stains] trained on RISE price buckets; show "condition-adjusted price band" and the marginal effect of a condition grade (a clean, defensible chart). Expect within-1 bucket accuracy high mostly because 88% of items sit in two buckets; report QWK and the lift over predicting from type+brand alone, and be honest if condition adds little (Rewear suggests it might).

---

## 8. Startups doing AI garment grading and what they publish

| Company | What | Published evidence | Source |
|---|---|---|---|
| **Fleek** (UK/US/Pakistan) | Fleek Sort, custom VLM grading + AI pricing; marketplace with 2,000+ graders/suppliers, 50k+ retailers | funding and scale claims only; **no accuracy, no paper** | [TNW](https://thenextweb.com/news/fleek-25m-series-b-secondhand-fashion-ai) [V] |
| **ThredUp** | in-house processing: photograph, grade, price; Resale-as-a-Service for Gap/Walmart | no papers; humans still inspect for stains/tears | search summary [V, weak] |
| **Trove** (Oakland) | brand-run resale (Patagonia, Levi's, Lululemon, REI, Carhartt); CV + ML to route, identify, price, list; "100M unique IDs"; dynamic pricing | marketing only | [trove.com/how-it-works](https://trove.com/how-it-works/) [V snippet] |
| **Reflaunt** | not verified (no result found) | | |
| **reverse.fashion** (Berlin, founded 2024; TU Berlin research; H&M pre-seed) | reverse.engine / line.sort (360° ultra-high-res, 2 m/s) / co.sort; classifies condition, style, type, gender, brand, size, season, colour, fabric construction; Rewear pilot: +40% productivity, ~20% revenue gain, vintage fraction +1.5 pts; precision/recall tunable for defects | numbers from pilot report, **no model metrics** | [Rewear PDF](https://circulareconomy.europa.eu/platform/sites/default/files/2026-06/FFG_x_Circle_Economy_Project_Rewear_fa69e780ee%20(1).pdf) [V] |
| **Refiberd** | NIR/hyperspectral + AI fibre ID; testing rip/tear/pilling detection for resale; Goodwill of the Finger Lakes pilot | no numbers | [Waste Dive](https://www.wastedive.com/news/us-textile-recycling-sorting-ai-epr-wm-refiberd-goodwill/815422/) [V] |
| **Matoha FabriTell** | desktop scanner: product type, age group, colour, composition (Sorting for Circularity India) | no numbers | Fashion for Good search result [V snippet] |
| **Sorting for Circularity** (Fashion for Good + Circle Economy) | framework, regional studies, Rewear report; says re-wearability assessment "is largely manual" | descriptive stats, not model accuracy | [fashionforgood.com](https://www.fashionforgood.com/our_news/sorting-for-circularity-europe-expands-to-address-rewearable-textile-crisis/) [V] |
| **Eton Systems aUPS** (Sweden) | automated garment sorting module: colour/size/style/brand, damage detection, price suggestion | none | [textiletechnology.net](https://www.textiletechnology.net/news/ai-driven-sorting-system-for-automated-garment-resale-199025) [V] |
| **ACS Clothing + Heriot-Watt (Innovate UK KTP)** | feasibility study of CV, hyperspectral, VLM for stains/tears; lighting consistency was the key requirement | no numbers | [iuk-ktp.org.uk](https://iuk-ktp.org.uk/case-study/ai-powered-garment-inspection-for-circular-fashion/) [V] |

Pattern: **nobody publishes grading accuracy.** The one hard operational finding repeated across sources is that consistent lighting and capture conditions are the prerequisite (ACS/Heriot-Watt) and that precision-vs-recall on "damaged" should be tunable (reverse.fashion). Both support the capture-checklist and abstention design.

---

## 9. INNOVATION IDEAS (ranked by wow × feasible-in-10-days; scale 1-5 each)

| # | Idea | Wow | Feas | Score | Papers / libraries |
|---|---|---|---|---|---|
| 1 | **Abstaining conformal grader: output a contiguous grade set (e.g. "3-4") with a coverage guarantee, and let the ADK agent respond to a wide set by asking for a specific extra photo** (back view, close-up of the flagged region, label). Shows measured risk-coverage curve and empirical coverage drop on phone photos | 4 | 5 | **20** | Dey et al. NeurIPS 2023 [V]; RPS conformal [arXiv 2606.24959](https://arxiv.org/abs/2606.24959) [V]; CORN ([coral-pytorch](https://github.com/Raschka-research-group/coral-pytorch), MIT); hand-rolled split conformal (avoid LGPL TorchCP) |
| 2 | **Two-model defect evidence: Gemini proposes boxes/polygons, a trained SigLIP 2 crop classifier confirms; only agreement is shown as a "defect"; disagreement becomes "check this region"** and the box overlay becomes the dispute-evidence artefact | 5 | 4 | **20** | Gemini 2D box/segmentation output [V, [docs](https://ai.google.dev/gemini-api/docs/image-understanding)]; SuperSimpleNet as an optional supervised-with-masks detector (MIT) trained on the 356 verified-defect images from the Tabernik recipe [V]; Fashionpedia parts for "defect location: cuff/collar/hem" |
| 3 | **Claim-vs-evidence score**: seller declares condition and defects; model returns P(true grade ≥ declared) and a mismatch flag, producing the structured evidence record for disputes (feeds R4-04 schema) | 4 | 5 | **20** | CORN probabilities + conformal; Gemini only for explanation |
| 4 | **Annotator-aware ordinal heads**: learn per-sorter cutpoints from the `annotator` column, infer with consensus cutpoints; report QWK gain and a plot of annotator bias | 4 | 3 | **12** | CORN/CONDOR [arXiv 2111.08851, 2110.07470] [V]; Wargon HF mirror has `annotator` [V]; subjectivity statement [V] |
| 5 | **Domain-gap scorecard in the demo**: same garments scored on sorting-line-style vs phone photos, BiRefNet on/off, with OOD score; drives the "please lay flat on a plain surface" prompt | 3 | 5 | **15** | BiRefNet (MIT), LP-FT [arXiv 2202.10054], WiSE-FT [arXiv 2109.01903]; Norway set [V] |
| 6 | **Condition-adjusted price band with marginal effect of grade** (brand tier × type × condition set), honest about condition's weak influence | 3 | 4 | **12** | RISE price buckets [V]; Han et al. [arXiv 2012.06009]; Rewear finding [V] |
| 7 | **Tuned small VLM vs prompted Gemini bake-off** (Gemma 4 E4B LoRA vs Vertex-tuned Gemini 2.5 Flash vs untuned) on the same 300-item test set, published as a table | 4 | 3 | **12** | Unsloth Gemma 4 [V]; Vertex SFT image tuning [V] |
| 8 | **Multi-view completeness**: attention-pool front+back+label, with a "photo coverage" meter showing which side has unobserved damage risk (RISE evidence: labelled damage often on the unseen side) | 3 | 4 | **12** | Tabernik et al. observation [V] |

Cut list: TPT/CLIPArTT test-time adaptation (low payoff for ordinal heads), DANN (needs unlabeled corpus), fabric-swatch pilling networks (domain mismatch).

---

## 10. DEAL-BREAKERS (severity; would it force a category change?)

| # | Risk | Severity | Forces category change? | Mitigation |
|---|---|---|---|---|
| D1 | **Defect labels in RISE are largely not visible in a front photo** (only 356 verified-visible positives in ~31k; stains 71% NaN; holes 95% NaN). Learning stain/hole detection from the raw labels will yield a weak, noisy detector | **High** for any "we detect stains/holes" claim | No (apparel remains viable) | Reframe: defects = Gemini-localised + classifier-confirmed + "needs closer photo" abstention; build 150-300 own verified set; never output a binary defect verdict from one photo |
| D2 | **Condition 1-5 is partly unobservable and annotator-specific** (sorters handle, smell, flip; labels facility-specific [V]). Exact-grade accuracy ceiling is probably ~50% [J] | **Medium-High** | No | Present grades as bands (conformal sets), report QWK/within-1, never a single hard number; use claim-vs-evidence framing |
| D3 | **Domain gap sorting-line → home phone** unknown until measured; Norway set (non-standard photos) is the early probe | **Medium** (could drop to High if ΔQWK > 0.25) | No; capture protocol (flat-lay, plain surface) is the product-level fix | Measure by D3; BiRefNet + augmentation + LP-FT; ship the photo checklist |
| D4 | **Condition is a weak driver of resale price** (brand and trend dominate [V]); a grader that only grades will not move price much | **Medium** | No (the trust-layer value is verification, not valuation) | Lead with claim verification and disputes; price band as secondary |
| D5 | **Geography/brand mismatch**: RISE is Swedish (H&M, Lindex-type brands), 69% women's, 13% children's; JAPAC brands/sizes (Uniqlo, GU, Muji, local sizing) are absent; price buckets are SEK-like | **Medium** | No | Brand and size via Gemini OCR (open vocabulary); brand-tier prior is the part to localise; don't train a closed brand classifier |
| D6 | **No published baseline to benchmark against** → risk of over-claiming | **Low-Medium** | No | Report our own baselines incl. untuned Gemini, trivial, and human-ceiling (own-40 inter-rater QWK, RISE test100 gold set); no SOTA language |
| D7 | **Data logistics**: full zip is 26.8 GB single file; Zenodo files are monolithic | **Low** | No | Use the 31.6k HF parquet mirror; `remotezip` for ~300 items needing back/label images [J] |
| D8 | **Small-VLM LoRA may show no gain** (the only comparable experiment saw none at n=10 [V]) | **Low** (it is a stretch arm) | No | Keep as ablation; the shipped path does not depend on it |
| D9 | **Licences**: SigLIP 2, Gemma 4, Marqo, BiRefNet, SuperSimpleNet, coral-pytorch permissive; DINOv3 custom gated; DeepFashion2 restricted; TorchCP LGPL | **Low** | No | Avoid DINOv3 and DeepFashion2 in the shipped path |
| D10 | **Gemini tuning availability/cost/ADK wiring unverified** | **Low-Medium** | No | Check Vertex model list on D1; fall back to Gemma 4 LoRA |

No finding forces a change away from pre-loved apparel. The one structural caveat is D1+D2: the product must be framed as *evidence and abstention*, not *automated verdict*.

---

## 11. Not verified (check before relying)

- Whether Gemini 3.x Flash supports supervised tuning, price/token, and how a tuned endpoint plugs into ADK.
- Reflaunt's technology; Vinted/Depop price-suggestion internals; Mercari Kaggle scores; ZJU-Leaper/TILDA licences.
- Zenodo HTTP range support (needed for `remotezip`), Norway dataset image counts per garment and file size.
- Marqo "Fashion SigLIP 2" claim (+78%).
- Cloud Run GPU (L4) availability and cost.
- Whether the RISE `annotator` field is in the Zenodo JSONs (it is in the Wargon HF mirror).
- Any RISE-based paper outside OpenAlex/arXiv/Europe PMC indexing (e.g. very recent workshop papers); my "only two papers" statement is for what I could index, not a proof.

## 12. Source list (primary)

- Dataset: https://zenodo.org/records/12518734 ; v1 https://zenodo.org/records/8386668 ; HF front-only https://huggingface.co/datasets/fnauman/fashion-second-hand-front-only-rgb ; HF Wargon https://huggingface.co/datasets/wargoninnovation/clothingdatasetsecondhand ; project page https://fnauman.com/second-hand-fashion/
- Tabernik and Skocaj ERK 2025: https://vicos.si/publications/tabernik2025erk/ ; https://erk.fe.uni-lj.si/2025/papers/tabernik%28detekcija_povrsinskih%29.pdf
- Image-only sorting framework (2026): https://www.preprints.org/manuscript/202607.1194 ; https://www.mdpi.com/2076-3417/16/16/8058
- Norway dataset: https://pmc.ncbi.nlm.nih.gov/articles/PMC13474385/
- Project Rewear: https://circulareconomy.europa.eu/platform/sites/default/files/2026-06/FFG_x_Circle_Economy_Project_Rewear_fa69e780ee%20(1).pdf
- Fleek: https://thenextweb.com/news/fleek-25m-series-b-secondhand-fashion-ai ; https://tech.eu/2026/07/08/fleek-secures-25m-to-digitise-secondhand-fashion/
- Models/libs: SigLIP 2 https://arxiv.org/abs/2502.14786 ; Gemma 4 https://huggingface.co/google/gemma-4-E4B ; Unsloth https://unsloth.ai/docs/models/gemma-4/train ; Marqo https://huggingface.co/Marqo/marqo-fashionSigLIP ; BiRefNet https://github.com/ZhengPeng7/BiRefNet ; SuperSimpleNet https://github.com/blaz-r/SuperSimpleNet ; CORN https://arxiv.org/pdf/2111.08851 ; coral-pytorch https://github.com/Raschka-research-group/coral-pytorch ; LP-FT https://arxiv.org/abs/2202.10054 ; WiSE-FT https://arxiv.org/abs/2109.01903 ; TPT https://arxiv.org/abs/2209.07511 ; conformal ordinal https://proceedings.neurips.cc/paper_files/paper/2023/hash/029f699912bf3db747fe110948cc6169-Abstract.html and https://arxiv.org/abs/2606.24959 ; Gemini image understanding https://ai.google.dev/gemini-api/docs/image-understanding ; Gemini tuning demo https://discuss.google.dev/t/image-tuning-gemini-as-genai-quality-control-inspector/283269
- Pricing: https://arxiv.org/abs/2012.06009
