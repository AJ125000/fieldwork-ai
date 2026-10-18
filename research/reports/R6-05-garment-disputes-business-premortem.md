# R6-05: Garment disputes, business case, competitors and category pre-mortem (7 Oct 2026)

Scope: second-hand apparel, JAPAC. Method: web search only. Date of research 7 Oct 2026; I prefer 2023-2026 sources.
Legend: **(est.)** = my own reasoning or arithmetic, not a published figure. **(weak)** = vendor blog, seller-tools blog, SEO site or market-research seller. Treat as direction only. **(gap)** = looked and did not find.

---

## 0. Bottom line (read this first)

1. **Stay with apparel**, with one condition: the Meesho conflict-of-interest question must be cleared by team formation (11 Oct). Nothing I found in disputes, counterfeits, hygiene or business case forces a category change. That conflict is the only trigger I would switch on (fallback: books, per R4-01).
2. **The pain is real and the market leader just proved it by building a physical fix.** Mercari Japan opened a "product collection centre" and launched a full-compensation programme on 1 Jul 2025 because disputed items could not be verified from chat and photos, and because buyers were returning swapped or empty parcels. A photo-evidence layer is the software substitute for that warehouse.
3. **Nobody publishes dispute rates by reason for second-hand apparel.** The only hard platform number is Mercari Japan's "trouble encounter rate" (0.56% H2 2023, 0.40% H1 2025, 0.35% H1 2026, all categories). Do not claim an apparel dispute rate in the pitch. Claim the mechanism and the cost per dispute instead.
4. **Authentication: "not in scope; risk flag only."** The market itself splits it off. Vinted's paid verification covers bags, shoes, accessories and jewellery, not apparel; Entrupy and Certilogo sell it separately.
5. **Smell and fit are not deal-breakers if we frame them as "declared, not shown".** They are deal-breakers only if we claim we judge them from photos.

---

## 1. Disputes and returns in second-hand fashion

### 1.1 Rates (what exists and what does not)

| Platform | Published dispute/return rate | Source and date | Note |
|---|---|---|---|
| Mercari Japan | Trouble encounter rate 0.56% (H2 2023), 0.40% (H1 2025), 0.35% (H1 2026, lowest on record) of transactions. Counts item problems and non-delivery. | Impress Watch, 1 Sep 2025, https://www.watch.impress.co.jp/docs/news/2043710.html ; Mercari transparency report H1 2026, https://jp-news.mercari.com/info/54623 | All categories, not apparel. Japan is a high-trust market, so this is the "good" benchmark. |
| Vinted | None published (gap). Became the 4th most complained-about company on UK Resolver by end 2025. | https://news.resolver.co.uk/?p=8400 (16 Sep 2025) | DSA transparency reports exist at vinted.co.uk/safety but I could not extract dispute counts. |
| Depop, Poshmark, Carousell, eBay fashion | None published (gap). | | Carousell: MHA page lists 2,476 scam reports in 2023 (1,834 in 2022), all categories. https://www.mha.gov.sg/e-commerce-marketplace-transaction-safety-ratings/carousell/ |
| ThredUp | Return rate not disclosed in the FY2025 10-K. Company says returns fell by more than 500 basis points year on year after fees and credit-return options (search summary of earnings material; level not stated). | https://www.sec.gov/Archives/edgar/data/1484778/000148477826000007/tdup-20251231.htm | Hub-inspected model; so disputes are structurally lower. |
| Proxy: new apparel online | Returns about 20-30% on average, up to 50% in some segments (weak). | search summary, several blogs | Mostly size and fit, not condition. Second-hand avoids bracketing, so do not use this as the second-hand rate. |

### 1.2 Top reasons (ranked from policy text and complaint samples, not from measured shares)

