# R8-07: Google-native concepts that make trust invisible

**Date:** 8 Oct 2026 · **Lens:** product inventor, "only Google could ship this" · **Context:** ROADMAP-APPAREL-v2.md (capture, grade, list, Q&A, price, handover, dispute, payout are currently separate steps)

**Core idea across all three:** today the condition record is something the user *fills in and files*. In a Google-native version the record is a property of the garment that follows it through surfaces the user already lives in (Photos, camera, Wallet, Gmail, Gemini). Nobody "does trust". It happens as a side effect of normal gestures.

---

## 0. What I verified on the web today (8 Oct 2026) and how much to trust it

| Capability | Status found | Confidence | Note |
|---|---|---|---|
| Gemini 3 Flash **Agentic Vision** (writes and runs Python to crop/zoom/annotate) | Launched late Jan 2026, in Gemini API (AI Studio, Vertex), Gemini app "Thinking" | High (Google blog + several outlets) | 5-10% benchmark lift per Google |
| **Live API**, model `gemini-3.1-flash-live-preview` | Preview since 26 Mar 2026; audio+video(~1 fps JPEG)+text in, audio+text out; WebSocket only; **ephemeral tokens** exist for browser clients (1 min to open session, 30 min to send) | High on model/tokens; video is 1 fps | Official Vertex page still lists 2.5 native-audio as the GA model, so use the preview ID and keep a 2.5 fallback |
| **Gemini Live camera + screen share** on Android | Free for all Android/iOS Gemini users | High | App must stay open |
| **Circle to Search** | Multi-object search + "find your look" (Feb 2026); merging into the Gemini overlay (May 2026, secondary reporting) | Medium | OS feature; no public API to hook it |
| **Google Lens / Shopping Graph** shopping and price info | Live | High | Existing "resale value" feature per our R7-03 |
| **Pixel 10 camera C2PA** (hardware-backed signing, keys per image, secure timestamp; Photos shows it in "About") | Live on Pixel 10; video credentials announced at I/O 2026 for Pixel 8/9/10 (secondary) | Medium-high | **Aug 2026 researcher report says Android C2PA is forgeable.** Treat as one signal, never proof. Use it as an honest "Forger vs Fieldwork" talking point |
| **Google Wallet** Generic pass via REST/JWT ("Add to Google Wallet" on web, email, SMS; Android SDK) | Live, long-standing | High | Consumer "Everything else" AI pass creation is US-only. I found **no** 2026 Wallet announcement at I/O. There is **no native pass-to-pass transfer between users**; we would issue a new pass object per owner |
| **UCP** (Universal Commerce Protocol) | Jan 2026; Gemini/AI Mode checkout with Google Pay; Merchant Center integration; select US merchants only | High | Compatible with A2A, AP2, MCP |
| **AP2** (Agent Payments Protocol) | v0.2 and donated to FIDO Alliance 28 Apr 2026; Intent Mandate, Cart Mandate, "human not present"; repo `google-agentic-commerce/AP2` (Python SDK + samples) | High on facts, repo contents not opened | Good for a faithful simulation |
| **Gemini Spark / Universal Cart** (I/O 2026) | Agent that buys within AP2 limits; payment authority first to trusted testers, then AI Ultra US beta | Medium (secondary sources) | Cannot be called from our app. Slide-only for the real thing |
| **Gmail Purchases tab** (order confirmations grouped) | Sept 2025 | Medium | No public API for the tab. Gmail API search + Gemini parsing works for test users |
| **Merchant Center `condition`** | Values new / refurbished / used; `used` required for second-hand | High | Only three buckets. Our four-lane record plus demerit score is strictly richer, which is the pitch |
| **Ask Photos / Gemini personal intelligence** | Exists; Gemini can use the photo library as context (Apr 2026) | Medium | **Not verified here:** current Google Photos API access. From prior knowledge, the old Library API was restricted to app-created content in 2025 and the **Photos Picker API** is the route for user-selected photos. Check before building |
| **Gemini 3.1 Flash Image (Nano Banana 2)** | Docs live on Gemini Enterprise Agent Platform | High | Already in v2 plan |
| **Web Share Target** (PWA appears in Android share sheet, so "Share from Photos to Fieldwork" works) | Web platform standard, Android Chrome | High (prior knowledge, not searched) | This is the cheap real hook for "Photos to Sell" |

