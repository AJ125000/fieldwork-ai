# R7-05: Wildcards and the demo (contrarian pass on ROADMAP-APPAREL)

Date: 8 Oct 2026. Role: contrarian inventor / judge. Roadmap not restated; each idea is read against it.

## 0. The blunt read

The roadmap is rigorous, but a judge sees it as "good applied ML plus Gemini". Weights: technical 40%, impact 25%, innovation 25%, UX 10%. The roadmap is strong on the 40%. It is weak on being *remembered*. Judges remember one physical moment, one number, and one sentence. The plan has the sentence ("evidence, not guesswork") and several numbers, but no moment. Every idea below is aimed at creating the moment, or at turning a stated weakness into the feature.

Scoring: wow 1-5 is my estimate of how much a judge remembers it. Build = realistic time with an AI coding assistant, on top of existing roadmap components.

---

## 1. Ideas

### A. Demo moments

**1. The blind swap, live with a judge's own garment (the headline)**
- What: Before the talk, a judge or front-row volunteer lends a real garment (jacket, hoodie). We scan it on stage in about 60 seconds (record, grade, measurements, listing in their language). The presenter hands it to the volunteer, who has 20 seconds out of sight to (a) change nothing, (b) add a small change (marker dot, safety pin, swap in a similar plain item). The handover scan then returns one of three verdicts live. The plan already has all three outcomes, so the demo shows every state of the gate, including "Can't tell, show me the left cuff".
- Beats the plan: the plan demos on our own 40 garments, which judges can't audit. Their own garment removes every "was it rehearsed?" doubt. It also shows the *honest failure* ("Can't tell") as a feature on stage.
- Build: no new model work. Needs a rehearsed fast path (pre-warmed Cloud Run min-instances=1, scan under 30 s) and a pre-recorded fallback. Two days is mostly latency and UI.
- Risk: live failure on stage. Mitigation: run the same flow on a spare garment backstage first; keep the video cut as a safety net; script the "Can't tell" case as a win.
- Wow: 5

**2. Blink comparator reveal (before/after)**
- What: Once the arrival photo is warped onto the listing template, flicker between "listing" and "arrival" at about 2 Hz. Unchanged regions sit still; the changed region visibly blinks, then a ring and a label appear: "new mark, ~2 cm, wearer-left cuff". Astronomers found Pluto this way, which is a one-line story for the stage.
- Beats the plan: the plan has the defect map as data. This makes the diff visceral in two seconds, and works with no sound and no reading, which matters for a 3-minute video.
- Build: CSS animation over two aligned images plus the heat-map mask; half a day (you already do the TPS warp).
- Risk: a poor warp makes everything flicker. Mitigation: show the blink only after alignment passes a quality score.
- Wow: 4

**3. Judges scan the garment tag on their own phones**
- What: The demo garment on stage wears a printed Fieldwork hang-tag (QR). On the last slide, judges scan it and land on the live garment page in their own language (EN/JA/KO/TH), where they can "Ask the garment" anything. A live counter shows questions coming in and how many got "Not in the photos" (abstentions) versus answered with a cited crop.
- Beats the plan: turns judges from watchers into testers; a Japanese or Korean judge reading their own language is a strong memory. It also invites "try to make it lie", which shows the grounding.
- Build: one public read-only page, rate limit, counter from Firestore. One day. Cloud Run min-instances plus per-IP cap.
- Risk: venue wifi, abuse, cost. Mitigation: cap at 200 requests, cached answers for common questions, no user data stored.
- Wow: 5

**4. The trust receipt: printed, signed, in the box**
- What: A one-page receipt (think Japanese 検品票, the inspection slip put in every parcel) with: four lanes, grade as a *set* ("3 or 4"), measured cm with error bars, the nonce QR, and a signature. The QR opens a verify page that says "record intact / altered since signing". On stage, it comes off a small thermal printer, or is held up as a printed A6 card.
- Beats the plan: the plan produces a record but no *artifact*. A physical receipt makes "evidence" tangible and is a leave-behind for judges. Signing gives a real tamper-evidence story (not just a database row).
- Build: sign the JSON with Cloud KMS asymmetric key (or an Ed25519 key in Secret Manager); verify page in Next.js; print stylesheet. Thermal printer is optional (ESC/POS over USB, about half a day, skip if tight). One day total.
- Risk: "signature" over-claims; it proves the record is unchanged, not that it is true. Say exactly that on the receipt.
- Wow: 4

### B. Product ideas that change how the system is judged

