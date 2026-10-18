# R7-04: Startups, product mechanisms, business models (re-commerce / circular fashion)

Date 8 Oct 2026. Lens: startups and business mechanisms, JAPAC-first. Everything here is NEW against ROADMAP-APPAREL.md (it already covers: capture, condition model, 4-lane record, cited listing, fits-like, GS1 passport slide, handover gate, case card, remedy engine, Fleek Sort, Mercari trouble rate, Vinted fraud wave, tri-state search).
Evidence caveat: most startup numbers below are company claims in press releases; they are marked (claim). Effort in days; 0 = pitch/slide only. Wow = judge wow 1-5.

---

## 1. Agent-readable condition record (Fieldwork Condition Spec v0)
- **What:** Publish our 4-lane record as a small open JSON schema (plus schema.org-style JSON-LD block on every listing page) that maps to the three condition values shoppers' agents already read (new / used / refurbished) AND to ISO 20245 grades A-D. Shown / Measured / Declared / Can't-judge lanes become fields an agent can filter on ("grade set within B-A, cuffs shown clean, chest 52 +/-1 cm").
- **Stage / business:** Product mechanism + standards play. Pitch line: "agents can't safely buy used clothes because condition is free text; we give them a typed, evidence-linked field".
- **Why new vs roadmap:** Roadmap stops at human-facing record and multilingual render. Nothing on machine readers, agents, or standards mapping.
- **Sources:** Google Merchant Center condition attribute (only new/used/refurbished): https://support.google.com/merchants/answer/6324469 ; UCP launch: https://skift.com/2026/01/11/google-ucp-ai-agentic-agents-checkout/ ; faircado on messy non-standard resale catalogues: https://faircado.com/cr1o ; ISO 20245 (A very good, B good, C fair, D poor, built for cross-border second-hand screening): https://www.iso.org/news/ref2253.html ; eBay bans buy-for-me agents from 20 Feb 2026: https://www.powersystemsdesign.com/blogs/ebay-bans-third-party-ai-shopping-or-agentic-commerce/763
- **Evidence:** Searches found no standard used-item condition schema that agents can read across platforms (gap confirmed by faircado and our own search). Google's own feed has 3 coarse values. Resale supply is the bottleneck per ThredUp 2026 report ($393B global, ~9% CAGR to 2030, US +19% in 2025): https://newsroom.thredup.com/news/thredup-14th-resale-report . UCP official docs show no apparel/condition field (search found none).
- **Effort:** 1.5 days (JSON Schema file, JSON-LD on listing page, ISO/Merchant mapping table, 1 slide).
- **Wow:** 5

## 2. fieldwork-mcp: let any agent read the record and ask the garment
- **What:** Expose 3 tools over MCP: `get_record(item_id)`, `ask_garment(item_id, question)` (abstains in code), `verify_handover(item_id, photos)`. Demo: Claude or ChatGPT answers "is this jacket's left cuff clean?" by calling our server and citing the crop; refuses where record says "not shown".
- **Stage / business:** Distribution mechanism: Fieldwork as the evidence layer behind other people's agents and marketplaces, not another marketplace.
- **Why new:** Roadmap has "Ask the garment" inside our UI only. Mercari already ships its listing/search through an AI app, so channel exists; condition is missing from it.
- **Sources:** Mercari app in ChatGPT, 23 Jun 2026, search across ~23M users' listings, listing drafts, price suggestions, built on Mercari MCP (company-stated): https://www.watch.impress.co.jp/docs/news/2119403.html ; Mercari general connection layer plan in same coverage: https://dxmagazine.jp/?p=210528 ; third-party resale-search MCP servers exist: https://ecommerceguide.com/mcp/mcp-server-for-secondhand-marketplaces/
- **Evidence:** Mercari coverage lists title/category/description drafts and comparables pricing, no condition verification mentioned (search result; not exhaustive). ThredUp 2026: 66% comfortable letting AI manage resale tasks, 32% would resell if listing took minimal effort: https://www.digitalcommerce360.com/2026/04/09/ecommerce-trends-what-is-ai-role-in-resale-growth/
- **Effort:** 1.5 days (ADK tools already exist; wrap with MCP SDK; 1-min screen recording).
- **Wow:** 4

