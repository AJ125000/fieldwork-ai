# R5-01: Open datasets for second-hand condition grading, by category

Date: 7 Oct 2026. Method: web search plus page fetches. Roboflow Universe pages returned HTTP 403 to my fetcher, so Roboflow image counts and licences come from search snippets only and are marked "snippet". Items marked (unverified) were not opened.

Scoring. Cond = relevance to judging used-item condition (1-5). Phone = realism versus seller phone photos (1-5; 5 = handheld phone shots in messy backgrounds, 1 = factory line or lab rig).

Licence warning. Many of the strongest research sets are non-commercial (CC BY-NC-SA, CC BY-NC, research-only forms). For a commercial trust product, treat them as benchmarks only, not training data, unless you get written permission. Commercially clean sets here are CC BY / CC BY-SA / CC BY 4.0 (Roboflow, Zenodo, Mendeley).

## Headline findings
1. No open dataset exists for kids' gear, acoustic instruments, sports equipment, watches/eyewear, kitchenware or home decor condition. For these, only generic defect transfer is possible, plus self-collection.
2. Only two datasets are true "used consumer item, condition labels" sets: the Wargon second-hand clothing set (Zenodo, CC BY, 1-5 condition plus stains/holes/pilling) and the DelftBikes set (part state intact/damaged/missing). Everything else is factory defects, car damage or toy lab rigs.
3. For same-item matching with damage, BBBicycles (synthetic before/after damage, re-ID) is unique. Generic product matching sets (SOP, Products-10K, ABO) cover the matching side but have no condition labels.
4. Phone-photo realism is the weak spot everywhere. Best phone-style sets: Mendeley Bag Damage (iPhone), Roboflow damage/scratch sets (mixed web photos), DelftBikes (street photos, capture method not stated on page).

---

## 1. Books and textbooks

| Dataset | URL | Licence | Size / images | Labels | Cond | Phone | Notes |
|---|---|---|---|---|---|---|---|
| SHBD (Second-Hand Book Defect), from DDNet paper | https://arxiv.org/abs/2409.04958 | Not stated in paper | 6,366 images | 6 defect classes: Vitium (missing edges/corners/pages), Defaced (water/oil stains), Crease, Patch (tape repairs), Signature (seals), Inkiness (ink/notes). Supports classification, detection, segmentation | 5 | 3 (capture device not stated) | No download link in the paper; contact authors. Best fit by far, but access unverified |
| second-hand-book-defect (Roboflow) | https://universe.roboflow.com/datas-workspace-cojr6/second-hand-book-defect | CC BY 4.0 (snippet) | Not verified | Book defect boxes | 4 | 3 | Possibly a public mirror of SHBD-style data; check counts |
| book_damage_detection (Roboflow, jonathan-hart) | https://universe.roboflow.com/jonathan-hart/book_damage_detection-sqrhi | CC BY 4.0 (snippet) | Not verified | Barcode, Notch, Ripped, Spot, Tag | 3 | 3 | Library-style damage |
| Book Defect Detection / Damage_criteria (Roboflow, damagecriteria) | https://universe.roboflow.com/damagecriteria | Likely CC BY 4.0 (snippet) | 961 / 355 (grayscale) / 580 images | Book defect classes | 3 | 2 | Small |
| Book Damage Atlas (paber.ut.ee) | https://paber.ut.ee/EN/kategooriad/k%C3%B6ide/koite_selja_seisukorra_hinnangud_ | Web reference, not a dataset | Illustrated grades | Spine, cover, corner, hinge condition scales | 2 | n/a | Use only to design the grading rubric |
| Open Shelves (spine detection) | https://github.com/capjamesg/open-shelves | See repo | Not verified | Book spine boxes | 1 | 3 | Localisation only, not condition |

Matching: use SOP / Products-10K style retrieval (see Matching section). No highlighting dataset found.

## 2. Furniture (wood, upholstery, laminate) and generic wood/leather/fabric surfaces