**5. Forger vs Fieldwork: self-play red team with Gemini image editing**
- What: An adversarial "forger" agent uses Gemini image editing (Nano Banana family) to (a) paint a fake tear or stain onto a real arrival photo and claim it, or (b) erase a real flaw from a return photo. Our system must catch it using the nonce-proven listing record, aligned-crop change check, and a damage-physics check ("does this tear follow how the weave frays?"). We report a **forger win rate** in the results table. On stage: an audience member types "add a coffee stain to this cuff", the forged photo appears, and the case card says "claimed damage is not in the handover scan taken with the nonce; not consistent".
- Why it beats the plan: it targets a *live news problem* (Vinted refund-fraud wave, Mar 2026; Forter calls AI-generated damage claims the fastest-growing return abuse; Boll & Branch spotted a fake because the rip did not fray like cotton, which is exactly the plausibility check). The plan has the defence as one bullet; this makes it a measured, repeatable experiment. **It also fixes the small-validation-set weakness**: synthetic edits give hundreds of labelled positives and negatives for the change detector, reported separately from real ones.
- Build: Gemini image-editing API on a few hundred of our own and dataset photos, scripted edits ("add a 3 cm wine stain on left cuff"); label is known by construction. Two days including evaluation harness.
- Risk: synthetic edits may be easier or harder than real forgeries; say so and report real and synthetic rows separately. Do not rely on SynthID detection: I found no public API for it (consumer Gemini-app check and waitlisted portal only), so treat it as a bonus, never a gate. Generated images from Google models also carry SynthID, so some forgeries will be flagged by Gemini app on demo day, which is a nice extra, but unreliable.
- Wow: 5

**6. Secret witness stitch: the seller's hidden mark**
- What: At listing, the app asks the seller to place one tiny, private mark (a single coloured thread stitch, or a pen dot in a hidden seam spot) and photograph it. The location is stored as a sealed commitment and *never shown to the buyer*. On a return, the seller scans only that region; the gate says "witness mark present / absent". A swapped-in lookalike cannot have it, and the buyer cannot copy something they never saw.
- Beats the plan: the plan's weakest spot is "a plain mass-produced garment can't be proven to be the same unit". This answers it directly, turning the weakness into a feature. Real sellers already do this informally (UV pens on returns, per seller forums), so the need is proven; nothing in an app has done it with a sealed record and a vision check.
- Build: reuse declared-flaw fingerprint code (it is the same matcher on a hidden crop), plus a commitment hash (SHA-256 of location and photo, stored at listing time). One day.
- Risk: extra seller effort; keep it optional ("Stronger evidence badge" tier). The mark might damage a high-value item, so suggest an inside seam, not an exterior.
- Wow: 4

**7. Meet-up mode: check before you pay (Korea, in-person trade)**
- What: Two phones pair via a QR handshake at an in-person meet-up. The buyer scans the garment on the spot, both screens show the same three-way result, and payment is released only after both tap "accept". Daangn is built around local face-to-face trades (about 4-6 km neighbourhoods), and in-person was still roughly a quarter or more of Bunjang trades as of 2023 (my inference from their published courier share; no current figure found), so this is a primary use case in Korea, not an edge case.
- Beats the plan: the plan assumes a shipped parcel and a 2-3 day window; this opens the largest Korean format and makes the demo work in a single room with no parcel.
- Build: Firestore realtime session plus a pairing QR plus the existing handover workflow. Half a day. A "kakao-style" chat bubble UI for the result.
- Risk: no payment in scope; show a mock "release" button and say so.
- Wow: 3

**8. Localised condition vocabulary: the grade speaks each market's own scale**
- What: The 1-5 grade, with its conformal set, is rendered in each marketplace's own condition scale. Mercari Japan uses six steps (新品、未使用 / 未使用に近い / 目立った傷や汚れなし / やや傷や汚れあり / 傷や汚れあり / 全体的に状態が悪い), chosen by the seller on self-judgement, which Mercari itself says buyers should check against photos. We output the nearest steps plus the evidence for them ("やや傷や汚れあり: 袖口に3 cmの毛玉").
- Beats the plan: the plan renders text in seven languages, but a Japanese buyer thinks in *Mercari's rank*. This answers a pain that platforms admit exists (seller-chosen grades). It reads as local insight.
- Build: a mapping table plus the grade set; 0.5 day. Needs a native speaker to check wording.
- Risk: our model is not trained on Mercari's labels; word it as "closest to", never as a replacement.
- Wow: 3

**9. Kintsugi view: flaws as gold seams**
- What: An alternative visual mode where each logged flaw is drawn as a gold line on the garment (kintsugi / sashiko mend), with a plain size label. The same data, shown as honest imperfection, so a flaw reads as a feature of a unique piece, not a defect to hide. Japanese users appreciate wabi-sabi and 使用感 (sign of use) as normal vocabulary.
- Beats the plan: the flaw ledger is a table today. A gold-seam overlay is the single screenshot that people repost, and it flips the emotional framing for sellers, who are afraid to photograph flaws (the real friction in Stage A).
- Build: draw polylines over the masks you already compute; half a day with an SVG overlay.
- Risk: purely aesthetic; do not let it hide the measured values.
- Wow: 3

