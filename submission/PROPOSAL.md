# Fieldwork: proof of condition for used clothing

**Google Cloud AI Builder Cup 2026 · Retail & Commerce · JAPAC**
Team: [[TEAM]] · Prototype: [[URL]] · Code: [[REPO URL]]

---

## 1. Summary

A used jacket is one of a kind. Nobody can check it before it is bought, and nobody can prove what state it left in. So when a buyer says "it arrived stained", the platform has a photo from each side and has to guess.

Fieldwork fixes the missing piece. The seller films the garment for 12 seconds. Gemini turns that video into a **condition record**: what is shown, what is only declared, and what cannot be judged. When the parcel arrives, the buyer films the unboxing, and Fieldwork compares the two videos. It answers **consistent with the listing**, **differs**, or **can't tell**. A seller is paid on "consistent". A difference opens a case with both videos attached.

It is built on Google ADK, Gemini and Cloud Run.

## 2. The problem

**Meet Yuki.** She is a student in Tokyo. She lists a jacket for 6,000 yen. A buyer in Singapore receives it and writes: "There is a stain on the sleeve." Yuki's listing photos show a clean sleeve, but the buyer's photo shows a stain. The platform cannot tell whether it was there before, appeared in transit, or was added later. Whoever it sides with, one person is wrong and angry.

This is common. The evidence we found:

| Fact | Source |
|---|---|
| Second-hand apparel is forecast to reach US$393B by 2030, about 10% of apparel spend. | ThredUp 14th Resale Report, 2 Apr 2026 |
| Japan's reuse market is about 3.3 to 3.5 trillion yen a year and has grown 15 years in a row. | Reuse Economic Journal; Ministry of the Environment (via research summary) |
| Mercari Japan reports a "trouble rate" of 0.35% of transactions (H1 2026), down from 0.56% (H2 2023). Even that low rate is large at Mercari's volume, and Mercari opened a product collection centre and a full-compensation scheme (1 Jul 2025) because disputes could not be settled from chat. | Impress Watch, 1 Sep 2025; Mercari transparency reports |
| Report windows are short: Vinted 2 days, Poshmark 3 days, Mercari US 72 hours. A stain seen on day 3 gets no help. | Platform policy pages |
| Vinted was the 4th most complained-about company on the UK site Resolver by end of 2025. | Resolver, 16 Sep 2025 |
| Buyers now fake damage with AI. They add cracks or stains to photos of intact items to claim refunds. Sellers fake listing photos too. | NSS Magazine, 8 Jun 2026 |
| In Korea, 50.8% of buyers fear poor condition (n=1,000, 2025). | Survey collected in our research files [[add source link]] |
| Casual sellers spend 45 to 90 minutes per item on photos, questions and posting. | Reseller report (weak source); direction only |
| In our own reading of 300 negative app reviews of second-hand marketplaces, 13% were disputes; of 119 dispute stories, 42% got no reply or a canned reply; about 1 in 5 disputes were about item condition. | Our analysis of 7,812 App Store reviews, 12 apps, 10 markets (26 Sep 2026) |

What we did **not** find: any platform publishing its dispute rate for second-hand clothing specifically. We do not claim one.

**The gap:** every platform asks for photos, but none has a record made at listing time that the arrival can be compared with. A tired human makes that comparison today. (Mercari uses a warehouse.)

## 3. Who it is for

- **Sellers like Yuki.** They are paid faster and cannot be falsely accused so easily. Listing takes one video instead of many photos and a written description.
- **Buyers.** They see what the garment looks like, ask it questions in their own language, and know a difference will be noticed.
- **Marketplaces** (Mercari, Carousell, Vinted and similar). They get fewer disputes to hand-judge, fewer abandoned listings, and evidence they can show a regulator or a customer. Fieldwork is a service they embed, not a rival marketplace.
- **Shopping agents** (see section 5). They need a structured, checkable condition to buy a one-of-one item.

## 4. The solution

**Sell it in one take. Settle it in one unboxing.**