| Dataset | URL | Licence | Size / images | Labels | Cond | Phone | Notes |
|---|---|---|---|---|---|---|---|
| Wood surface defects (sawn timber, production line) | https://zenodo.org/record/4694695 | CC BY 4.0 | 20,276 images, 43,000+ defects; 156.6 GB across 10 image zips (~15-17 GB each), plus 5 MB boxes, 207 MB semantic maps | 10 types: live/dead knot, knot with crack, crack, resin, marrow, quartzity, missing knot, blue stain, overgrown; boxes plus masks | 3 | 1 | Downloadable in pieces (per zip). Good for pretraining wood texture defects |
| Wood waterborne-paint defects | https://zenodo.org/records/15679291 | See record | 13,400 images | Scratch, crack, bubble, hole on painted wood | 4 | 1 | Closest to lacquered furniture finish. Licence not verified |
| VNWoodKnot | https://data.mendeley.com/datasets/vnst548g5n/2 | Mendeley (likely CC BY, unverified) | 1,515 images | Live knot 519, dead knot 496, knot-free 500; boxes | 2 | 2 | Varied lighting/angle |
| Roboflow "scratch" (damages): scratch, dent, chipping, heavy_dent, tear | https://universe.roboflow.com/damages/scratch-6nagp | CC BY 4.0 (snippet) | Not verified | 5 damage classes | 4 | 3 | Generic surface damage, transfers to laminate, wood, metal |
| SCRATCH (phatmmv) | https://universe.roboflow.com/phatmmv/scratch-d2eyu | CC BY 4.0 (snippet) | Not verified | Scratch, dent, chipping | 3 | 3 | |
| Fabric Stain Dataset (Intellisense Lab, Moratuwa; Kaggle copy) | https://datasetninja.com/fabric-stain-dataset | See page | 398 stained plus 68 clean images, 1920x1080 | Ink, dirt, oil stain boxes (polyester, cotton) | 4 | 2 | Upholstery stains proxy |
| Fabric Defects Dataset (compiled) | https://data.mendeley.com/datasets/663j22s43c/3 | Mendeley, check | Compiled from Kaggle, Aitex and others | Fabric defects | 2 | 1 | |
| Nyckel pretrained "furniture damage" classifier | https://www.nyckel.com/pretrained-classifiers/furniture-damage-identifier/ | Proprietary model, data not released | n/a | Damaged vs not | 3 | 4 | A benchmark baseline, not a dataset |
| MVTec AD (wood, leather, carpet, tile categories) | see Generic section | CC BY-NC-SA | | | | | |

Gap: no open furniture condition set with phone photos. Plan self-collection (listings) for sofas, wardrobes.

## 3. Kids' gear (strollers, prams, car seats, cribs, high chairs)

| Dataset | URL | Licence | Size | Labels | Cond | Phone | Notes |
|---|---|---|---|---|---|---|---|
| stroller (seokwoolee) | https://universe.roboflow.com/seokwoolee/stroller-zff9r | MIT (snippet) | Not verified | Stroller object boxes | 1 | 3 | Detection only |
| stroller detection (school-jt4su) | https://universe.roboflow.com/school-jt4su/stroller-detection-guxvi | Not verified | ~111 images (snippet) | Stroller boxes | 1 | 3 | Tiny |
| Generic metal/plastic/fabric defect transfer | see Generic section | | | | | | The only route: rust, scratch, tear, stain from other sets |

No condition or damage dataset found for strollers, car seats, cribs or high chairs. Data readiness is effectively zero. Safety-critical items (car seats: expiry, cracked shell, frayed straps) need self-collected data and likely non-visual checks.

## 4. Bicycles and kids' cycles

