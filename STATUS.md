# Fieldwork: project status

**As of:** 4 Oct 2026 · Google Cloud AI Builder Cup 2026 (Retail & Commerce)
**Submit:** Sat 17 Oct 2026 (the official deadline is 18 Oct; 17 Oct leaves a day of buffer) · **Team formation closes:** Sun 11 Oct

Read this first. It covers everything done so far, every file in this folder, the decisions made, and what's next.

---

## 1. Where we are, in one paragraph

- **Problem and product are locked.** Second-hand deals fail because nobody has trustworthy evidence of a one-of-one item's condition. Platforms that hold the buyer's money end up settling disputes by guesswork.
- **The product is Fieldwork:** a trust layer marketplaces embed. Used phones carry evidence, listing takes seconds, a 20-second handover check proves it's the same phone in the same condition, and any problem becomes a case a human settles in one tap.
- **Rigour so far:** the research went through 2 rounds of discovery, and the thesis and the product were each red-teamed by 10 independent reviewers. The full product brief is written.
- **Design:** Akshat delivered the design system.
- **Build:** the first front end (8 screens) is built and runs locally. **No AI is wired in yet.** Akshil owns the AI design; `AI-HANDOFF-SPEC.md` tells him what the screens need. A full premium redesign follows once the AI is final.

---

## 2. What was done, in order

