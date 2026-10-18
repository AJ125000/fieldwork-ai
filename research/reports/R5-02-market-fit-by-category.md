# R5-02 Market fit by category: which second-hand category should the AI trust layer master?

Prepared 7 Oct 2026. India first, then Japan, Korea, SEA, Australia.

## How to read this report (evidence quality, please read first)

- Web search returned mostly secondary sources (market-research aggregators, press, blogs). Hard category-level listing volumes for OLX, Quikr, Facebook Marketplace, Karrot and Bunjang are NOT public. I did not find them and have not invented them.
- Anything marked **(EST)** is my estimate, built from typical Indian retail price points and the resale ranges in cited sources. Treat it as a hypothesis to verify with 10 minutes of OLX/Cashify/Decathlon browsing, not as a finding.
- Anything marked **(UNVERIFIED)** came only from a search snippet; the page itself could not be opened.
- Market-research firm sizes (IMARC, Ken Research, Mordor, etc.) disagree with each other by 2-4x for the same category. Use them for direction only.
- Scores in the table: 1-5, higher is better for us. For "red flags", 5 = few red flags, 1 = serious ones.

## Executive answer

Recommended master category: **bicycles, with kids' cycles and scooters as the wedge** (adult geared bikes, kids' cycles, scooters). Fallback: **kids' gear with a hard exclusion list** (no car seats, cribs, mattresses or helmets). Then sports and fitness equipment, furniture, toys/LEGO-type sets.

Why bicycles win: new bikes are expensive, used ones sell at roughly half price, "will the brakes, drivetrain and frame be okay?" is the real fear, a platform cannot afford a mechanic per Rs 6,000 bike, and the failure points (rust, frame cracks, tyre and chain wear, frame size, component brand) are visible in guided photos. Households have them, so collecting 40-60 is realistic.

Why books lose despite strong demand: condition is not the barrier, and the items are too cheap to carry a dispute process.

## Cross-market context (applies to every category)

**India**
- OLX's 2016 Crust survey (IMRB, 16 cities) estimated Rs 78,300 crore of unused goods sitting in households: 90% of households stock unused goods, 49% sell. Average household holds 14 kitchen utensils, 12 clothing items, 11 books, 3 watches. Online resale fetched 25% more than offline. Source: https://www.sakshipost.com/indians-stock-rs-78300-cr-worth-unused-goods-olx-crust (survey dated Aug 2016, old). Useful for "supply exists at home", but dated.
- OLX India refocused in May 2024 on real estate, jobs, consumer durables, smartphones, cars and bikes; these are more than 80% of its 3 million+ monthly listings. So general C2C goods are a minor share of OLX India listings. Source: https://mobilityoutlook.com/news/olx-announces-strategic-transformation-to-focus-on-expanding-categories-partnerships (8 May 2024). Implication: the gap for a general-goods trust layer in India is open, but it also means demand is thinner than in Japan or Korea.
- Indian buyers' barriers to second-hand clothing are hygiene and condition, and they want condition verified before buying. Source: WRI practice note, May 2021, https://www.wri.org/research/secondhand-shopping-understanding-consumer-behavior-toward-pre-owned-clothing-india (clothing only, but the trust pattern likely transfers).
- Platforms with manual QC exist but only where value justifies it: Zefo (furniture and appliances, refurbish plus buyback up to 70% of price) was acquired by Quikr in April 2019 for a reported Rs 200 crore, so it is no longer independent. Sources: https://inc42.com/buzz/ecommerce-used-goods-zefo, search summary on acquisition.

**Japan**
- Reuse market about 3.1 trillion yen in 2023, about 3.3 trillion yen in 2024; target about 4 trillion yen by 2030. 71.2% of respondents in a government survey had not bought any second-hand item in the past year. Roadmap names trust and quality concerns as the barrier and introduces first "Good Practice Guidelines" for reuse businesses. Sources: https://zenbird.media/japan-unveils-roadmap-to-triple-reuse-market-and-accelerate-circular-economy/ (late 2025, exact date not shown); 3.3 trillion figure from search snippet citing Reuse Economic Journal, https://www.nippon.com/en/news/yjj2026090700595/ (this URL returned 404 when fetched, so UNVERIFIED).
- Mercari: about 23 million MAU, annual GMV about 1,120.9 billion yen (search snippet; source pages not opened). Entertainment and hobby is 40%+ of transaction volume in FY2025, up 22% YoY. Cross-border GMV rose from 6 billion yen (2022) to over 90 billion yen (end 2025), driven by hobby goods. Marketplace GMV in the nine months to June 2026 up 11.0% YoY to 939.4 billion yen. Source: https://www.statista.com/statistics/1167143/mercari-gross-merchandise-volume and search snippets (UNVERIFIED in detail).
- Mercari's "trouble encounter rate" fell from 0.56% (H2 2023) to 0.4% (H1 2025); H1 2026 inquiry rate 0.35%. The category split of troubles is not public in what I could open. Mercari has launched a Full Compensation program. Sources: https://speakerdeck.com/mercari_inc/transparency-report-first-half-of-2025 (Sep 2025), https://www.valueaddedresource.net/mercari-japan-full-compensation-buyer-seller-protection/.
- Mercari already uses AI at listing time (photo to title/description/condition prefill, price search, image search). So "AI listing assistant" is not a differentiator in Japan; evidence-grade capture and handover/dispute is. Sources: https://openai.com/index/mercari, https://www.valueaddedresource.net/mercari-japan-launches-price-search/.

