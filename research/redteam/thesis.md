# Thesis under attack (v2, 2 Oct 2026)

## Context
- **Event:** Google Cloud AI Builder Cup 2026 (Hack2skill, JAPAC).
- **Theme:** Retail & Commerce. The brief: "Build an AI-powered solution that transforms how businesses understand, engage, and serve customers while improving operational efficiency across physical and digital commerce. May address discovery, personalization, conversational shopping, demand planning, inventory, customer insights, or fraud."
- **Rubric:** Technical merit 40%, Problem alignment & impact 25%, Innovation 25%, UX 10%.
- **First round:** judged on a deployed prototype (Cloud Run), a demo video under 3 minutes, a public GitHub repo and a PDF deck. Must use Gemini or Gemma on Google Cloud.
- **Timeline:** submission due 18 Oct 2026, 16 days away. The goal is to reach the finalist list (Singapore, 4 Dec).
- **Team:** two people. One is a business/strategy analyst at an Indian marketplace. The other is a data scientist at Esri (GIS company). No designer.
- **Research done:** desk research and our own analysis of public app reviews only. No user interviews or surveys (no time).

## The problem (thesis)
The deepest unsolved problem in JAPAC second-hand (C2C) commerce is **condition uncertainty**: nobody can prove what condition a one-of-one used item is in.
- It is the #1 reason non-users don't buy.
- It is the root of the platform-judgement failures (disputes, bans, support) that unhappy users complain about most.
- Platforms that hold payment (escrow) inherit disputes they can't judge fairly or cheaply.

## Key evidence we rely on
1. **Barriers to buying second-hand:**
   - 68% of never-buyers cite quality (Carousell survey, 3,000+ people, 8 SEA/HK/TW markets, 2021).
   - Korea 2025 (n=1,000, second-hand clothing): poor condition 50.8%, fraud 44.7%, fakes 37.7%.
   - Japan 2024 (n=363 flea-market users): 59% worry about return trouble.
2. **Our App Store analysis.**
   - Data: 7,812 recent reviews of 12 apps in 10 markets (iOS only). 52% are negative.
   - Sample: a random 360 negative reviews, labelled by an AI labeller with limited human spot-checks.
   - In C2C apps (300 reviews):
     - App bugs 39%, fees 26%, bans/moderation 26%, support 21%, dispute handling 13%, scams 13%, discovery 8%.
     - Grouped: "platform judgement" (moderation, disputes, support) 44%.
   - Japan: disputes 32%. Korea: moderation 42%. India and Australia: discovery 20%.
3. **Dispute anatomy:**
   - 199 reviews were selected by dispute keywords; 119 were real disputes.
   - Complainants: sellers 53%, buyers 38%.
   - Platform response: 49% got no response or a canned reply.
   - Evidence: 13 of the 15 who had evidence say it was ignored.
   - Wanted: a fair decision 62%, the platform to intervene 58%.
4. **Platform policies:** timers decide many outcomes (2–9 day confirmation windows, 48 hours for a seller to respond). Nobody checks listing claims against photos at listing time.
5. **Why now:**
   - Protected payment is spreading (Bunjang made it mandatory in 2024; Joonggonara escrow transactions +162% in H1 2026).
   - Human support is shrinking (Mercari suspended chat in Feb 2026; Bunjang cut phone support).
   - Regulation is tightening (Korea's 2024–25 e-commerce law requires platforms to try resolving C2C disputes first; Singapore's online harms code and transaction safety ratings; Australia's scams law).
   - Multimodal AI is now cheap.
6. **Market size:**
   - Japan reuse ¥3.46T (2025, +6.2%), of which C2C ¥1.44T. Idle goods in Japanese homes are worth ¥90.5T.
   - Yahoo Flea Market "trouble rate" 0.3–0.6% of transactions.
   - Estimate: 1–4.5M trouble cases a year at Mercari plus Yahoo, costing $15–180M a year to handle.
   - Software revenue estimate: about $20–50M a year across JAPAC (dispute handling plus verified listings).
7. **Competition and prior art:**
   - No vendor turns listing, photos and chat into a reasoned dispute verdict.
   - Xianyu resolves 92% of its disputes through a crowd jury (7.5M jurors); its AI only routes cases.
   - Xianyu has a seller-side negotiation agent. Nobody ships a buyer-side one.
   - Among 1,142 public hackathon teams, none touch resale, disputes or marketplace trust.
8. **Threat:** AI-generated fake "damage" photos are being used in refund claims (Vinted, Amazon, Fnac; March 2026).

## The product (proposed)
A **condition evidence engine** sold to marketplaces (B2B), acting as a "chain of custody for one-of-one goods":
1. **Listing:**
   - Draft the listing from photos and extract each claim ("no scratches", "battery 90%").
   - **Photo coach:** tell the seller which shots prove each claim.
   - Mark each claim as photo-backed or not.
   - Sign photos at capture (C2PA where available).
2. **Buying:** a condition card (what's proven and what isn't), trust-aware search, and "ask the listing" questions answered from the evidence.
3. **Negotiation:** a buyer agent and a seller agent negotiate over Google's A2A protocol within limits each user sets, and may only state facts from the condition record. A human confirms the deal.
4. **Pack-out and arrival checks:** photos at packing and at arrival are compared with the listing photos (same physical item? new damage?).
5. **Disputes:** a case handler assembles the full chain, compares the photos, runs fake-photo risk checks (C2PA, SynthID, TruFor, Gemini), retrieves the platform's policy, and recommends an outcome with reasons. It abstains when unsure. A human approves.
6. **Returns:** the return-match check asks whether the returned item is the same physical item.
7. **Operations dashboard:** BigQuery and Looker.

- **Stack:** Gemini 3.8 Flash, Gemini 3.5 Flash-Lite (fast yes/no checks with confidence), Gemini grounding (defect boxes), Gemini Embedding 2 (same-item matching), ADK 2.11 on Agent Engine, A2A/AP2 (mocked payments), Cloud Run, BigQuery, Looker, and Gemma 4 for triage.
- **Category for the prototype:** used electronics/gadgets. A second demo scene is a Japanese cross-border listing explained for a buyer in Singapore.
- **Data plan:** our own photographed items, the eBay Browse API, synthetic disputes modelled on the 119 coded stories, and generated fake photos.
- **Build:** 4 deep pieces (engine, case handler, condition card, arrival check). Negotiation, search, pricing, pack-out and the dashboard are thin.
- **Day-1 test:** Gemini claim-checking accuracy on 50 listings.

## Pitch line
"68% of people who never buy second-hand cite condition. Platforms can't prove it, so they can't judge it. We give every used item a chain of custody."

## Research files (local, for evidence checks)
C:\Users\Akshat Lathi\Claude Code\ai-builder-cup\research\
- reports\*.md: full researcher reports, with sources.
- app-reviews\: raw review data, samples and label files.
- competition\teams.jsonl: the 1,142 public teams.
