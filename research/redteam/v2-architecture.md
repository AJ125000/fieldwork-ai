# Fieldwork v2: product and architecture (spec under attack, 3 Oct 2026)

## Context

- **Event:** Google Cloud AI Builder Cup 2026 (JAPAC), Retail & Commerce theme.
- **Rubric:** Technical 40%, Problem/impact 25%, Innovation 25%, UX 10%. The first round is judged on a live Cloud Run prototype, a video under 3 minutes, a GitHub repo and a deck.
- **Rules:** must use Gemini or Gemma on Google Cloud.
- **Deadline:** submit 17 Oct 2026, 14 days away.
- **Team:** Akshat (strategy/UX, will make the design system), Akshil (data scientist: accuracy tests and models), and Claude (writes most code). No designer.

**Locked problem (thesis v3):** second-hand deals fail because nobody has trustworthy evidence of a one-of-one item's condition. Marketplaces that hold the buyer's money must judge disputes without evidence. Evidence from our research:
- Disputes are 13% of negative C2C app reviews.
- 42% of dispute complainants got no or canned replies.
- Condition is about 1 in 5 dispute triggers.
- Korea 2025: 50.8% fear poor condition.
- 77% of Indian phone resales happen through informal channels.
- Prior art exists for dispute-time photo verdicts (LIQUET, DisputeGuard AI) and for car check-in/out inspection.

## Positioning (hybrid)
Not a marketplace, and no scraping. The product has three parts:
1. A personal AI agent for each buyer and seller. It shares item cards anywhere (WhatsApp/Instagram) and posts to partner marketplaces via official seller APIs (e.g. Depop/OLX partner APIs).
2. B2B APIs for marketplaces, run in the marketplace's own GCP project.
3. An open "item record", a condition-attestation format that marketplaces could send to Merchant Center or UCP, so Google Shopping and AI Mode can show used goods with verified condition.

## Users
- **Primary:** young urban buyers and sellers of used phones and gadgets in India/SEA. Personas: Priya (seller, 26) and Arjun (buyer, 21).
- **Payer:** marketplace operators and escrow providers.
- **Also:** support reviewers.

## 22 "magic moments"
Tiers: ★ core (8), ◐ thin, ○ vision.

**Sell**
- #1 ○ "What's it worth?" home scan.
- #2 ★ 10-second conversational listing: photos → Gemini identifies the model and gets specs via Google Search grounding; reads battery %, storage and serial from a settings screenshot; asks only the 2–3 missing questions by voice or text in Hindi or English; writes the listing in 3 languages plus a structured item record.
- #3 ★ Proof-as-you-go capture: 5 guided angles, a server one-time code shown in frame, and a 10-second turn-around video.
- #4 ◐ Sell now (partner instant offer) vs list.
- #5 ★ Say "yes" once: accepting the price also sets the floor and auto-accept.
- #6 ◐ Share card everywhere.
- #7 ◐ Nudge people who saved the item.

**Buy**
- #8 ◐ "Wanted" requests with auto-match.
- #9 ★ Ask-the-item: Q&A answered from evidence only, with photo crops, multilingual.
- #10 ◐ Fit-for-me.
- #11 ◐ Resale-value tag.

**Deal**
- #12 ★ Agents agree the price: buyer and seller agents over A2A; a policy engine in code holds the floor and ceiling; agents may cite only item-record facts; the human taps accept.
- #13 ◐ No-show deposit.
- #14 ◐ Meetup kit: safe spot via Maps Places, a 5-tap checklist, release.
- #15 ★ 20-second arrival check: 3 guided shots; gross damage via Gemini against the listing facts; unit identity via the serial on screen plus OpenCV feature matching of a unique-mark close-up; output is matches / differs / can't tell.
- #16 ○ Ship by QR.

**After**
- #17 ★ Support that already knows you:
  - AI intake while queued (3 questions, evidence, loads memory).
  - A human gets a briefed case card and never re-asks.
  - A callback instead of hold.
  - Vertex AI Memory Bank remembers history by account or phone, with consent.