| Dataset | URL | Licence | Size / images | Labels | Cond | Phone | Notes |
|---|---|---|---|---|---|---|---|
| DelftBikes | https://data.4tu.nl/datasets/c3d7e922-5777-4968-946e-e18c5fe99402 | CC BY-SA 4.0 | 10,000 bike images | 22 parts each, state = intact (60.5%), absent (19.5%), occluded (14%), damaged (6%). Boxes | 4 | 3 (street/real photos; capture method not on page) | Files showed as "temporarily unavailable, storage under maintenance" when checked 7 Oct 2026. Code: https://github.com/oskyhn/DelftBikes. Paper: https://arxiv.org/pdf/2106.02523 |
| BBBicycles (Bent & Broken Bicycles) | https://huggingface.co/datasets/GrainsPolito/BBBicycles | CC BY-NC 4.0 | 39,200 synthetic images, 2,800 IDs, 20 models, 130 GB | Before/after damage (bent, broken, dirty), missing-part one-hot (wheels, seat, handlebar, pedals), camera angle, background | 4 | 1 (synthetic) | Built for damaged-object re-identification, so it is the only open set linking matching and damage. Per-model folders so partial download is possible. Paper https://arxiv.org/pdf/2304.07883 |
| Damage/Rust (gitterbox) | https://universe.roboflow.com/gitterbox/damage-rust | CC BY 4.0 (snippet) | Not verified | Damage, rust | 3 | 3 | Page not opened (403) |
| Damage_Rust (project-thesis) | https://universe.roboflow.com/project-thesis-wqj9g/damage_rust | CC BY 4.0 (snippet) | Not verified | Damage, rust | 3 | 3 | |
| Rust_detection (rfgoogletest) | https://universe.roboflow.com/rfgoogletest/rust_detection-4uvbz | CC BY 4.0 (snippet) | Not verified | Rust | 3 | 3 | |
| BicycleObjectDetection | https://universe.roboflow.com/bicycle-parts/bicycleobjectdetection/model/1 | Not verified | 623 images | Bike part boxes | 2 | 3 | Parts, no condition |
| Corrosion segmentation (Mendeley) | https://data.mendeley.com/datasets/kcyn4nhv2c/1 | See page | 1,024 images, 35 with pixel masks | Corrosion masks | 3 | 4 (field photos) | Small mask set for rust |

## 5. Toys including LEGO

| Dataset | URL | Licence | Size / images | Labels | Cond | Phone | Notes |
|---|---|---|---|---|---|---|---|
| MAD / PAD (MAD-Sim, MAD-Real) | https://github.com/EricLee0224/PAD (paper https://arxiv.org/pdf/2310.07716) | CC BY-NC-SA 4.0 | MAD-Sim 970 MB: 4,000+ multi-pose training images, 7,000+ test, 20 LEGO animals. MAD-Real 2.19 GB: 10 classes | Anomalies: burrs, stains, missing parts; pose-agnostic, with masks | 4 | 2 (lab-controlled for real) | Best match for "missing parts" and "same toy in different pose". Two separate Google Drive files (Sim and Real) |
| B200C / B200 LEGO (Kaggle) | search result; Kaggle "B200C LEGO Classification" | See Kaggle | 800,000 synthetic images, 200 classes | Brick class only | 1 | 1 | Part recognition for completeness checks only |
| LegoBricks (Hugging Face) | search result, repo not opened | Not verified | 1,000 parts x 400 renders | Part ID | 1 | 1 | Synthetic renders |
| Roboflow Lego / BricksAug | https://universe.roboflow.com/pascal-y2gnm/lego-z0luc and https://universe.roboflow.com/vcbricks/bricksaug | Not verified | Not verified | Brick detection | 1 | 2 | |
| Generic Roboflow "damage" sets | https://universe.roboflow.com/goals/damage-j3qfz | CC BY 4.0 (snippet) | Not verified | Damage/scratch/broken | 2 | 3 | Not toy-specific |

No dataset for soft toys, board games (missing pieces) or ride-on toys.

## 6. Acoustic musical instruments

| Dataset | URL | Licence | Size | Labels | Cond | Phone | Notes |
|---|---|---|---|---|---|---|---|
| UVIFL violins | https://vision.unipv.it/research/UVIFL-Dataset | See page | Historical violins, multi-temporal UV fluorescence | Conservation monitoring of finish wear | 3 | 1 | UV lab imaging, not usable for phone photos |
| Broken instrument (Roboflow, yolov7) | https://universe.roboflow.com/yolov7-ndv7d/broken-instrument | CC BY 4.0 (snippet) | Not verified | Broken instrument | 2 | 3 | Likely not acoustic string instruments |
| guitar (project-ltqio) | https://universe.roboflow.com/project-ltqio/guitar-os6ye | CC BY 4.0 (snippet) | Not verified | Guitar detection | 1 | 3 | |
| Nyckel "guitar strings rusted" classifier | https://edge.nyckel.com/pretrained-classifiers/if-guitar-strings-are-rusted | Proprietary | n/a | Rusted vs not | 2 | 4 | Baseline only |
| Generic: wood paint defects, crack sets | see Generic section | | | | | | Only transfer route |

