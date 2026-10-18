# R7-01: Adjacent industries — idea cards (new vs ROADMAP-APPAREL.md)

**Date:** 8 Oct 2026 · **Lens:** car rental, insurance, returns/logistics, luxury authentication, rental/move-in, museums, laundry, textile QC, ID liveness.
**Evidence quality:** most vendor facts below come from vendor marketing or trade press (no independent accuracy audits found). Where a card is my own inference from a source, it says so. Items marked **[test]** need a 1-hour feasibility test before building.
**Not repeated from the roadmap:** the nonce/QR/card, OpenCV quality gate, PDQ/ImageHash duplicate check at listing, TruFor flag, declared-flaw fingerprints, template-space defect map, conformal gate, order-swapped adjudication, partial-refund engine, passport/GS1, weave fingerprint.

Format: name · what it is · stage · why new · sources · open-source · effort (days) · judge wow (1-5). Best first.

---

## 1. Weigh-in: garment weight as a cheap identity fingerprint
- **What:** seller puts the garment on a kitchen scale and the display is in the photo (gram reading read by OCR / Gemini). Buyer repeats at arrival. Weight is compared with a tolerance band for moisture and scale error, and becomes one more "Measured" claim in the record.
- **Stage:** A (capture), E (handover identity).
- **Why new:** directly attacks roadmap risk #2 ("a plain mass-produced garment can't be proven the same unit"). Roadmap has size/measurements and marks but no mass. Returns-fraud practice (empty-box and swapped-item fraud) already uses weight at dispatch versus arrival; nobody applies it to garments.
- **Honest limits:** same style and size swaps weigh almost the same, so it catches wrong-size, wrong-fabric, "different, cheaper garment" and missing parts (belts, liners), not a perfect twin. Cotton moisture regain is several percent, so the band is roughly 3-5%. **[test]** weigh 10 garments dry, humid, and after a day.
- **Sources:** https://racklify.com/encyclopedia/preventing-empty-box-return-scams-guide-for-retailers-and-warehouses , https://racklify.com/encyclopedia/empty-box-return-scam-how-it-works/
- **Open source:** Tesseract (Apache-2.0) or Gemini for the scale display.
- **Effort:** 1 · **Wow:** 4 (simple, visible in a demo, answers the hardest judge question)

## 2. Published fair-wear schedule + "no bill without a human" (the Hertz lesson)
- **What:** ship a numeric, public tolerance table per category before any dispute, e.g. "pilling up to grade 3, a single mark under 10 mm, hem fray under 2 cm = normal wear, not billable". Every flaw the system finds is classed Within tolerance / Beyond tolerance / Can't tell, and only "Beyond" enters the remedy engine. Both parties see the table at listing time.
- **Stage:** F (dispute), also C (listing).
- **Why new:** roadmap has severity-weighted refunds but no explicit wear-versus-damage schedule agreed in advance. Car rental shows why it matters: Hertz's UVeye scanners drew congressional scrutiny (Rep. Mace, Aug 2025), FTC complaints (Apr 2026) and still-ongoing complaints in Aug 2026 for charging $350-$544 for dime-sized dings, with no human review before billing and only a chatbot appeal. The UK BVRLA fair wear and tear guide is the opposite model: numbers (scratch 25 mm for cars, 50 mm for vans) that both sides know beforehand, and the Financial Ombudsman applies them.
- **Pitch line:** "Hertz billed on AI alone and got investigated. Fieldwork publishes the tolerance first and a human approves every charge."
- **Sources:** https://www.theautopian.com/customers-outraged-with-hertz-ai-scanners-they-say-automatically-charge-for-questionable-damages/ , https://oversight.house.gov/release/mace-investigates-use-of-artificial-intelligence-for-car-rental-damage-assessments/ , https://yourmileagemayvary.com/2026/08/19/hertz-ai-scanners-tiny-damage/ , https://www.fleetnews.co.uk/news/latest-news/2021/09/07/bvrla-updates-fair-wear-and-tear-guide-for-light-commercial-vehicles , https://www.financial-ombudsman.org.uk/decision/DRN-6006568.pdf
- **Open source:** none needed (a JSON table + a rule step in the case workflow).
- **Effort:** 1.5 · **Wow:** 4 (strong story, cheap to build; the table values are our own, flag them as proposals)

