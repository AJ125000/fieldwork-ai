# R8-06: Inventor lens, "one gesture" concepts for pre-loved apparel

**Date:** 8 Oct 2026. **Brief:** collapse capture, grading, listing, buyer questions, price, handover, dispute and payout into one seamless act, where trust is a by-product of something users already do.
**Method:** ~10 tool calls of feasibility and prior-art checks. Time and tap figures are my own estimates, not measured. Anything I could not confirm is marked.

---

## 0. The insight that drives all three

People already film themselves for trust. In Korea, the Philippines and Indonesia, sellers now say "no unboxing video, no refund", and buyers record the box being opened as a matter of habit. Courts and platforms treat it as helpful but not required. The behaviour exists; nobody turns it into a **machine-checked, auto-settling** record. At the same time, AI-faked unboxing and damage clips are rising (a Chinese merchant case in Dec 2025, Vinted's refund-fraud wave), so a raw video is no longer trusted by itself. The opening: **make the video the checkable object, captured in-app with a live challenge, and let the verdict pay out by itself.**

## 1. Feasibility facts checked today (8 Oct 2026)

| Capability | Status | Consequence for design |
|---|---|---|
| Gemini 3.x video understanding on uploaded files | Documented (gemini-3-flash-preview in Google's video docs; Files API for large or reused video) | Backbone for Concepts 1 and 2. Safe. |
| Agentic video understanding (model chooses what to watch, at what speed; lower tokens) | A changelog mirror says documented 1 Sep 2026 for 3.5/3.6/3.7 Flash. **I saw only snippets; verify on the official changelog.** | Nice-to-have for the demo. Do not depend on it. |
| Gemini Live API with video | `gemini-3.1-flash-live-preview` (26 Mar 2026) lists video input. Video goes in as **JPEG frames, max ~1 fps, ~768x768 recommended**. Function calling and Search tools are supported. Audio-first model. Session length limits not confirmed. | Good for conversation and "look at this". **Not** good for evidence: 1 fps misses fine defects. Concept 3 must use it only as the talker and call stills-based tools for facts. |
| On-device | Gemma 4 E2B/E4B (Apache 2.0, 2 Apr 2026) run offline on phones; Gemini Nano 4 is in AICore developer preview, flagship rollout late 2026. **No confirmed real-time camera API for Nano 4 / Gemma 4; sources conflict on whether the small models take video.** | Do not promise on-device AI judging. Use plain CV (sharpness, motion, coverage) on-device and Gemini in the cloud. |
| Capture provenance | Pixel 10 camera signs C2PA at Assurance Level 2 using StrongBox keys. Only some devices and native apps. | A web demo cannot use it. Position as a v2 hardening step; for the demo use in-app capture, a live nonce and server timestamps. |

## 2. Prior art (what is not new)

- **Photo to listing:** Depop (one photo, Sep 2024), Poshmark Smart List (2025, reported 48% less listing time), plus small apps (List My Closet, FlipFlow, PreLoved AI, Listvore). None carries a condition record or handover logic.
- **Video/voice to listing:** the **Hero** app takes video or voice to make eBay/Facebook Marketplace listings. So "video makes the listing" is not new on its own. What is new is the same take being a graded, measured, signed baseline that is **re-checked at handover**.
- **Closet capture:** Whering (10M users, $7M seed from eBay Ventures and Google AI Futures Fund, Jul 2026) has one-click resale and plans gallery scanning (a plan, not a launch). Google Photos has a Wardrobe feature (Apr 2026), not for resale. So passive closet capture is a crowded, well-funded lane we cannot win in 5 days.
- **Tags:** Digital product passports (EU ESPR), Coach's Coachtopia tag, Eon with Vestiaire and The RealReal. Brand-issued, so useless for everyday garments without tags.
- **Unboxing as evidence:** only a seller-side convention and a few dispute flows asking for it. I found no marketplace that **reads** the unboxing video, compares it with the listing and pays out.

Rejected as primary concepts: **tag/QR only** (needs physical distribution; we can use the QR as a seal and carrier inside Concepts 1 and 2), **passive closet** (privacy, and Whering and Google own it).

---

## CONCEPT 1: "One Take" (the 12-second spin)

**User story (5 lines)**
1. Seller holds the jacket up and presses one button. The screen shows a 3-digit code to read aloud.
2. They turn the garment slowly front, back, cuff, label, for about 12 seconds, saying the code.
3. By the time the phone is down, the listing is drafted in the seller's language: title, brand, size, material, condition grade with crops of every flaw, a price band.
4. The seller taps once to publish. The same video becomes "Ask the garment" for buyers (answers cite a frame).
5. The take is also the sealed reference that the handover check compares against later.

**Old steps merged:** photo capture + condition grading + listing form + price + buyer questions + the reference record for handover + liveness and identity (one object). Seven chores, one gesture.

**Taps / seconds** (estimates)

| | Before | After |
|---|---|---|
| Seller to a live listing | ~8-12 photos, ~10 form fields: about 50 taps and 7-8 min | 2 taps (record, publish) and about 45 s including processing |
| Buyer question | Chat, wait for the seller | Instant, with frame evidence |

**The AI**
- **On-device (plain CV, no model risk):** sharpness and motion-blur scoring per frame, coverage tracking (did we see front, back, label, both cuffs, collar), a nudge such as "slower on the left cuff".
- **Frame selection:** pick the sharpest frame per view, plus top-k frames around any suspected flaw.
- **Gemini video understanding** reads the whole clip (attributes, brand, material, visible flaws, a spoken seller note, the code said aloud as audio liveness) and returns structured JSON.
- **Gemini Agentic Vision** (already in v2 roadmap) on the selected stills to crop and zoom flaws; four-point demerit score; our trained SigLIP 2 + CORN grader and conformal sets for the grade; per-claim filtering so the record only states what the frames support.
- **Identity fingerprint:** embeddings of label and print frames plus tag-code OCR; hash of the clip; this is the handover baseline.
- **Measurement:** garment held against a credit card or on a flat surface; GarmentIQ gives cm. Optional, a bonus because of the day-1 test.

**Hardest technical risk:** a hand-held spin gives motion blur, hands covering the garment, and uneven coverage, so flaws are missed or measurement is off. Second risk: a video can be pre-recorded or faked, so the nonce must be fresh and checked in audio and on-screen (reflection or a printed card with the code). Mitigation: guided pace, auto-reject and re-prompt in the first 2 seconds, a fold-flat "last shot" prompt if coverage is below target, and a calibrated "can't tell" for unseen parts.

**Buildable in ~5 days by an AI coding assistant?** **Yes, the most buildable of the three.** Web app with `getUserMedia` + `MediaRecorder`, Laplacian sharpness in JS/Python, Gemini file API for the clip, the roadmap's existing inspector and record. Measurement and the trained grader are stretch. Day 1: capture + frame selection; Day 2: Gemini structured output + record; Day 3: Ask-the-garment; Day 4: handover baseline; Day 5: polish and eval.

**30-second demo moment:** a judge's jacket, one 12-second spin, phone down. A Japanese listing appears with a flaw crop on the left cuff and "price band ¥X-Y". Then ask in English "any stain on the sleeve?" and get the crop back, with the line "Not in the photos" for something it never saw.

---

## CONCEPT 2: "Unbox = Verify = Pay"

**User story (5 lines)**
1. The seller's parcel carries a seal strip with a QR (printed from the listing, or a sticker; any paper works).
2. The buyer opens the Fieldwork link from the delivery message, props the phone, and presses record. The app shows a live code for them to read.
3. They cut the seal and pull the garment out on camera. The app asks for two moves: "show the label", "turn it so we see the left cuff" (the same views as the seller's take).
4. Within seconds: **Consistent** (payout releases to the seller by itself, buyer taps "keep" or does nothing) or **Differs** (a case is filed automatically with the evidence, a refund slider anchored to the published fair-wear schedule, a human approves).
5. No form, no photos to upload, no waiting for a 3-day confirm window.

**Old steps merged:** receipt confirmation + handover photos + comparison + dispute filing + evidence assembly + payout trigger. Six steps, one gesture the buyer already does.

**Taps / seconds** (estimates)

| | Before | After |
|---|---|---|
| Buyer confirms receipt and checks | open app, confirm, photos, form: ~12-15 taps, 3-5 min, often 2-3 days of window | 1 tap to record, ~25 s |
| Dispute | claim form, photo upload, wait for a human | automatic, evidence attached |
| Seller payout | after confirm window or dispute | at verdict |

**The AI**
- **Gemini video understanding** compares the unboxing clip against the stored listing record (and the seller's take): same item? same declared flaws present? anything new? It cites timestamps and frames.
- **Frame selection plus alignment** (RoMa v2/LightGlue ghost overlay already in v2) aligns buyer frames to the seller's baseline, then **AnomalyDINO** change detection and the blink comparator flag a new stain.
- **Seal and chain of custody:** Gemini sees the seal QR intact then cut, and reads the parcel label; the rolling code ties the clip to this parcel.
- **Agents:** the roadmap's meta-judge and Trust-or-Escalate decide; pay-on-pass is simulated.
- **Forger vs Fieldwork** (already planned) is now the core test: AI-faked unboxing, edited clips and screen-replayed clips.

**Hardest technical risk:** **fake or staged evidence** (this is the whole game) and **unfair "differs" verdicts** from bad buyer lighting. Evidence from China (Dec 2025) shows AI-made unboxing video is already used for refund fraud. Mitigation: in-app capture only, live nonce and a motion challenge, continuous single-take check, device attestation and C2PA where available (Pixel 10), cross-case registry, calibration that treats poor capture as "can't tell, retake" never as "differs", and escalation to a human rather than auto-refund above a threshold. Honest limit: a determined forger with a rooted device is out of scope; we publish the forger's win rate.

**Buildable in ~5 days?** **Yes, with a simulated payout.** It reuses everything the roadmap already builds for handover (build items 3 and 6 and 7) and adds a video front end, the seal QR and the one-line verdict. Slightly harder than Concept 1 because the comparison and calibration need test pairs (Nano Banana 2.1 planted-change test bed). Real payments, courier hooks and device attestation are slides.

**30-second demo moment:** two phones on stage. Left: the seller's jacket was recorded. Right: a volunteer opens a sealed pouch on camera while someone off-stage had added a stain to the left cuff. The blink comparator flashes the cuff, the screen says "Differs", a case file appears with the refund slider, and a fraud clip made with AI on the next slide is rejected. Then the clean pouch: "Consistent", and a payout confirmation animates.

---

## CONCEPT 3: "Talk to the closet" (the Gemini Live seller agent)

**User story (5 lines)**
1. The seller points the phone at the garment and says "sell this, not under ¥3,000, can ship Tuesday".
2. The agent talks back: "Show me the label... turn it... I see a small mark on the left cuff, is that a stain or a thread pull?" The seller answers out loud.
3. It drafts the listing as they talk, and the seller's spoken claims ("worn twice, no smoke") are logged as **seller statements**, kept apart from what the camera confirmed.
4. After publishing, the same agent fields buyer questions and haggles inside the seller's floor price, with a message to the seller only when a decision is needed.
5. On handover it nudges both sides and relays the verdict.

**Old steps merged:** capture + condition interview + listing + price + buyer questions + negotiation + reminders. The seller never opens a form.

**Taps / seconds:** before about 50 taps and 7-8 min plus daily chat; after 1 tap and about 60-90 s of talking, then near-zero chat taps.

**The AI**
- **Gemini Live API** (`gemini-3.1-flash-live-preview`): audio in/out, camera frames at ~1 fps, **function calling** to hand off.
- **Tool calls do the real seeing:** the agent calls `grab_still(view)` and `inspect(still)`, which run the stills pipeline (Agentic Vision, grader, conformal filter) from Concept 1. The Live model never states a defect or a measurement on its own.
- **Buyer side:** a text agent with the same record, price floor from the seller and a negotiation policy, built on the Agent Platform.
- Multilingual voice is a real selling point for JAPAC.

**Hardest technical risk:** the Live model is audio-first and sees about 1 frame per second, so it can **hallucinate or over-reassure** ("looks great!") and miss fine flaws, which is exactly the trust failure we are meant to solve. Also session length, interruptions and noisy rooms are unconfirmed (I could not find session limits in the docs). Mitigation: strict tool-only facts, stills for evidence, a two-column record (claimed vs verified), and a text fallback.

**Buildable in ~5 days?** **Partly.** The Live demo is quick to wire (a working Live session with camera is roughly 1-2 days), but doing it well, with tool-grounded facts, negotiation and handover, is **7+ days**. A 5-day build is a voice front end on top of Concept 1's pipeline, with negotiation faked or scripted.

**30-second demo moment:** the presenter says to the phone in Japanese "これを3000円以上で売りたい" while turning the garment. The agent replies "left cuff, a mark, is that a stain?", the presenter says "yes, small", and the listing on screen updates live with the crop. Then a buyer's chat message arrives and the agent answers it with the cited frame while the presenter does nothing.

---

## 3. Comparison

| | 1. One Take | 2. Unbox=Verify=Pay | 3. Talk to closet |
|---|---|---|---|
| Collapses | seller side, 7 chores | buyer side, 6 chores | seller + chat, 7 chores |
| Trust is a by-product of | the spin the seller does anyway | the unboxing buyers already film | the chat sellers already have |
| Wow in 30 s | high | **highest (auto-verdict, auto-pay)** | high but risky live |
| Build in 5 days | **yes** | yes (simulated payout) | partly |
| Main risk | motion blur, fake clip | fraud and unfair "differs" | hallucination at 1 fps |
| Fits roadmap v2 | uses items 3, 4, 5 | uses items 6, 7, Forger | adds voice only |
| Already a product? | Hero does video-to-listing; no record or recheck | **no one reads the unboxing** | voice listing exists in Hero |

## 4. Recommendation: bet on 1 + 2 fused, "One Gesture, Two Ends"

The same 12-second turn of the garment is performed twice: by the seller to list, by the buyer on unboxing to settle. The second take is compared to the first and the verdict pays out. This is one story, not two features: **a record you make once, and check once**.

- It is the strongest answer to "trust as a by-product": nobody is asked to do a chore, only to film, and the filming is also the evidence.
- It reuses nearly all of the roadmap's v2 core (record, ghost overlay, blink comparator, meta-judge, Forger vs Fieldwork), so it adds a **video front end and one verdict screen** rather than a new system.
- It is the least exposed to the weaknesses we found: file-based Gemini video is documented, nothing depends on the 1 fps Live path or on-device video.
- Concept 3 is a stretch layer: a voice button on top of Concept 1 in the last two days if there is time.

**Build order (5 days):** (1) video capture + frame selection + nonce; (2) Gemini clip to record + Ask-the-garment; (3) buyer unboxing take + alignment + verdict; (4) auto-case and simulated pay-on-pass; (5) Forger vs Fieldwork run + demo.

**Risks to be honest about in the pitch:** a clip is not proof against a rooted device; "Differs" needs a calibrated can't-tell state; payouts are simulated; agentic video understanding and on-device video are unverified and not relied on.

## Sources (checked 8 Oct 2026)

- Gemini video understanding docs (ai.google.dev/gemini-api/docs/video-understanding)
- Live API capabilities and Gemini 3.1 Flash Live Preview model page (ai.google.dev/gemini-api/docs/live-api/capabilities; models/gemini-3.1-flash-live-preview)
- Vertex/Agent Platform "Send audio and video streams" (1 fps, 768x768)
- Agentic video understanding, 1 Sep 2026: Tech Dev Notes changelog mirror and Android Authority (unverified at source)
- Gemma 4 and Gemini Nano 4 coverage: edge-ai-vision.com (Apr 2026), ubergizmo.com (Apr 2026)
- Pixel 10 C2PA: security.googleblog.com (Sep 2025)
- Depop AI listing (thenextweb, Sep 2024); Poshmark Smart List; Hero app (App Store); Whering funding (tech.eu, 7 Jul 2026); Google Photos Wardrobe (Apr 2026)
- AI-faked unboxing evidence: China Daily (Dec 2025), Ravelin and HyperVerge blogs; "no video no refund" explainers (uclaw.ph, bizhankook)
- Digital product passports: textalks.com, the-ethos.co (2026)
