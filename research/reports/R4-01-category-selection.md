# R4-01: Which category should we master for the prototype?

Date: 7 Oct 2026. Researcher: Claude (web search). Submission: 17 Oct 2026 (10 days).
Problem (locked): in second-hand marketplaces nobody can trust a used item's condition, so buyers stay away, sellers don't list, and disputes are settled by guesswork.
Test: pick a low-margin, hard-to-sell category where manual inspection costs more than the item is worth, so AI condition evidence changes the economics, and the approach can carry to other categories later.

How to read this report
- "(estimate)" means my own reasoning or a rough calculation, not a published figure.
- "(weak source)" means a vendor blog, market-research seller or SEO site. Treat as direction, not fact. Market-research firms in particular disagree wildly (India second-hand apparel: US$3.0B in 2023 per Credence vs US$5.2B in 2025 per Mobility Foresights; the Mobility Foresights numbers are word-for-word identical to a page it sells for Australia, so I distrust them).
- Several things I could not find. They are listed in "Gaps" at the end rather than papered over.

---

## 0. The short answer

| Rank | Category | Why |
|---|---|---|
| 1 | Everyday pre-loved clothing (tops, tees, shirts, jeans, dresses) | Biggest pain, best open data (a 32,000-garment condition dataset under CC-BY), easiest demo, scales across Japan, Korea, SEA, Australia. Main risk: closest to the Meesho teammate's employer. |
| 2 | Books / textbooks | Cleanest "inspection costs more than the item" case, a standard grading scale already exists, zero Meesho overlap, easiest home photo collection. Main risk: low dispute pain and shipping cost can dwarf item price. |
| 3 (close) | Footwear (non-luxury) | Visible wear patterns, good second category to scale into, but thin open data. |

Recommended build: one condition-evidence engine, clothing as the hero demo, books as the "it generalises" proof (or the swap-in if the Meesho conflict cannot be cleared). Details in Section 10.

---

## 1. Pre-loved clothing / everyday fashion