## 3. Backlit "light-through" shot (transillumination) for thin spots, holes, moth damage
- **What:** optional close-up where the seller holds the cuff/elbow/knee/underarm against a window or phone torch. A luminance-based map shows thinned fabric and pinholes that front-lit photos hide (the trade inspects fabric on lit tables for this reason). Feeds a "Measured: light transmission, area X" claim and the hole/thin-spot head, whose labels are 95% empty in our training data.
- **Stage:** A (capture), B (condition).
- **Why new:** roadmap's close-ups are front-lit; sparse hole labels is risk #3. This gives a physical signal that does not need labels (simple threshold plus our crop classifier).
- **Honest limits:** my inference from standard fabric-inspection practice and moth-damage guidance (thinning is a recognised sign), not a published phone method. Dark or thick fabrics (denim, canvas) transmit little. **[test]** 5 worn items against a window.
- **Sources:** https://blog.v-trust.com/understanding-the-4-point-system-for-fabric-inspections (inspection practice), https://ipm.ucanr.edu/PMG/PESTNOTES/pn7435.html (moth thinning and holes)
- **Open source:** OpenCV (Apache-2.0).
- **Effort:** 1.5 · **Wow:** 4

## 4. Ghost-overlay re-photography at handover (align, then auto-snap)
- **What:** the buyer's camera shows a translucent outline of the seller's listing photo or the garment template, with an alignment meter; the shutter fires automatically when the match is above threshold. Same pose, same crop, same distance before any computation.
- **Stage:** E.
- **Why new:** roadmap normalises afterwards with a thin-plate-spline warp. Rental/move-in apps cut the problem upstream: PropCheckAI's "AI Align Overlay + Alignment Meter + Auto-Snap" exists because mismatched angles weaken any diff. Better inputs raise change-detection recall and lower false "Differs" calls, and it is a strong live-demo moment.
- **Sources:** https://mwm.ai/apps/propcheckai/6751109370 , https://verify.switchlabs.dev/industries/property-management
- **Open source:** OpenCV.js ORB/AKAZE homography (Apache-2.0); kornia (Apache-2.0) server side.
- **Effort:** 2 · **Wow:** 4

## 5. Serialised seal + weigh-in = chain of custody (who swapped, seller, carrier or buyer?)
- **What:** seller seals the parcel with a serial-numbered tamper-evident sticker, photographs the seal and writes the dispatch weight. Buyer photographs the unopened seal and weight first. The first mismatch localises the break to transit or to the receiving end. For returns, the buyer applies a new serial from the prepaid label.
- **Stage:** E, F.
- **Why new:** roadmap's handover starts when the buyer opens the parcel; it cannot say whether a swap happened before or after. Mercari's collection centre exists for this problem, and tamper-label vendors describe the same scheme (dispatch photo of seal and identifier, escalate on mismatch or weight difference). Honest limit: a seal shows alteration, not who did it, and fibre-tear seals can be steamed open or covered.
- **Sources:** https://tampertech.com/returns-fraud-protection/ , https://racklify.com/encyclopedia/preventing-empty-box-return-scams-guide-for-retailers-and-warehouses , https://sellercloud.com/blog/how-to-prevent-fraudulent-returns-and-other-benefits-of-serial-number-tracking/
- **Open source:** none needed (serial printed on the Fieldwork tag sheet we already print; OCR as in card 1).
- **Effort:** 1.5 · **Wow:** 3.5

## 6. Hop-by-hop baseline reset (museum condition-report chaining)
- **What:** each accepted handover becomes the new signed baseline for the next sale. Disputes only diff against the latest agreed state, never across owners. Demo: sell the same jacket twice; second buyer's baseline is the first buyer's arrival scan.
- **Stage:** C (record), E, F.
- **Why new:** roadmap puts the passport on SKIP as a slide. The museum practice is a concrete, cheap mechanism: couriers agree the condition report on arrival and again before departure, the report is treated as a legal document, and borrowers acknowledge it in writing. This implements the passport as a data rule (baseline = last accepted handover) and shows well in the demo.
- **Sources:** https://prm.ox.ac.uk/files/pittriversmuseumloanconditionsdoc , https://arkiv.preusmuseum.no/eng/Explore-the-Museum/Loans.html , https://rca-media2.rca.ac.uk/documents/College_Collection_Conditions_of_Loan_2016.pdf
- **Open source:** none.
- **Effort:** 1 · **Wow:** 3.5