**Korea**
- Online second-hand market projected at 43 trillion won (about USD 30.6B) in 2025, nearly double in four years (KISA). Karrot: 21 million MAU in Korea (early 2026), 2025 revenue 270.7 billion won (+43%). Bunjang: over 1 million items traded monthly, over 90 billion won monthly value (early 2025), with authentication for luxury and streetwear. Sources: https://www.seoulz.com/korea-recommerce-market-2026/, https://www.nationthailand.com/news/general/40056443.
- Karrot is hyperlocal (meet-up), and people use it for kids' items, small appliances, furniture, hobby items (search snippet, no ranking found). 87% of 3,577 surveyed named it the top app for direct trade. Source: https://www.seoulz.com/korea-resale-economy-2026/amp/.

**SEA**
- Carousell: platform GMV about USD 1.8B; autos and property drove about USD 420M of GMV (+38%) in Singapore, Malaysia, Philippines; positive EBITDA FY2025, revenue +18%. Carousell Certified (electronics, luxury bags, watches and more) certified about 120,000 items and generated S$18.4M GMV in FY2025 (search snippet, UNVERIFIED). Authentication is limited to high-value categories, which confirms that mid/low-value categories are unserved. Source: https://kr-asia.com/carousell-jumps-on-the-automotive-e-commerce-bandwagon-while-navigating-path-to-profitability and search snippets.

**Australia**
- Recommerce market about USD 4.68B in 2025 (+11.3%), forecast USD 6.75B by 2029. 86% of Australians engage in second-hand shopping. Facebook Marketplace, Gumtree and eBay dominate. Sources: https://www.globenewswire.com/fr/news-release/2025/07/16/3116210/28124/en/Australia-Recommerce-Intelligence-Report-2025-Market-to-Reach-6-75-Billion-by-2029-Driven-by-Platform-Expansion-Retail-Pilots-and-Policy-Influence.html (16 Jul 2025), https://www.iads.org/articles-reports/the-rise-of-second-hand-shopping-in-australia-a-cultural-and-economic-shift.
- Scams are the visible trust problem: Scamwatch says Australians lost about A$2.18B to scams in 2025 (search snippet). That is fraud rather than condition, but it shows buyers distrust off-platform C2C.

**General buyer concerns**
- Across Europe (CEBR survey of 10,000 adults), concerns about second-hand were product condition 43%, no warranty 39%, seller trustworthiness 29%. Source: https://www.linnworks.com/guides/the-linnworks-second-hand-consumer-survey-2024/ and https://internetretailing.net (snippets). It is Europe, not JAPAC, but it gives a plausible order of magnitude for "condition is the top worry".

---

## 1. Books and textbooks

**New vs used price (India).** New general books Rs 250-600, exam-prep and professional books Rs 800-6,000; used typically 30-60% of new **(EST)**. NCERT school books are about Rs 65 new **(EST)**, so there is nearly no absolute gap. The gap that matters is in expensive professional, medical and engineering titles.