1. **Undisclosed condition problems**: stains, holes, tears, pilling, fading, loose seams, broken zips. This is the core "not as described" case on every platform (Poshmark, Depop, Vinted, Mercari, eBay policy pages).
2. **Wrong item, wrong size or colour** (listing mismatch).
3. **Counterfeit** (Vinted and Depop list it as a valid ground; UKIPO survey below).
4. **Item swapped or emptied on return.** Mercari Japan: sellers reported returns arriving "empty or a different item"; fraudsters buy branded goods, claim defects, return a fake (All About, 9 May 2024, https://news.allabout.co.jp/articles/o/77065/ ; Impress Watch on the compensation programme, https://www.watch.impress.co.jp/docs/news/2027344.html ). This is exactly the case a same-item handover check addresses.
5. **Buyer-side forgery of damage with AI.** Buyers add AI-generated cracks or stains to photos of intact items to claim refunds (nssmag, 8 Jun 2026, https://www.nssmag.com/en/fashion/45705/artificial-intelligence-ai-vinted-scams-fake-listings ; one investigation found 16 suspicious profiles). The same piece says neither automated systems nor human reviewers can reliably tell. Seller-side AI-generated "model" photos are also flooding Vinted (NOS, https://nos.nl/l/2625987 ).
6. **Smell, hygiene, fit**: valid complaints but weakly covered by "not as described" policies (see section 3).

Mercari US low-rated reviews: 17.2% of 198 sampled involved "not as described" (weak, unstar.app, 2026, https://unstar.app/blog/mercari-refund-denied-return-policy-reviews-2026 ). This is a sample of angry reviews, not a rate.

### 1.3 How each platform's flow works

| Platform | Report window | Evidence | Who pays return shipping | Money held? | Source |
|---|---|---|---|---|---|
| Vinted | 2 days from delivery, in app | Photos; platform mediates; asks for more proof | If buyer wins, "return and refund, including shipping in most cases"; but many Trustpilot buyers say they paid return postage. Buyer pays a Buyer Protection fee (about 5% + fixed 0.70, weak). | Yes, until resolved | Resolver 16 Sep 2025 https://news.resolver.co.uk/?p=8400 ; fee: https://www.vinted.co.uk/pricelist (weak summary) |
| Depop | Sources conflict: "within 30 days of purchase" vs "3 days of delivery" (both weak). Official page not checked. | Resolution Centre, chat records, photos, tracking; seller must reply in 48 h; refunds 7-10 days | Not clear | Yes | https://closo.co/blogs/returns-refunds/depop-return-policy ; https://blog.vendoo.co/how-to-handle-depop-returns-and-refunds (weak) |
| Poshmark | 3 days from delivery | Photos and description required | Poshmark label; buyer returns within 5 days of approval | Yes; auto-releases to seller when 3 days pass or buyer accepts | https://www.supermoney.com/poshmark-return-policy ; https://thereturnguide.com/blogs/online-retailers-returns/poshmark-return-policy-guide (weak) |
| Mercari US | 72 hours after delivery | Photos; claim | Not confirmed | Yes; closes automatically if no action | https://closo.co/blogs/platform-specific-guides/mercari-buyer-protection-2 (weak) |
| Mercari Japan | Before the buyer's "received" rating | Photos and reason in chat | Seller bears shipping if item differs from description (norm). Since 1 Jul 2025, in unresolved cases Mercari sends a "Henpin-kun" return link and pays shipping; item goes to **Mercari's collection centre** for physical check. 93% compensated within 48 h of arrival (H1 2025); 97% within 48 h (H2 2025); 99.5% compensation rate (H1 2026) | Yes | https://www.watch.impress.co.jp/docs/news/2027344.html ; https://www.watch.impress.co.jp/docs/news/2043710.html |
| eBay | Money Back Guarantee case; escalate after 3 days if not refunded | Case messages, photos | Seller pays when "not as described"; buyer pays for "changed mind" | Yes | eBay community pages (weak) https://community.ebay.com |
| Carousell | Report via Help Centre; window not published | Reviews item description and delivery proof; "significantly not as described" gets full refund | Not published | Yes, for "Buy" button transactions | https://www.mha.gov.sg/e-commerce-marketplace-transaction-safety-ratings/carousell/ |

### 1.4 Complaints about these flows

- **Windows are too short, and money releases automatically.** Poshmark (3 days) and Mercari US (72 h) auto-close; Vinted 2 days. A buyer who sees a stain on day 3 has no recourse. Opportunity: a guided arrival scan inside the window.
- **Evidence is one-sided and hand-judged.** Vinted Trustpilot reviewers say complaints were closed relying only on the buyer's photos, or that support asked for more proof when both parties agreed on the damage; some call the protection fee "a charge for a service never received" (https://www.trustpilot.com/review/vinted.ie?page=9 and related pages, 2025-26; weak as a sample).
- **Sellers feel punished.** Depop: sellers say they are held responsible despite accurate listings and unedited photos (Trustpilot summary via https://kimola.com/reports/unveil-depop-user-insights-service-security-sales-concerns-trustpilot-en-us-151378 ; weak). Mercari US: seller cannot give "benefit of the doubt"; order is forced to complete after 3 days.
- **Ratings (weak, secondary sites):** Vinted Trustpilot about 3/5 (France, about 52,000 reviews); Depop about 3.0; Mercari US about 1.2 (https://unstar.app/blog/mercari-refund-denied-return-policy-reviews-2026 ). App-store ratings for the big resale apps sit at 4.2-4.7, so the pain concentrates in the dispute moment, not the browse experience.
- **Support is generic and slow.** Repeated across Depop, Mercari and Vinted review samples.

Takeaway for the pitch: every platform asks for photos, but none of them has a photo from the **listing moment** that the buyer's arrival photo can be compared against. The comparison is done by a tired human (or a warehouse, in Mercari's case).

---

## 2. Counterfeits in second-hand fashion: is authentication a must-have?

**Size of problem**
- UK IPO guidance developed with Vinted (1 Jun 2026): one in four pre-loved clothing buyers say they unknowingly bought fakes in the past year; 45% of 18-24s met counterfeits on resale platforms vs 23% of 55-64s; sample size not disclosed (https://www.just-style.com/news/uk-issues-guidance-on-spotting-counterfeit-secondhand-fashion/ ). Self-reported, likely overstated.
- Entrupy "State of the Fake 2026": of authenticated apparel items, **34.85% unidentified** ("the riskiest category by far"); Fear of God Essentials 95.75%, BAPE 85.19%, Nike apparel 73.33%; footwear 11.1%; luxury 8.1% ($3.7B value processed in 2025) (https://www.entrupy.com/report/state-of-the-fake-report-2026/ ). **Selection bias**: people submit items they already suspect, and it is mostly streetwear hype brands, about 99% Americas. It is not a rate for everyday clothing.

**What platforms actually authenticate**
- Vinted Item Verification: bags, shoes, accessories, jewellery; EUR/GBP 10 per item (includes shipping to hub); items of GBP 100 and over; paid by the buyer (https://www.theindustry.fashion/?p=243048 ; https://www.retail-week.com/marketplaces/vinted-launches-verification-service-for-designer-items/7044974.article ). Apparel not in the launch categories.
- Mercari Japan "Anshin Kantei": about 110,000 appraisals in H1 2026, about 3x year on year, 149 brands (https://jp-news.mercari.com/info/54623 , via search summary). Brand items, not everyday clothing.
- Entrupy apparel: plans from USD 8-10 per authentication, streetwear and luxury brands only (https://www.entrupy.com/apparel-authentication ). eBay owns Certilogo (digital ID for garments) since 2023.
- Carousell Certified: AI diagnostics for phones, human authenticators for luxury bags (https://nylon.com.sg/carousell-launches-certified-luxury-making-it-easier-to-buy-secondhand-luxury-goods-online/ ).

**Verdict: authentication not in scope; risk flag only.**
- Reasons: (a) the market treats it as a separate, paid, brand-specific, high-price service; (b) our category is everyday apparel where fakes are a small share by value; (c) a defensible authenticator needs per-brand ground truth we do not have in 10 days.
- What we do instead: (1) a **"brand-risk flag"** for a short list of high-fake brands (e.g. the streetwear brands above) that tells the platform "route to authentication partner"; (2) our capture protocol (care label, logo close-up, stitching) produces exactly the images a downstream authenticator (Entrupy, Certilogo, human) needs, so we are **upstream and complementary**, not competing.
- Pitch line: "We do not claim to detect fakes. We make sure the evidence an authenticator needs exists, and we flag where it is needed."

---

## 3. Hygiene, smell and fit: what photos cannot show

**Demand-side evidence that these matter**
- US survey (April 2026): cleanliness and hygiene is the top concern about used clothing at 34%, "limited selection or sizing" 31% (search summary of consumer sentiment survey; original not fetched).
- Condition and quality are the top barrier (41%) and transaction trust 33% in another cross-market survey; 38% of non-buyers cannot trust items arrive in "promised condition" (search summary, retail trade press 2024; verify before quoting).
- India (WRI practice note) and many academic papers name hygiene and condition as top barriers (https://www.wri.org/research/secondhand-shopping-understanding-consumer-behavior-toward-pre-owned-clothing-india ).

**How platforms handle it today**
- ThredUp: hub rejects items with odour, stains, pilling, holes; rejects about 40% of Standard Clean Out bag items and about 15% of Premium; charges USD 14.99 per Standard bag (weak, https://www.topbubbleindex.com/blog/is-selling-on-thredup-worth-it/ ). Humans smell.
- Peer marketplaces: nothing structured. Smell is a free-text line in the description. On Mercari Japan an undisclosed smell is treated as "differs from description" and can be a return reason (search summary of Japanese guidance pages; no case data found). No platform I found has a smell field with a defined dispute outcome.
- Fit: sellers give measurements; no platform verifies them.

**Is this a deal-breaker?** No, if we are honest about three evidence classes. Make this the central framing of the product and the demo:

| Class | Examples | What our layer does |
|---|---|---|
| **Shown** (visible, evidence attached) | Stains, holes, pilling, fading, labels, colour, visible mildew spots, yellowing | Detect, box, severity, abstain when unsure |
| **Measured** (derivable from a reference object) | Chest, length, shoulder | Ruler or card in the flat-lay photo; extract numbers; show tolerance (est.: feasible, to verify in testing) |
| **Declared** (cannot be seen; seller attests) | Smoke-free, pet-free, washed, fabric smell | Structured checkboxes recorded with timestamp; **never graded by AI**; disputes about these go to a policy lane ("we cannot judge this from photos") |

How to say it: "We tell you what the photos prove, what they measured, and what the seller promised. Smell is a promise, and we record who made it." This turns the limitation into a trust feature and pre-empts the judge's question. Proxy signals (yellowing at armpits, mildew) can be flagged but never sold as a smell test.

---

## 4. Business case

### 4.1 Cost per dispute for a platform (build-up, mostly est.)

| Component | Figure | Source |
|---|---|---|
| Assisted support contact, fully loaded | Median USD 13.50 per contact (self-service USD 1.84) | Gartner via https://ringly.io/blog/ecommerce-customer-service-cost-per-contact/ (secondary) |
| Contacts per dispute (buyer, seller, agent review, follow-up) | 3-6 (est.) | my estimate |
| Support cost per dispute | **USD 40-80 (est.)** | derived |
| Card chargeback comparison | about USD 46 third-party fees + USD 82 internal per case (weak) | https://www.ringly.io/blog/ecommerce-chargebacks |
| Refund/return logistics | USD 3-15 depending on market (est.) | my estimate |
| Lost item value or write-off | Item price (USD 15-30 West; USD 2-6 India, est.) | est. |
| Hidden: churn of buyer and seller | Not quantifiable here | |

Implication (est.): in low-ticket markets (India everyday clothes, Rs 150-500; Carousell SEA) **the cost of handling one dispute by hand exceeds the item price**. That is why proportional, automated remedies (idea C below) are a business argument, not just a UX one.

Mercari's own numbers give a real-world floor: it built a dedicated collection centre and pays shipping in unresolved cases to get 97-99.5% compensation inside 48 h. That is a fixed hub cost that photo-evidence could shrink.

### 4.2 Manual QC per item vs item price

- ThredUp discloses no per-item cost (10-K FY2025 and Q3 2025 supplemental checked). Disclosed: capacity over 100,000 SKUs per day, 7.5 million items; each item needs "inspection, evaluation, photography, pricing, SKU, fulfilment" touchpoints (10-K). Gross margin about 79% (Q3 2025). Derived average order value about USD 51 (USD 82.2M revenue / 1.608M orders, Q3 2025; includes multi-item orders).
- Price signal: ThredUp charges sellers USD 14.99 per Standard Clean Out bag and rejects about 40% of items (weak). The fee is a partial recovery of the inspection cost it bears.
- R4-01 estimate (carried over): inspection alone USD 0.25-0.70 per item; full hub chain USD 3-6 (est.); India chain Rs 40-100 (est.). Against Rs 150-500 prices that is 15-40% of price (est.).
- Bunjang Care (Korea): 30-40 checkpoints, 14% rejection, buyer-paid fee (https://designcompass.org/2023/01/05/bungae-care/ ; from R4-01).

### 4.3 What a platform might pay for evidence-weighted trust (benchmarks, then est.)

| Benchmark | Price | Source |
|---|---|---|
| Vinted Buyer Protection fee, already charged to buyers | about 5% + 0.70 (weak): about EUR 1.70 on a EUR 20 item (8.5%) | Vinted price list summary |
| Vinted Item Verification | EUR/GBP 10 per item (item at least GBP 100) | Retail Week / The Industry Fashion |
| Entrupy apparel authentication | USD 8-10 per item | https://www.entrupy.com/apparel-authentication |
| Mercari Authenticate (US) | USD 5 (older, weak) | crosslist summary |
| Gartner assisted contact | USD 13.50 | above |

Reasoning (est.): platforms already collect about 5-8% of the item price for "trust" and spend USD 40-80 per dispute. An AI layer whose marginal cost is cents (Gemini Flash-class model calls on 8-12 photos: well under USD 0.05 per item, est., verify against current Vertex pricing) can be priced:
- **Per listed item with evidence record: USD 0.02-0.10 (est.)**, and/or
- **Per resolved dispute: USD 1-3 (est.)** versus USD 40-80 manual, and/or
- **Basis points of GMV: 5-20 bps (est.)**. Illustration only: Vinted 2025 gross sales value EUR 10.8B (FashionUnited, 9 Apr 2026, https://fashionunited.uk/news/business/vinted-reaches-1-1-billion-euros-in-revenue-for-2025-accepting-a-strategic-drop-in-profits/2026040987347 ) at 5 bps is about EUR 5M a year. Unvalidated.
Do not present these as quotes; present them as the range implied by benchmarks and say "to be validated with design partners".

### 4.4 JAPAC second-hand apparel market sizes (all contested; treat as ranges)

| Market | Figure | Source and quality |
|---|---|---|
| Japan | Reuse market about JPY 3.1T (2023), about JPY 1T of it fashion-related; 2025 forecast JPY 3.25-3.5T; JPY 4T by 2030 | Search summary of Reuse Economic Journal / Ministry of Environment / Statista; ministry PDF not parsed (https://www.env.go.jp/content/000321557.pdf ). Reasonable. 1T yen is roughly USD 6-7B (est., at about 150-160 JPY/USD). |
| Korea | Online second-hand market about KRW 43T (about USD 30.6B) in 2025, all categories; Karrot 2025 revenue about KRW 270.7B (+43%) | https://www.seoulz.com/korea-resale-economy-2026/amp/ ; https://asianews.network/?p=230846 . Apparel share not found (gap). |
| Australia | Wildly inconsistent: USD 578M (Credence, 2024) vs USD 5.2B (Mobility Foresights, 2025; likely unreliable) vs AUD 1.4B op-shop industry revenue (IBISWorld) vs USD 4.68B recommerce all categories (Statista) | https://www.credenceresearch.com/report/australia-second-hand-apparel-market ; https://mobilityforesights.com/product/australia-second-hand-apparel-thrift-market ; https://www.ibisworld.com/australia/industry/opportunity-shops/5682/ . Use "about USD 0.6-1B apparel (est.)" with low confidence. |
| India | Apparel USD 3.0B (2023) to 9.1B (2032) (Credence, weak); recommerce all categories USD 5.91B (2025) | https://www.credenceresearch.com/report/india-second-hand-apparel-market ; FashionUnited Jul 2025 https://fashionunited.in/news/retail/india-recommerce-market-to-reach-5-91-billion-dollars-by-2025-report/2025070350450 |
| SEA | No credible apparel number found (gap). Adoption: 72% of Carousell users bought second-hand across 8 markets; Philippines 92% adoption (Carousell Recommerce Index, 2021, old) | https://www.bworldonline.com/?p=415047 ; https://vietnamnews.vn/media-outreach/1088975/ |
| Global | USD 393B by 2030, about 10% of apparel spend, growing 2x apparel retail | ThredUp 14th Resale Report, 2 Apr 2026, https://newsroom.thredup.com/news/thredup-14th-resale-report |

Pitch advice: lead with Vinted (EUR 10.8B GSV) and Japan (about JPY 1T fashion reuse) as the proven, sourced figures. Avoid single-number claims for Australia, SEA and India.

---

## 5. Competitors and white space

| Player | What it sells | Buyer-facing trust or dispute layer? | Source |
|---|---|---|---|
| **Fleek** | Fleek Sort: vision-language model grading garments from photos or video; B2B wholesale marketplace (2,000 suppliers, 50,000 buyers, 100+ countries); graders in Pakistan, India, Dubai; USD 25M Series B on 8 Jul 2026 led by Burda, eBay among investors | No. Warehouse and wholesale sorting; no consumer trust features mentioned | https://thenextweb.com/news/fleek-25m-series-b-secondhand-fashion-ai |
| **Trove** (acquired Recurate Aug 2024) | Branded resale and trade-in operations (Patagonia, Levi's, Lululemon, REI, Carhartt): grading, photography, routing, ML pricing | Brand-owned inventory, not C2C. Condition is done in Trove's hubs | https://fashionunited.in/news/business/recommerce-tech-provider-trove-acquires-resale-marketplace-recurate/2024081346215 ; https://trove.com/how-it-works/ |
| **Reflaunt** (Singapore, 2018), **Treet**, **Archive** | Resale-as-a-service for brands and retailers; P2P resale, trade-in, returns rerouting | Brand storefront tech, not buyer-seller dispute evidence | https://www.cbinsights.com/company/reflaunt/alternatives-competitors (weak) |
| **Entrupy** | Authentication (hardware/app) incl. streetwear and luxury apparel, USD 8-10 per item | Authenticity only, no condition | https://www.entrupy.com/apparel-authentication |
| **Certilogo** (eBay, 2023) | Brand digital IDs and consumer authentication of garments | Needs brand participation; not condition | https://fashionunited.uk/news/business/ebay-buys-authentication-tech-firm-certilogo-in-latest-pre-loved-fashion-push/2023051769616 |
| **Faircado** | Browser extension that finds second-hand alternatives; EUR 3M pre-seed (May 2024) | Discovery, not trust | https://tech.eu/2024/05/29/faircado-raises-eur3m-for-ai-powered-resale-shopping-extension/ |
| **Lalaland** | I found nothing linking it to resale trust. Believed to be AI model imagery for fashion retail (unverified) | No | (gap) |
| Small tools: GradeThread (Claude Vision five-factor garment grade, includes odour/cleanliness score), Jori, SnapWrite, Preloved AI, Autolister | Listing and grading assistants for individual sellers | Seller convenience, no cross-party evidence | https://peerlist.io/gradethread/project/gradethread--the-standard-for-grading |
| In-house at platforms | Mercari (OpenAI listing assistant, Anshin Kantei, collection centre); Carousell (AI scam detection, Certified for phones and luxury bags); Vinted (Item Verification) | Partial; closed to others | sections 1-2 |

**What nobody (that I found) does yet** (absence is not proven; private pilots may exist):
1. A **white-label, buyer-facing** condition record for **everyday C2C** apparel, not wholesale sorting, not brand-owned stock, not luxury.
2. A **listing-moment evidence record that is re-checked at handover** (same item? what changed?). Everyone else judges at listing or at the hub, not by comparison.
3. **Dispute adjudication that cites evidence and abstains** (shown / declared / can't tell) rather than binary buyer-wins.
4. **JAPAC-native**: multilingual rendering, low-ticket economics, and Google Cloud stack fit (Mercari and Carousell are both Google Cloud customers, per R4-01).

---

## 6. Five innovation ideas for the dispute stage

Scored 1-5 on wow (to a judge) and feasibility in 10 days (one non-technical lead, Claude builds), product ranks the list.

| Rank | Idea | Wow | Feasible | Score | Why |
|---|---|---|---|---|---|
| 1 | **Arrival Scan inside the report window.** Buyer opens the parcel on camera in a guided 60-second flow; system compares to the listing record (same item gate: MATCHES / DIFFERS / CAN'T TELL, plus a change map that filters wrinkles and shadows from real change). Catches swaps and missed stains before Vinted's 2-day or Poshmark's 3-day window closes. | 5 | 4 | **20** | Directly answers the Mercari swap/empty-parcel problem and the "window closes" complaint. Visual and demoable live. |
| 2 | **Evidence ledger case card.** Every claim in a dispute is mapped to one of: Shown (cite photo crop), Measured, Declared (seller promised, not provable), or Cannot be judged from photos. Smell and fit get their own lane with a stated policy. Both parties see the same card in their language. | 4 | 5 | **20** | Turns the biggest weakness (smell, fit) into a differentiator and gives judges a clear, honest artefact. Mostly prompt and UI work. |
| 3 | **Proportional remedy engine.** Instead of "return and full refund" (return shipping often exceeds item price in low-ticket markets), propose severity-weighted partial refund with keep-the-item option, with the platform able to set caps. Evidence severity from the tuned condition model drives the percentage. | 4 | 4 | **16** | Strongest business-case story (dispute cost > item price). Simple rules on top of existing severity output. |
| 4 | **Order-swapped double adjudication with abstention.** Run the verdict twice with buyer and seller order swapped; if outputs disagree, abstain and route to a human; human approves; explanation sent in each party's language. | 3 | 5 | **15** | Cheap, defensible on fairness and bias, easy to show in a results table. Less visually exciting. |
| 5 | **Forgery-resistant capture.** Session nonce, QR tag in frame, live-capture only, recapture and edit-risk flag, to counter AI-faked damage photos. | 4 | 3 | **12** | Timely (nssmag, Jun 2026) but detection of AI edits is an arms race; only the nonce and tag parts are reliably feasible. Keep as a supporting layer under idea 1. |

---

## 7. PRE-MORTEM: it is 4 Dec in Singapore and the demo failed or judges were flat. Why?

(Judging weights as given: technical 40%, problem/impact 25%, innovation 25%, UX 10%. Public listings of the cup name criteria as technical quality, AI implementation, impact, innovation and UX, without weights; weights per your brief.)

| # | Likely failure, specific to apparel | Likelihood | Mitigation |
|---|---|---|---|
| 1 | **"It's a Gemini wrapper that grades photos."** Fleek, GradeThread and others already do photo grading, so apparel grading alone reads as not novel. | High | Lead with the handover comparison and the evidence-ledger dispute, not grading. Show the tuned-model vs untuned-Gemini table with confidence intervals. |
| 2 | **Live demo accuracy collapses on a judge's own garment or phone photo** because training data (RISE) are sorting-line shots of Swedish charity stock. | High | Wild test set of 40-60 home garments; show abstention as a feature; pre-seeded demo garments and a recorded fallback video; tell judges which cases it will say "can't tell". |
| 3 | **Same-item check false-matches or fails on plain mass-produced garments** (two identical grey T-shirts). | Medium-High | Fieldwork tag (QR + code through the care label) plus flaw fingerprints; state the honest false-match rate (about 3-5% provable with about 100 negative pairs). |
| 4 | **Judge asks "what about smell, fit and fakes?"** and the answer sounds evasive. | High (it will be asked) | Evidence-ledger framing (Shown / Measured / Declared / Can't judge) on one slide; "authentication not in scope; risk flag only"; name Entrupy and Certilogo as partners, not rivals. |
| 5 | **Business case sounds hand-wavy** ("what would a platform pay?"), esp. low-ticket markets. | Medium | Use sourced benchmarks only (Gartner USD 13.50 per contact; Vinted fee 5% + 0.70; Entrupy USD 8-10; Mercari collection centre) and mark pricing as a range to validate. |
| 6 | **Capture friction**: sellers will not take 8-12 photos. UX scores low. | Medium | Show a 90-second capture with live guidance; incentive story (listing boost or lower buyer-protection fee for evidence-backed items). |
| 7 | **AI deciding money feels risky**; judges worry about liability and bias. | Medium | Human approves; abstention gate; order-swap test; both parties see the cited evidence. |
| 8 | **Scope creep in 10 days** with a non-technical lead; end-to-end not working on the day. | High | Hold the "Do" column of R4-00 until the pipeline works end to end; freeze features by 15 Oct; submit on 17 Oct (official deadline 18 Oct). |
| 9 | **Apparel looks "obvious" or crowded** (Vinted, Depop, ThredUp), reading as low innovation. | Medium | Position as infrastructure layer for any C2C platform (white-label), apparel as the hero; books/footwear as the "next category" slide. |
| 10 | **Employer conflict (Meesho)**: apparel is about half of Meesho's sales. Could force withdrawal or create reputational risk. | Medium; severe | Clear policy in writing before 11 Oct; use only public data and personal time; no internal data. |
| 11 | **Data licence or provenance challenge** (non-commercial datasets). | Low | Use RISE (CC-BY 4.0) and own photos only; avoid DeepFashion (non-commercial). |
| 12 | **Evidence can be forged** (AI-edited arrival photos) and a judge tests it. | Medium | Nonce plus tag plus recapture check; be honest that edit detection is probabilistic. |

**Reasons to switch category NOW (honest list):**
- **Hard trigger: the employer conflict is not cleared** (or advice is "do not touch fashion"). Switch to books (R4-01 fallback; same engine, nothing else changes). This is the only forcing reason.
- **Soft trigger (day 4 check, 11 Oct team formation context):** tuned condition model does not beat the Gemini baseline on the wild set. Do **not** switch category; reframe the claim to "tuned heads add calibration and abstention" and lean on the handover/dispute story.
- No evidence from this research that dispute pain, counterfeits, hygiene or economics are worse in apparel than in any alternative category; apparel has the best pain (largest volume, observed swap fraud, window complaints) and the only large open condition dataset.

---

## 8. DEAL-BREAKER table

| Issue | Severity | Mitigation | Forces category change? |
|---|---|---|---|
| Smell and hygiene cannot be seen | Medium | Declared lane in the evidence ledger; seller attestation recorded; never graded by AI; honest slide | No |
| Fit and true size cannot be seen | Medium | Measured lane (ruler or card in flat-lay); show tolerance; fit disputes routed to policy, not AI | No |
| Counterfeit apparel | Medium (high for streetwear, low for everyday) | "Authentication not in scope; risk flag only"; capture protocol yields authenticator-ready images; partner narrative | No |
| No published apparel dispute rate | Medium (pitch risk, not product risk) | Use Mercari 0.35-0.56% as benchmark, Gartner cost per contact, mechanism arguments; flag the gap openly | No |
| Domain gap: RISE sorting-line photos vs seller phone photos | High (demo risk) | Wild set of 40-60 garments; close-up requests; abstain; recorded fallback | No (unless model fails and no reframe is possible, then still no) |
| Same-unit identity for plain garments | High | Fieldwork tag + flaw fingerprints; 3-way gate; report false-match rate honestly | No |
| Low item price vs dispute cost (India, SEA) | Medium (it helps the case if framed right) | Proportional remedy engine; per-dispute pricing | No (it is the argument for the product) |
| AI-forged photos on both sides | High | Nonce, tag, live capture, recapture flag; probabilistic honesty; human approval | No |
| Grading alone is commoditising (Fleek, GradeThread) | High (innovation score) | Differentiate on handover diff + evidence-ledger adjudication | No |
| Employer conflict (Meesho; fashion about half of its sales) | **Severe** | Written clearance before 11 Oct; public data only; personal time | **Yes** (to books) if not cleared |
| 10-day scope with one non-technical lead | High | Core-only build; freeze 15 Oct; submit 17 Oct | No |
| Regulatory and privacy (images of people, face in photos; consumer-law fairness for AI decisions; JAPAC data rules) | Low-Medium | Garment-only capture, no faces; human final approval; explain decisions | No |

---

## 9. Verdict

**Stay with apparel.** The case: real, unmet dispute pain (observed swap fraud, short report windows, hand-judged evidence), a market leader that spent real money on a physical workaround, a clean "authentication out, risk flag only" boundary, an honest answer to smell and fit, and the only large open condition dataset. Switch to books only if the employer-conflict check fails.

## Gaps (could not find)
- Published dispute or return rates by reason for second-hand apparel on Vinted, Depop, Poshmark, ThredUp, Carousell, eBay.
- Official ThredUp per-item processing cost; Depop official window (sources conflict).
- Credible SEA and Korea apparel-only market sizes; reliable Australia apparel size.
- Evidence of any competitor offering buyer-facing, same-item handover verification for C2C apparel (absence not proven).

## Source quality notes
Weak sources used for direction only: closo.co, vendoo, topbubbleindex, oneshop, unstar.app, kimola, supermoney, Credence, Mobility Foresights, crosslist, Trustpilot samples. Strongest: Mercari transparency reports and Impress Watch, ThredUp 10-K, Entrupy report, Resolver (Sep 2025), UK IPO coverage (1 Jun 2026), Fleek via TNW (8 Jul 2026), ThredUp Resale Report (2 Apr 2026).
