# Fieldwork: complete product brief

**Version:** v3 · 3 Oct 2026
**For:** Akshat (brand, design system, UX), Akshil (AI and models), and Claude (build). Read this before designing anything.
**Status:** problem locked; product v3 locked after two rounds of red-teaming (20 independent attacks).
**Deadline:** submit the Google Cloud AI Builder Cup entry by **Sat 17 Oct 2026**. The official deadline is 18 Oct, which we keep as buffer. Team formation closes **11 Oct**.

> **The one sentence.** Rental cars get a photo inspection at pickup and drop-off. A second-hand phone gets nothing. When it arrives cracked, nobody can prove who's right, and the platform holding the money has to guess. **Fieldwork is the trust layer marketplaces embed so that used phones carry evidence.** Listing takes seconds, a 20-second handover check proves it's the same phone in the same condition, and any problem becomes a case a human can settle in one tap.

---

## Contents

1. [The competition and what wins it](#1-the-competition-and-what-wins-it)
2. [The problem, and the evidence behind it](#2-the-problem-and-the-evidence-behind-it)
3. [Why now](#3-why-now)
4. [Who it's for](#4-who-its-for)
5. [Positioning: what Fieldwork is and isn't](#5-positioning-what-fieldwork-is-and-isnt)
6. [The product: six moments](#6-the-product-six-moments)
7. [Journeys, screen by screen](#7-journeys-screen-by-screen)
8. [Experience principles](#8-experience-principles)
9. [What the design system must deliver](#9-what-the-design-system-must-deliver)
10. [Voice, tone and words](#10-voice-tone-and-words)
11. [How it works: architecture](#11-how-it-works-architecture)
12. [How the AI behaves](#12-how-the-ai-behaves)
13. [Trust, safety and privacy](#13-trust-safety-and-privacy)
14. [Cost](#14-cost)
15. [Fit with Google's ecosystem](#15-fit-with-googles-ecosystem)
16. [What we build vs the roadmap](#16-what-we-build-vs-the-roadmap)
17. [The demo](#17-the-demo)
18. [Evaluation: how we prove it works](#18-evaluation-how-we-prove-it-works)
19. [Plan, owners and dates](#19-plan-owners-and-dates)
20. [Open decisions](#20-open-decisions)
21. [Glossary](#21-glossary)
22. [Where everything lives](#22-where-everything-lives)

---

## 1. The competition and what wins it

| | |
|---|---|
| **Event** | Google Cloud AI Builder Cup 2026, run by Hack2skill, JAPAC-wide |
| **Theme** | Retail & Commerce: *"an AI-powered solution that transforms how businesses understand, engage, and serve customers while improving operational efficiency… may address discovery, personalization, conversational shopping, demand planning, inventory, customer insights, or fraud."* |
| **Goal** | Reach the finalist list and go to the Singapore Grand Finale (4 Dec 2026). Winning outright is a bonus |
| **Rules** | Must use **Gemini or Gemma** on **Google Cloud**, and deploy on **Cloud Run or Firebase**. The project must be fresh, built within the hackathon window |
| **What gets judged** | (1) a live deployed prototype link, (2) a demo video **under 3 minutes**, (3) a public GitHub repo, (4) a PDF deck |
| **Scoring** | Technical merit **40%** · Problem alignment and impact **25%** · Innovation **25%** · UX **10%** |

**What wins, from our research on past editions and the red teams:**

- **One deep, provable moment** beats many shallow features. Judges skim 3 minutes, so the hard thing must be *visible* and *measured*.
- **An honest results table**, with sample sizes, error ranges and failures shown, signals technical seriousness.
- **A live link that works on first click:** no cold start, a sample item, a "try it with your photos" button.
- **Real use of Google's 2026 stack** beats mocked integrations.
- **Specific beats vague.** Of 1,142 public competitor teams, 47% had blank descriptions and almost none stated a problem. **None works on second-hand goods, disputes or marketplace trust.**

---

## 2. The problem, and the evidence behind it

**The problem, stated honestly:** marketplaces that hold the buyer's money until delivery have to settle disputes about one-of-one used items with no trustworthy evidence. So they fall back on timers, templates and default refunds. Buyers fear lemons, sellers fear false claims, and support can't judge fairly or cheaply.

**Why used goods are different:** every used item is one of a kind. The seller knows far more about it than the buyer. This is the classic "market for lemons", where buyers who can't tell good from bad end up driving good sellers out. New goods have product codes, warranties and reviews that apply to every unit; used goods have none of that.

**Evidence** (all sourced; full detail in the landscape doc):

| Finding | Number | Source |
|---|---|---|
| Disputes in negative reviews of second-hand C2C apps | **13%** of 300 labelled reviews (20% in the first, narrower labelling) | Our analysis of 7,812 App Store reviews, 12 apps, 10 markets |
| The platform's handling (disputes, bans, support) as the complaint | 44% (a combined category) | Same |
| Japan: disputes in negative reviews | 32% | Same |
| Complainants who got no reply or a canned one | **42%** of 119 coded dispute stories | Same |
| Of those who said they had evidence, how many said it was ignored | 13 of 15 (a very small sample) | Same |
| Disputes triggered by the item's condition (not as described, fake, missing parts) | about **1 in 5** | Same |
| Korea: buyers who fear poor condition / fraud / fakes | **50.8% / 44.7% / 37.7%** | Embrain 2025, n=1,000 (clothing) |
| Japan: flea-market users who worry about return trouble | 59% | Velvet Japan 2024, n=363 |
| India: phone resales that happen outside formal platforms | **77%** | Cashify 2025, n=10,000 |
| Platforms resolve by timers | 2–9 day confirmation windows; 48 hours for a seller to reply | Platform policy teardown |
| Human support is shrinking | Mercari suspended chat (Feb 2026); Bunjang cut phone support | Same |
| Second-hand market size | Japan reuse market ¥3.46T (2025, +6.2%); C2C ¥1.44T | Reuse Economy Shimbun |
| Scam losses | Singapore e-commerce scams S$16.7M (2025); Korea second-hand fraud ₩334B (2024) | Police and consumer-agency data |

**What we must NOT claim** (the red team corrected these):

- "Condition uncertainty is the root cause of everything." Condition is one dispute trigger in about five.
- "68% of never-buyers cite condition." That's a 2021 Carousell figure about *quality*, for never-buyers only.
- "Nobody does AI dispute verdicts." LIQUET (July 2026) and DisputeGuard AI (June 2026, on Gemini) already do. Car check-in/check-out inspection (Ravin, UVeye, DeGould) is mature.
- **What's new:** bringing the rental-car inspection model to C2C goods. That means:
  - a condition record at *listing* time
  - per-claim coverage
  - *physical-unit* identity
  - trusted capture by ordinary people on ordinary phones
  - an evidence-based outcome that can say "can't tell"

---

## 3. Why now

1. **Google is bringing AI-agent checkout to Indian phones.** On 26 Sep 2026, Google began testing a Flipkart **Buy button inside Gemini and AI Mode in India, on UCP, starting with smartphones and electronics**, with wider rollout this October ([TechCrunch](https://techcrunch.com/2026/09/26/google-tests-buying-from-walmart-owned-flipkart-through-gemini-and-ai-mode-in-india/)). New phones now have agentic checkout. **Used phones have no trust layer for it.**
2. **Protected payment is spreading.** Bunjang made it mandatory in 2024, and Joonggonara's protected transactions rose 162% in H1 2026. Platforms holding the money inherit disputes.
3. **Human support is shrinking** while case volume grows.
4. **Regulation is tightening.** Korea's e-commerce law now requires C2C platforms to try to resolve disputes first. Singapore's online harms code and transaction safety ratings apply.
5. **AI can now read a whole case cheaply**, and AI-faked "damage" photos are appearing in refund claims (Vinted, Amazon, Fnac, Airbnb, 2026). Evidence has to be captured *before* the dispute.

---

## 4. Who it's for

**Design for the people; sell to the platform.**

| | Person | Their job | What they fear | What they'd love but won't ask for |
|---|---|---|---|---|
| **Seller (hero)** | **Priya**, 26, Bengaluru, selling her iPhone before upgrading | "Turn this into money fast, with no hassle and no comeback" | Lowballers, time-wasters, a buyer claiming damage after the sale | Never typing a description; proof she didn't break it; never haggling face to face |
| **Buyer** | **Arjun**, 21, student in Pune, wants a phone under ₹15,000 | "Get a good one cheaper than new, without being cheated" | A hidden crack, a fake, being scammed | Honest answers in his own language; a 20-second check that protects him; never repeating his story to support |
| **Reviewer** | A support agent at the marketplace | "Close the case fairly, fast" | Scattered evidence, angry users, 2 minutes per case | The whole case on one screen, with a suggested answer and the rule |
| **Payer** | Head of trust and safety at a mid-size marketplace or escrow provider | "Grow trusted transactions at low cost" | Cost per case, refund abuse, regulators | Faster, fairer, cheaper decisions; fewer disputes; more listings |

**Device and context constraints (design for these):**
- Low- and mid-range Android phones (3–4 GB RAM), patchy 4G, sometimes 3G.
- Hinglish (code-mixed Hindi and English) is normal, as is Roman-script Hindi. Voice is unreliable in noisy places.
- Many deals are **meetups** (India, Korea, Southeast Asia): no shipping, and payment by UPI or cash.
- Users already distrust AI decisions about their money. Users' most common complaint about platforms is chatbots that "ghost" them.

---

## 5. Positioning: what Fieldwork is and isn't

**Fieldwork is an embedded trust layer.** It's like Klarna or Affirm inside a merchant's checkout: the marketplace owns the user, the brand and the escrow, and Fieldwork powers the evidence, the handover check and the case outcome. It's delivered as:
1. **A white-label experience** that a marketplace puts inside its app. In the hackathon this is our **reference app**, showing the full journey.
2. **APIs** that a marketplace calls (listing evidence, handover check, case brief), running in the marketplace's own Google Cloud project.
3. **Real Google integrations:**
   - an AP2 payment mandate carrying the evidence ID
   - a marketplace feed row (`condition=used` plus evidence fields)
   - a tool that Gemini Enterprise for CX can call to fetch evidence

**What Fieldwork is NOT (decided after red-teaming):**
- **Not a new marketplace.** Marketplaces live on network effects, and the incumbents already have them.
- **Not an aggregator or scraper.** Scraping exposes us to terms-of-use lawsuits, and eBay restricts AI use of its data.
- **Not a third-party agent negotiating with a platform's users from outside.** Platforms sue over that (Amazon v. Perplexity).
- **Not "verified".** We say **"evidence-weighted"**, because a web app can't prove a photo came from a genuine phone.
- **Not an "open standard" we announce.** We show real AP2 and feed artifacts, and *request* a verified-condition attribute from Google.

**Pitch line:** *"Google gives the agent; Fieldwork gives it the evidence."*

---

## 6. The product: six moments

Six moments are built. Everything else from our 22-moment ideation is a roadmap slide (§16).

### Moment 1: List in seconds
- **What the user sees:**
  - Snap photos. A first draft streams in about 10 seconds: model, storage, colour, a title and a description.
  - **Tap-chips** answer the 2–3 missing questions (voice optional): "How long used?", "Any repairs?", "Box and bill?"
  - The listing appears in **Hindi and English**, with each claim marked ✅ *shown* or ○ *not shown yet*.
  - At most **one** prompt for an extra photo: "Show the back edge to back up 'no dents'".
  - A suggested price and the seller's **floor**, confirmed in rupees.
- **Why it delights:**
  - No typing.
  - Never forgetting what buyers will ask.
  - **No big platform interviews the seller.** Xianyu, Mercari and eBay only auto-fill from photos.
- **AI:** the model is identified from the photos; specs come from a per-model cache, with web lookup only for new models; battery %, storage and serial are read from a **settings screenshot**; the Interviewer agent asks for the missing facts; one call writes the listing and checks coverage.

### Moment 2: Proof as you go (the "evidence badge")
- **What the user sees:** a guided camera with a progress ring across 5 angles, a short **one-time code** shown in the frame (it expires in 60 seconds), and a quick "turn the phone" motion. Framed as **"Get the evidence badge"**, a bonus and never a gate. One close-up of a **unique mark** (a scratch, sticker or worn edge) proves which unit this is.
- **Why it delights:** protection for the seller, with almost no extra effort.
- **AI and code:**
  - Blur, framing and light are checked on the phone.
  - Screens being re-photographed are detected.
  - Every photo is hashed, and the hashes go to a locked log.
  - Location data is stripped.

### Moment 3: Ask the item
- **What the user sees:** the buyer asks in Hinglish, "Back mein dent hai?" ("Is there a dent on the back?"). The answer comes with the **exact photo crop**, or "Not shown in the photos, ask the seller".
- **Why it delights:** honest answers in your own language, instantly.
- **AI:** answers come only from the item's **public** evidence. It refuses questions about serials, location or what's in the background.

### Moment 4: Agree a price
- **What the user sees:**
  - The seller sets a floor once, with an explicit rupee confirmation. Auto-accept is off by default, with a 10-minute undo.
  - A buyer's shopping agent (for example, a Gemini-style agent) negotiates with the marketplace's seller agent.
  - A **price timeline** shows offer → counter → agreed, with the rupee amount large. One tap to accept.
- **Why it delights:** no awkward haggling, no lowballers.
- **AI and code:** a **price engine in code** produces every offer inside the limits. One small model call only *phrases* the message, citing item facts. The engine is exposed over **A2A** to *external* buyer agents. Only typed offers cross that boundary.

### Moment 5: The 20-second handover check (the hero)
- **What the user sees:** the buyer opens the check from the delivery notification (or does it at a meetup), and takes 3 guided shots plus the phone's "About" screen. Then one of three results:
  - 🟢 **"Matches the listing"**: payment released.
  - 🟠 **"Differs: screen crack"**: a case opens with the evidence attached.
  - ⚪ **"Can't tell, take 1 more photo of the top edge"**: always with a next step.
- **Meetup mode:** a 5-tap inspection checklist built from the item record, then both phones confirm.
- **Why it delights:** a check that protects you and finishes in 20 seconds.
- **AI and code:**
  - The **serial is read from the screen**.
  - The **unique mark is matched** with OpenCV, so it's the *same unit*, not just the same model.
  - Gemini looks for **gross damage** against the stored listing facts.
  - A rules engine combines these into the three outcomes.

### Moment 6: Problem → a case settled in one tap
- **What the user sees:**
  - "Report a problem", then a guided capture of the issue.
  - While the case waits for a human, an **intake agent asks only what's missing**. It already knows the order, the item record and the handover evidence. It offers a **callback instead of hold**.
  - The **reviewer** sees a case card: a 2-line summary, the facts ("crack visible in arrival photo 2; not in listing photo 4 or the turn video; serial matches"), the **rule cited**, and a recommendation or "can't tell". They approve in one tap.
  - **Both sides** see the outcome and the reason, in their language, with a one-tap appeal.
  - With consent, it **remembers your history** next time, but only after you log in.
- **Why it delights:** never repeating yourself, never waiting on hold, and being treated fairly. (Akshat's idea.)
- **AI:**
  - A **quarantined** fact extractor reads the evidence, and a policy step that never sees raw text drafts the recommendation.
  - Confidence comes from agreement plus rules. Below the threshold, the answer is "can't tell".
  - A human always decides.

---

## 7. Journeys, screen by screen

### Seller: Priya (about 60 seconds of her time)
| Step | Screen | What happens | Moment |
|---|---|---|---|
| 1 | Home → **Sell** (big camera button) | Opens the guided camera | 1, 2 |
| 2 | Camera | 5 angles + code in frame + turn; on-device quality checks | 2 |
| 3 | Settings shot | "Show Settings › Battery": reads 87%, storage, serial | 1 |
| 4 | Quick questions | 2–3 tap-chips (voice optional) | 1 |
| 5 | Draft listing | Streams in; claims ✅ / ○; one "add this shot" prompt | 1 |
| 6 | Price | Suggested price + floor; explicit rupee confirmation | 1, 4 |
| 7 | Published | Item card live in the marketplace; shareable link back into its checkout | 1 |
| 8 | Deal | "Arjun's agent offered ₹13,200, within your floor. Accept?" | 4 |

### Buyer: Arjun
| Step | Screen | What happens | Moment |
|---|---|---|---|
| 1 | **Buy** → search | Finds the iPhone 12 with an evidence badge | — |
| 2 | **Item card** | One line: "4 of 5 claims shown · battery 87% (read from screen)". Photos, coverage, seller's answers | 1, 2 |
| 3 | Ask | "Back mein dent?" → answer with photo crop | 3 |
| 4 | Price | His agent agrees ₹13,200 inside his ceiling; one tap | 4 |
| 5 | Pay | Protected payment (simulated) | — |
| 6 | Handover | 20-second check, or meetup checklist → result | 5 |
| 7 | Done | Rate each other; the item moves to his "My stuff" | — |

### When something goes wrong
| Step | Screen | What happens | Moment |
|---|---|---|---|
| 1 | Handover result: 🟠 differs | "Screen crack, not in the listing photos" → Report | 5 |
| 2 | Report | Guided capture of the problem; evidence attached automatically | 6 |
| 3 | Intake chat | Asks only what's missing; offers a callback | 6 |
| 4 | Reviewer console | Case card: facts, rule, recommendation; one-tap approve | 6 |
| 5 | Outcome | Both sides see the decision and the reason; appeal in one tap | 6 |

---

## 8. Experience principles

1. **No extra work by default.** Every extra step must earn its place. At most one extra photo request, ever.
2. **Credit, never shame.** Shown claims get a green tick; unshown claims are neutral grey ("not shown yet"), never red. No seller is labelled a liar.
3. **Three honest states.** Matches / Differs / Can't tell. "Can't tell" always comes with a next action.
4. **AI recommends, people decide.** Always show the reason and the evidence, and always offer a human. The words "AI decided" never appear.
5. **Money moves only on an explicit tap.** UPI-style confirmations, with the amount in large rupees, the counterparty named, and an undo window.
6. **Show, don't tell.** Photo crops and highlighted regions beat paragraphs.
7. **Tap first, voice second.** Chips for answers; voice as a shortcut. Serial numbers are never entered by voice.
8. **One next step.** Every screen has one primary action. Home always shows "your next step".
9. **Works on cheap phones and slow networks.** Photos upload first, video is compressed, uploads resume, and an "offline, will sync" state exists.
10. **Bilingual by default.** Hindi and English, with Roman-script Hindi accepted. Japanese and Korean are on the roadmap.
11. **Calm, not alarming.** Fraud language is avoided in buyer and seller screens. Risk flags are visible only to reviewers.

---

## 9. What the design system must deliver

This is the brief for Akshat's brand guidelines and design system. Deliver in this order; items 1–5 are needed by **6 Oct** for wireframes.

### 9.1 Brand foundations
- **Product name:** "Fieldwork" is the team name. Decide whether the product uses it or gets its own name (see §20).
- **Brand idea:** *calm proof*. Trustworthy like a bank, light like a camera app, human like a friend who checks things for you.
- **Personality:** honest, calm, quick, fair, warm. Not: alarming, legalistic, salesy, cute.
- **Logo:** works at 16 px (app icon, favicon) and as a small **evidence badge** placed on other brands' listings, because the product is white-label.
- **White-label rule:** the system must work inside *someone else's* app. Expect a thin Fieldwork layer (the badge, the handover check, the case card) that adopts the host's primary colour while keeping our state colours and badge shape.

### 9.2 Colour
- **Neutral palette** for surfaces and text (light mode first; dark mode on the roadmap).
- **One primary** brand colour, replaceable by the host's.
- **Semantic state colours.** These are critical, and fixed across hosts:

| State | Meaning | Must convey |
|---|---|---|
| **Shown / Matches** | Evidence supports the claim; handover matches | Positive, calm (not celebratory) |
| **Not shown yet** | No evidence for a claim | Neutral grey, never negative |
| **Differs** | Evidence contradicts the claim or listing | Attention, amber, not red panic |
| **Can't tell** | Not enough evidence | Neutral with an action |
| **Error / blocked** | System problem, failed upload | Clear, recoverable |
| **Money** | Amounts and payment actions | Distinct, high contrast |

- **Contrast:** text at least 4.5:1; never colour alone (always icon + label).

### 9.3 Typography
- Must support **Latin and Devanagari** (Hindi) in matching weights. Japanese and Korean later.
- A large, clear **numeric style** for rupee amounts and battery %.
- Minimum body size 16 sp; a reading level that works for a Class 6–8 English reader.

### 9.4 Iconography
- **Evidence badge:** the core mark, used on listings and cards.
- **State icons** for shown / not shown / differs / can't tell / matches.
- **Capture icons:** camera, angle guides, code-in-frame, turn the phone, unique mark, settings screenshot.
- **Deal icons:** offer, counter, agreed, protected payment, meetup, delivery.
- **Support icons:** report, case, callback, reviewer, appeal.

### 9.5 Components (the minimum set)
| Component | Notes |
|---|---|
| **Bottom navigation** | 4 tabs: Home, Sell, Buy, Help |
| **Next-step card** | Top of Home; one action |
| **Item status pill** | Listed · In deal · Handover pending · Matches · Case open |
| **Guided camera overlay** | Angle outline, progress ring (5 steps), code-in-frame area, quality warnings ("too dark", "hold steady") |
| **Claim row** | Claim text + state icon + "see photo" link |
| **Coverage summary** | "4 of 5 claims shown" + mini progress |
| **Evidence badge** | Small and large sizes; host-colour-safe |
| **Photo with highlight** | Photo with a bounding box or crop highlight + caption |
| **Tap-chip question** | 2–4 chips + "Not sure" + mic shortcut |
| **Streaming draft card** | Shows content filling in progressively |
| **Price confirmation sheet** | Big ₹ amount, floor, counterparty, Change link, Confirm |
| **Price timeline** | Offer → counter → agreed; the latest amount large |
| **Handover result card** | Three variants (matches / differs / can't tell) with the next action |
| **Meetup checklist** | 5 tappable checks built from the item record |
| **Chat bubble set** | User / AI agent / human agent clearly distinguished; "AI" label on agent messages |
| **Case card** (reviewer) | 2-line summary · facts with thumbnails · rule cited · recommendation · Approve / Change / Ask human |
| **Outcome card** (users) | "What we saw" / "The rule" / "Decision" / Appeal |
| **Consent screen** | One purpose per screen, in Hindi and English, toggle + "learn more" |
| **Toasts and banners** | Offline, syncing, upload failed + retry |
| **Empty, loading and skeleton states** | For every list and card |

### 9.6 Motion
- Subtle, purposeful: the streaming draft, the capture progress ring, the result reveal.
- No celebratory confetti on money or disputes. Calm confirmations only.
- Respect reduced-motion settings.

### 9.7 Imagery
- Real phone photos (our own test items), never stock.
- AI-generated images may appear only as **clearly labelled illustration**, never as evidence.
- Illustration style for empty states: simple, warm, inclusive of Indian users.

### 9.8 Layout
- Mobile-first, 360–412 dp wide. The reviewer console is the one desktop screen (1280 px+).
- 16 px side gutters, 8 px spacing grid, tap targets at least 48 dp.

### 9.9 Accessibility
- Screen-reader labels on every icon and state.
- Never rely on colour alone.
- Big tap targets; support for dynamic text size.
- Plain language.

### 9.10 Deliverable format (what to hand to Claude)
- **Design tokens** as JSON or a table: colours (including semantic states), type scale, spacing, radius, elevation, motion durations.
- **Component specs:** a screenshot or frame per component, with states.
- **Brand voice sheet:** 10 do/don't examples (see §10).
- **Logo files:** SVG plus a badge variant.
- Figma links are welcome. A markdown or PDF spec is fine too.

---

## 10. Voice, tone and words

**Voice:** a calm, fair friend who checks things for you. Short sentences. Rupees and numbers stated plainly.

| Say | Don't say |
|---|---|
| "4 of 5 claims shown in photos" | "Verified" / "Certified" / "Guaranteed" |
| "Not shown yet" | "Unproven" / "Suspicious" / "Fake?" |
| "Differs: screen crack" | "Fraud detected" / "Seller lied" |
| "Can't tell from these photos. Take one more of the top edge" | "Error" / "Insufficient data" |
| "Recommended: repair credit, based on rule 4.2" | "AI decided" |
| "A person will confirm this" | "Final decision" |
| "Your agent offered ₹13,200 (above your floor ₹12,800)" | "Auto-accepted" with no amount |
| "Evidence badge" | "Trust score" (it implies judging people) |

**Hindi copy:** natural Hinglish where users write that way ("Back mein dent hai?"). Avoid stiff formal Hindi. Have a native speaker review it.

**Labelling AI:** every AI message is labelled "AI". Every human agent is labelled with a role and first name.

---

## 11. How it works: architecture

**Two Cloud Run services, one database, three true agents, and fixed pipelines for everything else.**

```
Phone web app (Next.js PWA)  ──►  API service (one ADK app on Cloud Run, min instances 1)
  Home · Sell · Buy · Help          ├─ Listing pipeline: identify → missing fields → Interviewer agent → write + coverage → price
  + reviewer console                ├─ Capture service: 60 s code, turn check, screen-replay check, hashes → locked bucket
                                    ├─ Ask-the-item agent (public view only)
                                    ├─ Price engine (code) + phrasing call + A2A endpoint for external buyer agents
                                    ├─ Handover-check pipeline: serial read, OpenCV mark match, Gemini damage, rules
                                    └─ Support: intake agent + case workflow (extract → policy → recommend / can't tell)
Data: Firestore (single source of truth) + Cloud Storage (photos) + locked bucket (hash log)
Models: Gemini 3.8 Flash · Gemini 3.5 Flash-Lite · Gemini 3.8 Live (voice, optional)
Google integrations: AP2 mandate (evidence ID) · marketplace feed row · case brief as a tool for Gemini Enterprise for CX
```

**The three true agents** (multi-turn, needing judgement):

| Agent | Job | Guardrails |
|---|---|---|
| Interviewer | Asks only the missing 2–3 facts | Can't set prices; writes only typed fields |
| Ask-the-item | Answers from public evidence with photo crops | Refuses identifier and location questions; rate-limited |
| Support intake | Gathers the problem while you wait; never re-asks | Masked summary before login; memory keyed to the logged-in user |

**Data model (Firestore):**

| Collection | Holds |
|---|---|
| `users` | Profile, language, consents, typed preferences; keyed by Firebase Auth user ID (the phone number is only an attribute) |
| `items` (public view) | Blurred photos, model, condition summary, last 4 digits of the serial |
| `items` (private view) | Original photos, full serial, location, floor price |
| `items/{id}/events` | Append-only events (capture, claims, Q&A, price, handover check, case), each carrying the previous event's hash |
| `deals`, `cases` | Status, parties, evidence IDs, decision, reason |
| `comps` | ~40 hand-collected sold prices for the demo models (disclosed as seeded) |

**Operations:**
- Region asia-south1 (Mumbai) for data and compute. Check the Gemini endpoint's region.
- Min instances 1; request quota increases now; timeouts, retries and fallback models on every call.
- A recorded fallback for the demo.
- Cloud Logging and Cloud Trace.

---

## 12. How the AI behaves

- **Claim types, and what we can honestly say about each:**

| Claim type | Example | What we say |
|---|---|---|
| Readable | "Battery 87%", "128 GB", serial | **Read from screen** |
| Visible defect | "Small dent on corner" | **Shown**, with the region highlighted |
| Absence | "No scratches" | "**No scratch visible in these 5 angles**". Never "proven" |
| Not visual | "Never repaired" | "**Not checkable from photos**" |

- **Same unit, not just the same model:** we use the serial number plus a unique-mark match. If there are no distinguishing marks, the answer is "**not enough unique marks**", and we ask for the About screen.
- **Confidence:** comes from agreement plus rules (photo count, blur, coverage), never from the model's self-reported number. Below the threshold, the answer is "can't tell".
- **Defence against manipulative text:** text in listings, chats or photos is treated as data. The case extractor is quarantined; the policy step never sees raw text; only typed offers cross the agent boundary.
- **Fake photos:** evidence comes from **live in-app capture**. Detectors (C2PA, SynthID, edit checks) are **risk flags for reviewers only**, never proof.
- **The human always decides** money outcomes. Both sides always see the reason.

---

## 13. Trust, safety and privacy

**Must-dos for the build:**
1. **Log in with Firebase Auth (phone OTP).** Memory and cases are keyed to the user ID, never the phone number.
2. **Public vs private item views.** The serial is masked, faces and documents are blurred, and location is stripped. Card links are unguessable, not indexed, and can expire or be revoked.
3. **Ask-the-item reads only the public view.**
4. **Only typed JSON offers cross the A2A boundary.** The price engine alone reads the limits.
5. **No floor change without an on-screen rupee confirmation.**
6. **Photo hashes go to a locked bucket,** and the event chain is hash-linked.
7. **One consent screen per purpose,** in Hindi and English; an 18+ gate; a page to view and delete your data.
8. **Model Armor on the case extractor's inputs.** The injection test set is published in the repo.
9. **Demo data:** only our own photographed items, synthetic disputes and labelled generated fakes. **No eBay data** (its API terms restrict AI use) and no scraping.

**Say in the deck (roadmap):**
- a native app with device attestation (Play Integrity, App Attest)
- signed agent cards
- a Cloud KMS signature chain
- SIM-swap signals
- regional data handling for Japan

**Regulatory notes:**
- **India:** the DPDP Act requires plain-language, purpose-specific consent.
- **Korea:** people have the right to refuse fully automated decisions, which is why a human always decides.
- **Japan:** APPI governs cross-border transfers.
- **Australia:** disclosure rules for automated decision-making apply from Dec 2026.

---

## 14. Cost

**Assumptions:**
- Official Gemini pricing, quoted at **post-promo** rates. Gemini 3.8 Flash's promo price ends 31 Dec 2026.
- Photos at medium resolution (280–560 tokens each).
- These are estimates until we measure 20 real runs in week 1.

| Item | Estimate |
|---|---|
| AI cost per completed deal, before cuts | ~$0.12 (promo) / $0.17 (post-promo) |
| Target after cuts | **~$0.05–0.08 (~₹5–7)** |
| Support case, AI | ~$0.05 after cuts |
| Support case, 2-minute human approval | ~$0.13–0.27 |
| **Support case total** | **~$0.20–0.30** |
| Today's human baseline in India | ~$0.6–6 per case (2–4 contacts at ₹25–130 each; an indicative vendor benchmark) |

**The real value isn't only cost per case.** It's:
- **resolution time:** minutes, not days
- **fewer disputes**, because evidence exists from the start
- **fairer outcomes**
- **more listings**, because selling is effortless

Savings are larger in Japan, Korea and Singapore, where support costs more.

**Cost cuts built in:**
- Medium or low photo resolution.
- Caption each photo once and reuse the caption.
- Minimal thinking for simple steps.
- All languages in one call.
- One extraction run, escalating only when needed.
- The Batch API for callback cases.
- Spec caching per phone model.
- A static list of safe meetup spots (live Maps calls cost about $0.03 each).

---

## 15. Fit with Google's ecosystem

| Google product | How we use it | Real or mocked in the demo |
|---|---|---|
| Gemini 3.8 Flash, 3.5 Flash-Lite (GA) | All reasoning, vision, writing | **Real** |
| Gemini 3.8 Live | Optional voice answers in listing and support | Real if time allows |
| ADK + A2A | Agents; price engine exposed to external buyer agents | **Real** |
| Cloud Run, Firestore, Cloud Storage, Firebase Auth | The app, the data, the login | **Real** |
| Search grounding | Specs for a phone model not seen before | **Real** (cached) |
| Model Armor | Screening inputs to the case extractor | **Real** |
| AP2 | Mandate carrying the evidence ID (JSON round trip) | **Real JSON**; payment simulated |
| Merchant Center | Sample marketplace feed row: `condition=used` + evidence fields | **Real sample**, not submitted |
| Gemini Enterprise for CX | Calls our case brief as a tool | Shown as an integration slide or diagram |
| UCP / AI Mode | The Flipkart pilot shows the direction; used goods need our layer | Story slide |

**Why Google would care:** AI Mode and Gemini are starting to sell phones in India. Bringing **used** goods into agentic checkout needs evidence of condition. Fieldwork is that evidence layer, built on Google's own stack.

---

## 16. What we build vs the roadmap

| Tier | What |
|---|---|
| **Built (6 moments)** | List in seconds · proof as you go · ask the item · agree a price · **20-second handover check (the hero)** · problem → a case settled in one tap |
| **Thin, if time allows** | Meetup checklist polish · seller rates buyer · evidence vault (deleted chats kept for open cases) |
| **Roadmap slide only** | "What's it worth?" home scan · sell now vs list (instant offers) · "wanted" requests with auto-match · fit-for-me · resale-value tag · nudging people who saved an item · no-show deposit · ship by QR · relist in one tap · item history that travels to the next owner · native app with device attestation · Japanese and Korean |

**Cut order if we slip** (the hero and the case flow are never cut):
1. Voice (falls back to text).
2. A2A to an external agent (falls back to in-app price agreement).
3. Ask-the-item polish.
4. Meetup mode.

---

## 17. The demo

**3 minutes, one story, depth on the hero moment:**

| Time | Scene |
|---|---|
| 0:00–0:15 | **Hook:** "Rental cars get inspected at pickup. Your second-hand phone gets nothing." |
| 0:15–0:45 | **Priya lists:** photos → draft streams in → settings screenshot read (87%) → 2 tap-chips → claims ✅/○ → one extra shot → price confirmed in ₹ |
| 0:45–1:05 | **Arjun checks:** asks "back mein dent?" and gets a photo-crop answer; his agent and the seller's agree ₹13,200 over A2A; one tap |
| 1:05–2:00 | **The hero, filmed in one take on a real phone:** the handover check, three outcomes. Matches → release. A real crack → "Differs", same unit proven (serial + mark). A deliberate "can't tell" → "take one more photo" |
| 2:00–2:30 | **The case:** the AI gathered everything while Arjun waited; the reviewer's case card shows facts and the rule cited; approved in one tap; both sides see why |
| 2:30–2:50 | **Results table:** sample sizes, accuracy, "can't tell" rate, injection tests, one honest failure, measured cost per deal and per case |
| 2:50–3:00 | **Google fit:** "Google gives the agent; Fieldwork gives it the evidence." AP2 mandate with the evidence ID + feed row |

**The live link for judges:** opens on a sample deal with "Try the handover check with your own photos". It's kept warm, with a recorded fallback.

---

## 18. Evaluation: how we prove it works

**Rule:** every row shows **sample size, measure, 95% error range, "can't tell" rate, and a MEASURED or QUALITATIVE label. Failures are shown.**

| Component | Measure | Test set | Min N |
|---|---|---|---|
| Screenshot reader | Exact match: battery %, storage, serial | Real iOS and Android screenshots | 60 |
| Model identification | Exact model incl. look-alikes (iPhone 12 vs 13) | Own and borrowed phones | 60 |
| Claim coverage | Precision and recall of shown / not shown | Staged sets with deliberate gaps | 40 |
| **Handover check** | **Recall of "differs" at fixed precision; wrong-"matches" rate; "can't tell" rate** | **Staged damage, identical twins, clean pairs** | **40 pairs** |
| Case workflow | Agreement with human labels; injection success rate | Hand-labelled cases + 30 injection attempts | 100 + 30 |
| Ask-the-item | Recall of defect facts; false-reassurance rate | Hand-built item records | 50 questions |
| Price | Error vs the seeded sold-price table | ~40 comparisons | 40 (qualitative) |
| Hindi listing quality | Native-speaker rating, 1–5 | 20 listings | 20 (qualitative) |
| Price agreement | Deal rate; limit violations (zero by design) | Scripted scenarios | 30 (qualitative) |

**Test items to collect:**
- About **30 phones and gadgets with real defects** and **30 clean ones**.
- At least **2–3 identical-model pairs** for the identity test.
- 5 angles each, real phone photos, mixed lighting.
- Fakes from at least 2 non-Google image generators, plus manual edits.

---

## 19. Plan, owners and dates

| Who | Owns |
|---|---|
| **Akshat** | Registration (by 11 Oct); **brand guidelines and design system (by 6 Oct)**; wireframe review; Hindi and English copy; test-item photos; seeded price table; demo marketplace policy document; synthetic dispute cases; deck and video |
| **Akshil** | GCP project; the accuracy tests (identification, coverage, handover, twins); unit-identity matcher; calibration of "can't tell"; injection and fake test sets; the results table |
| **Claude** | Wireframes from the design system; the web app and reviewer console; the ADK app, pipelines, agents and price engine; capture and hashing; Firebase Auth; AP2 and feed artifacts; deployment; README and deck drafts |

| Date | Milestone |
|---|---|
| 3–4 Oct | GCP project, repo, hello-world on Cloud Run; photograph test items |
| 4–5 Oct | **Accuracy test → go/no-go per claim type** (e.g. drop hairline scratches if recall is under ~60%) |
| **6 Oct** | **Design system and brand guidelines due** |
| 7 Oct | Wireframes for the 5 key screens: (1) Home with the next-step card, (2) Sell camera + finished listing, (3) item card, (4) price agreement, (5) handover result + case outcome; plus the reviewer console |
| 8–11 Oct | Build the spine; **end-to-end test on 11 Oct** (also the team-formation deadline) |
| 11–13 Oct | Polish, then the thin features if the spine passes |
| **13 Oct** | **Feature freeze** |
| 14 Oct | Results table, cost measurement |
| 15 Oct | Record the video |
| 16 Oct | Deck and README |
| **17 Oct** | **Submit** (18 Oct is buffer) |

---

## 20. Open decisions

- [ ] **Product name:** "Fieldwork" or a separate product name? (The team is registered as Fieldwork.)
- [ ] **Lead market in the pitch:** an India persona (recommended), with Japan and Korea data as proof that disputes hurt most where platforms hold money.
- [ ] **Akshil's available hours,** and confirmation that he owns the accuracy tests.
- [ ] **Employer policies:** both teammates confirm with their employers (Meesho, Esri) on outside work and IP.
- [ ] **Voice in v1:** in, if the spine is done by 11 Oct, or out.
- [ ] **Test items:** which phones we can borrow, including identical pairs.

---

## 21. Glossary

| Term | Meaning |
|---|---|
| C2C | Consumer to consumer: individuals selling to individuals |
| Escrow / protected payment | The platform holds the buyer's money until the buyer confirms receipt |
| Item record | Everything known about one physical item: photos, claims, evidence, events, decisions. Has a public view and a private view |
| Evidence badge | A mark showing a listing has guided, code-stamped photos |
| Claim coverage | Whether each claim in a listing is shown in the photos |
| Handover check | A 20-second photo check at delivery or meetup |
| Unit identity | Proving it's the same physical phone (serial + unique mark), not just the same model |
| Case card | The reviewer's one-screen summary of a dispute |
| "Can't tell" | The honest third answer when evidence isn't enough |
| Evidence-weighted | Our wording instead of "verified"; we weigh evidence, we don't certify |
| ADK | Google's Agent Development Kit, for building agents |
| A2A | Agent-to-agent protocol; how an outside buyer agent talks to our seller agent |
| AP2 | Agent Payments Protocol; payment mandates (we carry the evidence ID in one) |
| UCP | Universal Commerce Protocol; Google's agentic checkout standard |
| Merchant Center feed | How marketplaces send listings to Google Shopping |
| DPDP | India's Digital Personal Data Protection Act |

---

## 22. Where everything lives

| What | Where |
|---|---|
| **Product and architecture** (v3 is the first tab; also v1, v2, full red-team reports) | https://claude.ai/code/artifact/4adc2275-7187-4465-912c-5eabdc69de3b |
| **Problem research** (landscape; deep dive; round 2; lifecycle; red team on the thesis; 27 raw research files) | https://claude.ai/code/artifact/84268a38-6449-47da-bc1b-0107c0539054 |
| App-review data, scripts and labels | `ai-builder-cup/research/app-reviews/` |
| Competitor team listing (1,142 teams) | `ai-builder-cup/research/competition/teams.jsonl` |
| Raw researcher and red-team reports | `ai-builder-cup/research/reports/` |
| Specs that were red-teamed | `ai-builder-cup/research/redteam/` |
| This brief | `ai-builder-cup/FIELDWORK-PRODUCT-BRIEF.md` |

---

*When the design system is ready, hand Claude: design tokens (colours including the six semantic states, type scale with Devanagari, spacing, radius, elevation, motion), the component specs from §9.5, the voice sheet, and the logo/badge SVGs. Wireframes for the five key screens follow within a day.*