No tabla, violin or guitar damage dataset found. Readiness is effectively zero.

## 7. Sports and fitness equipment

| Dataset | URL | Licence | Size | Labels | Cond | Phone | Notes |
|---|---|---|---|---|---|---|---|
| RacketDB | https://github.com/muhabdulhaq/racketdb | See repo | 16,608 train / 3,175 test / 2,899 val | Badminton racket detection | 1 | 3 | Detection only |
| Corrosion/rust sets (see Bicycles) | | | | | | | Dumbbells, rusted plates |
| Generic scratch/dent sets | | | | | | | Cricket bat edge cracks, racket frame |

No condition dataset found.

## 8. Bags, luggage, non-luxury handbags

| Dataset | URL | Licence | Size / images | Labels | Cond | Phone | Notes |
|---|---|---|---|---|---|---|---|
| Bag Damage Detection (Mendeley) | https://data.mendeley.com/datasets/9k3bf6ksnd/1 | CC BY 4.0 | 700 images (640x640 after preprocessing, includes augmentation) | Classes "damage" and "bag": tears, rips, punctures, segmentation | 4 | 4 (iPhone 13 12MP, Pune, Oct-Dec 2023, plus some stock/YouTube images) | Best phone-realistic damage set. Single download. Small, and augmentation is baked into the processed copy, so deduplicate |
| LetGo image-quality set (shoes and handbags) | https://arxiv.org/abs/1811.10648 | Not found; PDF text unreadable | ~75,000 second-hand listing images; handbags 29,839 listings / 44,725 images, shoes 66,752 listings / 133,783 images collected (the labelled subset is smaller) | Human image-quality scores (photo quality, not item condition) | 2 | 5 (real seller photos) | Useful for photo-quality gating at upload, not for defects. Release status and licence unverified |
| Bag Accessories Detection (Mendeley) | https://data.mendeley.com/datasets/tzmf2ztdwp | See page | 2,528 images | bag, handle, strap | 1 | 4 | Localisation of handles and straps |
| Zipper Defect Detection (Roboflow) | https://universe.roboflow.com/cipi-p24b4/zipper-defect-detection | CC BY 4.0 | Not verified | Zipper defect | 3 | 2 | Broken zips |
| 2-BagDamageHandle (Roboflow) | https://universe.roboflow.com/project1bag-and-handle-detection/2-bagdamagehandle | Not verified | Not verified | Bag damage and handle | 3 | 3 | |
| MVTec AD zipper, leather; leather defect sets | see Generic section | | | | | | |

## 9. Footwear

| Dataset | URL | Licence | Size | Labels | Cond | Phone | Notes |
|---|---|---|---|---|---|---|---|
| Longitudinal Shoe Study (Iowa State CSAFE) | https://iastate.figshare.com/articles/dataset/Longitudinal_Shoe_Study_Digital_Photos_of_Shoe_Soles/8181866 | Figshare (licence not checked) | 160 pairs (Nike Winflo 4, Adidas Seeley), worn 6 months, repeat photos; also 3D scans and 2D scans | Same shoe over time, wear progression | 4 | 2 (lab photos) | Only real longitudinal wear data, so it supports both wear-progress and same-item matching. Several separate figshare packages (photos, 3D scans, 2D scans) |
| Shoe Defect (kh-uliaq, Roboflow) | https://universe.roboflow.com/kh-uliaq/shoe-defect-bss2k | Not verified | Not verified | Scratch, crack, sole detachment (snippet) | 3 | 2 (factory) | |
| damage_shoes (fcbox, Roboflow) | https://universe.roboflow.com/fcbox/damage_shoes | Not verified | Not verified | Scratch, unglued | 3 | 3 | |
| shoe defect classification (pesankoding) | https://universe.roboflow.com/pesankoding/shoe-defect-classification-c5fpz | Not verified | Not verified | Defect classes | 2 | 2 | |
| LetGo shoes | see Bags | | | | | | Photo quality labels |

## 10. Ethnic wear (sarees, lehengas, sherwanis)