**10. Condition ruler: "show me what a 3 looks like"**
- What: Next to the grade, show the three nearest reference garments from the training set (SigLIP nearest neighbours) with their human grades and the matching feature. Buyers see "similar to these grade-3 hoodies".
- Beats the plan: a bare "3 or 4" is abstract; neighbours make the model *explain by example*, which is also the cheapest honest explanation and a good sanity check.
- Build: kNN over cached embeddings (you already compute them). Half a day.
- Risk: dataset is sorting-line photos, not phone photos; label it "reference examples".
- Wow: 3

**11. Make the domain gap a published augmentation result**
- What: The HF mirror is background-removed sorting-line photos. Paste those cut-outs onto thousands of phone-like backgrounds (beds, floors, tables), with random lighting, shadows and wrinkles, and add Gemini image editing for a few hundred "phone-style" restyles. Report the effect on our 40 phone-photographed garments in one table row ("with / without domain randomisation").
- Beats the plan: the plan treats the gap as a risk to mitigate with adaptation on 40 garments. This turns it into an experiment with a before/after number, and the cheapest version is classical, not generative.
- Build: compositing script, one day; generative restyle is optional and costs real money per image, so cap it at a few hundred.
- Risk: no guarantee it helps; report honestly either way (a null result is still a result row).
- Wow: 3 (high for technical judges, low for the room)

**12. Risk-appetite dial (conformal slider)**
- What: A single slider on the dashboard: "How much risk will you accept?" (e.g., 5%, 10%, 20%). Moving it re-computes, live from the cached validation set, how many handovers are auto-cleared versus sent to a human, and the certified false-match bound. The marketplace chooses its own appetite; the maths guarantees it.
- Beats the plan: the plan reports a risk-coverage curve in a table. A slider makes it a decision tool and shows a DeepMind-style guarantee in 10 seconds. It also reframes the small validation set honestly (the bound simply widens).
- Build: precompute outcomes per threshold; slider in the UI; half a day.
- Risk: viewers misread it as accuracy; label it "certified upper bound on wrong clears".
- Wow: 4 (technical judges), 2 (others)