## 7. Cross-case evidence registry (serial-claimant and recycled-damage-photo catcher)
- **What:** every evidence photo submitted in any case is hashed and indexed; a new photo is checked against all prior cases and accounts, robust to crop, rotation and screenshot. A damage crop reused on another order, or the same stain "found" on three different garments by one buyer, is flagged to the case card as a routing signal (never a verdict).
- **Stage:** F.
- **Why new:** roadmap's duplicate check is at listing (stock photos, web). Insurance vendors treat cross-claim (and cross-carrier) matching as the way to catch serial abuse that a single adjuster never sees. Directly answers the Vinted March 2026 refund-fraud wave the roadmap cites.
- **Sources:** https://www.vaarhaft.com/blog/duplicate-claim-image-fraud-prevention , https://www.vaarhaft.com/insurance-claims-management , https://postonline.co.uk/node/7955620
- **Open source:** PDQ (Meta ThreatExchange, BSD-3), `imagehash` (BSD-2); DINOv2/SigLIP embeddings for crops.
- **Effort:** 1 · **Wow:** 3

## 8. Evidence-tier protection plan (Entrupy / Cover Genius model)
- **What:** a small add-on at checkout ("Fieldwork Protect", about 1-3% of price) that is cheaper for listings with a stronger evidence badge. Funded from a pooled reserve, claims settled by the case workflow, with a one-year limit. A simple expected-loss model shows the price and break-even from our results table (false-"consistent" bound times average claim).
- **Stage:** business.
- **Why new:** roadmap has dispute cost ($40-80) but no revenue model. Entrupy sells a financial guarantee to its direct customers, and Cover Genius embeds insurance at checkout (covers wear damage such as seams and zips, not fakes). Evidence quality as the price lever is the novel link: it pays sellers for capture friction, which is roadmap risk #5.
- **Sources:** https://www.entrupy.com/entrupys-financial-guarantee/ , https://fintech.global/?p=182950 , https://coverager.com/jewelers-mutual-partners-with-entrupy/
- **Open source:** none.
- **Effort:** 0.5 (slide and a 20-line pricing calc) · **Wow:** 3.5

## 9. Seller countersign window + append-only third-party mode
- **What:** after the buyer's arrival scan the seller gets the same flat-lay diff and can accept or contest inside the window. Agreement closes the case without adjudication; contest opens the case card. Third parties (tailor, dry-cleaner, locker clerk) get a QR-secured, time-limited mode where they can add photos but never edit or delete.
- **Stage:** E, F.
- **Why new:** roadmap's case flow starts from a buyer claim. Rental-inspection apps combine two-sided capture (conflicts only escalate when both sets disagree) with append-only staff access. It cuts reviewer load and gives a clean story for judges: most cases never reach AI adjudication.
- **Sources:** https://verify.switchlabs.dev/use-cases/peer-to-peer-rental-handoff , https://mwm.ai/apps/propcheckai/6751109370 , https://www.producthunt.com/p/witnessed/witnessed
- **Open source:** none.
- **Effort:** 1.5 · **Wow:** 3

## 10. Four-point defect demerit score (textile QC standard) for the flaw ledger
- **What:** convert the flaw ledger (size in mm and position) into a standard demerit number: defect length bands 0-75 mm = 1 point, to 150 mm = 2, to 230 mm = 3, over = 4, max 4 per flaw, plus our own location weight (visible vs hidden). One transparent total feeds the grade, the remedy and the human labelling protocol for our 40 garments.
- **Stage:** B, C.
- **Why new:** roadmap measures flaws but has no accepted, explainable scoring rule; judges can check this against an ASTM standard rather than a prompt. Caveat: ASTM D5430 is for fabric rolls; adapting it to garments is our assumption, so label it "inspired by".
- **Sources:** https://blog.v-trust.com/understanding-the-4-point-system-for-fabric-inspections , https://store.astm.org/d5430-26.html
- **Open source:** none (formula).
- **Effort:** 1 · **Wow:** 3