| Dataset | URL | Licence | Size | Labels | Cond | Phone | Notes |
|---|---|---|---|---|---|---|---|
| IndoFashion | https://indofashion.github.io/ (paper https://arxiv.org/abs/2104.02830) | Copyright, gated Google Form, no open licence | 106K+ images (91,166 train / 7,500 val / 7,500 test), 15 classes incl. saree, lehenga, sherwani | Category only, from Indian e-commerce and Google images | 1 | 1 (studio/catalogue) | Garment recognition and retrieval, no condition |
| Clothing Dataset for Second-Hand Fashion (Wargon / RISE / Myrorna) | https://zenodo.org/records/12518734 | CC BY 4.0 | 31,997 items x 3 photos (~96,000 images), 26.9 GB single zip | JSON: condition 1-5, pilling, stains, holes, smell, damage location, material, price, reuse/repair/recycle destination | 5 | 3 (sorting-table photos with 10x10 cm grid or tape, 1280x720 or 1920x1080) | The best open used-item condition dataset found, though everyday Swedish clothing. Single zip, so not downloadable in pieces. About 4,000-5,000 brand images removed for privacy |
| Fabric Defect (Mendeley y62b4pfyz2) | https://data.mendeley.com/datasets/y62b4pfyz2 | CC BY 4.0 | 2,468 images | Button-hike 307, broken button 545, hole 556, colour defect 384, foreign yarn 334, sewing error 317; boxes | 3 | 3 | Garment-level defects (capture device not stated) |
| Defect-Clothes (Roboflow, hawadz) | https://universe.roboflow.com/hawadz/defect-clothes-ukrks | Not verified | ~1,482 images (snippet) | Holes, stains | 3 | 3 | |
| Fabric Stain Dataset | see section 2 | | 398 stained images | Ink, dirt, oil stains | 4 | 2 | |
| FabricSpotDefect | https://www.ncbi.nlm.nih.gov/pmc/articles/PMC11648198/ | See paper | Not verified | Stains, rust marks, oil marks across cotton, linen, silk, denim, jacquard | 4 | 3 | Silk and jacquard are nearest to ethnic wear |
| Tianchi fabric | search result, not opened | Alibaba competition terms | Not verified | Holes, stains, wrinkles, colour shade | 2 | 1 | |

Gap: no sari/lehenga/sherwani condition data. Embellishment loss, zari tarnish, sweat marks and hem wear are absent from every dataset.

## 11. Kitchen and home, non-electric (cookware, pressure cookers, utensils, crockery)

| Dataset | URL | Licence | Size | Labels | Cond | Phone | Notes |
|---|---|---|---|---|---|---|---|
| Multi-illumination stainless-steel surface defects | https://ieee-dataport.org/documents/multi-illumination-stainless-steel-surface-defect-dataset | IEEE DataPort (check; may need account) | 528 images (5472x3648), 33 sink samples, 8 illuminations, 2 views | Surface defects on stainless steel | 3 | 1 | Relevant to steel cookware scratches |
| Sanitary ceramics V2 | https://data.mendeley.com/datasets/2bkhytgwm8 | Mendeley (check) | 106 images (67 defective, 39 clean) | Ceramic surface defects | 3 | 1 | Crockery chips and cracks proxy, very small |
| Ceramic tile defects | https://data.mendeley.com/datasets/47x6jdbr5j | Mendeley (check) | 1,600 images (800 normal / 800 defective), 4096x3072 | Cracks, deformations | 2 | 1 | |
| Ceramic substrate defects | https://data.mendeley.com/datasets/55yb7hh55r | Mendeley (check) | 2,892 images, 6 defect types | Industrial ceramic | 1 | 1 | |
| Corrosion/rust sets (see Bicycles) | | | | | | | Rust on iron cookware |

No cookware or crockery condition dataset from used items.

## 12. Watches (non-smart, non-luxury) and eyewear