## 3. Pay-on-pass: the handover gate triggers escrow release
- **What:** Seller payment is held in escrow; the handover result IS the release trigger. "Consistent with listing" -> seller paid within minutes. "Differs" -> case card with partial-refund proposal. "Can't tell" -> one re-ask, then human. Replaces the blunt "buyer confirms" or fixed 2-3 day window.
- **Stage / business:** Take-rate model: platform fee plus (optional) fast-payout fee; also solves supply (sellers want faster money).
- **Why new:** Roadmap has the gate and the dispute flow but never wires it to money movement or payout speed.
- **Sources:** Carousell escrow-protected Buyer Protection checkout (SG/MY/HK), funds held until resolution: https://apps.apple.com/my/app/carousell-snap-sell-chat-buy/id548607187 ; Bunjang mandatory secure payment from Aug 2024 and Bungae Care (counterfeit compensated 300%, 2023): https://demoday.co.kr/bm-analysis/140 ; ThredUp 2026: 36% would resell more with faster payouts: https://www.digitalcommerce360.com/2026/04/09/ecommerce-trends-what-is-ai-role-in-resale-growth/ ; NEWOFF cash settlement in 3 days after inspection: https://app.dealroom.co/companies/newoff
- **Evidence:** Today's payout benchmark is ~3 days after item inspection (NEWOFF) or buyer confirmation. Seller-side demand for speed is quantified (36%). Mercari/Bunjang/Carousell all use escrow, none ties release to an automated evidence check.
- **Effort:** 1 day (state machine + simulated ledger, UI states, 3 demo flows).
- **Wow:** 4

## 4. Evidence-priced return assurance (fee from uncertainty)
- **What:** Optional "protect this purchase" add-on whose price is computed from the record: tight conformal grade set + many shown close-ups = near-free; wide set + few shots = pricier or "ask for close-up first". Buyer gets a return window on a normally final-sale item; the premium is a function of what the evidence does NOT show.
- **Stage / business:** Insurance-style revenue per order. Seel's model: flat fee, 100% buyback of returned items on branded-resale stores.
- **Why new:** Roadmap's remedy engine is post-dispute. This is pre-purchase, priced risk.
- **Sources:** Treet x Seel Return Assurance: https://www.treet.co/post/treet-x-seel-return-assurance-for-your-branded-resale-customers ; store terms (7-day window, $10 return shipping deducted, US only): https://boyish.treet.co/protections ; Ypulse on Seel 2026 study: https://www.ypulse.com/newsfeed/2026/05/28/most-gen-z-picks-their-online-thrifting-sites-with-return-policies-in-mind/
- **Evidence:** (Seel-commissioned, vendor) 61% of Gen Z skipped a purchase over a strict return policy; 77% more likely to buy if optional protection offered; 76.5% say checkout protection raises purchase likelihood (n=1,100 US). No published claim/return rate for resale exists, which means a priced-by-evidence model is a genuine gap.
- **Effort:** 1 day (pricing function from grade-set width and coverage, slider in the buyer UI, note in results table as simulated).
- **Wow:** 4