## 11. Limit-sample ladder: anchor images per grade, seller picks the closest
- **What:** show 3-5 reference crops per category and defect (cuff wear, pilling, fade). The seller chooses the nearest, which gives a human ordinal label with no free-text. Our model also scores each crop against the same anchors (ordinal retrieval), so seller, model and buyer share one visual scale.
- **Stage:** B, C.
- **Why new:** resale marketplaces publish written condition rules (StockX fails items on its guidelines), and QC floors use physical "limit samples" for pass/fail boundaries. Roadmap relies on model plus free capture. The ladder doubles as annotation protocol and agreement test (human QWK).
- **Sources:** https://stockx.com/about/en-gb/verification-en-gb/ , https://www.cognex.com/downloads/textile-inspection-industry-overview-19152
- **Open source:** none.
- **Effort:** 1.5 · **Wow:** 3

## 12. Remedy anchors: age depreciation plus repair-cost quote
- **What:** the "keep it, get X% back" number is bounded by two public-style anchors: (a) remaining-life depreciation as in the dry-cleaning Fair Claims Guide (payout based on the unused share of expected garment life, e.g. a $500 suit with 10-year life, 3 years old, is about $350); (b) the local repair cost of the flaw (re-hem, zip swap, button) from a small rate card. Remedy = min(severity share of value, repair cost) with the working shown.
- **Stage:** F.
- **Why new:** roadmap's remedy is severity-weighted only. Cleaners' and insurers' practice shows depreciation by item life; car-damage vendors (Ravin RepairIQ, Tractable/CCC estimates) price the damage, not just detect it. Both make the number defensible. Life-expectancy table values must be our own (the DLI table is not public in what I found).
- **Sources:** https://americandrycleaner.com/articles/customer-service-vs-fair-claims , https://www.checkbook.org/chicago-area/drycleaners/articles/How-to-Handle-Drycleaning-Problems-1293 , https://www.switchlabs.dev/compare/verify-ai-vs-ravin-ai , https://insurancebusinessmag.com/ca/news/auto-motor/tractable-mitchell-launch-straightthrough-processing-solution-403249.aspx
- **Open source:** none.
- **Effort:** 1 · **Wow:** 3