| Dataset | URL | Licence | Size | Labels | Cond | Phone | Notes |
|---|---|---|---|---|---|---|---|
| SSGD smartphone screen glass defects | https://arxiv.org/pdf/2303.06673 | See paper | 2,504 images | Crack, broken, spot, scratch, light-leakage, blot, broken-membrane | 3 | 1 | Transfers to watch crystal and lens scratches. Phones themselves are out of scope |
| Mobile phone defect segmentation (MSD) | https://cdn.datasetninja.com/mobile-phone-defect-segmentation | See page | 1,200 images (400 each: oil, scratch, stain), 1920x1080 | Segmentation | 3 | 1 | |
| Nyckel "damaged eyeglasses" classifier | https://nyckel.com/pretrained-classifiers/damaged-eyeglasses-identifier | Proprietary | n/a | Damaged vs undamaged | 2 | 4 | Baseline, data not released |
| Roboflow glass defect sets | https://universe.roboflow.com/ardpi/glass-4xl5i | Not verified | Not verified | Damage | 2 | 2 | Industrial glass |
| Watch detection (Roboflow) and Human Wrist Image Dataset | https://universe.roboflow.com/imran-jutt/watch-2d2ud-s9qmt and https://gts.ai/dataset-download/human-wrist-image-dataset/ | Not verified | ~1,014 images (Roboflow watch set, snippet) | Watch/wrist detection | 1 | 4 | Detection only |

No watch-dial wear or frame-damage dataset.

## 13. Collectibles (cards, comics, coins, stamps)

| Dataset | URL | Licence | Size | Labels | Cond | Phone | Notes |
|---|---|---|---|---|---|---|---|
| Card Grader (Roboflow, kvitteringer) | https://universe.roboflow.com/kvitteringer/card-grader-rr2yt | Not verified | Not verified | Edge wear, scratch, corner wear (snippet) | 4 | 3 | Page 403; counts unknown |
| Card Grader (Roboflow, rafets-workspace) | https://universe.roboflow.com/rafets-workspace/card-grader-ogigp | Not verified | Not verified | Same type of damage classes | 4 | 3 | |
| Robotic card imaging study | https://www.researchsquare.com/article/rs-8098898/latest.pdf | Preprint | 6000x4000 px standardised images, controlled light | Centering, corners, edges, surface | 4 | 1 | Dataset release not confirmed |
| Saint-Gaudens coin grading (DLRC) | https://arxiv.org/html/2512.04464v1 | Paper CC BY-NC-SA 4.0 | 1,785 gold coins, obverse+reverse | PCGS/NGC Sheldon grades MS-50 to MS-68, heavy imbalance | 4 | 1 (dealer photos, standard lighting) | Repo link not given in paper; data availability unverified |
| Gupta Coin Grading and Rarity | https://data.mendeley.com/datasets/w36vkn66yw/1 | Mendeley (check) | Not verified | Gupta coins by metal and ruler, grading/rarity | 2 | 2 | Ancient coins |
| Nyckel comic book grade classifier | https://www.nyckel.com/pretrained-classifiers/comic-book-grade/ | Proprietary | n/a | 10 grade classes | 3 | 4 | Baseline only |

Gap: no open PSA/BGS-labelled card set found on Kaggle; stamps and comics have no open sets.

## 14. Home decor, artwork, lamps

| Dataset | URL | Licence | Size | Labels | Cond | Phone | Notes |
|---|---|---|---|---|---|---|---|
| Craquelure detection (Allure of Craquelure) | https://arxiv.org/html/2602.09730v1 | See paper | ~8,100 clean painting patches (NGA, Slovak National Gallery, Wikimedia) plus synthetic cracks | Synthetic crack masks | 3 | 1 | Crack pretraining for paintings; labels are synthetic |
| StructDamage | https://arxiv.org/pdf/2603.10484 | Not verified | Large-scale unified crack/surface defect set | Cracks, surface defects | 2 | 3 | Structural, not decor (unverified) |
| UCL parchment damage | https://discovery.ucl.ac.uk/id/eprint/1469099/ | See record | 2,800 multispectral images | Induced damage types | 1 | 1 | Lab multispectral |
| Generic scratch/chip and wood-finish sets | see Generic section | | | | | | |

No open lamp, frame or home-decor condition set.

## 15. Other second-hand categories with strong condition data