| Date | Step | Output |
|---|---|---|
| 26 Sep | Reviewed the original handoff idea (item attestation); stress-tested it | Verdict: worth pursuing, with reframes |
| 26 Sep | Team change: Owais out, Akshil (data scientist, Esri) in; no geospatial pivot | Decision recorded |
| 26 Sep | **Problem-first research, round 1:** market, players, buyer and seller problems, forums, social media, polls, AI already in use | Landscape doc, main tab |
| 26 Sep | **Own data:** 7,812 App Store reviews (12 apps, 10 markets) pulled and analysed; 360 hand-labelled; 199 dispute stories coded | `research/app-reviews/` |
| 26 Sep | Dispute deep-dive: platform policies, JAPAC regulation, competitors, sizing | Landscape doc |
| 2 Oct | Competition scan: 1,142 public teams read from the Hack2skill listing; nobody works on resale or disputes | `research/competition/` |
| 2 Oct | **Round 2 (gaps):** a fair re-labelling of all complaints, user wishes, non-buyer barriers, informal channels, cross-border, categories, sizing v2, benchmarks (Xianyu, Rakuma, Kream) | Landscape doc, "Round 2" tab |
| 2 Oct | Every researcher's brief, searches, pages opened and full report put into the doc | Landscape doc, "Research files" (26 sub-tabs) |
| 2 Oct | Lifecycle map (13 steps); negotiation research; new models (Gemini 3.8, Jev) | Landscape doc, "Lifecycle" tab |
| 2 Oct | **Red team on the thesis (10 attackers)** → thesis v3 | Landscape doc, "Red team and thesis v3" tab |
| 3 Oct | **Product v1 → v2 → v3:** architecture, journeys, cost; v2 attacked by 10 more reviewers; v3 is the current version | Product doc |
| 3 Oct | **Complete product brief** (22 sections) | `FIELDWORK-PRODUCT-BRIEF.md` |
| 3 Oct | Design system received from Akshat | `fieldwork-app/DESIGN.md` |
| 3 Oct | Portable Node.js installed (no admin needed); **front end v0 built**: 8 screens; reviewer console fixed so the AI's recommendation isn't pre-selected | `fieldwork-app/` |
| 4 Oct | Launcher fixed (a second dev server was blocking it); a double-click runner added | `fieldwork-app/run-dev.cmd` |
| 4 Oct | Team registered on Hack2skill | Done |
| 4 Oct | **Non-users deep dive** (why people don't buy or sell second-hand): 69% of Indians hesitate to sell an old phone over data fears (Cashify, n=8,000); proposed data wipe + wipe record, IMEI and lock check, condition video | Landscape doc, "Non-users deep dive" tab |
| 4 Oct | Decision: **Akshil owns all AI architecture and model choices** | This file |
| 4 Oct | **AI handoff spec**: what each screen sends to the AI and needs back, without dictating the AI design | `AI-HANDOFF-SPEC.md` |
| 4 Oct | UI audit with the ui-ux-pro-max skill: 7 accessibility and layout fixes; colour-contrast items left for Akshat | `fieldwork-app/UI-AUDIT.md` |
| 4 Oct | Decision: **complete premium UI/UX redesign** after the AI is final (11–14 Oct) | This file |

---

## 3. The key findings (corrected figures)

| Finding | Number |
|---|---|
| Disputes in negative second-hand C2C app reviews | **13%** (300 labelled) |
| The platform's handling (disputes, bans, support) as the complaint | 44% (combined category) |
| Dispute complainants who got no reply or a canned one | **42%** (119 coded stories) |
| Disputes triggered by item condition | about **1 in 5** |
| Korea: buyers who fear poor condition | **50.8%** (n=1,000, 2025) |
| India: phone resales that happen outside platforms | **77%** (Cashify, n=10,000) |
| Japan reuse market | ¥3.46T (2025, +6.2%) |
| Google testing a Flipkart Buy button in Gemini and AI Mode in India (smartphones first) | 26 Sep 2026 ([TechCrunch](https://techcrunch.com/2026/09/26/google-tests-buying-from-walmart-owned-flipkart-through-gemini-and-ai-mode-in-india/)) |
| Prior art for dispute-time AI verdicts | LIQUET (Jul 2026), DisputeGuard AI (Jun 2026, Gemini) |

**What's new about our product:** the rental-car inspection model applied to C2C goods. That means:
- evidence captured at listing time
- coverage checked claim by claim
- proof it's the same physical unit
- capture people can trust
- an outcome based on evidence that can say "can't tell"

---

## 4. Product v3 (current)

**Six moments:**
1. **List in seconds:** a first draft in about 10 s; tap-chips for the details.
2. **Proof as you go:** guided capture with a one-time code in the frame.
3. **Ask the item:** answered from the public evidence only.
4. **Agree a price:** a code engine holds the limits; A2A is used only with external buyer agents.
5. **20-second handover check (the hero):** Matches / Differs / Can't tell.
6. **Problem → a case settled in one tap:** AI intake, a case card, and a human decides.

**Architecture:**
- 2 Cloud Run services (web, and an API running one ADK app).
- Firestore as the single source of truth, with public and private item views and a hash-chained event log.
- 3 true agents; everything else runs as fixed pipelines.
- Models: Gemini 3.8 Flash and 3.5 Flash-Lite.

**Cost (estimates until measured):**

| Item | Before cuts | Target |
|---|---|---|
| Per deal | ~$0.12–0.17 | $0.05–0.08 |
| Per support case (incl. human approval) | ~$0.30–0.45 | — |
| India human baseline per case | ~$0.6–6 | — |

**Wording:** "evidence-weighted", never "verified".

---

## 5. Files in this folder

| Path | What it is |
|---|---|
| `STATUS.md` | This file |
| `FIELDWORK-PRODUCT-BRIEF.md` | **The complete product brief.** Read it before designing or building |
| `AI-HANDOFF-SPEC.md` | **For Akshil:** inputs, outputs, speed and product rules for each AI moment. Architecture is his call |
| `fieldwork-app/UI-AUDIT.md` | Accessibility and layout audit of the 8 screens, with open design decisions |
| `fieldwork-app/` | The front end (Next.js) |
| `fieldwork-app/DESIGN.md` | Akshat's design contract (authoritative for visuals) |
| `fieldwork-app/CLAUDE.md` | Agreed overrides plus build notes for coding agents |
| `fieldwork-app/run-dev.cmd` | **Double-click to run the app** → http://localhost:3000 |
| `fieldwork-app/app/` | Pages, global CSS and `tokens.css`, the design tokens |
| `fieldwork-app/components/` | 24 reusable components (Button, ClaimRow, EvidenceBadge, ResultCard, PriceTimeline, OutcomeCard, and others) |
| `fieldwork-app/lib/mock.ts` | Sample data (iPhone 13, Priya, Arjun, case FW-1042) |
| `research/app-reviews/` | Review data (`data/`), fetch and classify scripts, samples, labels (360 negative, 199 dispute, 190 wish) |
| `research/competition/` | 1,142 public hackathon teams (`teams.jsonl`) and raw pages |
| `research/reports/` | Every researcher's full report: R1-01–15, R2-01–08, R3-01–02, the red team on the thesis (`RT-redteam.md`), the red team on v2 plus research (`V2-redteam.md`), and the app-review detail (`A-app-review-detail.md`) |
| `research/redteam/` | The two specs that were attacked (`thesis.md`, `v2-architecture.md`) |

**Not included:** `node_modules/` and `.next/`. They're regenerated automatically the first time `run-dev.cmd` runs.

**The app's screens** (open after starting it):

| Route | Screen |
|---|---|
| `/` | Home |
| `/sell` | Guided capture |
| `/sell/draft` | Listing draft |
| `/item/iphone-13?tab=evidence` | Item evidence |
| `/deal/iphone-13` | Price agreement |
| `/handover/iphone-13?result=matches` | Handover check (also `differs`, `cant-tell`) |
| `/case/fw-1042` | Problem → case |
| `/review` | Reviewer console (desktop) |

---

## 6. Online docs (not in the zip; they live on claude.ai)

| Doc | Link | Tabs |
|---|---|---|
| **Problem research** | https://claude.ai/code/artifact/84268a38-6449-47da-bc1b-0107c0539054 | Landscape · Deep dive · Round 2 · Lifecycle · Red team and thesis v3 · Research files (27 raw sub-tabs) |
| **Product and architecture** | https://claude.ai/code/artifact/4adc2275-7187-4465-912c-5eabdc69de3b | **v3 (current)** · v2 · v1 · Red team and research reports (full) |

Any tab can be exported to PDF, Word or Markdown from the doc itself.

---

## 7. Decisions made

- **Positioning:** an embedded trust layer (the Klarna and Affirm model). Not a marketplace, not a scraper, and not a third-party agent acting on a platform's users.
- **Hero:** the 20-second handover check. Lead market for the story: India persona; Japan and Korea data show where disputes hurt most.
- **Category:** used phones and gadgets priced roughly ₹4,000 and up.
- **Data:** our own photographed items, synthetic disputes and labelled fakes. **No eBay data** (its API terms restrict AI use) and no scraping. Reddit was blocked for automated tools and wasn't used.
- **Design overrides:** IBM Plex (not Söhne); the hex values in DESIGN.md; no confidence numbers; no confetti; no shield icon; navigation Home / Buy / Capture / Sell / Help.
- **Team name:** Fieldwork (recommended, not yet confirmed).

---

## 8. Next steps

| When | What | Who |
|---|---|---|
| Now | Send `AI-HANDOFF-SPEC.md` to Akshil; get his answers (§10) and his hours; confirm employer policies (Meesho, Esri) | Akshat, Akshil |
| 5–6 Oct | Demo data: policy doc, price table, 20 synthetic disputes + injection attempts, 40 ask-the-item questions, results table template | Claude |
| 5–6 Oct | Create a GitHub repo and a Google Cloud project with billing | Akshat |
| 4–5 Oct | Photograph test items: ~30 with real defects, 30 clean, 2–3 identical phone pairs, 5 angles each | Akshat |
| 4–6 Oct | AI design and accuracy test (Akshil decides the approach) | Akshil |
| by 11 Oct | Collect 5–10 app screens you love; decide whether the redesign may change the brand (colours, fonts) or only raise the polish | Akshat |
| 5–11 Oct | Build the AI (Akshil's design) | Akshil |
| 5–11 Oct | Firebase Auth, Firestore, photo storage; `lib/ai.ts` swap-in point; deploy the web app to Cloud Run | Claude |
| **11 Oct** | End-to-end test of the spine | All |
| 11–14 Oct | **Complete premium UI/UX redesign** (after the AI is final; every screen, button and flow; ui-ux-pro-max skill) | Claude + Akshat |
| **13 Oct** | Feature freeze | All |
| 14 Oct | Results table (sample sizes, error ranges, failures shown); cost measured | Akshil |
| 15 Oct | Video (under 3 min) | Akshat |
| 16 Oct | Deck and README | Akshat + Claude |
| **17 Oct** | **Submit** | Akshat |

---

## 9. Open decisions

- [ ] Product name: Fieldwork, or a separate name?
- [ ] Akshil's available hours until 17 Oct.
- [ ] Akshil's answers to the handoff spec (§10).
- [ ] Redesign scope: may it change the brand, or only the polish?
- [ ] Contrast: darken the quiet-grey text and the Differs / Can't tell label colours? (see UI-AUDIT.md)
- [ ] YouGov India figure: 36% or 41%? (to verify)
- [ ] Voice input in v1, or text only?
- [ ] Which test phones we can borrow, including identical pairs.
- [ ] Employer policy confirmations (Meesho, Esri).