Not verifiable today: any direct "negotiation" feature in Gemini shopping (none found; Direct Offers is an ad-placement product, not price negotiation). Concept C is therefore a design we build, not a Google product we call.

---

## 1. Concept A: "Circle to Sell" (one gesture, one 20-second conversation)

**User story (5 lines)**
1. Priya opens Google Photos, finds a selfie where she wears her denim jacket, and circles the jacket (or shares a fresh photo to Fieldwork).
2. A voice says: "Nice Levi's trucker, size M. The right cuff looks a bit frayed, is that new?" She says "from a snag last winter".
3. The coach asks for one cuff close-up (camera opens, ghost frame, auto-snaps) and says "Bought March 2024, worn about 6 times by your photos. Done."
4. Her listing is live with a four-lane condition record, an error bound, a price band, and an agent-readable spec. Nothing to type.
5. She taps once to publish. The jacket gets a Wallet pass (see Concept B).

**Steps merged:** capture + grading + declared flaws + listing form + price + provenance. (Also pre-answers Q&A, because the record is already attached.)

**Taps and seconds (estimates, our own click-count of a typical listing flow, not measured)**
| | Before (pipeline) | After |
|---|---|---|
| Taps | ~35-45 (6-8 photos, category, size, brand, condition, flaws, price, description) | ~3 (circle, confirm close-up, publish) |
| Seconds | ~5-8 min | ~30-40 s (20 s voice + 10 s close-up) |

**Exact Google services**
- Google Photos (Picker API, or Share-to-PWA) and the Pixel camera / **Circle to Search** gesture as the entry point.
- **Gemini 3.1 Flash Live** for the 20-second coach, fed 1 fps video plus audio, with **Agentic Vision** on Gemini 3 Flash for the detailed flaw pass (the Live model asks, the Agentic Vision model inspects the stills).
- **Gmail API + Gemini** to parse the order email into brand, date, price (provenance). Photos date-stamps give "worn N times" (count of dated photos containing the garment, via SigLIP/Gemini match).
- **Google Lens / Shopping Graph** price anchor for the new-price baseline (fallback: our own comps).
- **Merchant Center** feed mapping (`condition=used` plus our spec) so the listing is machine-readable.
- **C2PA** read of the Pixel photo (is it camera-original and unedited).

**Web prototype in ~5 days**
| Real | Simulated | Slide only |
|---|---|---|
| PWA with Web Share Target, so Photos' share sheet really opens it on Android | "Circle" gesture: a finger-draw on the photo, resolved by SAM 3 (our v2 part-finder), not the OS Circle to Search | Actual Circle to Search / Gemini overlay hook |
| Live API coach in the browser via ephemeral token (voice + 1 fps camera) | "Bought Mar 2024" from a test Gmail account (OAuth testing mode, a few test users, one seeded order email) | Photos-based "worn 6 times" at scale |
| Agentic Vision flaw crops, four-lane record, demerit score, conformal bound (already CORE) | Lens price anchor (hard-coded comps) | Merchant Center live feed |
| c2pa-js read of a Pixel 10 photo | | |
Cost to us: ~1.5 days on top of CORE #3/#4/#5 (the coach is a new front end on existing pieces). Fits only if the web-dev teammate owns the PWA shell.

**30-second demo moment:** on a real Android phone, long-press a Photos picture of a jacket, tap Share to Fieldwork; talk for 20 s; the screen assembles the listing and the four-lane card while a timer shows "0:27". Then the line: "Before this, it was 41 taps."

**Why Google judges would love it:** it is Gemini Live + Agentic Vision + Photos + Gmail doing the thing only Google has: *your own history is the provenance*. Competitors have to ask the user; Google already knows. It is also a clean, relatable showcase of Live API multimodal video, not a chatbot.