**13. Video spin capture, with on-device Gemma coaching**
- What: Capture as a 20-second slow turn-around video; Gemini picks the best frames. A small Gemma model on the phone coaches instantly ("tilt left, more light") with no network, so the demo can run in airplane mode. The live-voice coach (the plan's stretch) is covered by the same stage trick.
- Beats the plan: a single clip is far less seller friction than four shots plus a card, and "works offline" is a good stage beat and a privacy argument (home interiors, faces, never leave the phone before the user submits).
- Build: Gemini video understanding for frame choice is easy (half a day). On-device Gemma in the browser is the risky half: the MediaPipe LLM Inference web guide supports Gemma 3n image input but the API is in maintenance mode and points to LiteRT-LM; Gemma 4 via Transformers.js/WebGPU also exists. Plan two days, and cut to a scripted coach if it is not working by Fri 10 Oct.
- Risk: video loses the nonce-in-frame proof unless the code is shown in frame; keep the 4-shot path as the default.
- Wow: 4

**14. Chain of custody: the arrival scan is the next listing**
- What: When owner 2 receives the garment, the handover scan is reused as the resale listing, with the previous record carried forward and diffed ("since owner 1: one new mark, 2 cm"). One tap to relist in under 20 seconds.
- Beats the plan: the roadmap skips the passport as a slide. This shows the flywheel (each handover reduces the next seller's effort, which is the real friction) with no new model. It also demos nicely: a second-hand garment's *history*, not a snapshot.
- Build: reuse normalise plus record builder; one day. Skip the GS1 Digital Link and keep it as a slide.
- Risk: scope creep; do only one hop.
- Wow: 4

**15. Fabric-sound check (scratch test) (long shot, 1-hour test only)**
- What: Rub the fabric near the phone mic for 3 seconds; a classifier or Gemini audio reasoning gives a fabric-hand signal (stiff / soft / pilled). This tries to turn the "can't judge feel" lane into a measured one.
- Beats the plan: nothing else in second-hand does it, and it makes the demo clip memorable.
- Build: one hour to test whether the features separate our own fabrics; no training data exists, so keep it as a roadmap slide unless the test is clean.
- Risk: very likely to be noise; claiming it without a result would damage credibility. Do not ship unless it passes.
- Wow: 4 if it works, 0 if oversold

**On smell:** do not try to sense it. Keep it in the "can't judge" lane, but make it a *seller declaration with accountability* (washed date, smoke/pet-free, scent), which becomes case evidence. The honest "I can't smell" answer is the strongest line in the whole "Make it lie" challenge.

---

## 2. The three most boring or generic parts of the roadmap

**1. Stage A capture (quality gate, 4-shot protocol, coach).**
Every resale app and every AI-photo demo has a "retake, too blurry" screen. It is a cost centre, not a story.
Upgrade: make the *reveal* the show: lines draw out over the garment and cm numbers count up, then a physical tape is laid next to it and matches. Pair with idea 13 (20-second spin, offline coach) so capture feels like one effortless gesture, plus idea 6 as the hook for plain garments.

**2. Stage C cited listing plus "Ask the garment".**
Judges have seen AI-written listings (Carousell, Mercari, Depop, eBay, ThredUp all ship them) and a chat box over a RAG store. In text it looks like both.
Upgrade: make answers *visual and adversarial*: each answer highlights the crop it came from; unseen regions show as a dashed "not in the photos" ghost; add a "Make it lie" challenge with a live counter, and let judges scan the tag (idea 3). Speak and render in the judge's own language.

**3. Stage F case card (claim / policy / skeptic agents, order-swapped adjudication).**
Claim, policy and skeptic agents are the standard multi-agent LLM-judge pattern, and a text case card is a wall of prose. The genuinely novel parts (proportional remedy, can't-judge lane) are buried.
Upgrade: lead with the *outcome in one sentence and a slider* ("keep it, get 20% back"), with the evidence as annotated pins on the garment; show the order-swap as a two-column "same verdict both ways / flipped, so a human decides" strip; and put the forger win rate (idea 5) at the top of the case section, because that is the part nobody else measures.

Also: the results table (section 7) is full of QWK / ECE / TPR jargon. Keep it for the PDF; on stage use three lines: one grade with its range, one blink, one forger win rate.

---

## 3. Demo craft: stage (5 min) and video (3 min)

- **Cold open (video, 10 s):** a split screen of a real dispute chat in Japanese and Korean, "it was not like this" against "it was exactly like this". Cut to the blink comparator (idea 2). This is the only reveal the video needs in the first 20 seconds.
- **Stage structure:** 0:00 judge garment scan (1) · 1:30 the receipt (4) · 2:00 the swap and verdict (1, 2) · 3:00 forger attack (5) · 4:00 judges scan (3) · 4:30 one results line. Cut idea 12 to a single slide.
- **Rule:** one hero (idea 1), one number (forger win rate), one sentence. Everything else lives in the PDF.
- **Fallbacks:** a pre-recorded screen capture of the entire flow, a spare garment, a hot-spot, min-instances on Cloud Run, cached answers.

## 4. Suggested priorities (given 9 build days and the cut list)

1. **Do, high value per day:** 2 (blink), 5 (forger), 6 (secret witness), 4 (receipt without printer), 3 (judge scan).
2. **Do if core works end to end:** 1 (needs 2, 4, 5 first), 8, 9, 10, 14.
3. **Long shot:** 13 (on-device Gemma), 15 (fabric sound).
4. **Skip:** 7 (unless Korea becomes a focus), 11 and 12 (keep as PDF sections only).

## 5. Feasibility checks run (8 Oct)

- Gemini image editing (Nano Banana family, Gemini 2.5 Flash Image, and the newer Nano Banana 2 from Feb 2026) exists as an API; all Google-generated images carry SynthID. No public programmatic SynthID verification found (consumer Gemini-app check, waitlisted portal, enterprise API "being prepared"), so do not depend on it.
- AI-generated damage claims are a documented 2026 problem (Vinted Mar 2026, OECD AI incident log; Forter/Retail Gazette Jun 2026; Boll & Branch case). Vendor statistics are self-interested; use the incidents, not the percentages.
- Sellers already use hidden UV marks to check returns, per forum posts; I found no product that does a sealed, vision-checked version for garments (not exhaustive).
- Mercari Japan's six-step condition scale confirmed on its help pages; seller-chosen, and Mercari tells buyers to check photos.
- Daangn is neighbourhood-based; Bunjang courier share reached 72% of direct-vs-courier in 2023. No current in-person share for fashion found.
- Gemma 3n image input in the browser: supported in MediaPipe LLM Inference web, but that API is maintenance-only (LiteRT-LM is the successor); WebGPU path unconfirmed. Treat as risky.
- ADK Gemini Live API toolkit exists (bidi-demo sample); Cloud Run deployment not confirmed from my search.

Sources: Retail Gazette (Jun 2026), OECD.AI incident 2026-03-02, Mercari JP help centre, Google AI Edge MediaPipe web guide, Korea Times/Korea JoongAng Daily on Bunjang, Google blog on SynthID Detector, adk.dev Live toolkit docs.
