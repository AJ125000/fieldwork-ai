# R6-03: From condition record to listing and the buyer's decision (garments, JAPAC) - 7 Oct 2026

Scope: fit/size, language-neutral garment record, grounded listing + buyer Q&A, search/discovery, competitor map. Builds on R4-04 section 3 (record schema v1) and R4-00 (architecture). Evidence tags: **[P]** = I read the page; **[S]** = search snippet only (treat as unverified); **[K]** = my own knowledge, not re-verified this session. "Licence/maturity" given for repos. Non-commercial licences are acceptable per brief.

---

## 0. Bottom line

1. **Fit is not a deal-breaker for second-hand trust, and it cannot be "solved" - but it is solvable enough for a prototype if we change the question from "which size fits you" (prediction) to "here are the measured numbers, compared with a garment you already own, with error bars" (measurement + honesty).** Even Zalando's large, mature fit stack prevented only 8% of size-related returns overall in 2025 [P] and about 10% with body-measurement advice [P], so nobody has solved prediction. Second-hand is the case where measurement beats labels: labels on used garments are unreliable (brand, market and era drift, shrinkage) [K].
2. **The biggest strategic finding is not technical: AI listing generation is already shipped by every large player** (Carousell with Gemini, Mercari, Depop, eBay, ThredUp). We must not pitch "AI writes your listing". The white space is the **coded, evidence-linked, language-neutral condition record** that listing, Q&A, search and translation all read from, with an explicit "not shown" state.
3. No high-severity deal-breaker that forces a category change. One high-severity **positioning** risk (listing generation is commoditised), several medium technical ones. See section 7.

---

## 1. Fit and size

