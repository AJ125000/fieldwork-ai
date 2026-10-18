# Fieldwork: deck outline (10 slides)

Plain words. One idea per slide. Numbers only from the results table; use placeholders until the final run.

---

**1. Yuki's problem**
- A Tokyo student sells a jacket; a buyer in Singapore says it arrived stained.
- Nobody can prove what state it left in. It is her word against his.
- Used clothes are one of a kind, so the platform has to guess.
*Visual:* Chat screenshot with a stain photo; Yuki holding the jacket.

**2. The problem is large and getting worse**
- Second-hand apparel is forecast to reach US$393B by 2030 (ThredUp, 2026). Japan's reuse market is about 3.3 to 3.5 trillion yen.
- Report windows are 2 to 3 days; AI-faked damage is now a refund tactic (NSS Magazine, Jun 2026); Mercari built a collection centre to settle disputes (2025).
- No platform keeps a listing-time record to compare against.
*Visual:* Three big numbers with sources, and a mini timeline of report windows.

**3. Fieldwork in one line**
- Sell it in one take. Settle it in one unboxing.
- A 12-second video becomes the listing, the condition record and the evidence.
- Answers: consistent with the listing / differs / can't tell.
*Visual:* Two phones side by side: seller take, buyer unbox, joined by an arrow.

**4. The magic moment: the blink comparator**
- The listing crop and the arrival crop flash back and forth; a real change jumps out.
- Gemini then judges whether the change is real or just light and folds.
- Result is visible in one second, without reading a report.
*Visual:* Animated GIF of the sleeve with a planted mark flashing.

**5. What Gemini does**
- Watches the video, writes each claim, zooms into flaws, reads the label, answers in the buyer's language.
- Compares the crops and rules on cases three times.
- Our trained grade model and OpenCV are the grounding; [[RESULT: Gemini zoom gain]] over plain Gemini.
*Visual:* Pipeline strip with Gemini steps highlighted; classical steps greyed beneath.

**6. Built for agents: a condition oracle**
- Shopping agents can't buy one-of-a-kind items; they can't ask "what shape is it in?"
- Our buyer agent (ADK + MCP) searches by evidence, asks the garment, holds payment, releases only if the unboxing matches.
- Fits Google's agent shopping direction (AI Mode shopping, AP2, UCP); payment is simulated in the prototype.
*Visual:* One sentence in, agent steps out, coat on screen with "Payment held".

**7. Honest by design**
- Never "verified" or "certified". "Consistent with the listing", with evidence.
- "Can't tell" never releases money; a random close-up is requested.
- Forger vs Fieldwork: AI-faked damage tested; catch rate by how the fake is passed on [[RESULT: forger ladder]].
*Visual:* Ladder chart: raw, JPEG, screenshot, re-photographed.

**8. Results**
- Grade agreement: ours [[RESULT: QWK ours]] vs untuned Gemini [[RESULT: QWK Gemini]] ([[N]] items).
- Catch rate on real planted changes [[RESULT]]; false "consistent" on different garments [[RESULT]].
- Cost per take / check / case [[RESULT: US$]]; time [[RESULT: s]].
*Visual:* Clean table with intervals; one bar chart.

**9. Feasibility and business**
- Runs on one Cloud Run service, CPU only; most compute is Gemini calls. Built: take, ask, unbox, case, agent, MCP, front end.
- Marketplaces pay per check; pay-on-pass; return assurance. Embedded as a two-call API, no change to their payments.
- Risks named: replay, fairness, model errors; each has a mitigation.
*Visual:* Architecture sketch, then a small fee-flow diagram.

**10. What comes next**
- More categories (shoes, bags, phones), then a marketplace pilot.
- Google Wallet pass, real AP2 payments, published MCP.
- Native app attestation to close the replay and AI-fake gap. Team: [[TEAM]].
*Visual:* Roadmap line with three stops; Yuki's jacket on the final frame.