- #18 ★ Fair outcome with reasons:
  - A quarantined evidence extractor (Gemini ×3 runs) outputs facts.
  - A policy judge retrieves the rule from Vertex AI Search and recommends, or says "can't tell".
  - A human approves, and both sides see the reason.
- #19 ◐ Evidence vault (deleted chats kept).
- #20 ◐ Two-way ratings.
- #21 ○ Relist in one tap.
- #22 ○ Item history that travels.

## Architecture (9 layers)
1. **Experience:** Next.js PWA (chat-first home, "My stuff", camera with on-device MediaPipe checks), server-rendered item card pages, reviewer console, partner API/widget, voice via the Gemini Live API.
2. **Agents:** ADK on Vertex AI Agent Engine, with one Concierge per user plus about 15 specialists.
   - Sell: Identifier (3.8 Flash + Search grounding), Interviewer (Flash-Lite), Writer (3.8 Flash), Coverage checker (Flash-Lite + grounding boxes), Pricer (Flash-Lite + BigQuery).
   - Buy: Wanted-matcher (embeddings + rules), Ask-the-item (Flash-Lite), Fit/resale.
   - Deal: Negotiation pair (A2A + policy engine), Meetup (Maps), Arrival checker (3.8 Flash + OpenCV).
   - Support: Intake (Flash-Lite + Live), Evidence extractor (quarantined, 3.8 Flash ×3), Policy judge + Brief writer + Co-pilot (Flash-Lite + Vertex AI Search).
3. **Memory:** Agent Engine sessions; Memory Bank (person: language, preferences, limits, past cases; consented, viewable and deletable, with TTL); item record in Firestore + Cloud Storage, append-only events with timestamp and SHA-256 per photo. It is stored with a human_view (multilingual) and a machine view (JSON).
4. **Knowledge:**
   - Google Search grounding for specs, cached per model in BigQuery.
   - Price comps in BigQuery.
   - Policies in Vertex AI Search.
   - A vector index (Firestore vector search).
5. **Trust and safety:**
   - Capture: one-time code in frame, video, location data stripped.
   - Unit identity: OpenCV matching plus a serial check.
   - C2PA read, SynthID and hashes, as risk flags only.
   - Model Armor.
   - The quarantined extractor: a two-stage judge against prompt injection.
   - Sensitive Data Protection to blur faces and documents.
   - A consent manager.
6. **Integrations:** partner marketplace REST + webhooks; attestation export (Merchant Center custom attributes / UCP extension); AP2 mandates + Google Pay test mode (mocked); Maps Places; Agent Assist / Gemini Enterprise for CX as the enterprise path.
7. **Model router:** Flash-Lite first, escalating to 3.8 Flash on low confidence or high value; Gemma 4 fine-tune later; context caching; Batch API; a per-deal budget.
8. **Events:** Pub/Sub → BigQuery → Looker Studio.
9. **Evaluation:** ADK eval; test sets (defects, clean items, identical twins, non-Google fakes, injection); a reliability chart; Cloud Trace and Logging.

## Cost claims (estimates, unmeasured)
- **Assumptions:** Gemini 3.8 Flash $0.75/$3.75 per million tokens (promo until 31 Dec 2026, then $1.50/$7.50); Flash-Lite $0.30/$2.50; ~1,300 tokens per photo.
- **Per completed deal:** ~$0.04–0.05 (about ₹4).
- **Per support case:** ~$0.10 plus a 2-minute human approval, against ~$27–54 today (2–4 contacts at a $13.50 Gartner global median).
- **Grounding:** cached per model.

## Build plan
- The spine (8 core moments) is built and tested end to end by 11 Oct.
- Thin features run 11–13 Oct, then a freeze on 13 Oct, results on 14, video on 15, deck on 16, submit on 17.
- **Cut order:** no-show deposit, sell-now, nudge, fit/resale, safe spot, wanted→search, voice→text, negotiation→scripted.

## Demo (3 minutes)
1. Hook: rental cars get inspected; a used phone doesn't.
2. Priya lists in Hindi by voice.
3. Arjun's wanted-match plus ask-the-item.
4. The agents agree ₹13,200.
5. A crack on arrival → support already knows → the brief → a one-tap human approval.
6. A results table (with failures), cost.
7. The Google fit: the item record as an open attestation.