1. **One Take (seller, about 45 seconds).** The app shows a one-time code. The seller shows the garment front and back, then the label, with the code in frame. Gemini watches the video and builds the record: item type, brand and size from the label, flaws, a price range, and a listing in several languages. Gemini zooms into suspected flaws itself, so small marks are not lost.
2. **Garment Pass.** The record becomes a web page any buyer or agent can open. "Ask the garment" answers questions only from the record, shows the exact crop, or says "not in the take". It never guesses.
3. **Unbox (buyer).** Two choices: "All good" (one tap) or "Unbox on camera". Filming gives the buyer full protection and gives the seller payment the moment it checks out. Fieldwork pairs matching frames from the two videos, lines them up, and finds changes. Gemini then looks at each pair of crops. The **blink comparator** flashes between the listing crop and the arrival crop so anyone can see the change.
4. **Three outcomes.** *Consistent with the listing*: the seller is paid (simulated). *Differs*: a case opens. *Can't tell*: the system asks for one close-up of a spot the buyer could not predict. "Can't tell" never releases money.
5. **The case.** Both videos are attached. Buyer's text is converted to a fixed set of facts first, so a clever message cannot instruct the model. Gemini rules three times. If the three agree and the claim is small, a remedy is proposed from a published wear-and-tear schedule. If not, a person decides. Photo-only claims are capped; large claims need the item returned.

**Honest wording.** Fieldwork says "consistent with the listing" and "evidence". It never says "verified", "certified" or "guaranteed".

## 5. Why now: shopping agents

Shopping is moving into AI assistants. Google is testing buying inside Gemini and AI Mode (a Flipkart buy button in India, reported 26 Sep 2026, TechCrunch). Google's Agent Payments Protocol (AP2) and the Universal Commerce Protocol (UCP) [[VERIFY name and status]] let an agent pay on a person's behalf with signed approvals.

New items are easy for an agent: the same SKU is identical everywhere. A used jacket is one of a kind. An agent cannot buy it unless it can ask "what shape is it in?" and later check "is this what arrived?" Fieldwork is that missing piece: a **condition oracle** an agent can query. Our demo shows a buyer's agent doing exactly this: one sentence in, a coat found by evidence, two questions asked through MCP, a held payment, and a release only if the unboxing matches. AP2 has no escrow; "release only if the unboxing is consistent" is our extension, simulated in the prototype.

## 6. How it works

```
Phone (Next.js)  ->  Cloud Run (FastAPI + ADK, CPU only)  ->  Gemini
                          |-- take: frames -> record -> flaw zoom -> grade -> listing
                          |-- ask: answers from the record only
                          |-- unbox: pair -> align -> diff -> crop compare -> gate
                          |-- case: quarantine -> 3 rulings -> agreement -> remedy/human
                          |-- agents: ADK buyer agent <-> MCP server
                          '-- escrow (simulated signed mandate)
Storage: Firestore + Cloud Storage [[STATUS]]
```

**Gemini does the visible work.** It watches the video, writes each claim, zooms into flaws, reads the label and the code, answers in Japanese, Korean, Thai, Hindi and more, compares the two sets of crops, and weighs the case. Our own model and classic computer vision are the grounding under it.

| Component | What it does | Tools |
|---|---|---|
| Frame selection | Picks the sharpest frame per view | OpenCV |
| Record | Writes claims, each tied to a frame and box, in four lanes: *Shown*, *Measured*, *Declared*, *Can't judge* | Gemini (video) |
| Flaw zoom | Gemini crops and enlarges before describing | Gemini code-execution tool |
| Condition grade | An honest range such as "grade 3 to 4", from a small trained model | SigLIP 2 features + ordinal head, trained on the RISE dataset (CC-BY 4.0) |
| Pairing and alignment | Match frames across the two videos and line them up | Embedding similarity, AKAZE |
| Change map | Where the garment differs | DINOv2-small patch difference + pixel difference |
| Crop judge | Is the difference real, or just light and folds? | Gemini |
| Gate | Consistent / differs / can't tell; random close-up; flags replayed frames and "too-perfect" matches | Our rules |
| Case | Fact quarantine, three Gemini rulings, agreement check | Gemini |
| Buyer agent | Search by evidence, ask, hold payment, request unbox | ADK + MCP |

## 7. What is new

- **Referee, not grader.** Most AI listing tools grade one photo. Fieldwork compares two moments, the listing and the arrival, which is where disputes happen.
- **The video is the listing, the record and the evidence.** One action replaces photos, descriptions, Q&A and dispute filing.
- **It tells you when it can't tell.** A third answer, with a rule that no money moves on it.
- **Blink comparator.** Astronomers use it to find moving objects between two sky photos. Here it makes a change visible in a second, without reading a report.
- **Tested against its own forger.** We generate AI-faked damage and report how much of it gets caught, and how that falls as the fake is screenshotted or re-photographed. [[RESULT: forger ladder]]
- **A condition oracle for agents.** Used goods become tradable by software.