| Dataset | URL | Licence | Size | Labels | Cond | Phone | Notes |
|---|---|---|---|---|---|---|---|
| CarDD (car damage) | https://cardd-ustc.github.io (paper https://arxiv.org/pdf/2211.00945) | Non-commercial research/education only; licence form, Flickr and Shutterstock terms | 4,000 images, 9,000+ instances, 2.2 GB, COCO boxes plus masks | Dent, scratch, crack, glass shatter, tire flat, lamp broken | 5 | 4 (real-world photos) | Best defect transfer for dents, scratches, cracks on painted/metal bodies (scooter, appliance bodies) |
| Roboflow car damage sets | https://universe.roboflow.com/praneeth-qlgmp/car-damage-llypv and https://universe.roboflow.com/ai-proyect/car-damages-kaggle | CC BY 4.0 (snippet) | Not verified | Scratch, dent, corrosion, bumper damage, flat tire | 4 | 4 | Commercially usable alternative to CarDD, check each licence |
| LetGo / eBay second-hand image quality | see Bags | | | | | | |
| Secondhand jewelry resale set | https://arxiv.org/pdf/1907.00661 | Not found | 32,542 samples with images and attributes | Resale price | 1 | 4 | Price, not condition; access unverified |

---

## Generic transferable defect datasets

| Dataset | URL | Licence | Size | What it covers | Transfers to |
|---|---|---|---|---|---|
| MVTec AD | https://www.mvtec.com/company/research/datasets/mvtec-ad | CC BY-NC-SA 4.0 | 5,000+ images, 15 categories (incl. leather, wood, carpet, tile, zipper, metal nut), pixel masks | Scratches, cracks, holes, stains on textures and objects | Furniture, bags, footwear, kitchen. Benchmark use only |
| MVTec AD 2 | https://www.mvtec.com/company/research/datasets/mvtec-ad-2 | CC BY-NC-SA 4.0 | 8,000+ images, 8 scenarios, form-gated download | Varying illumination, transparent objects | Glassware, eyewear, lighting-shift robustness |
| MVTec LOCO AD | https://www.mvtec.com/company/research/datasets/mvtec-loco | CC BY-NC-SA 4.0 | 3,644 images, 5 categories | Logical anomalies (missing or misplaced component) | Completeness checks: LEGO sets, kits, strollers missing parts |
| VisA | https://registry.opendata.aws/visa | CC BY 4.0 | 10,821 images (9,621 normal, 1,200 anomalous), 12 subsets | Complex structures, multiple instances (PCB, capsules, candles, macaroni, fryum, pipe fryum) | General anomaly benchmark; CC BY is the most permissive of the big three |
| Real-IAD | https://realiad4ad.github.io/Real-IAD/ (paper https://arxiv.org/pdf/2403.12580) | CC BY-SA 4.0 on the project page; paper search result says CC BY-NC-SA 4.0. Confirm before use | ~150K images, 30 objects, 5 views per sample; 53 GB (1024px) or 507 GB (raw); automatic Hugging Face approval | Pit, deformation, abrasion, scratch, damage, missing parts, foreign object, contamination | Multi-view condition grading; matches "same item, several photos" setup. Downloadable as a complete package |
| Real-IAD D3 | https://realiad4ad.github.io/Real-IAD_D3 | Research-use (see site) | 20 categories, RGB plus pseudo-3D plus point clouds | Fine defects | Surface relief such as dents (2D+3D) |
| MAD (PAD) | see Toys | CC BY-NC-SA 4.0 | | Pose-agnostic anomalies | Any 3D object photographed from many angles |
| Wood surface defects (Zenodo) | https://zenodo.org/record/4694695 | CC BY 4.0 | 20,276 images / 156.6 GB | Wood | Furniture, bats, instruments |
| Leather defect classification (IEEE DataPort) | https://ieee-dataport.org/documents/leather-defect-detection-and-classification | IEEE DataPort | 3,600 images, 6 classes x 600 (folding marks, grain off, growth marks, loose grains, pinhole, none) | Leather | Bags, footwear, sofas (leather) |
| Roboflow leather sets | https://universe.roboflow.com/shreekhant/defect-detection-leather | CC BY 4.0 (snippet) | Not verified | Colour, cut, fold, glue, poke | Same |
| Fabric Stain / Fabric Defect / FabricSpotDefect | see section 2 and 10 | | | Stains, holes, spots | Ethnic wear, upholstery |
| Roboflow scratch/dent sets | https://universe.roboflow.com/damages/scratch-6nagp | CC BY 4.0 (snippet) | Not verified | Scratch, dent, chip, tear | Wide: furniture, cookware, appliances, bats |
| Roboflow rust/corrosion sets | https://universe.roboflow.com/oumaima-6jfwk/rust-segmentation-rncmf | CC BY 4.0 (snippet) | Not verified | Rust masks | Bicycles, cookware, dumbbells, prams |
| CarDD | see section 15 | | | | Dents, scratches, cracks on painted body |