**Risks:** Live API video is 1 fps, so the coach cannot judge motion, only stills (fine for apparel). Gmail restricted scopes need verification for real users; test-mode is enough for the demo, say so out loud. Priya's privacy: provenance must be opt-in and shown.

---

## 2. Concept B: "Garment Pass" (the Wallet pass that carries the condition record and the handover check)

**User story (5 lines)**
1. Ravi buys the jacket. An "Add to Google Wallet" button on the order page gives him a **Garment Pass**: hero photo, grade, "Trust: 3 flaws declared, error bound 8%", and a countdown "Inspect within 48 h of delivery".
2. The jacket arrives. He opens Wallet, taps the pass, taps **Inspect**; the camera opens with the *listing photo ghosted over the live view*.
3. It auto-snaps three aligned shots. In about 10 s the pass flips: "Consistent with listing" (green) or "Differs: left cuff, new mark" with the blink-comparator crop on the pass back.
4. Green: pay-on-pass releases the seller's payment via Google Pay and the pass becomes Ravi's: he can resell it with the same record plus one more history line. Red: the pass shows the refund slider anchored to the fair-wear schedule; a human approves.
5. Eighteen months later Ravi lists it: the pass already knows "2 owners, 1 inspection passed, 1 wash-care label verified".

**Steps merged:** handover check + verdict + dispute opening + payout + the *next* listing's capture (the pass is the baseline for the next owner).

**Taps and seconds (estimates)**
| | Before | After |
|---|---|---|
| Taps | ~20 (open app, find order, start check, 6 guided shots with confirm, review, accept/dispute, form) | ~4 (open pass, Inspect, confirm, verdict) |
| Seconds | ~3-5 min | ~40 s |

