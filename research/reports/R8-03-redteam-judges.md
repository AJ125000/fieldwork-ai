# R8-03: Red-team of ROADMAP-APPAREL-v2 (skeptical judge panel)

Date: 8 Oct 2026. Evidence base: v2 roadmap plus public winner write-ups. Google published no judge comments for any contest below, so "what judges praised" is inferred from the award titles and the winners' descriptions.

## 1. Scorecard

| Criterion | Weight | Score | Reasons |
|---|---|---|---|
| Technical merit and Gen AI | 40% | **7 / 10** | Strong: calibrated uncertainty, a planted-change test bed, an eval table that reports honest baselines, and agentic zoom (Agentic Vision). Weak: most of the "hard" parts are NOT Gen AI (SigLIP 2 plus CORN heads, conformal prediction, RoMa v2, AnomalyDINO, SAM 3). Gemini is the inspector and judge, but the model that matters is a classical classifier. A judge counting "meaningful Gen AI" sees Gemini as one box among about 15. Scalability is asserted but not shown. The load is 10.5 Claude-days in 9 calendar days, and several pieces depend on a model (Nano Banana 2.1) that has been GA for two days. |
| Problem alignment and impact | 25% | **6.5 / 10** | The pain is real: pre-loved apparel returns, "not as described" disputes, Vinted's refund-fraud wave. But the problem is told as infrastructure ("evidence layer for disputes"), not as a person. There is no named seller or buyer, and no number such as "X% of resale returns are condition disputes, costing Y". The impact claim is a pitch-only slide. The Retail theme is met, but a judge cannot say who is better off after the demo. |
| Innovation and creativity | 25% | **7 / 10** | The blink comparator, ghost overlay, Forger vs Fieldwork and "make it lie" are memorable. The components are known techniques (change detection, conformal sets, demerit scoring) recombined. This is incremental-plus, not revolutionary. Strongest differentiator: publishing the forger's win rate and the error bound. |
| UX and solution design | 10% | **5.5 / 10** | There are four lanes, a refund slider, a ghost overlay, a multilingual render, an MCP connector and a Condition Spec. UX has to be shown in 3 minutes, and a web-dev teammate is not yet confirmed. Risk of a dashboard-style UI full of confidence bounds. |
| **Weighted total** | | **about 6.7 / 10** | Competent finalist-bubble entry. Not currently a winner. |

## 2. What feels over-engineered, jargon-heavy, or invisible in 3 minutes

**Over-engineered (cut or hide):**
- Five signature innovations, about 20 techniques, 4 lanes, a meta-judge and "Trust or Escalate". A 3-minute video can carry ONE idea.
- Both RoMa v2 and LightGlue and TPS, plus both AnomalyDINO and PatchCore history.
- SAM 3 parts, tag OCR, witness mark, backlit shot, cross-case registry, AP2, Memory Bank, MCP, Condition Spec v0 and ISO 20245 mapping. Most of this is invisible to a viewer.
- A pay-on-pass escrow that is only simulated.

**Jargon a judge will not parse in a video:**
- "Per-claim conformal filtering", "CORN heads", "ConfLVLM", "four-point demerit", "certified false-match bound", "meta-judge", "Agentic Vision". Fine in the PDF. In the video, say "it only claims what it can prove" and "it tells you when it can't tell".

**Invisible in the video:**
- The 28k-image training and the calibration (nobody sees it).
- Conformal bounds, the error-bound maths and the dataset-baseline claim (a numbers slide at 25 s is the only place).
- Agentic Vision's gain over plain Gemini (a bar chart, not a moment).
- Fraud registry, cost per check, multilingual render, pay-on-pass.

**Visible and strong:** blink comparator, ghost overlay snapping, "make it lie", forger caught. Build the video around these only.

## 3. "A Gemini photo grader again?"

Partly yes. Capture, inspect, grade condition, produce a record: this is the same shape as a dozen "AI listing" and "AI condition grader" entries. The defence is in step 3 (handover diff) and step 5 (Forger vs Fieldwork), because those are about disagreement between two moments, not grading one photo. But the roadmap leads with grading in demo step 1 and in innovation #1 ("a model that knows what it doesn't know"). Reorder so the first 10 seconds says "this is not a grader, it is the referee between two photos".

## 4. Revolutionary or incremental?