### Market size and growth
- Global: second-hand apparel to reach US$393B by 2030, about 10% of apparel spend, growing 2x faster than apparel retail. US grew 19% in 2025. Source: ThredUp 14th Resale Report, 2 Apr 2026, https://newsroom.thredup.com/news/thredup-14th-resale-report . The same report says "supply has emerged as the new constraint": platforms cannot get enough good listings.
- India: total recommerce about US$5.91B in 2025 rising to US$8.61B by 2029 (11.7% a year), fashion named as a main growth segment (ResearchAndMarkets via FashionUnited, Jul 2025, https://fashionunited.in/news/retail/india-recommerce-market-to-reach-5-91-billion-dollars-by-2025-report/2025070350450 ). Apparel-only: US$3.0B (2023) to US$9.1B (2032), 13% a year (Credence, https://www.credenceresearch.com/report/india-second-hand-apparel-market , weak source). Credence itself lists the barriers as hygiene doubts, "limited quality checks and inconsistent grading systems", and unregulated street markets.
- Japan: reuse market 2024 about 3.3 trillion yen (Reuse Economic Journal) to 3.5 trillion yen (Ministry of Environment), growing 15 years in a row (search summary of env.go.jp and Statista; the ministry PDF https://www.env.go.jp/content/000321557.pdf would not parse for me). Clothing and accessories was the biggest category at about 459 billion yen in 2021 (Statista summary, older data).
- Korea: online second-hand market about 35 trillion won (2024) heading to 43 trillion won (2025), per Korea Internet and Security Agency as reported at https://asianews.network/?p=230846 and https://www.seoulz.com/korea-resale-economy-2026/amp/ . Clothing and accessories was the most posted category on Karrot (Danggeun) at 2.8 million posts a month in Sept 2020 (https://v.daum.net/v/20211013181452804 ; old data).
- SEA: Carousell survey says 72% of users across its eight markets have bought second-hand; in the Philippines 58% are comfortable buying and 75% selling second-hand apparel (https://www.bworldonline.com/?p=415047 ).
- Australia: recommerce about US$4.68B in 2025, +11.3% (Statista summary, https://www.statista.com/topics/10774/resale-market-in-australia ); 86% of Australians shop second-hand (IADS, https://www.iads.org/articles-reports/the-rise-of-second-hand-shopping-in-australia-a-cultural-and-economic-shift ).
- Platform scale: Vinted 2025 revenue about EUR 1.1B, gross sales value EUR 10.8B, +47% (FashionUnited, 9 Apr 2026, https://fashionunited.uk/news/business/vinted-reaches-1-1-billion-euros-in-revenue-for-2025-accepting-a-strategic-drop-in-profits/2026040987347 ).

### Unsold supply, items kept or thrown
- ThredUp listed only 59% of the items sellers sent in 2020, so 41% were rejected as not worth handling (S-1, https://www.sec.gov/Archives/edgar/data/1484778/000162828021003857/thredups-1.htm ). Third-party blogs say 40-60% rejection on Clean Out kits (weak source).
- Japan: 770,000 tonnes of clothes bought and 480,000 tonnes thrown out by households in 2024; government target is a 25% cut by fiscal 2030 but progress is under 2% (Ministry of Environment, via Jiji/Nippon.com, 4 Jan 2026: https://www.nippon.com/en/news/yjj2026010400187 , page later returned 404 for me; figures came via search summary).
- India: an OLX/IMRB survey found the average household stocks 12 clothing items it no longer uses and 90% of households stock unused goods; "I'll use it one day" is the top reason (OLX CRUST 2015-16, https://www.digit.in/news/general/rs-78300-crore-worth-of-used-goods-stocked-away-in-indian-homes-olx-31306.html ). Old (about 10 years) but it is the only India-wide number I found. 82% said trust in the seller was the reason online marketplaces felt better, because you could meet the seller and test the item.
- Vinted: occasional sellers sell about 15-30% of their listings; top sellers 50-60% (https://fripio.app/blog/taux-rotation-sell-through-vinted-2026 , weak source, a seller-tools blog).

### Returns and disputes
- New online fashion in India: return/RTO rates 25-40%, main reason size mismatch and colour variance (https://base.com/en-IN/blog/?p=20558 , vendor blog, weak source). This is for new items, mostly cash-on-delivery.
- Second-hand specific: Poshmark and Depop treat "not as described", undisclosed stains and holes as valid refund reasons; Poshmark gives 3 business days to report (https://www.supermoney.com/poshmark-return-policy , https://closo.co/blogs/platform-specific-guides/can-you-do-returns-on-depop ). I found no published dispute-rate percentage by reason for second-hand apparel.
- Vinted became the 4th most complained-about company on UK site Resolver by end 2025; buyers have only 2 days to report and usually pay return shipping (https://news.resolver.co.uk/?p=8400 ). Fraud is now two-way: sellers use AI-generated photos; buyers add AI-faked cracks and stains to photos to claim refunds (https://www.nssmag.com/en/fashion/45705/artificial-intelligence-ai-vinted-scams-fake-listings ). This matters for our design: evidence must be tamper-resistant.
- Mercari Japan: "trouble encounter rate" 0.4% in H1 2025, down from 0.56% in H2 2023 (Mercari transparency report, Impress Watch, 1 Sep 2025, https://www.watch.impress.co.jp/docs/news/2043710.html ). Japan is a high-trust market; this is the benchmark for what "good" looks like. Mercari staff advice pages say condition disputes come from sellers and buyers having different ideas of "beautiful condition".

### Existing players and what they do for condition
- ThredUp (US): central hubs handle 70-100k items a day; in-house computer vision reads brand, size, care label in seconds and sets price; humans still do final quality check (https://ww.getcoai.com/news/thredup-uses-ai-to-sort-80k-daily-items-while-cutting-teams-to-4 , weak source, and Modern Retail 21 Mar 2025). Fulfilment about 23% of revenue (weak source).
- Vinted (EU): buyer protection plus photo rules, no hub inspection; complaint handling is by human review (company says it has tools to spot AI-faked images, unverified).
- Mercari JP: OpenAI-powered listing assistant that writes title, description and suggests price from a photo (https://openai.com/index/mercari ); image search for price check (https://www.valueaddedresource.net/mercari-japan-launches-price-search/ ). Condition is chosen by the seller from a fixed 6-step list; the AI does not grade damage (as far as public sources show). Mercari runs on Google Cloud (https://cloud.google.com/customers/mercari-data ), which is relevant for our hackathon.
- 2nd Street (Geo Holdings, Japan): stores buy and inspect by trained staff; certification system for about 10,000 buyers; I found no public AI condition tool.
- Carousell (SEA): AI listing flow cut median listing time under 2 minutes and lifted listings 20% (marlvel.ai summary, weak source); also Google Cloud customer (https://cloud.google.com/customers/carousell ). Authentication AI is for luxury only.
- Karrot/Danggeun (KR): neighbourhood meetup, you inspect in person; Bunjang adds paid "Bunjang Care" inspection for luxury and sneakers: 30-40 check points per item, 14% rejection, fee paid by buyer (https://designcompass.org/2023/01/05/bungae-care/ ).
- India: Kiabza, Ziniosa, Zapyle, Saritoria, Relove (resale-as-a-service for brands, items verified before listing), Myntra pilots, Meesho named as a C2C-expansion player in the ResearchAndMarkets India report (see conflict section), OLX, Sulekha classifieds. Almost all use manual QC at a hub; I found no India player using AI for condition grading.
- AI grading specialists: Fleek Sort, a vision-language model that grades garments from photos or video, in use in sorting hubs in Pakistan, India and Dubai (https://www.esgtoday.com/fleek-raises-25-million-to-help-scale-the-second-hand-fashion-market-with-ai/ ). It is for wholesale sorting (B2B), not for a buyer-facing C2C trust card. GradeThread (Claude Vision, five-factor garment score) is a small public project (https://peerlist.io/gradethread/project/gradethread--the-standard-for-grading ). Sweden's RISE/Wargön built an open AI database for sorting because manual sorting and valuation is "physically demanding and expensive" (https://scandinavianmind.com/world-unique-ai-database-revolutionises-second-hand-sorting-heres-how/ ).

### Manual inspection cost vs item price
- No platform publishes cost per item. ThredUp S-1 and earnings calls do not give it (checked S-1 and Q4 2023 call).
- Estimate: a trained grader needs 1-2 minutes to inspect, photograph and describe a garment. At US$15-20 an hour that is US$0.25-0.70 for inspection alone, and US$3-6 per item for the full hub chain (receive, sort, steam, photograph, pack). In India, inspection only is perhaps Rs 5-15 and the full chain Rs 40-100 (all estimate). Typical India everyday-clothing resale prices are Rs 150-500 (estimate; a Rs 99-299 price point is common on thrift Instagram pages). So the hub chain eats 15-40% of price, which is why 41% of incoming items are rejected: below a price floor the item loses money to handle.
- Individual resellers report 45-90 minutes of total labour per item including photos, answering questions and posting (weak source, https://closo.co/blogs/platform-specific-guides/poshmark-resellers ), so for a casual seller the effort, not the money, kills the listing. This is the "sellers don't bother" half of our problem.

### How hard is condition from photos?
- Defects that matter: stains, holes/tears, pilling, fading, stretched neckline or hem, loose seams, broken zip or missing buttons, colour mismatch to listing. Mostly visible at normal phone resolution with a flat-lay, a close-up of any flaw, and the care label.
- Not visible: smell, hygiene, true fabric feel, shrinkage, true fit. Sizing needs a tape-measure photo or measurements; AI can read a ruler laid next to the garment (feasible).
- Evidence this works: the RISE dataset labels condition 1-5, pilling 1-5, and stains, holes, smell as none/minor/major from three photos per item (front, back, label). Smell is labelled by experts but cannot be seen, so we skip it.

### Can a non-technical person collect test photos at home?
- Yes, easily. Every teammate has 20+ garments. A flat-lay on a bed or floor, plus close-ups, takes about 1 minute an item. Stains and holes can be photographed for real (everyone has an old t-shirt). 100-150 items in a weekend is realistic.

### Open datasets (licences)
- Clothing Dataset for Second-Hand Fashion (RISE / Wargön / Myrorna): 31,997 garments, 3 photos each (front, back, brand label), condition, pilling, stains, holes, smell, damage location, price, material. Licence CC-BY 4.0. https://zenodo.org/records/12518734 . This is the single most useful find: real second-hand items with condition labels, usable commercially with credit. Caveat: Swedish charity-shop stock (Western clothes, plain background).
- Fashionpedia: 27 apparel categories, 294 attributes, segmentation masks; CC BY 4.0 per Hugging Face dataset card (https://huggingface.co/datasets/detection-datasets/fashionpedia ). New-looking clothing, not defects; I could not confirm per-image licences on the GitHub page.
- DeepFashion / DeepFashion2: non-commercial research only, no reselling, no sharing (https://mmlab.ie.cuhk.edu.hk/projects/DeepFashion/DeepFashionAgreement.pdf ). Do not use for a demo we might later commercialise; fine for a quick internal test only if the team accepts the terms.
- Fabric Stain Dataset (University of Moratuwa): 466 images, 870 stain boxes, CC0 (https://datasetninja.com/fabric-stain-dataset ). Roboflow Universe garment/fabric defect sets (holes, stains, yarn defects), CC BY 4.0 on several (https://universe.roboflow.com/riyans-workspace-tpzu7/garments-defect-detection ). These are factory fabric on plain backgrounds, so only a rough guide for worn clothes.

### Meesho conflict note
- Meesho is fashion-heavy: apparel and fashion about 50% of GMV, rank 1 in fashion (apparel, footwear, kidswear) with 21-23% share per prospectus-cited market data (search summary; Q1 FY27 NMV up 34%, https://www.kotakneo.com/news/stocks/meesho-q1-fy27-results-nmv-up-34-percent/ ). Meesho is listed as a "C2C expansion" player in India fashion recommerce in the July 2025 ResearchAndMarkets report (above). I could not confirm any live Meesho resale product.
- Risk: clothing is the category with the most overlap with the employer's business and could look like competing work or use of insider insight. This is a company-policy question, not a research one: the teammate should check the conflict-of-interest and outside-work/IP policy and, to be safe, use only public data and personal time, and avoid any Meesho data, return reasons or seller learnings. I have not looked at any internal Meesho material for this report.

---

## 2. Ethnic wear (sarees, lehengas, kurtas)

### Market
- India: "pre-owned ethnic and wedding wear" claimed to lead India's resale fashion with about 38% share in 2026 (https://www.thereportcubes.com/public/report-store/resale-fashion-market-india , weak source). Credence's India apparel report treats ethnic wear only as "other categories". Treat as unproven.
- Outside India: only a diaspora niche (UK, US, Australia, UAE). Example: Saari Collective writes about pre-loved South Asian clothing "eyeing Australia" (https://www.saaricollective.com.au/business/blog/pre-loved-south-asian-clothing-market-has-eyes-on-australia/ ). Not a Japan, Korea or SEA market.

### Unsold supply, returns, disputes
- Wedding and occasion outfits are worn once or twice, so supply exists. I found no unsold-share or dispute-rate number specific to ethnic wear. India new-fashion returns of 25-40% apply to fashion broadly, with ethnic wear named as high-return because fit cannot be checked before buying (weak source).

### Players and condition handling
- Kiabza, Ziniosa, Zapyle, Saritoria (three-step authentication), Loved Lehenga, Confidential Couture (luxury). Manual multi-point checks for stitching, fabric, finishing, labels; every item vetted before listing (https://www.theestablished.com/style/fashion/5-online-platforms-to-buy-or-rent-pre-loved-indian-designer-wear ). No AI found.

### Manual cost vs price
- High-value items (Rs 3,000 to 50,000 resale price, estimate), so Rs 200-500 of inspection and cleaning is under 10% of price. This is the opposite of our thesis: manual inspection is affordable here, so AI saves less.

### Photo difficulty
- Hard. Zari tarnish, embroidery snags, sequin loss, lining wear, fall/pico stitching, alterations in the seams, dye bleed and the drape of a saree do not show well in one flat photo; colour on phone screens varies with lighting and sellers' filters. Weight, smell and dry-clean history cannot be seen.

### Home collection
- Medium to poor. A team may have a few sarees but not 100 varied pieces with real defects.

### Datasets
- I found no open ethnic-wear defect dataset. Fashionpedia and DeepFashion2 are Western-heavy.

### Meesho conflict
- Highest of all. Sarees and kurtis are Meesho's core volume categories (https://www.shiprocket.in/blog/most-selling-products-on-meesho/ ).

---

## 3. Footwear / sneakers (non-luxury)

### Market
- India sneaker market US$3.88B in FY24 heading to nearly US$6B by FY32; used-footwear sales growing about 15% a year; sneaker flipping boom collapsed in 2023-24 (Inc42, https://inc42.com/features/how-sneaker-resellers-d2c-brands-are-cashing-in-on-indias-6-bn-boom/ ; Onmanorama, https://www.onmanorama.com/lifestyle/beauty-and-fashion/2023/12/17/used-footwear-business-booming-india-youngsters-top-brands.html ). About 84,000 shipments of imported used footwear a year enter India, repaired by distributors before sale (same source).
- Japan: SNKRDUNK (authenticates and lists sneakers and streetwear with multi-inspector checks and defect databases: https://snkrdunk.com/en/magazine/2024/06/11/how-snkrdunk-authenticates-streetwear-products/ ). Korea: Bunjang Care for sneakers (14% rejection, 30-40 checks). No clean category size for Japan/SEA/Australia footwear.

### Unsold supply, returns, disputes
- New footwear in India: 20-30% COD returns, reason sizing inconsistency (https://base.com/en-IN/blog/?p=20558 , weak source). Worn shoes: hygiene and smell are the buyer worry (Credence-type reports; no number).
- Bunjang inspection rejects 14% of luxury and sneaker items for condition or fakes.

### Players and AI
- StockX, GOAT, SNKRDUNK, eBay Authenticity Guarantee: these are authentication for high-value hype pairs, not wear grading for ordinary shoes. StockX fees about 9.5% plus 3% processing; eBay authenticates sneakers over US$100. Apps such as Shoe Pricer AI claim condition scoring from wear, creases and sole fade (https://appshunter.io/ios/app/shoe-pricer-ai-sneaker-value/id6758336726 , weak source); SneakPeek uses AI to flag defects (https://www.cbinsights.com/company/sneakpeek ).

### Manual cost vs price
- Authentication is built into a 12.5-15% platform fee, i.e. paid for by high prices (US$200 pair: about US$25). For a Rs 500-1,500 everyday pair, a 15% fee is Rs 75-225; manual inspection plus cleaning is a large share of price (estimate).

### Photo difficulty
- Moderate. Visible: outsole wear, heel drag, midsole crease and yellowing, upper scuffs and cracks, insole wear, sole separation (partly). Needs 5-6 photos (side, top, outsole, heel, insole, toe box). Not visible: smell, cushion collapse, true size.

### Home collection
- Good: everyone has 3-6 pairs with real wear; 100 shoes requires borrowing from family and friends.

### Datasets
- No open dataset of used-shoe condition found. UT Zappos50K is product images (academic, non-commercial). Roboflow has a few small shoe sets of unclear quality. We would build our own.

### Meesho conflict
- Medium. Footwear sits in Meesho's fashion GMV but is not its identity category.

---

## 4. Books / textbooks

### Market
- India second-hand books: US$781M (2023) to US$1.41B (2032), 6.8% a year; academic about 30%; buyers search Rs 150-500 books (Credence, https://www.credenceresearch.com/report/india-second-hand-books-market , weak source). Players: Amazon India used-books store (100,000+ offers at launch, 2016, https://www.business-standard.com/article/companies/amazon-launches-used-books-in-india-to-tap-smaller-town-readers-116081001444_1.html ), BookChor, OLX, local textbook markets.
- Japan: Book-Off sells many books at 100-300 yen after checking each; Mercari is a big book channel (shipping by Nekopos costs 210 yen, so shipping is more than the book's price for cheap titles; https://tokyointernationalmeetup.com/mercari-japan-seller-fees-2026/ ). Korea: Aladin used books (not researched in depth). SEA and Australia: textbook swaps on Carousell and Facebook Marketplace (no figures found).

### Unsold supply
- OLX CRUST: the average Indian household stocks 11 books it no longer uses (2015-16). School book sets are resold by seasonal informal networks.

### Returns and disputes
- New books in India return only 3-6% (wrong item delivered), the lowest of any category (https://base.com/en-IN/blog/?p=20558 , weak source). Used books: condition disputes are real but I found no rate. Amazon-seller forums say grade disagreement is the main dispute and buyers usually win (weak source, https://amazonsellerslawyer.com/?p=12661 ). Counter-view: because books are cheap, buyers often just accept a worse book, so disputes are under-reported and the pain shows up as buyer reluctance, not refund claims.

### Players and AI
- Standard grade scale already exists (Like New, Very Good, Good, Acceptable) with written rules for creasing, notes, highlighting, spine (Amazon). Sellers self-declare. No AI condition tool on a major marketplace found. Research and hobby tools exist: Nyckel "damaged textbooks" classifier (https://www.nyckel.com/pretrained-classifiers/damaged-textbooks-identifier ), and an academic detector for recycled books reaching 46.7 mAP on six defect types (https://arxiv.org/abs/2409.04958 ).

### Manual cost vs price
- Strongest fit to the thesis. A used book resells for Rs 100-300 or 100-300 yen. Even 1 minute of staff time plus cleaning is a large share; this is why Book-Off built an industrial model and why individuals do not list ("not worth the effort"). (estimate for per-item cost; price figures partly from weak sources.) The real constraint is shipping: it can equal the item price, so the AI value is in listing and trust, not in logistics.

### Photo difficulty
- Moderate to good for covers, spine, edges and corners (creases, tears, sun-fade, water stains, sticker residue, library stamps). Weak for the inside: highlighting, writing, missing pages and loose binding need 3-4 page photos; smell and mould are not visible. An ISBN barcode photo identifies the exact edition and gives a price reference, which is a big shortcut clothing does not have.

### Home collection
- Excellent. Every teammate has 10-50 books; 150 books is easy; defects (dog-ears, highlighting) occur naturally and can be added honestly (we photograph real states, we do not fake).

### Datasets
- Roboflow "book_damage_detection", CC BY 4.0 (https://universe.roboflow.com/jonathan-hart/book_damage_detection-sqrhi ); SHBD (6,366 images, six defect types: missing corners/pages, stains, creases, repairs, stamps, ink); I could not confirm whether SHBD is publicly downloadable or its licence, so do not count on it. Open Library covers/metadata are open. Datasets are small, so we would rely on a strong general vision model with the grade rubric as the instructions, plus our own photographed set.

### Meesho conflict
- Very low. Books are not a notable Meesho category.

---

## 5. Kids' items (toys, strollers, school uniforms, baby clothes)

### Market
- Korea: baby/child products were the third most posted category on Karrot at 1.41 million posts a month (Sept 2020), after clothing 2.8M and digital/home appliances 1.52M (https://v.daum.net/v/20211013181452804 ). Global second-hand baby gear US$4.8B in 2025 to US$8.9B in 2034 (marketintelo, weak source). India: SoldResold (Mumbai, kids items), Zefo (earlier), kids rental/resale sites; school-uniform exchange is mostly informal or charity.

### Unsold supply
- Strong structural supply: children outgrow items fast, so condition is often near-new and supply is high (reasoning; the "worn only a few times" claim has no source I could verify).

### Returns and disputes
- Safety, not looks, is the pain: used strollers, car seats and cribs can be recalled or expired with no visible sign. A Choice Australia investigation found recalled children's products still on online marketplaces (https://www.choice.com.au/babies-and-kids/children-and-safety/avoiding-common-dangers/articles/recalled-childrens-products-are-being-sold-on-online-marketplaces ). GoodBuy Gear (US) rejects under 5% of general products but 12% of car seats and does about 20 checks per stroller and about 30 per car seat manually (https://www.modernretail.co/operations/how-resale-marketplaces-safety-check-hard-goods-like-car-seats-strollers/ ). eBay blocks used car seats and relies on AI filters plus recall databases.

### Photo difficulty
- Mixed. Baby clothes: like clothing. Toys: missing pieces and battery corrosion are hard to see. Strollers: frame cracks and brake function are not reliably visible; recall status needs model number lookup, not vision.

### Home collection
- Poor for our team unless teammates have young kids. Likely under 30 items.

### Datasets
- None found specific to kids' items condition.

### Meesho conflict
- Medium (kidswear is inside Meesho fashion).

---

## 6. Furniture / home decor

### Market
- Korea: furniture over 880,000 posts a month on Karrot (Sept 2020). India: Zefo (certified second-hand furniture and appliances at 20-75% of retail, physical QC and repair, buyback up to 70%; Pepperfry exchange; Furlenco rental) (https://inc42.com/buzz/ecommerce-used-goods-zefo ). US Kaiyo handles about 6,000 items (2022). Japan: 2nd Street and Mercari large-item shipping (no figures found).

### Returns and disputes
- India new home furnishings 15-20% returns, mainly transit damage (base.com, weak source). Second-hand furniture disputes often involve damage in transit and buyers who inspected by video call still complaining after purchase (OLX dishwasher consumer-case write-up, 10 Jul 2026, https://sudhirrao.com/insights/olx-buyer-complaints-legal-risks ).

### Players and cost
- Zefo physically inspects, refurbishes and warrants items. Kaiyo inspects every piece for structure and cleanliness. Item prices are high (Rs 5,000-30,000, estimate) so manual inspection is affordable; logistics and storage dominate cost. AI saves little.

### Photo difficulty
- Moderate for scratches, stains, water rings, peeling veneer, fabric wear; poor for wobble, structural cracks, wood rot, mattress hygiene, true dimensions and colour.

### Home collection
- Poor: bulky; teams have few pieces. Small decor items are easy but low interest.

### Datasets
- Little open furniture-condition data found.

### Meesho conflict
- Low to medium (home and kitchen is about 8-10% of Meesho GMV).

---

## 7. Small kitchen and home appliances (low-value, non-electronic or simple)

### Market and problem
- India second-hand appliances are served by OLX, Zefo and kabadiwalas; people note there is no proper channel for certified used white goods (https://www.startinup.up.gov.in/crm/Welcome/startup_user_details/Mzk0MTU= , weak source). OLX CRUST: average household has 7 unused kitchen appliances and 14 kitchen utensils (2015-16). Used-dishwasher dispute case shows "works or not" disagreements (link above).

### AI feasibility
- Poor. The question buyers care about is "does it work and is it safe", which a photo cannot show. Photos only show cosmetic wear (rust, cracks, stains, missing parts). Electrical items add liability. Non-electronic items (steel utensils, pressure cookers' gaskets, glass) are too low value and too uniform.

### Home collection
- Easy for common items, but tests would be cosmetic only, so the demo does not show our core value.

### Datasets
- None found.

### Meesho conflict
- Medium (home and kitchen category).

---

## 8. Added candidates

I looked for evidence supporting extra categories. None came out clearly better, so I did not score new ones separately. Two refinements follow from the evidence:
- Narrow clothing to everyday basics: tops, tees, shirts, jeans, dresses (not kurtis or sarees). This keeps the Meesho overlap lower than ethnic wear and matches Japan, Korea, SEA and Australia demand, and it matches the Swedish dataset.
- Consider bags and non-luxury accessories as a later step: shared "surface wear" detection with clothing and footwear. No category evidence gathered; just a scale-to idea.

---

## 9. Scoring table (1-5, 5 is best for us; for Meesho conflict risk 5 means lowest risk)

| Criterion | 1 Everyday clothing | 2 Ethnic wear | 3 Footwear | 4 Books | 5 Kids' items | 6 Furniture/decor | 7 Small appliances |
|---|---|---|---|---|---|---|---|
| Pain size | 5: biggest category in every market (ThredUp US$393B by 2030; clothing top category on Karrot and Mercari) | 4: large in India only; unproven numbers | 3: smaller pool, hygiene worry | 3: established but low dispute rate (new books 3-6% returns) | 4: high supply, safety worry | 4: big ticket pain, logistics-heavy | 3: "does it work" pain, small value |
| Economics gap AI closes | 4: 41% of items rejected as not worth handling; casual sellers face 45-90 min per item | 2: items are pricey, manual check is affordable | 3: platform fees 12-15% already fund inspection on hype pairs; cheap pairs uncovered | 4: item is Rs 100-300, any hand check is a large share (but shipping can equal price) | 3: manual checks justified by safety, not cost | 2: price high, logistics dominates | 3: hand testing needed anyway |
| AI feasibility from photos in 10 days | 4: stains, holes, pilling, fading are visible; measurements via ruler; no smell | 2: zari, embroidery, drape, colour not reliable in photos | 3: sole wear, creases, scuffs visible; smell and cushioning not | 4: cover, spine, corners visible; ISBN gives identity; inside pages need extra photos | 3: clothes fine, strollers and toys not | 3: scratches visible, structure not | 1: function cannot be seen |
| Data availability | 5: RISE 31,997 garments CC-BY with condition labels, plus Fashionpedia CC BY | 2: no open ethnic-wear defect data | 2: nothing for used shoes | 3: Roboflow book damage CC BY 4.0; SHBD licence unclear | 2: none | 1: none | 1: none |
| Demo-ability with home items | 5: everyone owns 20+ garments with real wear | 3: few pieces, little variety | 4: 3-6 pairs each with real wear | 5: easy to get 150 books with natural defects | 2: few teammates have kids' items | 2: bulky, few items | 4: easy, but cosmetic only |
| Competitive white space | 3: ThredUp, Fleek, Mercari, Vinted have AI around listing or sorting, but nobody offers buyer-facing, tamper-resistant condition evidence for C2C disputes | 4: manual hubs only, no AI found | 3: authentication apps cover hype pairs, not everyday wear | 4: no AI grader on major marketplaces | 3: safety checks are manual and recall lookups | 3: Zefo and Kaiyo manual | 3: little AI, little demand |
| JAPAC scalability | 5: top category at Mercari, 2nd Street, Karrot, Carousell, Vinted-style Australia | 2: India and diaspora only | 4: sneaker culture in Japan, Korea (SNKRDUNK, Bunjang) | 4: Book-Off, Aladin, textbooks in India, Australia | 4: strong in Korea, Japan | 4: Japan, Korea large | 3: varies by country |
| Meesho conflict risk (5 = low risk) | 2: fashion is Meesho's core, and Meesho is named a recommerce entrant in one report | 1: sarees and kurtis are Meesho's core volume | 3: footwear is inside Meesho fashion | 5: books not a Meesho category | 3: kidswear inside Meesho fashion | 4: home category small | 3: home and kitchen about 8-10% of GMV |
| Total (of 40) | 33 | 20 | 25 | 32 | 24 | 23 | 21 |

(Scores are my judgement from the evidence above; the reasons are in each cell. Ties between 1 and 4 would break differently depending on how the Meesho conflict is judged.)

---

## 10. Recommendation

Top 2: everyday pre-loved clothing, then books.

Why clothing is first
- Largest pain and largest JAPAC footprint of any candidate, so the "scales across categories and countries" story is easiest to tell. It is also the category where marketplaces most openly admit that supply, not demand, is the limit (ThredUp 2026 report).
- There is real, open, legally usable data: the 31,997-garment Swedish second-hand dataset (CC-BY 4.0) with condition, pilling, stains and holes labelled. Nothing comparable exists for any other candidate. That is what makes a 10-day build credible.
- Home demo is trivial and honest: real stains and holes from our own wardrobes.
- Rival work exists but sits in different places (Fleek for wholesale sorting, Mercari and ThredUp for listing and pricing). A buyer-and-seller-facing "condition evidence card" that holds up in a dispute, with tamper checks given the new AI-faked-defect fraud on Vinted, is still open.

Why books is second
- Best match to the thesis: very cheap items where any manual look costs a large share of price; written grading rubric already exists, so AI can be scored against a known standard; ISBN gives identity and price for free.
- No Meesho overlap, so it can be the main demo if the employer cannot be squared away.
- Best collection story: 150 books in an afternoon.

Why not the rest
- Ethnic wear: manual inspection is affordable at those prices, photos cannot show the defects that matter, no open data, highest conflict.
- Footwear: a good second category to scale into later (same "surface wear" skills) but thin data; keep as the "next category" slide.
- Kids' items, furniture, appliances: safety, function and logistics are the real problems, which photos cannot solve.

Suggested plan (for the team to decide)
1. Build one category-agnostic condition engine (photos in, graded evidence card out: grade, defects with locations, confidence, photo-quality warnings, tamper checks).
2. Hero demo: everyday clothing. Second demo: books, to show it generalises and to show a category with zero employer overlap.
3. Before touching clothing, the Meesho teammate checks employer policy and keeps all inputs public. If not cleared, flip the order: books as hero, clothing as the "scales to" example using only the open Swedish data.

### Biggest risk of each
- Clothing: the Meesho conflict (policy, perception) and the fact that fit, smell and feel cannot be judged from photos, so buyers still return for size.
- Books: low dispute pain and low value mean judges may ask "who really suffers?", and shipping cost can exceed item price, so the economic story must be about listing effort and trust, not logistics.

---

## Gaps (could not find, so not claimed)
- Published manual-inspection cost per item for any resale platform (all per-item cost figures above are my estimates).
- Dispute rates by reason for second-hand apparel, books or footwear in India.
- Category breakdown of Japan's reuse market for 2024 (the ministry PDF would not parse; 2021 figures from a Statista summary are used).
- Any live Meesho resale product; the only link is one market report's mention.
- Licence and download status of the SHBD book-defect dataset; per-image licences in Fashionpedia.
- Whether Mercari, Karrot or Bunjang use AI to grade condition (only listing and fraud AI is documented).

## Main sources (all accessed 7 Oct 2026)
- ThredUp 14th Resale Report: https://newsroom.thredup.com/news/thredup-14th-resale-report
- ThredUp S-1 (2021): https://www.sec.gov/Archives/edgar/data/1484778/000162828021003857/thredups-1.htm
- RISE second-hand clothing dataset: https://zenodo.org/records/12518734
- Fleek: https://www.esgtoday.com/fleek-raises-25-million-to-help-scale-the-second-hand-fashion-market-with-ai/
- India recommerce: https://fashionunited.in/news/retail/india-recommerce-market-to-reach-5-91-billion-dollars-by-2025-report/2025070350450
- Credence India apparel: https://www.credenceresearch.com/report/india-second-hand-apparel-market
- OLX CRUST: https://www.digit.in/news/general/rs-78300-crore-worth-of-used-goods-stocked-away-in-indian-homes-olx-31306.html
- Return rates India (vendor): https://base.com/en-IN/blog/?p=20558
- Vinted 2025 results: https://fashionunited.uk/news/business/vinted-reaches-1-1-billion-euros-in-revenue-for-2025-accepting-a-strategic-drop-in-profits/2026040987347
- Vinted AI-fraud: https://www.nssmag.com/en/fashion/45705/artificial-intelligence-ai-vinted-scams-fake-listings
- Mercari AI: https://openai.com/index/mercari ; Mercari on Google Cloud: https://cloud.google.com/customers/mercari-data
- Mercari trouble rate: https://www.watch.impress.co.jp/docs/news/2043710.html
- Korea market: https://www.seoulz.com/korea-resale-economy-2026/amp/ ; categories: https://v.daum.net/v/20211013181452804
- Bunjang Care: https://designcompass.org/2023/01/05/bungae-care/
- Carousell on Google Cloud: https://cloud.google.com/customers/carousell
- Japan clothing waste: https://www.nippon.com/en/news/yjj2026010400187
- GoodBuy Gear and Kaiyo: https://www.modernretail.co/operations/how-resale-marketplaces-safety-check-hard-goods-like-car-seats-strollers/
- Zefo: https://inc42.com/buzz/ecommerce-used-goods-zefo
- Book datasets: https://universe.roboflow.com/jonathan-hart/book_damage_detection-sqrhi ; https://arxiv.org/abs/2409.04958
- Fabric stain dataset (CC0): https://datasetninja.com/fabric-stain-dataset
- DeepFashion licence: https://mmlab.ie.cuhk.edu.hk/projects/DeepFashion/DeepFashionAgreement.pdf
- Meesho Q1 FY27: https://www.kotakneo.com/news/stocks/meesho-q1-fy27-results-nmv-up-34-percent/