## 13. Sweep-video parallax check (screen-replay and photo-of-photo detector)
- **What:** a 2-3 second sweep over the care label / tag instead of one still. Keypoint tracks across frames are fitted to a single plane: a screen or printed photo fits one homography almost perfectly, a folded garment with a raised tag does not. Optionally flash a random colour sequence from the screen (active illumination) and check the colour tint appears on the label.
- **Stage:** A.
- **Why new:** roadmap admits "no hardware camera proof on the web (medium)". ID-verification vendors answer this with motion and randomised-colour liveness plus injection-attack defence (Jumio's patented colour sequence, ISO 30107-3 L2). The plane test is my adaptation of that idea to a web page and is cheap; the vendors' own methods are proprietary.
- **Sources:** https://www.jumio.com/about/press-releases/jumio-launches-premium-liveness-detection-solution/ , https://www.businesswire.com/news/home/20250618472801/en/Jumio-Launches-Premium-Liveness-Detection-Solution-for-Superior-Protection-Against-Deepfakes-and-Injection-Attacks
- **Open source:** OpenCV.js optical flow + `findHomography` (Apache-2.0). **[test]** on a screen replay and a real tag.
- **Effort:** 2 · **Wow:** 3.5

## 14. Step-up capture ladder (escalate only when risk says so)
- **What:** normal capture stays light. Only on a risk flag, high value, or repeat account does the system require "controlled capture": live camera only (no gallery), nonce in frame, sweep video, wider coverage. Truepic and Vaarhaft run exactly this two-tier pattern (a smart link with no login for controlled capture; SafeCam as fallback when authenticity is uncertain).
- **Stage:** A, F.
- **Why new:** roadmap has one graded badge; this adds the escalation logic that protects seller friction (risk #5) while still giving a hard path for the minority of risky cases.
- **Sources:** https://www.guidewire.com/resources/blog/industry-trends/driving-insurance-innovation-truepic , https://www.vaarhaft.com/insurance-claims-management
- **Open source:** none (policy rule in the ADK workflow).
- **Effort:** 1 · **Wow:** 3

## 15. Tag-code OCR cross-check (style code, production date, RN/CA number)
- **What:** read the printed codes on the care/brand label (style number, factory code, date code) and check they are mutually consistent and plausible for the brand; at handover the same codes must match. Gives lot-level identity for plain garments and a free consistency flag for brand claims.
- **Stage:** A, C, E.
- **Why new:** roadmap matches label and print visually (LightGlue) and reads a tag serial, but does not read the manufacturer codes. Sneaker/luxury authenticators work from photos of exactly these details plus purchase data. Scope stays "consistency with the listing", not authenticity.
- **Sources:** https://legitcheck.app/how-it-works/ , https://apps.apple.com/mx/app/real-authentication/id1170927767
- **Open source:** Tesseract / PaddleOCR (Apache-2.0); Gemini for messy labels.
- **Effort:** 1 · **Wow:** 3

## 16. Optional UV-torch stain pass
- **What:** in the "Stronger evidence" tier, a 3-second dark-room shot with a cheap 395 nm torch. Cleaners' UV reveals the full extent of food-type stains (sugars fluoresce yellow, proteins pink). Whites glow from optical brighteners, so the model must say "can't judge" on white and light fabrics.
- **Stage:** A, B.
- **Why new:** roadmap stain labels are 71% blank; this adds a physical stain signal and a clear "can't judge" lane for whites. Sweat/oil response is unverified in sources I found. **[test]** with 5 stained items.
- **Sources:** https://laundryandcleaningnews.com/?p=12133 , https://www.futurelight.co.za/pages/faq-understanding-uv-black-lights-uses-safety-and-effects
- **Open source:** OpenCV (Apache-2.0).
- **Effort:** 1.5 · **Wow:** 3

## 17. Camera-consistency check across the listing set (PRNU)
- **What:** sensor-noise fingerprint (PRNU) compared across a listing's photos; a stock image mixed into a seller's set fails to match the phone that took the rest. Shown as a soft flag.
- **Stage:** A.
- **Why new:** roadmap's forensics list has TruFor and Community Forensics but not source-camera consistency. Weak on modern phones: HDR, computational photography and recompression degrade PRNU, and the library docs do not address this. **[test]** before committing.
- **Sources:** https://github.com/polimi-ispl/prnu-python , https://arxiv.org/pdf/2509.17581
- **Open source:** prnu-python (MIT, confirmed on repo page).
- **Effort:** 2 · **Wow:** 2.5

## 18. Behavioural priors as routing only (return-fraud signals)
- **What:** claim timing (before or soon after delivery), many linked accounts, prior flags feed only the routing step (how much human review), shown in the case card as a separate lane from evidence.
- **Stage:** F.
- **Why new:** Happy Returns/UPS uses these signals plus photo matching; their CEO concedes photos alone cannot catch wardrobing, which is where behaviour helps. Risk: fairness and privacy, so never used as evidence and logged. Low priority, include as a roadmap line.
- **Sources:** https://www.cbsnews.com/philadelphia/news/product-return-fraud-artificial-intelligence-happy-returns/ , https://www.claimlane.com/resources/blog/ai-return-fraud-detection
- **Open source:** none.
- **Effort:** 0.5 · **Wow:** 2

---

## Notes (things checked and not worth building)
- **Phone microscopy for authentication (Entrupy):** its signal lives in 5-10 micrometre structures from a dedicated handheld device and a very large proprietary image set (KDD 2017 paper); a phone macro lens will not reproduce it. Supports the roadmap decision to SKIP the weave fingerprint.
- **Amazon/DHL proof-of-delivery photos:** useful rule of thumb only ("one wide shot + one close shot, show a fixed landmark"), already covered by the 4-shot protocol.
- **Rent the Runway / Nuuly:** unique garment ID with rental history, 16-point inspection (Nuuly) and per-style cleaning methods exist, but no public photo-diff between renters was found; the transferable part is card 6 (baseline per hop) and the "absorb minor damage as a business cost" policy (card 2).
- **Fabric-defect anomaly models (Smartex, Cognex ViDi, FABLE, one-defect-free-sample methods):** same idea as the roadmap's PatchCore on the listing crop; nothing new beyond confirming "train on good samples only" is standard.