### 1.1 How big is the problem for second-hand
- ThredUp 2026 Resale Report (survey of 3,268 US adults, Jan-Feb 2026): **31.3% are deterred from buying second-hand clothing online by sizing gaps**, 34.4% by hygiene/cleanliness, 23% by quality/durability [S via echogroup summary: https://www.echogroup.ai/articles/81b9f682-a59a-4475-83a6-7c4664322388 ; report: https://secure.businesswire.com/news/home/20260402799816/en/ThredUps-14th-Annual-Resale-Report-Reveals-New-Era-of-Structural-Competition-and-AI-Driven-Discovery]. Note hygiene is bigger than fit: "smell/clean" is the other buyer anxiety and is not visual (see ODR code).
- General online apparel: a June 2026 Overnight Glasses survey of 1,882 shoppers puts apparel returns near 60% with sizing/fit the primary reason [P: https://retail-insider.com/retail-insider/2026/07/online-clothing-leads-e-commerce-returns-with-sizing-driving-most-send-backs-overnight-glasses/] - a weak commercial source (eyewear brand), so use it only as colour. Treat "#1 reason" as plausible, not proven for second-hand specifically.
- In C2C second-hand, returns are usually restricted or impossible (Japanese Mercari sellers use "NC/NR", no claim/no return [S: search results on Mercari listings]), so **a wrong fit costs the buyer the whole purchase** and the dispute load falls on the platform. This raises the value of honest fit information beyond what retail return-rate numbers suggest.

### 1.2 Size-tag variation (why labels fail, especially cross-border)
- Asian sizes run smaller: a JP/CN "L" T-shirt is roughly a US "M"; Korean men's numeric sizes 90/95/100/105 map roughly to S/M/L/XL; Japanese women's sizes use odd numbers (5, 7, 9 ...) tied to EU 32, 34, 36 ... [S: https://jingsourcing.com/b-american-asian-size-chart/ ; https://dodropshipping.com/how-to-convert-asian-sizes/]. Public conversion charts disagree with each other (the one above lists JP 9 as EU 36 and US 6, while the usual UK/US offset implies US 4) [S], which itself proves the point: **do not convert labels; store the label verbatim plus the market it was sold in, and rely on measurements.**
- Vinted's US launch (22 Jan 2026) needed US-size localisation, not just translation [S: https://fripio.app/blog/vinted-etats-unis-expansion-2026].
- Beni (resale search aggregator) says the hard part is normalising sizes across 40+ marketplaces ("there may be 100,000 different sizes" per search) [P: https://developers.googleblog.com/en/how-recommerce-startup-beni-uses-ai-to-help-you-shop-secondhand/].
- Used-garment specific: shrinkage, stretch and vintage (vanity-sized) cuts make the tag a weak guide [K]. This is the strongest argument for measuring.

### 1.3 Fit prediction literature (what exists, what we can borrow)
All are **purchase/return-history models**; none work for a one-off unique used garment with no history. We borrow ideas, not code.
| Work | Idea | Use for us |
|---|---|---|
| Sheikh et al. (Zalando), "A Deep Learning System for Predicting Size and Fit in Fashion E-Commerce", RecSys 2019, https://arxiv.org/abs/1907.09844 [S] | content + collaborative deep model per customer/article | Not usable (needs history). Cite as state of art. |
| Sembium et al. (Amazon), "Recommending Product Sizes to Customers", RecSys 2017, https://cdn.amazon.science/e0/1f/f6eff24d42858edc71ab97d8d7e8/recommending-product-sizes-to-customers.pdf [S] | latent "true size" for customer and product learned from returns; outputs small/fit/large | Conceptual frame: "true size" of an article vs label. |
| Misra, Wan, McAuley, "Decomposing fit semantics...", RecSys 2018 [S]; datasets ModCloth (82,790 transactions) and RentTheRunway (192,544) with small/fit/large feedback, https://cseweb.ucsd.edu/~jmcauley/datasets.html#clothing_fit | metric-learning on fit feedback | Public data to sanity-check a fit classifier; research-use only licence [K]. ModCloth is a vintage-style retailer, closest to used. |
| SizeFlags, KDD 2021, https://arxiv.org/abs/2106.03532 [P: abstract]; MultiFlags 2025 https://www.scitepress.org/PublishedPapers/2025/137099 [S] | Bayesian "runs small/large" flag per article, with priors from experts and computer vision, deployed across 14 countries | **Closest to our need**: a flag with confidence, not a point recommendation. Our "runs small vs label" flag could come from measured vs expected chart values. |
| SizeNet, CVPR-W 2019, https://arxiv.org/abs/1905.11784 [P: abstract] | weakly supervised visual cues of size/fit from article images | Cold-start idea; not reproducible in 10 days. |
| Zalando body-measurement from two phone photos, on-device; 10% fewer size returns vs no advice (2023); 1.5M+ users; virtual fitting room pilot up to 40% fewer jeans returns [P: https://corporate.zalando.com/en/node/10477 ; https://corporate.zalando.com/en/node/11013] | body side of the equation | Out of reach (body privacy, 3D). Our reference-garment approach avoids needing a body model. |

**Takeaway:** the industry's best result is single-digit to low-double-digit percent reduction. A hackathon should not claim to predict fit; it should claim to **make fit-relevant facts measured, comparable and honestly bounded**.

### 1.4 Garment measurement from a flat-lay photo with a scale reference
- Approach is standard: segment garment -> detect landmarks -> convert pixels to cm using a known-size reference -> distances between landmarks. Stitch Fix described this in 2016 (contour, corner detection, template fit, backdrop of known size, human-in-the-loop when uncertain) [P: https://multithreaded.stitchfix.com/blog/2016/09/30/photo-based-clothing-measurement/].
- ArUco-marker approach: photo includes ArUco markers to get a pixel-to-cm ratio; contour + feature points + Euclidean distance; neural-net error correction [S: https://annals-csis.org/Volume_32/drp/pdf/8.pdf]. Reported errors in that line of work: about 1.27 cm (blazers), 0.75 cm (dresses), 1.01 cm (skirts) [S via search snippet; verify before quoting].
- **GarmentIQ** (Yuan, Zhai, Ma, 2025 preprint): classification (tinyViT, 95.76%), BiRefNet segmentation, HRNet landmarks, 9 categories, trained on 23,266 Nordstrom/Myntra images [P: https://archive.gd.edu.kg/abs/20250525121523/]. Repo https://github.com/lygitdata/garmentiq : **MIT licence, 37 stars, 14 commits, pip-installable** [P] -> young, single-team, no published cm-error in the README. Also uses SAM 1/2/3. Usable as a reference or fallback; heavy for Cloud Run CPU.
- Thesis: "Towards Automated Garment Measurements In the Wild Using Landmark and Depth Estimation" (ECU, Dec 2024), DepthAnything + Keypoint R-CNN on DeepFashion2; no error figure in the abstract [P: https://thescholarship.ecu.edu/items/7a31dc61-8270-42da-926c-0cd169e2e664/full]. DeepFashion2 is non-commercial-research data [K].
- Commercial: Fitit "auto-measure garments from photos", "Fit Check" answering "does this fit *me*" for marketplaces [P: https://fitit.ai/solutions/marketplaces/]; Klothes (AI/AR ruler for resellers) [S: https://apps.apple.com/app/id1514959523]; Size AI and Tailored apps [S]; MySize announced second-hand sizing in June 2021 [P: https://apparelresources.com/technology-news/retail-tech/mysize-disrupt-sizing-second-hand-clothing-developing-ai-driven-solution]. So **photo-measuring is not new**; what is new would be doing it inside an evidence record with error bars and tying it to the buyer's decision.
- **Our 10-day recipe (no training):** (a) scale reference = the R4 "Fieldwork tag" or an A4 sheet / ISO ID-1 card (85.6 x 54.0 mm) in the same plane [K], with OpenCV ArUco (Apache-2.0, very mature) for homography; (b) Gemini Flash returns landmark **points** (Gemini image understanding supports bounding boxes `box_2d` normalised 0-1000 and 2D points; segmentation masks since 2.5 [P: https://ai.google.dev/gemini-api/docs/vision]) for shoulder, armpit, hem, cuff, collar on a flat-lay; (c) sample 3 times, take the median and the spread as the uncertainty; (d) reject and ask for a retake if spread > threshold or the marker is skewed; (e) validate on 15-20 garments tape-measured by two people and report MAE and share within +/-1.5 cm. That test set is the credible "measured" number for judges.
- Convention matters: resale uses **flat widths** (pit-to-pit = half chest circumference) [S: Vinted/Poshmark seller norms]; store flat width and let the renderer double it for circumference. Body/garment vocabularies: EN 13402 and ISO 8559 define body measurements [K].

### 1.5 "Fits like ..." with honest uncertainty (proposal)
- **Reference-garment comparison.** Buyer enters (or picks from earlier purchases) 2-3 measurements of a garment of the same type that fits them well: chest flat width, length, shoulder. We compare per dimension: `delta = listing - reference`, `sigma = sqrt(sigma_listing^2 + sigma_ref^2)` (listing sigma comes from `sz.m[...][1]`, tape-entered reference gets a default 1.5 cm).
- Verdict per dimension: |delta| < 1 sigma -> "about the same"; interval excludes 0 -> "tighter/looser by x to y cm"; sigma too large or method = label only -> **"Can't tell"**. A knit with high stretch widens the "same" tolerance.
- Sanity on magnitudes: a typical chest size step is about 4-6 cm in circumference (2-3 cm flat) [K]; photo measurement error of about 1 cm flat is roughly half a size step. So the output supports a 3-way "snug / similar / roomy" call, **not** "this is your size". Say so on the screen.
- Fallback if buyer has no reference garment: body chest/waist + ease bands (fitted ~4-8 cm, regular ~8-14, loose 14+ over body circumference) [K heuristic, tune]. Mark clearly as a rule of thumb.
- Do **not** use generative virtual try-on as a fit signal: Google itself warns "Fit and appearance won't be exact" [S: https://dataconomy.com/2025/12/12/google-now-lets-you-try-on-clothes-virtually-with-just-a-selfie/], and eBay drew seller backlash for inserting AI model images that distorted sleeves and collars [S: https://www.shopifreaks.com/ebay-is-testing-ai-generated-fashion-model-images-and-inserting-them-into-seller-listings-without-permission/]. AI-generated pictures of used goods undermine a trust product.

### 1.6 Verdict on fit
**Solvable enough for a prototype; not a deal-breaker; frame as "measured and bounded", never "predicted".** Risk to trust comes from over-claiming, so the demo should show a "Can't tell" case on purpose.

---

## 2. Language-neutral, token-efficient garment record

### 2.1 Vocabularies to anchor to (map, do not adopt wholesale)
| Source | What we take | Licence/maturity |
|---|---|---|
| Fashionpedia ontology: 27 apparel categories, 19 garment parts, 294 attributes (silhouette, neckline, sleeve length, pattern, fabric manipulation) [P: https://arxiv.org/abs/2004.12276 ; https://fashionpedia.github.io/home/index.html ; repo https://github.com/cvdfoundation/fashionpedia] | category + attribute + **part names** (collar, sleeve, pocket, zipper, neckline ...) as the region vocabulary; attribute values for `at` | CC BY 4.0, ECCV 2020, stable, 46,781 images |
| schema.org `OfferItemCondition` (New, Used, Refurbished, Damaged) and Google Merchant `condition` | derive `sch` for SEO/interop only (as in R4) | Standard, stable |
| GS1 GPC bricks + attributes (GS1 US Attribute Explorer: 2,700+ attributes, 3,600+ code values for apparel [S: https://www.gs1.nl/en/industries/textile-apparel/data-model/]) | map our category codes to GPC bricks for 2-3 categories; borrow attribute names (neckline, sleeve, fibre) | Free to use for classification [K]; heavy, take a subset |
| ISO 12945-2 / ASTM D3512 pilling grades 1-5 (5 = no change ... 1 = severe) [S: https://begoodtex.com/blog/iso-12945-textile-pilling-and-fuzzing-test-standards/] | pilling grade; RISE/Nauman uses 1-5 following ISO where possible [S: https://zenodo.org/records/12518734] | ISO text is paywalled; the grade descriptions are widely published |
| Platform scales: Vinted (New, Like new, Very good, Good, Satisfactory, Needs repair for electronics) [P: https://www.vinted.co.uk/help/50-choosing-item-condition]; Mercari JP six levels (新品未使用 / 未使用に近い / 目立った傷や汚れなし / やや傷や汚れあり / 傷や汚れあり / 全体的に状態が悪い) [S: https://help.jp.mercari.com/guide/articles/64/] | crosswalk table, below | public help pages |
| EN 13402 / ISO 8559 (body measurement and size designation) [K] | naming of body dimensions only | paywalled |

### 2.2 Condition crosswalk (proposed; render the buyer's local scale from our 1-5)
| Ours | Mercari JP | Vinted |
|---|---|---|
| 5 | 新品、未使用 / 未使用に近い | New / Like new |
| 4 | 目立った傷や汚れなし | Very good |
| 3 | やや傷や汚れあり | Good |
| 2 | 傷や汚れあり | Satisfactory |
| 1 | 全体的に状態が悪い | Satisfactory + defect flags |
Japanese used-clothing buyers expect specific wear words (毛羽立ち pilling, シミ・汚れ stains, 色あせ fading, 使用感 signs of wear) [S: Japanese used-clothing research, shoin.repo.nii.ac.jp] and Japan's baseline condition expectations are high [S: tofugu guide]. **Add a YEL (yellowing) code** for collar/underarm; it is a JP-specific complaint class [K].

### 2.3 Rendering at read time (no LLM for the defect facts)
- Record carries codes only. `taxonomy.yaml` holds, per code, a label and a sentence template per locale, using ICU MessageFormat plurals/units (Babel or `Intl`). Defects are **never machine-translated**; only the seller's free text goes through MT, shown with a "machine-translated, original below" badge.
- Starter glossary (my best knowledge; **must be checked by a native speaker per language** [K]):
| Code | EN | JA | KO | TH | ID | VI | HI |
|---|---|---|---|---|---|---|---|
| STN | stain | シミ・汚れ | 얼룩 | คราบ | noda | vết bẩn | दाग |
| PIL | pilling | 毛玉 | 보풀 | ขุย | bulu halus (pilling) | xù lông | पिलिंग |
| HOL | hole | 穴 | 구멍 | รู | lubang | lỗ thủng | छेद |
| FAD | fading | 色あせ | 색바램 | สีซีด | warna pudar | phai màu | रंग फीका |
| TER | tear / seam split | ほつれ・破れ | 뜯어짐 | ขาด / ตะเข็บแยก | sobek / jahitan lepas | rách / bung chỉ | फटा / सिलाई उधड़ी |
| BTN.MIS | button missing | ボタン欠損 | 단추 없음 | กระดุมหาย | kancing hilang | thiếu cúc | बटन गायब |
| SHP | stretched | 型崩れ・伸び | 늘어남 | ยืด | melar | giãn / bai | खिंचा हुआ |
| YEL | yellowing | 黄ばみ | 누런 변색 | เหลือง | menguning | ngả vàng | पीलापन |
| ODR | odour | 臭い | 냄새 | กลิ่น | bau | mùi | गंध |
- Back-translation check for the free-text path: translate to target, back-translate, flag large semantic drift. Translation engines: Gemini (Carousell built a Gemini translation workflow that automates 90% of its translation needs [S: https://cloud.google.com/customers/carousell]) or **TranslateGemma** (open, 4B/12B/27B, 55 languages, Gemma Terms of Use, Jan 2026 [S: https://gigazine.net/gsc_news/en/20260116-google-translategemma]). Gemma 4 (2 Apr 2026, Apache-2.0, E2B/E4B/26B-A4B/31B, multimodal) is also available [S: https://rits.shanghai.nyu.edu/ai/google-releases-gemma-4-frontier-open-models-under-apache-2-0/].

### 2.4 How resale platforms do cross-border today
- **Mercari Global** (Japan -> 100+ countries since 2019 [S: https://kyodonewsprwire.jp/release/201911073215]; June 2026 US app with real-time AI translation [S: https://www.digitalcommerce360.com/2026/06/19/mercari-launches-us-app/]). Mercari's Phrase case study covers **UI strings only**; there is no public detail on translating seller listings [P: https://phrase.com/customers/mercari/]. Mercari also ships AI listing support (photos -> title/description, ~15 s vs 5-10 min; GPT-4o mini) [S: https://openai.com/index/mercari].
- **Buyee / proxy services**: show Mercari listings through automatic translation; no one checks condition before shipping; translation "mangles condition grades and disclaimers" [S: https://tokyointernationalmeetup.com/buy-from-mercari-japan-overseas-2026/]. This is exactly the failure a coded record avoids.
- **Vinted** multi-country: I found only third-party extensions that auto-translate listings; I could not confirm an official listing-translation feature [S]; treat as unverified.
- **Carousell** (SEA + HK + TW): Gemini generates listings (+20% items listed per seller, median listing time under 2 minutes) and powers a translation workflow [S: https://cloud.google.com/customers/carousell]. **Carousell is a Google customer; judges may know it. Position as complementary: they translate prose, we render evidence.**

---

## 3. Garment item-record schema v2 (extends R4-04 s3, compact, coded)

### 3.1 What changes from v1
Add: (1) measured dimensions with uncertainty and method; (2) **coverage** - which regions were actually photographed, so "unseen" is distinguishable from "clean"; (3) controlled attribute block from Fashionpedia-style codes; (4) explicit odour block; (5) label verbatim + market, never converted; (6) stretch factor for fit tolerance. Everything else (hash chain, provenance, `src` of S/M/B/V, evidence ids) stays as in R4.

### 3.2 Codes
- **Measurements** `sz.m`: `{dim: [value_cm, sigma_cm]}`, flat widths. Dims: tops `chest_w, len, shl_w, slv, hem_w`; bottoms `wst_w, hip_w, inseam, rise, thigh_w, hem_w`; dresses add `skt_len`. Method `mm`: `ARU` flat-lay + marker, `TPE` seller tape, `LBL` brand chart (declared), `MIX`.
- **Regions (garment map)**, dotted: `FRT` (`FRT.UP`, `FRT.BDY`, `FRT.CLS`), `BCK`, `NCK` (`NCK.IN`), `SHL.L/R`, `AXL.L/R` (armpit), `SLV.L/R` (`.ELB`, `.UND`, `.CF` cuff), `HEM`, `PKT.*`, `LIN`, `SEAM.*`, `LBL`; bottoms `WST, CRO, INS.L/R, KNE.L/R, SEAT, HEM`. Names align with Fashionpedia parts (collar, sleeve, pocket, neckline, zipper) [K].
- **Defects** as R4: `STN(.OIL/.INK/.RUST), HOL, TER, FAD, PIL, SHP, ODR, ZIP.BRK/STK, BTN.MIS/LSE, PRT.WER, LIN.DMG` plus new `YEL`, `SHN` (shrinkage suspected), `PET` (pet hair). `s` severity 1-3, `iso` optional pilling grade 1-5 (5 = none), `a` size (cm or cm2), `e` evidence ids, `src` S/M/B/V, `c` confidence.
- **Tri-state truth for any (defect, region)**: *Defect present* (record lists it), *Shown clean* (region in `cov.seen` and no defect), *Not shown* (region in `cov.unseen`). Q&A and search only ever claim the first two when evidence supports it.

### 3.3 Example (a navy knit from a Mumbai seller, label sold in JP market)
```jsonc
{
 "v": 2, "id": "01JA3K...", "ver": 1,
 "cat": "CL.TOP.KNT",                       // maps to GPC brick + Fashionpedia "sweater"
 "b": "UNIQLO",
 "sz": {"lab": "L", "sys": "INTL", "mkt": "JP",       // label verbatim, never converted
        "m": {"chest_w": [55.0, 1.0], "len": [66.5, 1.0], "shl_w": [47.0, 1.5], "slv": [60.5, 1.5]},
        "mm": "ARU", "cal": {"ref": "TAG5", "res": 0.4}},   // marker used, residual px
 "fab": {"mat": [["WO", 50], ["AC", 50]], "str": 1, "src": "LBL"},
 "at": {"nk": "CRW", "slv": "LNG", "pat": "SLD", "cut": "REG", "col": ["NVY"]},
 "cn": {"g": 4, "sch": "USED"},
 "d": [
  {"t": "PIL", "r": "SLV.L.UND", "s": 1, "iso": 4, "a": 0, "e": ["i4"], "src": "B", "c": 0.81},
  {"t": "STN.OIL", "r": "FRT.HEM", "s": 1, "a": 1.5, "e": ["i3", "i5"], "src": "B", "c": 0.74}
 ],
 "cov": {"seen": ["FRT", "BCK", "NCK", "SLV.L", "SLV.R", "HEM", "LBL"],
         "unseen": ["AXL.L", "AXL.R", "NCK.IN"]},
 "odr": {"v": "NONE", "src": "S"},          // seller-declared, never "verified" from photos
 "img": [{"id": "i3", "cap": "FRT", "h": "sha256:..."}, {"id": "i4", "cap": "SLV.L.UND", "h": "sha256:..."}],
 "px": {"a": 89900, "cur": "INR"},
 "loc": {"cc": "IN"}, "ls": "hi",
 "ft": {"o": "...", "h": "sha256:..."},     // original free text, untrusted, quarantined
 "prov": {"pack": "clothing@0.4", "models": ["gemini-flash", "siglip2@clothing"], "conf": 0.78, "prev": "sha256:...", "sig": "..."}
}
```
Token cost: roughly 3x smaller than the equivalent verbose English JSON/prose (R4 measured 95 vs 262 tokens on its smaller record; re-measure this one with the API token counter [K]). Rendered to Japanese: "表示された範囲: 左袖の下に軽い毛玉(ISO 4)。裾前面に小さな油染み(約1.5 cm)。両脇下・襟の内側は未撮影。臭い: なし(出品者申告)。" - every clause traces to one field.

---

## 4. Listing generation and buyer Q&A grounded only in evidence

### 4.1 State of the art in what competitors do
Depop: one photo -> description, category, colour, brand, hashtags [P: https://thenextweb.com/news/depop-ai-generates-listings-from-one-photo]. eBay Magical Listing: >50% more listings per lister, 500M AI-assisted listings, ~25% faster listing (company figures) [S: https://cryptobriefing.com/ebay-ai-listings-50-percent-increase/]. ThredUp Direct Listing (9 Jun 2026): background removal, auto-filled product details, pricing [P: https://newsroom.thredup.com/news/thredup-directlisting]. All of these generate **marketing prose from photos**; none publish how they stop the prose over-claiming condition. Third-party tools for Vinted generate descriptions and AI-modelled photos, not evidence [S: https://vintefy.com/vinted-ai]. Fabricated damage photos are an emerging dispute problem on Vinted [S: https://www.75secondes.fr/tech/arnaque-ia-sur-vinted-attention-aux-fausses-photos-de-litige], which is the other side of this product.

### 4.2 Pattern: "closed-world listing"
1. **Writer sees only the record + glossary**, never raw photos, and outputs sentences each tagged with `claim_ids` (e.g. `d[1]`, `sz.m.chest_w`). ADK `LlmAgent` with `output_schema`.
2. **Validator (code)**: every sentence has >=1 claim id; every number in the text exists in the record; superlatives and "like new/pristine/no flaws" are blocked unless `cn.g = 5` and `cov` complete; absent regions must be stated as "not shown". On failure, fall back to a deterministic template render.
3. Ship the template render as the default and the LLM prose as an optional polish; the listing is always the same facts.

### 4.3 Pattern: "Ask the garment" Q&A
- **Step 1 - route in code.** Parse question to (defect type, region) with a small Gemini call returning an enum schema. Look up the record.
- **Step 2 - answer from the tri-state**: *present* -> show the crop(s) `e[]` (cropped by stored box); *shown clean* -> "None visible in these photos" + the crop of that region; *not shown* -> **"Not in the photos"** + button "Ask seller for a close-up" (async). Never answer "no stains" for an unseen region.
- **Step 3 - novel questions** (e.g. "is the print cracked?") go to Gemini with only the relevant image crops; require JSON `{answer: YES|NO|CANT_TELL, evidence: [image_id, box_2d]}`; reject if the box does not overlap a stored crop; self-consistency of 3 samples; any disagreement -> CANT_TELL.
- Literature backing the evidence-first design: Visual Evidence Prompting (domain-expert outputs as visual evidence reduce LVLM hallucination, ACL 2025) [S: https://aclanthology.org/2025.acl-long.205]; VADE, visual-attention-guided hallucination detection and elimination on e-commerce product images (Findings of ACL 2025) [S]; ContextualLens, training-free hallucination detection and grounding (NAACL 2025) [S]. We do not need these as code; we use their principle (answer from external evidence, ground to a region, abstain) and a code-level gate.
- **Odour/hygiene** (34.4% buyer concern [S]): not visual. Show seller declaration with provenance label "seller says" and optionally "washed before listing" as a declared field; never "fresh".
- Seller and buyer free text are untrusted input (prompt injection) - same quarantine as R4.

---

## 5. Search and discovery

### 5.1 What exists
- **Beni Lens** (Dec 2025): visual search across Poshmark, ThredUp, The RealReal, eBay, Depop; profile filters by size, condition, budget, brand; photos -> structured attributes (silhouette, colour, fabric, detail) because listings have no clean catalogue [P: https://techspective.net/2025/12/10/the-hidden-barrier-holding-back-the-booming-secondhand-market/ ; S: https://www.mannpublications.com/fashionmannuscript/2025/12/10/beni-unveils-beni-lens-the-first-visual-search-engine-for-secondhand-fashion-making-thrifting-as-easy-as-shopping-new/]. Built on Google Cloud (Vision Product Search, Vertex AI, BigQuery), not on Gemini per the article [P: Google dev blog above]. Raised about $6M [S: CB Insights].
- **Vestiaire Collective**: AI search turning keywords into image-pattern matching, price recommendation with image recognition, image search (2024 announcement) [S: https://apparelresources.com/technology-news/retail-tech/vestiaire-collective-announces-ai-advancements-tech-appointments/].
- **Phia**: price comparison against 250M+ used items across RealReal, Vestiaire, ThredUp, StockX, eBay, Poshmark [S: https://www.digitalcommerce360.com/2025/10/29/phia-co-founders-ai-resale-at-techcrunch-disrupt/]. **Faircado**: extension, 60M+ products from 70+ partners, filters by brand, colour, size, price [S: https://faircado.com/faq/]. **Renoon**: 1M+ products, 200+ brands [S].
- None of these filter on **defect-level condition** (they filter on the seller's declared condition label).

### 5.2 Components to use
- **Marqo-FashionSigLIP / Marqo-FashionCLIP**: 150M-param ViT-B-16 embeddings, **Apache-2.0**, 146 stars, load via `open_clip` `hf-hub:Marqo/marqo-fashionCLIP`; text-to-image avg recall 0.231 vs FashionCLIP 2.0's 0.163 and OpenFashionCLIP 0.132 across 6 datasets [P: https://github.com/marqo-ai/marqo-FashionCLIP]. Small enough for Cloud Run CPU. FashionCLIP original (MIT [K]).
- Hybrid query: **structured filter first, embedding rank second.** Filter operates on the tri-state: `grade>=4`, `no STN present`, with a toggle "include items where stains are not shown" (default off). Natural-language -> filter DSL via Gemini function calling ("only condition 4+ and no stains, size around M, under 1500 rupees"). Store records in SQLite/Postgres + embeddings in numpy/pgvector; for 200-2,000 demo items no vector DB is needed.
- Composed retrieval ("like this, but longer sleeves") exists in research (FashionIQ, CoLLM 2025 https://arxiv.org/abs/2503.19910 [S]); zero-shot Recall@10 around 20-25% on FashionIQ [S] is too weak for a trust demo; skip.

### 5.3 Sustainability / CO2 metrics
- Vinted: avg **1.8 kg CO2e avoided per second-hand item**, consequential LCA by Vaayu over half a billion transactions plus 350,000-member behaviour sample [S: https://ecotextile.com/2024062432199/fashion-retail-news/vinted-reports-claims-significant-emissions-savings.html].
- ThredUp Fashion Footprint Calculator with Green Story, 11 questions; "half of your clothes second-hand saves 656 lbs CO2 a year" [S: https://newsroom.thredup.com/news/thredup-launches-fashion-footprint-calculator-to-help-consumers-lessen-their-eco-impact].
- WRAP 2025: second-hand purchases displace a new purchase about **64.6%** of the time; extending garment life 9 months cuts footprints about 20% [S: https://www.wrap.ngo/es/node/47400 and WRAP summaries].
- Per-garment production footprints vary widely: cotton T-shirt about 4.5-8.5 kg CO2e, 9.2 kg in one Chinese cotton-garment study, knitwear 7.2 kg [S].
- Proposal: show a **range, not a point**: `avoided = 0.646 x footprint(category, fibre, weight)` with a low/high band, plus a sanity line "Vinted reports 1.8 kg average". Explain it in one tap. Avoid greenwashing claims.

---

## 6. Competitor map and white space

| Player | AI they ship (listing / condition / fit / cross-border) | Source |
|---|---|---|
| Vinted | Suggests category, size, brand from photos, price hints, fraud monitoring (secondary source); no official native AI listing tool found; 1.8 kg CO2e/item claim; US launch Jan 2026 | [S: https://pdpspectra.com/blog/ai-second-hand-marketplaces-2026] |
| Depop (Etsy) | One-photo listing generation (category, colour, brand, hashtags) | [P: thenextweb above] |
| Mercari | AI listing support (title/description from photos ~15 s), AI Assistant (Oct 2023), OpenAI models; Global app with real-time AI translation; UI localisation at scale | [S: openai.com/index/mercari; digitalcommerce360] |
| Carousell | Gemini listing generation (+20% items/seller, <2 min median), Gemini translation workflow (90% automated) | [S: cloud.google.com/customers/carousell] |
| ThredUp | Direct Listing (AI background removal, autofill, price), AI discovery claims; reports sizing/hygiene as top barriers | [P: newsroom.thredup.com] |
| eBay | Magical Listing from photos; AI-model-image controversy | [S: cryptobriefing; shopifreaks] |
| The RealReal | Authentication via Entrupy and in-house CV (bags, jewellery, accessories); AI price suggestions | [S: pdpspectra] |
| Vestiaire | AI search, price recommendation, image search | [S: apparelresources] |
| Faircado, Renoon, Phia, Beni | Discovery/aggregation across marketplaces; Beni = visual search + size/condition filters on seller-declared data | see s5 |
| Trove, Treet, Archive, Reflaunt | Brand-run resale infrastructure; Trove applies computer vision to identify items and enrich catalogue attributes at check-in; no public AI evidence for defect grading or fit found | [S: https://trove.com/how-it-works/ ; CB Insights] |
| Fitit, MySize, Klothes, Size AI | Garment measurement from photos for sellers; Fit Check for buyers (Fitit) | [P/S above] |
| "Gem" | I could not identify a resale company by this name (search returned a recruiting tool) | - |

**White space (what nobody is shown to ship):**
1. A **shared, coded, evidence-linked condition record** that survives translation, listing, Q&A and disputes (competitors generate prose; nothing is machine-checkable).
2. An explicit **"Not shown" state**, honoured in Q&A and search, instead of silence.
3. **Measured fit with error bars** bound to the same record (Fitit/Klothes measure; none surface uncertainty or compare against the buyer's own garment as far as I found).
4. **Cross-border by rendering codes, not translating prose**, including local condition scales (Buyee-style MT is documented to garble condition).
5. **Defect-level search filters** (Beni/Faircado filter on declared condition).
6. Cross-vendor neutrality: a trust layer that sits above several marketplaces (Beni-style feeds show demand for normalisation).

---

## 7. Innovation ideas, ranked by wow x feasibility in 10 days (each scored 1-5)

| # | Idea | Wow | Feas | Score | Papers / libraries |
|---|---|---|---|---|---|
| 1 | **"Ask the garment" + cited listing**: every listing sentence and every Q&A answer carries a claim id and shows the crop; unseen regions answer "Not in the photos"; abstention in code | 4 | 5 | **20** | Gemini `box_2d` + structured output [Gemini vision docs]; Visual Evidence Prompting (ACL 2025); VADE (Findings ACL 2025); ADK `LlmAgent` + `output_schema` + callbacks |
| 2 | **"Fits like..." vs your own garment, per-dimension deltas with error bars and a "Can't tell" state** | 4.5 | 4 | **18** | SizeFlags (KDD 2021) for "flag with confidence" framing; Amazon latent true-size idea; ModCloth/RTR data for sanity checks |
| 3 | **Tri-state condition search**: "grade >=4, no stains" distinguishes shown-clean vs not-shown; NL -> filter DSL; embedding rerank | 3.5 | 5 | **17.5** | Marqo-FashionSigLIP (Apache-2.0), open_clip; Gemini function calling |
| 4 | **Read-time multilingual render from codes** with local condition scales (Mercari 6-level, Vinted) and curated defect glossary; MT only for seller prose with back-translation drift check | 3.5 | 4.5 | **15.8** | TranslateGemma (Gemma ToU), Gemma 4 (Apache-2.0), ICU MessageFormat/Babel; Mercari/Vinted scales |
| 5 | **Flat-lay auto-measure with tag/A4 scale reference** (prerequisite for #2; fallback: seller tape) | 4 | 3.5 | **14** | OpenCV ArUco (Apache-2.0); Gemini point/box output; GarmentIQ (MIT, as reference); Stitch Fix contour method; validation vs tape on 15-20 garments |
| 6 | **Impact receipt with a CO2e range** per item from displacement rate x category footprint | 2.5 | 5 | **12.5** | WRAP 2025 (64.6% displacement); Vinted/Vaayu 1.8 kg anchor; ThredUp/Green Story calculator as prior art |
| 7 | **Query by example with defect guard** ("like this, but no pilling") using FashionSigLIP + filters | 3.5 | 3 | **10.5** | Marqo-FashionSigLIP; composed retrieval papers as stretch (CoLLM 2025, FashionIQ) |
| 8 | **Label-vs-measured drift index per brand** learned from our own measurements ("this brand's L runs 3 cm small when used") | 4 | 1.5 | **6** | SizeFlags/MultiFlags (Bayesian flags); needs data we cannot collect in 10 days - pitch as roadmap only |

**Recommended demo bundle:** #1 + #3 + #4 are the fast, robust core (record -> listing -> Q&A -> search -> JP/KR/TH rendering). Add **#5 + #2 as one slice** if the measurement MAE test comes in under ~1.5 cm; otherwise degrade #2 to seller-entered tape measurements and keep the error-bar logic - the story survives.

**Suggested ADK mapping (Cloud Run, stateless):** deterministic workflow agent; `FunctionTool`s `lookup_record`, `check_coverage`, `crop_evidence`, `render(locale)`, `fit_compare`, `search_catalog`; `ListingWriter` and `QA` as `LlmAgent`s with schema outputs; validators as callbacks/custom agents that can veto and force the template fallback.

---

## 8. Deal-breakers

| # | Deal-breaker | Severity | Forces category change? | Mitigation |
|---|---|---|---|---|
| 1 | **Listing generation is commoditised** (Carousell-Gemini, Mercari, Depop, eBay, ThredUp all ship it; Carousell is a Google Cloud case study) | **High (positioning)** | No - forces a pitch change: lead with the evidence/trust record and "not shown", not AI-written listings | Demo what generators cannot do: claim-level citations, abstention, defect-level search, cross-border rendering |
| 2 | Fit/feel/smell cannot be proved from photos; hygiene (34.4%) and sizing (31.3%) are the top buyer anxieties | Medium | No | Measurement + bounded verdicts, explicit "Can't tell", seller-declared odour labelled as such |
| 3 | Photo-measurement accuracy is unvalidated by us; published errors are about 0.75-1.3 cm for specific garment types in other setups [S] | Medium | No | Own test set vs tape, report MAE; reject poor captures; seller tape fallback |
| 4 | Wrong "no stains" statement in Q&A creates a dispute and liability | Medium-High | No | Tri-state logic in code, coverage-based abstention, crops shown, record version pinned to purchase (R4) |
| 5 | Translation of condition terms wrong or culturally off (esp. JP expectations, NC/NR norms); my glossary is unverified | Medium | No | Native-speaker review of glossary before demo; render only from curated table; badge MT prose |
| 6 | Seller effort: marker + 3-5 extra photos vs competitors' "listing in under 2 minutes" | Medium | No | Tag doubles as scale ref and identity anchor (R4); progressive capture; measure only when seller opts in |
| 7 | We are a layer, not a marketplace: need a host flow to demo | Low-Medium | No | Build a thin mock marketplace; export schema.org Product/Offer JSON-LD for interop |
| 8 | Licences: DeepFashion2 and UCSD fit data are research-only; Gemma Terms of Use for TranslateGemma; GarmentIQ is 37-star immature | Low (non-commercial acceptable) | No | Use as reference/validation only; keep Apache/MIT components in the core |
| 9 | Meesho conflict in clothing (R4-00) - outside this stage but unchanged | Policy question for Akshat | Possibly (fallback = books) | Resolve before 11 Oct |

**Net:** no high-severity technical blocker for the garment category; one high-severity positioning risk (#1) that is solved by what we choose to emphasise.

---

## 9. Open items to verify before submission
- Native-speaker check of the glossary in s2.3 (JA, KO, TH, ID, VI, HI).
- Re-read primary pages that I only saw as snippets before quoting: Carousell case study, ThredUp report numbers, WRAP 64.6% figure, measurement-error figures (0.75-1.27 cm).
- Confirm Gemini point/box output accuracy on flat-lay garments with a 20-image smoke test before committing to #5.
- Measure token counts of the v2 record vs verbose JSON with the Gemini token counter.