**Exact Google services**
- **Google Wallet API, Generic pass**: pass class "Garment Pass", one object per owner; state changes via PATCH (status, verdict text, hero image, "Inspect" link as a modules-data link). "Add to Google Wallet" via signed JWT on the web.
- **Camera + Pixel C2PA** at handover for "arrival photos are camera-original" (one signal).
- **Agentic Vision** (crop and compare), plus our RoMa v2 / AnomalyDINO pipeline (CORE #6).
- **Google Pay** (payment rails) for pay-on-pass; **Wallet** for the credential. In India, UPI via Google Pay is the realistic rail. (Not researched today.)
- **Gmail**: pass add-to-wallet and the verdict receipt sent as a structured email (schema.org so it lands in Purchases-style cards). Optional.

**Web prototype in ~5 days**
| Real | Simulated | Slide only |
|---|---|---|
| Issuer + Generic pass class + signed JWT "Add to Google Wallet" for test users, and PATCH updates that visibly change the pass on a real Android phone | Pass "transfer" (we expire the old object and mint a new one for the next owner; Wallet has no native transfer) | Real money movement; pay-on-pass is an escrow ledger in our DB (matches STRETCH-1) |
| Ghost-overlay handover capture, blink comparator, verdict (CORE #3, #6) | Pass issuer accessing production users (Wallet issuer account is in demo mode, so only test-listed Google accounts can add) | Wallet-native transfer, NFC tap-to-verify |
| Dispute card with fair-wear schedule (CORE #7) | | |
Cost: ~0.7 day for Wallet issuer setup, JWT, PATCH, and a Wallet-styled hero image (needs ~1032x812 hero per current Wallet guidance). Very low technical risk; the one fragile bit is Wallet issuer approval, so do it **today** (test mode only needs a Google Pay & Wallet Console account and a service account).

**30-second demo moment:** hold a Pixel; the pass in Wallet reads "Navy jacket, Grade B, inspect now". Tap Inspect, ghost overlay locks, shot fires, then *the pass on the lock-screen-style card visibly changes* to "Differs: left cuff" with the flashing crop. One tap to release or refund. The judge holds the phone.

**Why Google judges would love it:** it turns a *Wallet pass into a verifiable object ledger for physical goods*, which is the kind of "Wallet as the home of trust" story Google already tells for tickets and IDs, extended to product condition and resale. It makes our CORE pipeline *feel* like a Google-native flow instead of a separate app, and the demo is on a real phone.

**Risks:** Wallet branding rules (do not imitate a government or payment pass; Generic type is correct). Transfer is by design a re-issue, so be upfront. Passes are visible on the lock screen: keep PII off the pass (Generic Private needs pre-approval; avoid it).

---

## 3. Concept C: "Two agents shake hands" (buyer's Gemini agent interrogates and pays on pass)

**User story (5 lines)**
1. Meera tells Gemini: "Navy denim trucker, M, under 2,500 rupees, grade B or better, no stains on sleeves, pay only if it matches the listing."
2. That sentence becomes an **AP2 Intent Mandate** (price ceiling, grade floor, conditions). She approves with one biometric tap.
3. Her agent finds three candidates, asks each garment's record (`ask_garment`) "any marks on the sleeves?", and gets answers with crops or "Not in the photos". It rejects one, haggles with the seller's agent on another (counter-offer anchored to remedy anchors and age depreciation).
4. It signs a **Cart Mandate** that is *conditional on the handover check passing*. She sees one card: "Jacket, 2,150, protected by Garment Pass".
5. On delivery she does the 40-second inspect (Concept B). Pass green: payment released. She never chatted with a seller.

**Steps merged:** search + Q&A + price negotiation + checkout + escrow trigger + payout; and it makes the record *buyable by software*.

**Taps and seconds (estimates)**
| | Before | After |
|---|---|---|
| Taps | ~25-30 across listings, chat with seller (hours-days), offer, counter, pay | 1 sentence + 1 biometric approval + (later) inspect |
| Elapsed time | hours to days of back-and-forth | ~15 s on screen for the negotiation (the agents run in the background) |

**Exact Google services**
- **Gemini** (shopping agent) via **Gemini Enterprise Agent Platform** / ADK, with **Agent Engine + Memory Bank** for sizes and preferences (already in v2).
- **AP2** (Intent Mandate, Cart Mandate, Payment Mandate; human-not-present flow; v0.2, now under FIDO) and **UCP** (discovery/checkout shape; AP2 is a UCP extension).
- **A2A / MCP** between the two agents; our `fieldwork-mcp` (`get_record`, `ask_garment`, `verify_handover`).
- **Merchant Center / schema.org** Condition Spec so Google surfaces can read the record. **Google Pay** as the (simulated) rail.
- **Wallet** pass as the proof object the Cart Mandate is conditional on.

**Web prototype in ~5 days**
| Real | Simulated | Slide only |
|---|---|---|
| fieldwork-mcp server + two real Gemini agents (buyer, seller) on Agent Platform with visible tool calls, including a live "make it lie" refusal | AP2 mandates: use the AP2 Python SDK/samples to *sign* real structures (Intent, Cart) with demo keys; payment execution is a ledger entry, not Google Pay | Gemini Spark / AI Mode negotiating with *our* listing. No public hook exists; Spark's payment authority is trusted-tester only |
| Agents negotiating inside our UI with a transcript panel and price converging | Seller agent personalities (firm/flexible) | Real UCP checkout (needs approved Merchant Center and select-merchant status) |
| Conditional release on the handover verdict | | |
Cost: ~1.2 days (MCP 0.5 + agents 0.5 + mandate signing 0.2). The most *ambitious* and the least *controllable*: agent loops can wobble on stage.

**30-second demo moment:** a split screen with two agent logs. Buyer: "Any stains on the sleeves?" Seller-record: "Not in the photos" or a crop. Buyer: "I will not pay above grade B." A price number ticks 2,600, 2,350, 2,150. A mandate card gets stamped. Then cut to the pass going green.

**Why Google judges would love it:** it is literally their agent-commerce stack (AP2, UCP, A2A, MCP, Agent Platform) used for the one thing the stack lacks: *a trusted fact about a physical used item*. It argues that agentic commerce stalls on used goods without a record, and we supply the missing standard.

**Risks:** easiest to look like a slide with extra steps; negotiation has to be visible and honest. Do not claim we use "Gemini Spark" or live UCP checkout.

---

## 4. Comparison

| | A: Circle to Sell | B: Garment Pass | C: Two agents |
|---|---|---|---|
| Steps merged | 6 | 5 (and bootstraps the next sale) | 6 |
| Feels "only Google" | High (Photos+Gmail history) | **Very high** (Wallet as trust object) | High (their own agent stack) |
| Reuses CORE | Yes (#3-5) | **Yes (#3, 6, 7), the most** | Yes (#5, 6, 7 plus MCP) |
| Extra build | ~1.5 d | **~0.7 d** | ~1.2 d |
| Technical risk | Medium (Live latency, Photos access) | **Low** | Medium-high (agent behaviour) |
| Best demo medium | Real phone | **Real phone, judge holds it** | Laptop split screen |

## 5. Recommendation: bet on B, open with A's gesture, close with C as a slide

**Bet: Concept B, the Garment Pass.** It is the cheapest (0.7 day), the least risky, reuses our strongest CORE work (ghost overlay + blink comparator + pay-on-pass), and gives the single most memorable image: *a physical garment gets a Wallet pass whose colour changes when its condition changes*. It also solves the framing problem in v2 ("a pipeline of separate steps") with one object that persists.

Weld the story as **one thread**: *Circle it* (A's gesture, simulated with SAM 3 and a Share Target on Android) → *the garment gets a pass* (B) → *a buyer's agent reads the pass* (C, 15-second slide plus a real `fieldwork-mcp` call if STRETCH-1 lands). Do not build full A and full C; build B fully and a thin A front door (share target plus 20-s coach, ~1 day, droppable).

**Do today:** (1) open a Google Pay & Wallet Console issuer account and mint a test Generic pass; (2) confirm Photos Picker / Share Target on an Android test device; (3) confirm `gemini-3.1-flash-live-preview` access and an ephemeral-token browser demo; (4) clone the AP2 repo and check what the samples actually sign.

**Honesty rules for the pitch:** say "simulated" for payment, mandate execution, and pass transfer; say "test users" for Wallet and Gmail; do not claim Circle to Search integration (it is an OS surface we mimic); treat Pixel C2PA as a signal with a known Aug 2026 forgery report, which feeds directly into Forger vs Fieldwork.

## Sources (found during this research; several are secondary)
- Agentic Vision: blog.google "Introducing Agentic Vision in Gemini 3 Flash"; edge-ai-vision.com, datacamp.com tutorial
- Live API: ai.google.dev/gemini-api/docs/models/gemini-3.1-flash-live-preview; blog.google "Build real-time conversational agents with Gemini 3.1 Flash Live"; ai.google.dev/gemini-api/docs/ephemeral-tokens; Vertex AI Live API overview
- Gemini Live camera/screen share: 9to5google 30 May 2025; androidauthority
- AP2 / FIDO: blog.google "agent-payments-protocol-fido-alliance"; fidoalliance.org announcement (28 Apr 2026); ppc.land
- UCP / checkout: support.google.com/merchants/answer/16837055; 9to5google 11 Jan 2026; retailtouchpoints
- I/O 2026 shopping, Spark, Universal Cart: shopifreaks.com, e-commerce.news, techloy, labellerr (secondary)
- Wallet Generic pass: developers.google.com/wallet/generic; androidauthority/chromeunboxed on "Everything else"; passkit.com 2026 design notes (secondary)
- Pixel C2PA: securityaffairs, hackmag, securityarsenal (secondary); Aug 2026 forgery report seen via a secondary summary only
- Circle to Search: blog.google/intl/de-de Feb 2026 post; androidauthority (overlay merge)
- Merchant Center condition: support.google.com/merchants/answer/6324469
- Gmail Purchases: gadgetbond (Sept 2025)