## Matching the same item across photos (no condition labels)

| Dataset | URL | Licence | Size | Photo style | Use |
|---|---|---|---|---|---|
| Stanford Online Products | https://cvgl.stanford.edu/projects/lifted_struct/ (paper https://arxiv.org/pdf/1511.06452) | Not stated in my sources (research use, check) | 120,053 images, 22,634 items, 12 categories, from eBay | Seller photos, many angles per item | Same-item metric learning with real marketplace photos |
| Products-10K | https://arxiv.org/pdf/2008.10545 | Non-commercial research and education | 10,000 SKUs from JD.com | E-commerce | Fine-grained product retrieval |
| Amazon Berkeley Objects | https://registry.opendata.aws/amazon-berkeley-objects/ | CC BY-NC 4.0 | 147,702 listings, 398,212 catalog images; 8,222 360-degree sequences (586,584 images) | Studio plus turntable | Multi-view of same item; furniture and decor heavy |
| BBBicycles, Longitudinal Shoe Study, MAD, Real-IAD | see above | | | | Matching with damage / wear changes |

---

## Summary ranking: data readiness by category (1-5)

| Rank | Category | Readiness | Reason |
|---|---|---|---|
| 1 | 4 Bicycles | 4 | Two purpose-built sets (DelftBikes part-state labels, BBBicycles damaged re-ID) plus many CC BY rust sets. Caveats: DelftBikes files offline when checked, BBBicycles synthetic and non-commercial |
| 2 | 10 Ethnic wear (via second-hand textiles) | 3.5 | Wargon set is a rare CC BY used-item set with 1-5 condition plus stains/holes. But it is everyday Swedish clothing, and ethnic-wear sets (IndoFashion) have no condition labels |
| 3 | 8 Bags and luggage | 3.5 | One phone-photographed tear/rip set (700 images, CC BY) plus leather and zipper sets. Small |
| 4 | 1 Books | 3 | SHBD matches the use case exactly (6,366 images, 6 defect types) but access and licence are unclear |
| 5 | 5 Toys / LEGO | 3 | MAD covers missing parts, stains, burrs with pose-agnostic design, but 20 LEGO animals only and non-commercial |
| 6 | 2 Furniture | 3 | Large wood/leather/fabric defect sets exist, but all factory imagery |
| 7 | 13 Collectibles | 2.5 | Card and coin grading sets exist, but availability is unverified or small |
| 8 | 9 Footwear | 2 | Longitudinal wear study is good for wear progression, otherwise factory defects |
| 9 | 14 Home decor / art | 2 | Craquelure with synthetic labels only |
| 10 | 11 Kitchen / crockery | 1.5 | Industrial steel and ceramic datasets, tiny |
| 11 | 12 Watches / eyewear | 1.5 | Screen-glass proxies only |
| 12 | 7 Sports equipment | 1 | Detection datasets only |
| 13 | 6 Instruments | 1 | One UV lab set; nothing usable |
| 14 | 3 Kids' gear | 1 | Detection only, and the safety stakes are highest |
| Bonus | 15 Cars/scooters | 4 | CarDD plus CC BY Roboflow sets give the strongest generic dent/scratch/crack supervision |

## Recommended plan
1. Pretrain a defect encoder on commercially clean data: Wargon (Zenodo CC BY), Mendeley bag damage and fabric defect (CC BY), DelftBikes (CC BY-SA), VisA (CC BY), Zenodo wood (CC BY), vetted Roboflow CC BY sets.
2. Use CarDD, MVTec AD / LOCO / AD 2, MAD, BBBicycles, Products-10K and ABO strictly as research benchmarks unless licences are cleared.
3. Build a small seller-photo benchmark (phone images, 3-5 photos per item, defect-labelled) for kids' gear, instruments, sports gear, kitchenware, watches and ethnic wear: no open data exists.
4. Verify before committing: SHBD availability, DelftBikes download restored, Real-IAD licence wording (SA vs NC-SA), and licence and counts on every Roboflow set (pages returned 403 here).