Incremental with a sharp edge. The edge is calibration plus adversarial self-testing, which is rare in hackathons. It reads as research, not as a product people want. Judges at Google events reward "wow, I'd use that" more than "rigorous". Closing the gap needs one emotional human moment (a seller falsely accused, or a buyer's refund wrongly denied) and one live magic trick (the blind swap).

## 5. Mandatory requirement coverage

| Requirement | Covered? | Note |
|---|---|---|
| Gemini or Gemma | Yes | Gemini inspector, judge, "Ask the garment", Nano Banana. Make sure Gemini does the visible work, not just the PDF. |
| Agentic platform (Agent Platform, Antigravity, AI Studio) | Partly | Roadmap says "Gemini Enterprise Agent Platform". Needs a visible, real use in the architecture slide and a repo path (ADK or Agent Engine), not just a deploy target. Antigravity is not mentioned; using it for the build costs nothing and is a cheap box to tick. |
| Deployed on Cloud Run / Firebase | Yes (item 8) | Depends on a teammate who is not yet found. Single owner, 1.5 days. |
| Working prototype | At risk | CORE is 10.5 days in 9. If any of capture, handover or dispute is faked, the video must still be honest. |
| 3-minute video | Planned | The storyboard has 6 beats in 170 seconds, with about 25 s per beat. Too dense. |
| PDF proposal with feasibility analysis | Not in the build plan | There is no line item or day for writing the PDF, cost model or feasibility section. v1 has a risk register but v2 does not show it. Add 0.5 day. |
| Deadline | Check | v2 says submit 17 Oct. Public listings disagree: prototype deadline 4 Oct (one source) vs 18 Oct (another); evaluation 5 Oct to 6 Nov; finalists 7 Nov; Singapore finale 4 Dec. Confirm on the official Hack2skill page today. |

## 6. Top 5 weaknesses and fixes

1. **No hero user and no emotional story.** The v2 pitch starts at the pipeline. Fix: pick one hero (Mei, a Tokyo reseller whose buyer claims "it arrived stained", and she loses 4,000 yen and her seller rating). Open the video with her, close with her getting paid (pay-on-pass) in one line.
2. **Too many ideas for 3 minutes.** Five innovations, six beats. Fix: one sentence, "Fieldwork is the referee between a listing photo and an arrival photo, and it never claims what it can't see." Cut to 3 beats: ghost overlay and blink comparator, "make it lie", forger caught. Everything else goes to the PDF.
3. **Gen AI share looks small.** Most of the clever work is classical CV. Fix: make Gemini visibly central: Gemini does the zoom (Agentic Vision), writes the claim, argues the case, answers in Japanese. Show a one-slide "what Gemini does vs what it doesn't" and report its measured gain. Use the classical models as "grounding", not as the star.
4. **Execution risk.** 10.5 days of core in 9, a teammate not yet found, and several day-1 tests that could invalidate claims (Nano Banana synthetic stains, Agentic Vision gain, GarmentIQ). Fix: choose option (b) now (test bed only, no synthetic training), freeze scope on 12 Oct, and rehearse the blind swap on 3 garments. If a day-1 test fails, drop the claim from the video rather than the feature.
5. **Impact is unquantified and pitched as infrastructure.** Fix: add 3 numbers to the PDF and the numbers beat: share of resale returns that are condition disputes, average cost per dispute handled by a human, and cost per Fieldwork check. Put the JAPAC angle (Japan's Mercari-style resale, Vinted-like fraud) in one slide. Keep agent-commerce (MCP, AP2) as a "what's next" line, not a feature.

## 7. Single biggest reason it would NOT make the finalist list

It is a rigorous but abstract system with no single human story and no one 10-second wow, so in a 3-minute video the judges see a pile of technical features and a "photo grader" shape, while the scarcest resource (the build, 10.5 days in 9) is spread over 15 components. A finalist-level entry needs a hero, one magic moment, and a working end-to-end loop that is demonstrably real.

## 8. Patterns from past Google/Gemini winners

| Contest | Winner | Pattern |
|---|---|---|
| Gemini Live Agent Challenge 2026 (Google Cloud; 1,536 projects, 151 countries) | Grand prize ORION: voice-directed surgical co-pilot | One clear user (the surgeon with scrubbed hands), a high-stakes setting, and a real-time, hands-free "magic moment". Gemini is the visible hero. |
| same | drone-copilot, Sankofa (family-history "griot"), Moonwalk, Wand, JohnKeats.AI, Rayan Memory | Almost all are a person and an agent talking, seeing or acting live. Emotion (Sankofa, JohnKeats) and novelty of interface are rewarded. Not one winner is "calibration" or "evaluation rigour". |
| same, honorable mentions | NagarDrishti (citizens report potholes, officials query), Call My Parts, Relay | Local, concrete, India/Asia-relevant problems with a one-line story. |
| Gemini API Developer Competition 2024 | Jayu (best overall), VITE VERE (most impactful and People's Choice), Prospera, Gaze Link (ALS), ViddyScribe, Trippy | Strong accessibility and human-benefit stories; "most impactful" and People's Choice went to the cognitive-disability app. Simple, one-sentence descriptions. |
| Kaggle "Vibe Code with Gemini 3 Pro" Dec 2025 (4,097 submissions) | NeuroState (embedded-systems IDE) was the only winner I could confirm | Four criteria: impact, technical depth and execution, creativity, presentation quality. Reviewers tried to validate claims and replicate results, which helps a team with real eval numbers. |

What these have that v2 lacks: a named hero user, a high-stakes or emotional scene, live multimodal interaction (voice/vision) shown once and clearly, and a title you can say in one breath. What v2 has that most of them lack: measured claims and honest baselines. Keep that for the PDF and the numbers beat, since reviewers are told to replicate claims.

Caveat on evidence: Google published no judging comments; "what judges praised" is inferred from award titles and descriptions. Gemini 3 Devpost hackathon (Dec 2025 to Feb 2026) and Rapid Agent Hackathon (May to June 2026) winners were not found.

### URLs
- https://ai.google.dev/competition (Gemini API Developer Competition 2024 winners and categories)
- https://cloud.google.com/blog/topics/developers-practitioners/winners-and-highlights-of-the-gemini-live-agent-challenge (Gemini Live Agent Challenge winners)
- https://geminiliveagentchallenge.devpost.com (project gallery)
- https://developers.googleblog.com/en/build-for-tomorrow-in-the-gemini-api-developer-competition/ (2024 contest launch post)
- https://ai.plainenglish.io/gemini-3-kaggle-hackathon-winners-officially-announced-4e762f6f9eea (Kaggle Gemini 3 winners; third-party, only partly readable)
- https://www.bnext.com.tw/article/85434/google-vide-code-competition (Kaggle contest criteria, third-party)
- https://opportunitiesradar.com/google-ai-builder-cup-2026/ (AI Builder Cup timeline; third-party, confirm on Hack2skill)