## 8. Feasibility analysis

### 8.1 Technical feasibility by component

Status key: **Built** = code runs in the repo. **Tested** = measured with results in the README. **Planned** = not started.

| Component | Status | Evidence or next step |
|---|---|---|
| One Take to record (frames, Gemini video, flaw zoom, grade, listing) | Built; [[Tested?]] | `fieldwork/take/`; day-1 tests on video vs photo and zoom gain in `eval/` [[RESULT]] |
| Condition grade head (SigLIP 2, CPU) | Built; [[Tested?]] | `models/heads.joblib`, `train/`; [[RESULT: QWK]] |
| Ask the garment | Built | `ask.py` |
| Unbox check (pair, align, diff, Gemini crop compare, gate, random close-up) | Built; [[Tested?]] | `fieldwork/unbox/`; [[RESULT: recall on planted changes]] |
| Case workflow (quarantine, 3 rulings, agreement, remedy) | Built | `case.py`; [[RESULT: agreement rate]] |
| Buyer agent (ADK) and MCP server | Built | `agents/buyer.py`, `agents/mcp_server.py` |
| Simulated escrow | Built (simulated) | `escrow.py`; signed JSON mandate |
| Seed marketplace and evidence search | Built | `market.py` |
| Front end: sell, pass, agent, unbox (blink comparator), case | Built | `fieldwork-app/` |
| Cloud Run deployment | [[STATUS]] | `Dockerfile`, `deploy.cmd` |
| Virtual try-on preview | Planned | Vertex Virtual Try-On exists; quota limits [[STATUS]] |
| Google Wallet pass | Planned | Needs an issuer account |
| Real AP2 payments | Planned | Needs a payment partner |
| Native app capture attestation | Planned | See section 10 |

### 8.2 Cost

Cost is logged for every Gemini call to `logs/cost.jsonl` (tokens in, tokens out, model). Method: run the evaluation set end to end, sum the log, divide by the number of takes, checks and cases. Prices are Google's published rates at the time of the run.

| Unit | What is included | Cost | Time | Method |
|---|---|---|---|---|
| One take | Video record, flaw zoom, listing in N languages, grade (CPU) | [[RESULT: US$]] | [[RESULT: s]] | Mean over [[N]] takes |
| One unbox check | Pairing, diff, crop judging | [[RESULT: US$]] | [[RESULT: s]] | Mean over [[N]] checks |
| One case | Fact extraction + 3 rulings | [[RESULT: US$]] | [[RESULT: s]] | Mean over [[N]] cases |
| Hosting | Cloud Run (CPU only, scales to zero) | [[RESULT: US$/month at demo load]] | | Cloud Billing export |

Reference point: a trained grader needs 1 to 2 minutes per garment, about US$0.25 to 0.70 for inspection alone (our estimate from US$15 to 20 an hour); a full hub chain is US$3 to 6 per item (estimate). A manual dispute review is also paid labour. [[RESULT: cost per manual dispute, if we can source one]]

### 8.3 Scalability on Cloud Run

- One stateless container, CPU only: the grade model is small and runs on CPU. Model weights are baked into the image, so cold starts do not download them.
- Cloud Run scales with load and to zero when idle. Heavy steps are calls to Gemini, not local compute.
- Limits we know of: Gemini quota and speed (we retry and fall back across model versions), and video upload size on mobile networks. For long Gemini calls we move work to a background job [[STATUS]].
- Load test: [[RESULT: requests per second and p95 time at N concurrent takes]].

### 8.4 Risks and mitigations