**Demand and supply.** India second-hand book market USD 781M (2023) to USD 1.41B (2032), 6.8% CAGR (Credence Research, https://www.credenceresearch.com/report/india-second-hand-books-market; single aggregator). Average household holds 11 books (OLX Crust 2016). Players: Bookchor, Book Thela, Pustakkosh, NearBook (Shark Tank, Rs 40 lakh for 20%, claims 300% growth in second-hand book sales; https://indianretailer.com/article/d2c-new-commerce/perspectives/nearbooks-rs-40l-shark-tank-deal-fuels-300pc-growth-second, 18 Feb 2025; no GMV disclosed). Japan: Book-Off built a large chain on used books (founded 1990). Mercari books are a staple, but no figure found.

**Barriers and disputes.** Main barriers are edition mismatch, availability and delivery cost relative to price. Condition worries are real (highlighting, torn pages, water damage, missing pages) but modest. I found no dispute data.

**Existing players and condition handling.** Specialist sellers grade in-house and bulk-buy. Manual grading cost is small per book but the item is worth Rs 100-300 **(EST)**.

**Inspection economics.** Manual inspection of even Rs 20 per book (EST) eats 10-20% of the price. So inspection is uneconomic for a platform and AI helps on cost, but the dispute cost of a Rs 150 book is also trivial, so "fair dispute handling" has little to prove.

**Photo visibility.** Cover and spine yes; inside pages (markings, damp, loose binding) need page-by-page capture, which is slow.

**Collecting 40-60 at home.** Trivial.

**JAPAC.** Strong in Japan (Book-Off, Mercari), mid in India, Korea (Aladin used), SEA (Carousell books).

**Poor-fit signals.** Condition is not the main barrier; margin per item is tiny; ISBN already tells the buyer what the item is.

**Verdict:** high demand, low need for our product. Do not pick.

## 2. Furniture

**New vs used price (India).** Sofa set new Rs 25,000-80,000; used good-condition 3-6-year-old sets Rs 4,000-15,000, older sets Rs 1,500-4,000 (DigiRake, undated; https://knowledge.digirake.com/sofa/sell-old-sofa-delhi?amp=1). That is roughly 70-90% below new **(EST from those ranges)**. Used furniture bought from online classifieds can be "a quarter of new" (Outlook Business, undated; https://www.outlookbusiness.com/enterprise/trend/online-bargain-231).

**Demand and supply.** Used goods market claimed at over Rs 56,000 crore with furniture a significant segment (same Outlook Business piece, EST by OLX). OLX lists household goods such as furniture among its most active categories. In Korea, furniture is a common Karrot trade. Australia: furniture resale is a growth category for retailers' pilots (GlobeNewswire, 16 Jul 2025).

**Barriers and disputes.** Hidden structural damage, damp and borer or termite, wobble, stains, smell, and matching dimensions. Transport cost of Rs 500-1,800 per sofa within NCR (DigiRake) is often 10-20% of a Rs 8,000 item **(EST)**. Buyers usually collect themselves.

**Existing players and condition handling.** Zefo refurbished before listing (manual QC, acquired by Quikr 2019). Pepperfry, Urban Ladder resale options exist but are minor. Everyone else is photos plus phone call.

**Inspection economics.** A site visit is Rs 400-800 **(EST)** against a Rs 5,000-20,000 item: possible for a platform, but tough on thin margins, and a reason Zefo needed a refurb and warehouse model.

**Photo visibility.** Scratches, stains, fabric wear, dents are visible. Structural soundness, damp inside the frame, foam firmness and smell are not.

**Collecting 40-60 at home.** Every home has furniture, so we can photograph in situ without moving anything. Realistic if we use friends' homes.

**JAPAC.** Good: Japan has big demand because of oversize-waste fees (mention as context, not verified in this research), Korea strong, Australia strong, India strong.

**Poor-fit signals.** Bulky shipping means hyperlocal handover only; a trust layer helps pre-visit screening but cannot fix delivery. Storage and moving cost can dwarf the item.

**Verdict:** strong price gap and condition anxiety, but weaker photo evidence and logistics red flag. Top 5 but not first.

## 3. Kids' gear (strollers, high chairs, play gear, cribs, car seats)

**New vs used price (India).** Strollers/prams Rs 3,400-6,300 for popular budget models, premium much higher (search snippets: https://www.lifelongindiaonline.com/collections/stroller-pram and others). Used typically 30-50% of new **(EST)**. Baby gear is outgrown in months, so it is the textbook "barely used, half price" category.

**Demand and supply.** India baby mobility equipment about USD 426M in 2025, strollers fastest growing (Ken Research, https://www.kenresearch.com/industry-reports/india-baby-mobility-equipment-market.md). About 23.1 million births in India in 2025 (same source). SecondCry began as a Facebook group in Feb 2015 with 18,000 members, then 20,000+ parents buying, selling, swapping, renting and donating kids' gear; it was acqui-hired by Elanic (https://yourstory.com/2015/11/second-hand-fashion-platforms, 2015; https://cwv.yourstory.com/2016/10/elanics-aditi-rohan). The pre-owned kids category has few startups, which says both "open space" and "hard business". Japan: on Mercari, car seats, formula milk and strollers top the baby/kids ranking (kakaku.com ranking, Aug 2026 per search snippet, https://kakaku.com/ranking/baby/).

**Barriers and disputes.** Safety (car seats: unknown crash history and 6-10-year expiry; cots: bar gaps, lead paint; mattresses: dust mites and SIDS risk), hygiene, missing parts, worn brakes and folding mechanisms. Sources: Consumer Reports (https://www.consumerreports.org/car-seats/are-secondhand-car-seats-safe), CHOICE Australia (https://www.choice.com.au/babies-and-kids/baby-furniture/buying-furniture/articles/what-not-to-buy-second-hand), and Australian rules that second-hand cots must still meet AS/NZS 2172 (https://commerce.wa.gov.au/cp/secondhandcots).

**Existing players and condition handling.** Mostly none beyond seller photos. Elanic/SecondCry used manual checks at small scale (undocumented).

**Inspection economics.** Items Rs 1,500-10,000 **(EST)**; manual inspection is clearly uneconomic.

**Photo visibility.** Fabric wear, frame rust, wheel condition, labels (manufacture date, model number) are photo-capturable and are exactly what an AI condition record can standardise. Brakes, folding latches and harness integrity need a short video.

**Collecting 40-60 at home.** Moderate: depends on friends with young children; a large amount of gear sits in storage rooms.

**JAPAC.** Very good: Japan (Mercari kids ranking), Korea (Karrot is famous for kids' items), Australia (kids' items popular), India (births).

**Poor-fit signals.** Regulatory and liability: do not touch car seats, cribs/cots, mattresses, helmets, baby gates. Platform brand risk is high if a recommendation is blamed for an injury. Recommend scoping to strollers, high chairs (with caveats), carriers, bouncers, play gyms, ride-ons and kids' cycles/scooters with an explicit "not supported" list.

**Verdict:** best condition-barrier fit, but the red flag is real. Strong second choice, or bundle with bicycles as "kids on wheels".

## 4. Bicycles and kids' cycles

**New vs used price (India).** Kids' cycles Rs 3,500-9,000 new; adult commuter/geared Rs 8,000-40,000; performance Rs 30,000+ **(EST, from Decathlon/Hero/Hercules price points; I did not open a price list)**. OLX average listed price for second-hand bicycles Rs 6,134 (search snippet, https://www.bikeleague.in/motorcycle-articles/motorcycle-editorials/used-bike-buying-guide-in-india-platforms-checklist-scams, not primary). Used geared bikes at 40-60% of new **(EST)**. Kids' cycles are outgrown in 1-2 years.

**Demand and supply.** India: 10.67 million bicycles sold in FY2023-24 including 5.71M roadsters, 3.16M "fancy" and 1.36M kids' (association figure via https://www.kenresearch.com/industry-reports/india-bicycle-market.md); market sizes range USD 1.15B to 2.9B depending on source (aggregators disagree). Decathlon launched repair, resale and buyback in India (June 2025): repair in 95+ stores, refurbished resale in 90+ stores, buyback in 50+ stores, targets tripling circular revenue by 2027 and kept 300,000 products from landfill by 2027 (https://indianretailer.com/news/decathlon-expands-repair-resale-and-buyback-services-across-india-scale-circular-retail, June 2025). Buyback covers cycles and fitness equipment, so a big incumbent is validating the category and capturing supply in-store. Australia: about 312,000 used bikes listed and about 150,000 sold in 12 months to Oct 2024 on peer-to-peer platforms (48% sell-through), about A$12M peer-to-peer value, Facebook Marketplace dominant, listing-to-sale price gap narrowed from 50% to 35% (https://www.research.bike/2024/12/australian-used-second-hand-bicycle-sales/, Dec 2024). That price gap is a direct sign of negotiation caused by uncertainty.

**Barriers and disputes.** Brakes, gear indexing, chain and cassette wear, frame cracks, rust, wheel true, tyre age, size/fit, and stolen-bike provenance. I found no published dispute split; ask a local bike shop to estimate.

**Existing players and condition handling.** Decathlon: in-house refurbishing and warranty in stores. Cashify/Flipkart/Amazon do not focus on bicycles. Used cycle dealers inspect manually. Online C2C is mostly unassisted photos.

**Inspection economics.** A mechanic check costs about Rs 150-400 **(EST)**: reasonable for a Rs 25,000 geared bike, painful for a Rs 4,000 kids' cycle. So the platform cannot afford per-item manual inspection for most of the supply.

**Photo visibility.** High for drivetrain wear, rust, frame, fork, tyre tread and brand/model; guided shots (drive side, cassette, chainring, brake pads, tyre sidewall, frame size sticker, serial number) can be specified precisely. Frame cracks and bearing play need extra care or a short video of wheel spin and brake squeeze.

**Collecting 40-60 at home.** Good: cycles and kids' cycles are in a large share of homes; bulky but photographed in place; still easy to get 40-60 across a team's network.

**JAPAC.** Good: Australia (data above), Japan (mamachari and sport bikes), Korea (urban cycling), SEA (Carousell has strong bike/motorbike traffic), India (large base).

**Poor-fit signals.** Seasonal; bulky shipping so local handover; stolen goods risk; e-bikes bring battery and electronics issues, so exclude. Helmets excluded.

**Verdict:** best fit on the team lead's criteria. Pick as master category, with kids' cycles and scooters as the entry wedge.

## 5. Toys and LEGO-type building sets

**New vs used price (India).** LEGO sets Rs 449 to Rs 80,000+, 32 SKUs between Rs 499 and Rs 2,800 (Exchange4media/Storyboard18; https://www.exchange4media.com/marketing-news/2024-is-going-to-be-bigger-better-bolder-bhavana-mandon-the-lego-133221.html, https://www.storyboard18.com/amp/brand-marketing/danish-toymaker-lego-opens-first-store-in-india-eyes-double-digit-growth-67011.htm). Used sets usually fetch 50-70% of retail when complete **(EST)**; missing pieces cut value 20-50% (Bam Good Bricks, https://bamgoodbricks.com/blogs/lego-news/key-features-of-a-preowned-lego-set-worth-investing-in); retired sets can sell above retail (BrickEconomy). Ordinary toys cost Rs 200-1,500 new, so the rupee gap is small.

**Demand and supply.** India toys market about USD 2.05-2.09B in 2025 (IMARC, Ken Research; two sources agree). Toy rental/library startups exist (Khilonewala, The Elefant). Japan: toys and models are named among growth segments of the reuse market (search snippet). Mercari's hobby category is 40%+ of volume.

**Barriers and disputes.** Missing pieces and manuals, counterfeit/knockoff sets (a known issue in India, see Techenclave "Lego (and Knockoffs)" thread), small-part and battery hazards for under-3s (CHOICE), hygiene.

**Existing players and condition handling.** Bricks sold by weight or lot (BrickLink in global market) with manual piece counts. No one in India does verified completeness.

**Inspection economics.** A full piece count takes 20-60 minutes **(EST)**, uneconomic for any Rs 2,000 set.

**Photo visibility.** Medium: sorted-by-colour photos can verify completeness only coarsely; box and sealed bags are visible. AI counting of hundreds of small parts is unreliable.

**Collecting 40-60 at home.** Easy.

**JAPAC.** Good in Japan and Korea; AU good; India smaller.

**Poor-fit signals.** Low rupee value per item; child-safety grey zone; completeness disputes are hard to adjudicate from photos alone.

**Verdict:** easy to collect, completeness dispute is a good demo of "handover check", but the price gap in India is thin. Top-5 contender, not first.

## 6. Acoustic musical instruments

**New vs used price (India).** Yamaha acoustic guitars: F280 Rs 7,499, FS80C Rs 9,490, FX280 electro Rs 12,990, F370 Rs 15,990 (https://yamahamusicstore.in/guitar-price-under-20000.html, undated). Bajaao's used guitars range from Rs 2,742 to Rs 76,500 with discounts shown. Used 50-65% of new **(EST)**. Example at higher end: used Yamaha Genos 2 Rs 3.5-5.5 lakh vs new Rs 6-7.5 lakh (electronic, out of scope).

**Demand and supply.** India western musical instruments about USD 291M in 2025 (IMARC), or USD 224M in 2025 (Mordor); electronic instruments lead with about 26% revenue share. Small, hobbyist-driven. Japan: Hard-Off chain trades heavily in instruments, and Mercari ran zero-commission promotions for guitars and amps. Reverb is the global specialist.

**Barriers and disputes.** Playability (action height, neck bow, fret wear, buzz), cracks, humidity damage, tuning stability, authenticity of known brands. Reverb's four-point scale (Excellent, Very Good, Good, Fair) shows how standardised condition grading reduces order issues (https://help.reverb.com/hc/en-us/articles/360013525833).

**Existing players and condition handling.** Bajaao "Open Box" and used gear: every item "inspected, tested and certified" in-house (https://www.bajaao.com/collections/open-box-gear). Reverb: seller grading, Fender Certified Pre-Owned via Reverb.

**Inspection economics.** A luthier check Rs 500-1,500 **(EST)**, high relative to Rs 5,000-10,000 beginners' guitars; reasonable for Rs 30,000+. Mixed.

**Photo visibility.** Finish, dings, cracks and headstock are visible. Neck relief and action can be measured with guided shots (ruler at the 12th fret, sight down the neck); sound needs a 10-second audio sample. This is a nice multimodal demo.

**Collecting 40-60 at home.** Hard: few homes have more than one instrument; we would need to borrow from music schools.

**JAPAC.** Good in Japan; moderate elsewhere.

**Poor-fit signals.** Niche and low-frequency; keyboards and electronics are in the excluded zone.

**Verdict:** very good condition-is-barrier story but the test-item collection problem and small market weaken it. Reserve.

## 7. Sports and fitness equipment

**New vs used price (India).** Treadmills Rs 12,000-40,000 for common home models; 1-2-year-old units resell at about 40-60% of original (DigiRake city pages, undated, https://knowledge.digirake.com/treadmill/sell-old-treadmill-delhi), so about 40-60% off. Weights, yoga mats, racquets: new Rs 500-6,000, used 30-50% **(EST)**. Cycles overlap with category 4.

**Demand and supply.** India fitness equipment USD 342M (GlobalData, 2025) to USD 793M (IMARC, 2024); 10% CAGR. OLX, Quikr and Facebook Marketplace are active for treadmills and home gyms. Decathlon is scaling resale and buyback of cycles and fitness equipment in India (June 2025). Korea and Australia have strong second-hand sporting goods (no figures verified).

**Barriers and disputes.** Motorised equipment: motor, belt, console faults (electronics-adjacent). Non-motorised: wear, rust, missing parts, safety of weights and benches. CHOICE notes more than 100 Australian children seriously injured by home treadmills, a liability signal.

**Existing players and condition handling.** Decathlon in-store grading; local dealers; Cashify for gym gear in some cities (search snippet).

**Inspection economics.** Rs 3,000-30,000 items; manual inspection and pickup uneconomic for most.

**Photo visibility.** Medium. Belt wear, rust, frame, grips and weight plates visible; function not.

**Collecting 40-60 at home.** Reasonable: dumbbells, mats, racquets, skates, balls are common, though less so than cycles.

**JAPAC.** Strong across the region (golf, badminton, surf, yoga).

**Poor-fit signals.** Too heterogeneous (needs a single sub-category like racquets or weights); motorised equipment crosses into electronics; safety liability.

**Verdict:** good, but best used as part of the cycle story (Decathlon sells both). Top 5.

## 8. Bags and luggage

**New vs used price (India).** American Tourister Rs 3,000-10,000; Safari Rs 2,000-7,000; VIP Rs 4,000-12,000 (https://www.bajajfinserv.in/best-trolley-bags, undated). Used 30-50% **(EST)**; heavy discounting on new (up to 85% off per Desidime listing) compresses the gap.

**Demand and supply.** India luggage market about USD 4.0B (2025, IMARC), growing with domestic air travel. No second-hand luggage data found, which in itself suggests thin used demand. Japan trades used designer bags heavily (luxury is out of scope).

**Barriers and disputes.** Zips, wheels, handle, shell cracks, smell, size accuracy.

**Existing players and condition handling.** None specialist for non-luxury luggage found.

**Inspection economics.** Not worth manual inspection at Rs 1,000-4,000 resale.

**Photo visibility.** Good for shell, zips and wheels; handles' load strength not visible.

**Collecting 40-60 at home.** Easy.

**JAPAC.** Moderate.

**Poor-fit signals.** Low purchase frequency, low incentive: people replace luggage rarely and new is regularly discounted.

**Verdict:** easy to photograph but little pull. Skip.

## 9. Footwear

**New vs used price (India).** Everyday shoes Rs 800-4,000; sports shoes Rs 2,000-8,000 **(EST)**. Sneaker hype pairs can resell above retail. India sneaker market about USD 3.98B in 2025 (IMARC).

**Demand and supply.** Resale is concentrated in hype sneakers: Culture Circle, SNKRDUNK-type, Carousell's Ox Street (https://www.media-outreach.vn/news/2021/11/15/104392/ox-street-joins-carousell-group-as-it-sets-sights-on-the-us10-billion-sneaker-resale-market-in-greater-southeast-asia), Korea's KREAM (5.3M MAU in 2023). Ordinary footwear second-hand demand in India is low (hygiene, fit).

**Barriers and disputes.** Hygiene and fit/size dominate; for sneakers, authenticity dominates. Sole wear and odour matter.

**Existing players and condition handling.** Authentication platforms with manual QC (e.g., Culture Circle, KREAM).

**Inspection economics.** Manual authentication is viable for Rs 10,000+ hype pairs; not for ordinary shoes.

**Photo visibility.** Good for wear (sole, upper creasing, heel drag); not for odour or fit.

**Collecting 40-60 at home.** Very easy.

**JAPAC.** Good for sneakers (Japan, Korea, SEA).

**Poor-fit signals.** Hygiene stigma; returns driven by fit; authenticity not condition.

**Verdict:** not a condition problem for the mass market. Skip.

## 10. Ethnic wear (sarees, lehengas, sherwanis)

**New vs used price (India).** Designer ethnic resale at steep discounts: a Tarun Tahiliani lehenga about Rs 40,000 resale vs Rs 3,40,000 new; a Sabyasachi saree about Rs 30,000 vs Rs 1,11,000 new (https://www.theestablished.com/style/fashion/5-online-platforms-to-buy-or-rent-pre-loved-indian-designer-wear, undated). That is about 65-90% off, the biggest gap of any category here. Mid-market lehengas Rs 8,000-40,000 new **(EST)**.

**Demand and supply.** India bridal wear USD 14B (2025), about 48% bridal lehenga choli (Mordor-type aggregator, https://www.marknteladvisors.com/press-release/india-bridal-wear-market-size). India resale fashion (pre-owned and rental) about USD 0.86B in 2026, growing about 22.8% CAGR to USD 4.45B by 2034 (ReportCubes, single aggregator, low confidence). Rental: Flyrobe at 10-15% of retail. Resale: Saritoria, CoutLoot (3,000+ ethnic outfits), Confidential Couture, Revivify. Informal WhatsApp resale is widespread.

**Barriers and disputes.** Authenticity of designer labels, stains, embroidery loss, alterations, colour mismatch to photos, and size/fit. Hygiene and cultural reluctance to wear worn bridal items. WRI (2021): hygiene and condition are the top two barriers to second-hand clothing in India.

**Existing players and condition handling.** CoutLoot: doorstep pickup, sanitising, authentication; Saritoria: three-step authentication (https://www.fibre2fashion.com/news/fashion-news/re-seller-coutloot-launches-ethnic-clothing--202524-newsdetails.htm, 2025).

**Inspection economics.** Item values of Rs 15,000-300,000 justify manual inspection and cleaning, which is why those platforms do it. This undercuts the "inspection is uneconomic" criterion.

**Photo visibility.** Medium-low: embroidery, zari and stains need controlled lighting and macro shots; fabric drape and fit are not visible.

**Collecting 40-60 at home.** Reasonable in family wardrobes, but owners are emotional about wedding outfits.

**JAPAC.** Weak: strongly India-specific (Korea hanbok, Japan kimono, Malay kebaya are separate cultural markets).

**Poor-fit signals.** Seasonal wedding peaks; authenticity and fit dominate; non-scalable across countries.

**Verdict:** strongest price gap and an India-heavy story but fails on JAPAC scale and inspection economics. Skip, or keep as an India-only extension.

## 11. Kitchen and home non-electric (cookware, crockery)

**New vs used price (India).** Cookware Rs 500-6,000, crockery sets Rs 1,000-8,000 **(EST)**. Used high discount, but absolute rupee savings small.

**Demand and supply.** Households hold about 14 kitchen utensils on average (OLX Crust 2016), so supply is huge but there is almost no evidence of resale demand. Hygiene concerns apply.

**Barriers and disputes.** Chips and cracks, non-stick coating wear, hygiene, breakage in transit.

**Existing players and condition handling.** None specialised.

**Inspection economics.** Not viable at Rs 100-1,000.

**Photo visibility.** Good for chips and scratches; coating degradation is hard.

**Collecting 40-60 at home.** Very easy.

**JAPAC.** Japan and Korea have a thrift culture (Karrot, Mercari), others weak.

**Poor-fit signals.** Low value, fragile shipping, near-zero buyer pull.

**Verdict:** skip.

## 12. Watches and eyewear (non-smart, non-luxury)

**New vs used price (India).** Titan, Fastrack, Casio Rs 2,000-12,000 new; used 40-60% **(EST)**. Prescription eyewear is personal and not reusable; frames and sunglasses used Rs 500-5,000.

**Demand and supply.** Average household has 3 watches (OLX Crust 2016). Resale demand evidence is thin outside luxury and collectors; Carousell Certified covers watches but at the luxury end.

**Barriers and disputes.** Authenticity (fakes), movement accuracy, water resistance, battery, scratched crystal; for eyewear: lens scratches and fit.

**Existing players and condition handling.** Luxury authenticators (Carousell Certified, Legit App partnership), independent authentication at roughly SGD 30-80 per item (search snippet).

**Inspection economics.** Authentication cost is acceptable above Rs 20,000, not for a Rs 3,000 watch.

**Photo visibility.** Case, crystal and strap condition yes; function and water resistance no.

**Collecting 40-60 at home.** Hard to find 40-60 non-luxury watches; eyewear collection is awkward.

**JAPAC.** Good for watches in Japan, HK, SG, but luxury-heavy.

**Poor-fit signals.** Drift toward luxury; function not photographable; eyewear is personal.

**Verdict:** skip.

## 13. Collectibles (trading cards, comics, coins)

**New vs used price.** The premise inverts: scarcity items sell above original price. Condition drives price ratios by orders of magnitude (centering, corners, surface), so condition matters more here than anywhere else.

**Demand and supply.** Japan: strongest evidence of any category. Mercari entertainment/hobby is 40%+ of volume; cross-border Mercari GMV passed 90 billion yen by end 2025. Korea: K-pop merchandise secondary market above USD 500M annually worldwide, and Bunjang cross-border growth (https://www.seoulz.com/korea-recommerce-market-2026/). India: small.

**Barriers and disputes.** Counterfeits and alterations dominate: PSA estimated more than USD 200M of counterfeit and altered trading cards identified in 2025, counterfeit Pokemon up 125% and altered up 407% year on year (https://finance.yahoo.com/markets/crypto/articles/fake-pok-mon-cards-flooding-120252009.html, 2025-26; a 2023 SNKRDUNK survey reported 59.3% of Japanese card buyers met counterfeit or repackaged goods, per search snippet). So the barrier is authenticity first, condition second.

**Existing players and condition handling.** PSA, BGS grading (days to weeks, fee per card), SNKRDUNK and Mercari authentication for sneakers/cards.

**Inspection economics.** High-value cards justify professional grading; the long tail of Rs 200-2,000 cards does not.

**Photo visibility.** Good with guided macro and raking-light shots; this is a real AI strength.

**Collecting 40-60 at home.** Medium: need cards, comics or coins from collectors we know.

**JAPAC.** Strong in Japan and Korea, moderate SEA/AU, weak India.

**Poor-fit signals.** Incumbent graders; authenticity is the real problem and needs hardware or expert knowledge; price volatility; weak in India, which is our first market.

**Verdict:** best Japan story, worst India fit. Skip for this hackathon.

## 14. Home decor and art

**New vs used price (India).** Decor Rs 300-5,000 new; art values are subjective.

**Demand and supply.** Little evidence of either.

**Barriers and disputes.** Subjective taste, colour mismatch, breakage, authenticity of art.

**Inspection economics.** Not viable at low value; art expertise is a different business.

**Photo visibility.** Good for scratches or cracks but irrelevant to buyer decisions.

**Collecting 40-60 at home.** Easy.

**JAPAC.** Weak.

**Verdict:** skip.

## Additions I considered

- **Outdoor and camping gear (tents, trekking packs):** new is expensive (Rs 3,000-20,000 **(EST)**), condition critical (waterproofing, zips, poles), photo-visible in part; strong in Australia and Japan, small in India. Decathlon sells it and has a circular programme. Worth a mention as an extension of sports gear, not a standalone pick.
- **Board games, puzzles, model kits (Gunpla):** completeness is the condition issue (like LEGO), strong in Japan/Korea, small in India. Fold into the toys line.
- **Professional and exam-prep books (Rs 1,500-6,000 new):** the only sub-slice of books with a real price gap; still low "condition is the barrier" signal.
- **Kids' cycles and scooters as a separate wedge:** I folded these into bicycles because they share a checklist (brakes, wheels, frame, size). They also solve the "40-60 items at home" problem because families with kids often hold two or three outgrown cycles.

---

## Scoring table

Scale 1-5, higher is better for our product. "Red flags": 5 = few, 1 = severe.

| Category | Price gap | Demand | Condition is the barrier | Inspection uneconomic | Photo-visible condition | Home-collectable | JAPAC scale | Red flags | Weighted score |
|---|---|---|---|---|---|---|---|---|---|
| Bicycles and kids' cycles | 4: used about 40-60% below new (EST); OLX avg used Rs 6,134 | 4: AU 150k used sold/yr, India 10.67M new/yr, Decathlon buyback | 5: brakes, drivetrain, frame cannot be judged by buyer | 4: Rs 150-400 check is fine at Rs 25k, painful at Rs 4k (EST) | 4: rust, wear, size sticker, serial all capturable | 4: common in homes, bulky but shot in place | 4: AU, JP, KR, SEA, IN all active | 3: local handover only, stolen-goods, e-bikes out | 44.5 |
| Kids' gear (scoped) | 5: outgrown in months, used about 30-50% of new (EST) | 4: births 23.1M (IN), Mercari kids top ranks, Karrot famous for kids | 5: safety, hygiene, missing parts | 5: Rs 1.5-10k items | 3: fabric/frame yes, brakes/latches need video | 3: needs friends with young children | 4: JP, KR, AU, IN | 2: car seat/crib/mattress liability | 43.5 |
| Sports and fitness | 4: treadmill 40-60% of original after 1-2 years | 4: Decathlon scaling resale; OLX active | 4: function and safety unknown | 4: Rs 3-30k | 3: wear/rust yes; function no | 4: dumbbells, mats, racquets common | 4: regionwide | 3: heterogeneous, motorised = electronics, injury risk | 41.0 |
| Toys and LEGO-type sets | 3: sets 50-70% of retail (EST), small rupee gap | 4: Mercari hobby 40%+, India toys USD 2B | 3: completeness, counterfeit, hygiene | 5: piece count not affordable | 3: coarse completeness only | 5: very easy | 4: JP, KR, AU strong | 3: child safety, low item value | 40.0 |
| Furniture | 5: used often 10-30% of new (EST from DigiRake ranges) | 4: OLX household goods active; AU and KR strong | 4: structure, damp, termite, smell | 3: Rs 400-800 visit vs Rs 5-20k item (EST) | 3: surface yes, structure no | 3: in every home but bulky | 3: strong in JP/KR/AU/IN | 3: transport can be 10-20% of price | 39.0 |
| Books and textbooks | 3: 30-60% off (EST), NCERT gap tiny | 4: NearBook, Bookchor, Book-Off | 2: edition/availability matter more | 5: Rs 20 per book check is 10-20% of price (EST) | 3: pages hard to show | 5: trivial | 4: JP, KR, IN, SEA | 4: low item value | 39.5 (fails condition gate) |
| Bags and luggage | 3: 30-50% (EST), new often discounted | 2: no used-luggage data found | 3: zips and wheels | 5: Rs 1-4k | 4: shell, zips, wheels | 5: easy | 3 | 3: low frequency | 38.5 |
| Acoustic instruments | 4: used about 50-65% of new (EST) | 3: India USD 224-291M, JP strong | 5: playability unseen | 3: luthier Rs 500-1,500 hard on Rs 5-10k guitar (EST) | 3: audio and neck-sight shots needed | 2: few instruments per home | 3: JP strong, others modest | 3: niche | 37.5 |
| Kitchen and home | 3: small rupee gap | 2: supply huge (14 utensils/household), demand unproven | 2: hygiene rather than condition | 5 | 4 | 5 | 3 | 3: fragile, near-zero pull | 36.5 |
| Footwear | 3: 30-50% (EST) except hype sneakers | 2: hygiene and fit; sneaker niche | 3: wear visible but fit/odour not | 4 | 4 | 5 | 4 | 2: hygiene, size returns, authenticity | 36.5 |
| Ethnic wear | 5: Sabyasachi saree Rs 30k vs Rs 1.11 lakh new | 3: resale fashion USD 0.86B (low-confidence) | 4: stains, embroidery, authenticity | 2: platforms already inspect at these values | 3: lighting and drape problems | 4: family wardrobes | 2: India-specific | 3: seasonal, fit | 36.5 |
| Watches and eyewear | 3 | 2 | 3 | 3 | 3 | 3 | 4 | 2: drift to luxury, function not visible | 31.5 |
| Collectibles | 2: premise inverted | 4: Mercari hobby 40%+, Korea K-pop USD 500M+; India weak | 4: condition and authenticity | 2: graders exist for high value | 4: macro shots work | 3 | 4: strong JP/KR, weak IN | 2: counterfeits, incumbents, India weak | 34.0 |
| Home decor and art | 2 | 2 | 2 | 5 | 4 | 5 | 2 | 3 | 34.0 |

Weighted score = price gap x1.5, demand x1, condition barrier x2, inspection uneconomic x1.5, photo-visible x1.5, home-collectable x1, JAPAC x1, red flags x1.5 (maximum 55). Weights reflect the team lead's priorities (price gap, condition as the barrier, inspection uneconomic, photographable). Scores are my judgement from the evidence above; many inputs are estimates, so treat differences under about 3 points as ties.

**Gate:** I excluded any category scoring below 3 on "condition is the barrier", because the product is a condition trust layer. That removes books (2), kitchen (2) and home decor (2) even where the arithmetic is competitive.

## Top 5

1. **Bicycles and kids' cycles (44.5).** Strongest data point: Australia saw about 312,000 used bikes listed and about 150,000 sold on peer-to-peer platforms in 12 months with the listing-vs-sale price gap at 35% (research.bike, Dec 2024), and Decathlon India is now buying back cycles and scaling refurbished resale (June 2025). Biggest red flag: local-handover only, stolen-goods provenance and e-bike/battery exclusions; Decathlon is a strong incumbent for the premium end.
2. **Kids' gear, scoped (43.5).** Strongest data point: strollers and baby gear are outgrown in months, India has about 23.1M births a year and SecondCry already gathered 20,000+ parents around outgrown gear. Biggest red flag: safety and liability for car seats, cribs, mattresses and helmets (must be excluded explicitly).
3. **Sports and fitness equipment (41.0).** Strongest data point: 1-2-year-old treadmills resell at about 40-60% of original price on OLX, and Decathlon aims to triple circular revenue by 2027. Biggest red flag: too heterogeneous and motorised equipment drifts into electronics; injury liability.
4. **Toys and LEGO-type sets (40.0).** Strongest data point: Mercari entertainment/hobby is over 40% of volume and missing pieces cut used LEGO value 20-50%, a direct completeness dispute. Biggest red flag: small rupee gap and low item value in India.
5. **Furniture (39.0).** Strongest data point: used sofas sell at about Rs 4,000-15,000 against new sets of Rs 25,000+ (EST for new), and Zefo's refurbish-and-sell model shows buyers pay for verified condition. Biggest red flag: bulk and logistics, with condition (structure, damp, termite) only partly visible in photos.

Sixth place: acoustic instruments (37.5), good for a multimodal demo (photo plus audio) but few instruments per home for collecting test items.

## Suggested next steps (cheap, 1 day)

1. Browse OLX/Facebook Marketplace/Cashify for 20 used bikes and 20 strollers in Bengaluru or Delhi; record asking price vs new price, count how many listings mention condition, and how many photos show the drivetrain, serial or frame size. This turns the (EST) price gaps into measured ones.
2. Call two local bike shops and one Decathlon store: what do they check, how long does it take, what do they charge, what do buyers dispute most.
3. Ask 10 parents in your network what they would not buy second-hand and why, to confirm the exclusion list.
4. Verify the UNVERIFIED items above (nippon.com reuse figure, Mercari GMV, Carousell Certified numbers) against primary sources before putting them on a slide.