## 5. Buyback-guarantee underwriting (we are the condition check that makes it possible)
- **What:** "This jacket will resell for about X in 12 months if it passes the handover check again." Fieldwork supplies the two missing parts of a buyback guarantee: a condition-aware price band at purchase, and an automated re-verification at buyback. Demo a "held value" chip on the listing.
- **Stage / business:** B2B2C: brands or marketplaces embed it to lift conversion and AOV; revenue = per-guarantee fee or margin share.
- **Why new:** Roadmap has a price-bucket head but no guarantee product, no pre-purchase resale value, no buyback re-check.
- **Sources:** Croissant: guaranteed buyback at checkout, $28M raised 25 Feb 2026 ($14M equity + $14M debt), 100k+ users, $50M+ GMV (claims), partners Nordstrom, Revolve, Reformation, SSENSE: https://www.vcaonline.com/news/2026022505/croissant-raises-28-million-to-scale-intentional-commerce/ ; Liberont (Japan): pre-guarantees up to 90% of resale value at purchase, ¥130M seed, Jun 2025: https://thebridge.jp/en/2025/06/liberont-secures-%c2%a5130-million-from-genesia-v-with-buyback-guarantee-for-resale-value-assurance ; Arc'teryx ReBIRD 30% credit after inspection: https://arcteryx.com/product-advice/arcteryx-rebird-resale ; Patagonia Worn Wear ~20% of MSRP (deal-site quote): https://hip2save.com/?p=10841190
- **Evidence:** Liberont cites "82% of US millennials consider resale value when buying" (claim). Liberont says condition is verified post-purchase but gives no method; Croissant pays on receipt at its operations centre (manual).
- **Effort:** 1.5 days (price band from grade set, "held value" chip, re-check = reuse handover flow; label estimates as modelled).
- **Wow:** 4