| Risk | Likelihood / impact | Mitigation |
|---|---|---|
| Gemini on video misses small flaws a still photo would catch | Medium / high | We extract the sharpest frames and send them as images; one close-up on request; day-1 test result [[RESULT]] |
| Buyer fakes damage with AI | Rising / high | Check against the listing video, not the buyer's photo; replay guard; random close-up; report the forger ladder [[RESULT]] |
| Seller or buyer replays old footage | Medium / medium | Near-identical frame detection; one-time code in the take. Stronger fix needs app attestation (section 10) |
| False "consistent" on a different or near-identical garment | Low / high | Declared-flaw fingerprints must still be present; tested per group [[RESULT]]; "can't tell" never pays |
| Model errors in disputes harm a person | Medium / high | Three rulings must agree; large claims go to a human; photo-only claims are capped; reasons shown in both languages |
| Prompt injection in buyer text | Medium / medium | Text is turned into fixed facts before any ruling |
| Fairness: lighting, skin-tone of models, dark fabrics | Medium / medium | Report results per fabric colour and lighting where N allows; "can't tell" when quality is low |
| Phone video is not like dataset photos | High / medium | Calibrate on phone takes; report coverage as measured |
| Gemini rate limits or renamed models | High / low | Fallback model list, config-only model names, recorded demo fallbacks |
| Marketplaces do not integrate | Medium / high | Start with one partner, an API with two calls (create record, check unbox), no change to their payments |
| Over-claiming | Medium / high | Wording rules, results with intervals, limitations in the README |

### 8.5 Data and privacy

- **Training data:** RISE / Wargön / Myrorna dataset, 31,997 garments, CC-BY 4.0, credited. No scraped marketplace images.
- **Our test garments:** our own wardrobe and friends' clothes, with consent. [[CONFIRM]]
- **What the video holds:** mostly clothes, but a seller's room or face may appear. Plan: ask sellers to frame the garment only; blur faces and background where detected [[STATUS]]; delete raw video after the case window [[policy: N days]].
- **Gemini and personal data:** media is sent to Gemini through the Google Cloud agreement; marketplace deployments would use a data-processing agreement and a regional endpoint (Singapore, Tokyo). Japan's APPI and Singapore's PDPA apply [[confirm legal review]].
- **No sale of data.** Records are visible to buyers only as the public lane; the raw video stays with the platform.
- **Audit trail:** every claim points to a frame and box. Every verdict can be re-opened.

### 8.6 Business model

| Model | Who pays | Notes |
|---|---|---|
| **Per-check fee to the marketplace** | Marketplace | A small fee per take and per unbox check [[RESULT: priced against measured cost]]. Compare: Vinted charges buyers EUR/GBP 10 for item verification on high-value goods; Entrupy sells authentication from US$8 to 10 per item. We target everyday clothing at a much lower price. |
| **Pay-on-pass** | Marketplace or seller | The fee is charged only when the unbox is "consistent" and the deal completes. Marketplace takes no risk on a flop. |
| **Return assurance** | Buyer or marketplace | Filming the unboxing gives a buyer full protection. This turns today's "no video, no refund" rule into a feature, and can extend the short report windows (2 to 3 days) with evidence. |

We do not compete with authentication services. Our position: "we make sure the evidence an authenticator needs exists, and flag where it is needed."

## 9. Impact

- **Fewer disputes decided by guesswork.** Mercari's trouble rate is already low (0.35%), so the target is not volume but the cost per case and the trust lost per case. We will measure how many cases in our test set auto-close with agreement. [[RESULT]]
- **Faster listing.** Target: 2 taps and about 45 seconds, against 45 to 90 minutes reported by resellers. We will time it. [[RESULT: median seconds, n takes]]
- **More supply.** Marketplaces say supply, not demand, limits growth (ThredUp 2026). Easier listing helps. Japan throws away 480,000 tonnes of clothing a year; the government target of a 25% cut by 2030 shows under 2% progress (Ministry of the Environment, via Nippon.com, 4 Jan 2026).
- **JAPAC fit.** High-trust, high-volume resale markets (Japan, Korea) and cross-border buying in Southeast Asia, where the Yuki-to-Singapore case is common. Multilingual output is built in.

## 10. Roadmap after the hackathon

| When | What |
|---|---|
| Next 3 months | One marketplace pilot with the two-call API. More categories (shoes, bags, then phones, books). Wider languages. Larger evaluation with outside sellers. |
| Next 6 months | **Google Wallet pass** for the Garment Pass. **Real AP2** payment mandates with a payment partner. Fieldwork MCP published for any shopping agent. Human-review console for marketplaces. |
| 6 to 12 months | **Native app capture attestation** (device-signed video, proof that it came from the camera in real time), which closes the replay and AI-fake gap that the web app cannot. Memory of a garment through several owners. Measurement from video. |

## 11. Team

[[TEAM: names, roles, background]]

---

### Source notes
Dates and figures are from our research files (`research/reports/R4-01`, `R6-05`, `STATUS.md`). Items marked "weak source" are blogs or vendor posts and are used for direction only. We found no published dispute rate for second-hand clothing and make no such claim.