## 6. Sell from your camera roll (multi-photo ingest, auto-slotting)
- **What:** Seller dumps 6-10 existing photos (or a short video); Gemini sorts them into our 4 core slots, flags what is missing ("no label shot"), and the capture planner asks only for the gaps. Cuts the tiered-capture friction risk (#5 in the deal-breaker register).
- **Stage / business:** Funnel mechanism; distribution through wardrobe apps.
- **Why new:** Roadmap capture assumes live guided shooting. Nobody on the list pre-fills from photos already on the phone.
- **Sources:** Whering $7M seed Jul 2026 (eBay Ventures, Google AI Futures Fund), 10M users (claim), gallery scanning and resale integrations as use of funds: https://runtimewire.com/article/whering-raises-7m-seed-ebay-google-ai-futures-fund ; Carousell "List with AI" from short video or photos on Gemini, +20% items listed per seller, median listing time under 2 min (Google Cloud vendor page): https://cloud.google.com/customers/carousell ; app availability photo AI in SG/MY/HK/PH: https://apps.apple.com/my/app/carousell-snap-sell-chat-buy/id548607187
- **Evidence:** Carousell numbers above set the friction benchmark to beat ("under 2 minutes"). ThredUp: 32% would resell with minimal setup effort.
- **Effort:** 1 day (multi-file upload, Gemini slot classifier, gap prompt).
- **Wow:** 3

## 7. Evidence-based seller reputation (portable because it is checkable)
- **What:** A seller score built from outcomes (share of handovers "consistent with listing", share of declared flaws recovered, abstention honesty) instead of star ratings. Portable as a signed summary any marketplace can verify against records.
- **Stage / business:** Trust infrastructure; later API revenue.
- **Why new:** Roadmap has per-item trust only; no seller layer.
- **Sources:** HICSS 2020 study on imported seller reputation (consumers receptive, but no reliable representation yet): https://aisel.aisnet.org/hicss-53/os/trust/4 ; Springer on portability as exit barrier: https://link.springer.com/10.1007/s12599-021-00717-9 ; eRated aggregator, claimed 90% of sellers on multiple marketplaces (2016): https://techcrunch.com/2016/01/19/erated/amp/ ; Mark3t "Passport" for luxury, startup pitch: https://startup-seeker.com/company/mark3t~ai
- **Evidence:** No widely adopted standard; research says the hard part is the representation, not plumbing. Evidence-grounded outcomes are a better-defined representation than stars.
- **Effort:** 0.5 day (compute from our ~40-garment synthetic pairs; one profile card). Otherwise 0 as a slide.
- **Wow:** 3

## 8. "ISO" alerts: condition-aware wanted-requests that unlock supply
- **What:** Buyer posts "In Search Of: denim jacket, size M, grade within B-A, cuffs shown clean"; sellers with matching drafts get a nudge ("a buyer wants this, add the missing close-up"). Demand creates the evidence request.
- **Stage / business:** Supply-side growth hack for a supply-constrained market.
- **Why new:** Roadmap tri-state search is a STRETCH filter; this is a standing demand object, which is a different product.
- **Sources:** Treet 2025 recap: 50,000+ ISO requests, 48% of purchases from repeat buyers, median 9 days list-to-purchase, P2P sell-through over 60% in one month (self-reported): https://treet.co/post/branded-resale-recap-2025 ; ThredUp 2026 "supply is the new constraint": https://newsroom.thredup.com/news/thredup-14th-resale-report
- **Evidence:** 50k ISO requests on brand resale shows latent demand for items not listed anywhere.
- **Effort:** 0.5 day (saved query + match notification mock).
- **Wow:** 3

## 9. Condition history ledger (passport write-back, not just identity)
- **What:** Every Fieldwork event (listing, handover, dispute outcome, repair) appends a signed row to the garment's record. A brand DPP tag proves identity and origin; ours adds "condition over time". Resale price and last-known condition feed the next listing automatically.
- **Stage / business:** Data moat; sells into brands wanting use-phase data.
- **Why new:** Roadmap marks passport as a SKIP slide with GS1 Digital Link for EU DPP readiness. This reframes it as an append-only use-phase log and gives it a 0.5-day demo.
- **Sources:** Poshmark x EON x Coachtopia one-click resale with resale price written back to the item's digital ID (Sep 2024; no uptake metrics published): https://eon.xyz/press/poshmark-eon-and-coachtopia-team-up-to-launch-instant-resale-in-the-u-s-powered-by-eons-digital-id-technology ; Avery Dennison ReadyDPP: https://www.labelsandlabeling.com/news/interactive-technology/avery-dennison-launches-dpp-platform ; EU textile DPP act expected 2027, compliance within 18 months of publication (unconfirmed secondary source): https://abiresearch.com/market-research/insight/7782973-tech-driven-sustainability-and-traceabilit
- **Evidence:** Searches found no published metrics on DPP-driven resale and nothing on condition history. So the "use-phase condition" gap is open; do not claim DPP raises resale value (the "2x lifetime value" Bain/eBay line could not be traced to an original).
- **Effort:** 0.5 day (event list per item in Firestore + timeline UI).
- **Wow:** 3

## 10. Returns-to-resale wedge: our grader as the B-grade intake layer
- **What:** Same condition model used on returned new items (Loop / Shopify returns): grade, route to resale or restock, auto-list. Gives a B2B wedge that does not depend on sellers shooting 4 photos.
- **Stage / business:** B2B SaaS; per-item fee or share of recovered value.
- **Why new:** Roadmap is C2C resale. Returns-grading is a distinct buyer.
- **Sources:** Treet x Pact: B-grade returns 80% sell-through, 7,500+ returned units cleared, grading done by Fillogic (manual intake): https://www.treet.co/post/how-pact-turned-returns-into-revenue ; Loop "Resell on [store]" button for non-returnable items: https://help.loopreturns.com/en/articles/8002305 ; Treet CEO estimate brands recover 45-65% of MSRP on returns (vendor): https://www.retailbrew.com/stories/why-more-returns-are-ending-up-in-the-resale-channel
- **Evidence:** 30+ brands on Treet's Loop integration (Treet recap). Grading is still a human step at partners.
- **Effort:** 0 as a pitch slide; 0.5 day to add a "returns intake" mode in the UI.
- **Wow:** 3

## 11. Repair credit: flaw ledger becomes a repair quote
- **What:** For flaws classified as repairable (loose seam, missing button, hem), the record shows a repair estimate and "repair before you sell" for sellers; in a dispute the remedy engine can offer "repair credit" (cost of local repair) instead of refund.
- **Stage / business:** Fee share from repair partners; policy tailwind.
- **Why new:** Roadmap remedy is severity-weighted partial refund only; no repair route.
- **Sources:** Vestiaire x Sojo repair/alteration partnership (Jun 2024), Vestiaire analysis that 65% of returns on its platform were wrong fit, seller-side repairs can raise sale value: https://fashionunited.uk/news/business/vestiaire-collective-cooperates-with-repair-and-alteration-platform-sojo/2024060475882 ; Sojo pricing from GBP 5 at Selfridges: https://fashionunited.uk/news/retail/sojo-opens-permanent-space-in-selfridges/2024012473742 ; Ellen MacArthur "The New Bottom Line" (29 May 2026) estimates gross margins up to 55% for resale and 41% for repair under tax and EPR changes: https://circulars.iclei.org/resource/the-new-bottom-line-policy-levers-to-scale-resale-and-repair-for-fashion/
- **Evidence:** Vestiaire excludes tears and holes from seller criteria (so repair is a gap there). No checkout-level repair offer found in 2026 coverage.
- **Effort:** 1 day (repairable flag + estimate table + remedy option).
- **Wow:** 3

## 12. Jury tier for small disputes (Xianyu "small court", but evidence-first)
- **What:** For low-value items where a human case costs more than the item, the case card goes to a panel of three independent runs (different model prompts and party order), then to a human only on disagreement. Frame as "digital jury"; in the pitch, mention a real crowd jury as a roadmap step with jurors seeing only the evidence card.
- **Stage / business:** Cost-to-resolve reduction.
- **Why new:** Roadmap has two-run order-swap and a human approver; no tiered jury logic or crowd route.
- **Sources:** Xianyu "court" with a 17-person volunteer jury, inherited from Taobao Public Jury (2012): https://www.sixthtone.com/news/1016578 ; study finding crowd resolution cannot fully replace platform staff: https://thelivinglib.org/you-be-the-judge-how-taobao-crowdsourced-its-courts/
- **Evidence:** Qualitative only. Study of Xianyu comments: disputes mostly about returns and refunds. No resolution-rate or cost numbers found.
- **Effort:** 0.5 day (panel of 3 + disagreement routing; report agreement rate in results table).
- **Wow:** 3

## 13. JAPAC inspection-hub economics slide (where the human cost sits today)
- **What:** One slide: incumbents in Japan/Korea solve trust with physical inspection hubs; Fieldwork is the software version for C2C. Comps: digdig (JP) handles photography, measurement, packaging, shipping; ¥400M Series A Oct 2025, 300k+ downloads in a year (claims); Charan (KR) inspects, cleans, resells, added a P2P channel with verification Feb 2026; NEWOFF (KR) buyback with per-item inspection and cash within 3 days; Bunjang inspection centre ~350 luxury items/day, 100k+ items inspected, up to 18 checkpoints plus 28-criteria condition report; KLD (JP) branded second-hand raise May 2026 including AI operations.
- **Stage / business:** Market-fit narrative for JAPAC judges.
- **Why new:** Roadmap cites Mercari's collection centre and Fleek only.
- **Sources:** https://thebridge.jp/en/2025/10/fashion-flea-market-app-digdig-raises-approximately-%c2%a5400-million-in-series-a-to-strengthen-product ; https://wowtale.net/2024/04/24/75653 ; https://app.dealroom.co/companies/newoff ; https://news.mtn.co.kr/news-detail/2024112916422657429 ; https://globalbunjang.com/blog/edition1 ; https://thebridge.jp/en/2026/06/kld-secures-funding-for-branded-secondhand-clothing-purchase-and-sales
- **Evidence:** All company-stated; no published unit costs per inspection. Do not quote a cost saving.
- **Effort:** 0
- **Wow:** 3

## 14. Impact receipt with a displacement factor (honest ranges)
- **What:** On record and receipt: CO2 and water avoided with a range and a stated displacement rate, using fabric and category from the label shot. Add one line "assumes 72% of used purchases replace a new one".
- **Stage / business:** Conversion and ESG reporting for brand partners.
- **Why new:** Roadmap has no impact metric.
- **Sources:** ThredUp methodology (category-level, 72% displacement): https://www.thredup.com/bg/p/our-eco-stats ; Farfetch figures per pre-owned item 22 kg CO2, 3,040 L water, 1 kg waste: https://www.theindustry.fashion/farfetch-launches-online-sustainability-calculator/ ; Vinted about 1.8 kg CO2 per item (platform-stated): https://lithuania.lt/news/business-and-innovations-in-lithuania/more-than-a-trend-how-lithuanian-brands-contribute-to-sustainability-in-fashion/ ; Shady Rays A/B on impact badges, +3% purchase gap, p=0.006 (vendor case study): https://verdn.com/resources/case-studies/shady-rays
- **Evidence:** Published per-item figures range 1.8 to 22 kg, so show a range, never a single number. Conversion lifts are vendor-published (14% at one brand; 3% in the A/B).
- **Effort:** 0.5 day
- **Wow:** 2

## 15. Price band from the grade set (publish pricing error nobody publishes)
- **What:** Replace single "suggested price" with a band derived from the conformal grade set and brand tier; report band hit-rate on our test pairs. Position as honest pricing.
- **Stage / business:** Seller delight / sell-through.
- **Why new:** Roadmap has a price-bucket head only as a training target; no seller-facing band, no accuracy table.
- **Sources:** Rebag Clair retention is brand-level only (Goyard 104%, Hermes 100%, Chanel 92%, LV 88%): https://www.fashiondive.com/news/rebag-annual-clair-resale-retention-value-report/ ; Vestiaire calculator publishes no accuracy: https://faq.vestiairecollective.com/hc/en-gb/articles/208526309 ; Mercari price suggestion via comparables, no accuracy published (ChatGPT app coverage above)
- **Evidence:** Searches found no platform publishing predicted-vs-realised price error. A small honest table is a differentiator, but it needs real sold prices, which we do not have for our own garments (risk).
- **Effort:** 1 day (only if sold-price data from the HF set price bucket is usable)
- **Wow:** 2

## 16. 2026 funding-and-policy tape (timing slide)
- **What:** Why now, one slide: Fleek $25M Series B 8 Jul 2026 (Burda lead, eBay in); Whering $7M seed Jul 2026 (eBay Ventures, Google AI Futures Fund); Croissant $28M Feb 2026; Phia (AI price/resale-comparison shopping) reported ~$35M early 2026, 1M+ users (round details conflict across sources); eBay agreed to acquire Depop for $1.2B (as reported); Vinted launched in Australia Aug 2026; ThredUp 14th report $393B, supply the constraint; EMF policy paper 29 May 2026.
- **Stage / business:** Pitch timing and "investors are paying for AI supply and trust infrastructure".
- **Why new:** Roadmap has Fleek Sort only.
- **Sources:** https://tech.eu/2026/07/08/fleek-secures-25m-to-digitise-secondhand-fashion/ ; https://www.shopifreaks.com/whering-a-london-based-digital-wardrobe-app-raises-7m-in-seed-funding-led-by-ebay-ventures-and-googles-ai-futures-fund/ ; https://www.vcaonline.com/news/2026022505/croissant-raises-28-million-to-scale-intentional-commerce/ ; https://www.forbes.com.au/news/entrepreneurs/how-phoebe-gates-and-sophia-kianni-raised-35m-to-build-an-ai-shopping-unicorn/ ; https://www.just-style.com/newsletters/vinted-australia-launch-secondhand
- **Evidence:** Aggregator-level; verify before putting numbers on a slide. The eBay-Depop figure came from one search summary and should be re-checked.
- **Effort:** 0
- **Wow:** 2

---

## Checked and dropped (already in roadmap, or no evidence)
- Fleek Sort, Mercari trouble rate, Vinted AI-fake-damage wave, EU DPP/GS1: already in roadmap.
- Archive, Trove, Reflaunt, Recurate white-label resale: no 2026 conversion/repeat data found beyond Treet's own recap; useful only as B2B go-to-market framing (Trove acquired Recurate Aug 2024; Archive raised $30M Feb 2025 per CB Insights, search summary).
- India 2026 AI resale funding: none found (Circle, pre-seed, targets electronics not clothes; Ziniosa is luxury, May 2025).
- Singapore/SEA/Australia 2026 rounds: none confirmed beyond Carousell's Gemini listing tool and Vinted Australia.
- Staking/deposits as a trust device: no live fashion example found; skipped.
- Gemini/ChatGPT shopping agents actually buying used goods: no evidence they filter by condition today; checkout still needs a human (so card 1 is a positioning bet, not a proven demand).
