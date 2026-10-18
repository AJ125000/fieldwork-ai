# Local workflow audit — 18 October 2026

Status: fixes implemented locally; frontend production build and type checking pass. No cloud deployment or model promotion. Buyer/seller identity ownership remains unfinished; this is a shared local prototype with simulated payments.

## Reported issues and changes

| Issue | Cause | Change and evidence |
|---|---|---|
| Buyer agent latency | In-app ADK started a Python MCP child and prompted automatic follow-up vision questions. Logged individual response intervals reached about 155 seconds, including tool work. | Reuse the MCP tool functions in-process, search once, and ask vision questions only on explicit request. Bound model turns/output and the total agent budget to 60 seconds. Explicit vision tools run off the event loop. One fresh live Celio search completed in 15.92 seconds and returned two cards with no extra `ask_garment` call. This single observation is not a latency distribution or controlled speedup benchmark. |
| Unsupported pricing | Fixed type/condition formula and dataset-currency conversion were treated as transaction prices. | Both removed. Seller enters a whole-rupee INR asking price, optionally enables negotiation and supplies a private minimum. Condition grades have no pricing role. Publication requires a saved price. Legacy estimate-only listings cannot be purchased. |
| Buyer response formatting | Markdown was inserted into a plain text container. | Safe React formatting for paragraphs, lists, emphasis, code and ordinary links; no raw HTML. Shorter response instruction. A live browser response exposed the unsupported label “Verified flaws”; the prompt now prohibits it and that observed label is normalized to “Recorded observations.” Other generated wording still needs human evaluation. |
| Missing photos/video | Search cards and Pass rendered record prose/crops only. | Search thumbnails, full seller photo/video gallery, video controls, full-size photo links, seller asking price and purchase/offer controls. Actual saved Celio media is returned by the API and displayed in the browser: all three photos loaded, and the video decoded metadata (13.85 seconds, readyState 4, no error). Media byte-range requests returned HTTP 206. |
| Missing full stops | Seller text was joined without a sentence boundary; old saved prose stayed malformed. | Normalize sentence endings in seller projection and rendering, including old “... Visual confirmation” boundaries. Browser confirmed the existing Celio limitation now has the missing full stop. |
| Inspection formatting | Machine-style flags, dense paragraphs and raw finding names. | Explicit inspection heading, separated limitation bullets, readable finding labels, formatted text, review-state-specific copy and a historical-report notice. |
| Unattributed near-identical warnings | Replay findings stored no source IDs or media paths. | New findings retain both source IDs, human labels and image URLs. Wording now says “near-identical,” matching the resized-image similarity test rather than asserting exact pixels. The existing report's three replay pairs were recovered from saved images, with an original-report backup. |
| Different cropped regions | Crop judge prompt assumed that a geometric warp established correspondence. | Check full-view correspondence first; crop schemas require explicit comparable regions. Unclear or mismatched crops cannot become missing/new defect findings. |
| Neck-versus-side alignment | Geometry could extrapolate sparse local/background matches onto unrelated garment regions. | Unique feature correspondences, inlier-supported garment masks and padded-crop support checks. Production skips views without usable garment focus and rejects semantically mismatched views. The actual reported video-frame/photo pair was rerun from temporary copies: zero accepted pairs, no defect findings, `cant_tell`. |
| Help lost pending review | Navigation pointed to `/case/fx_coat_navy_clean`. | `/help` lists actual saved reports and links to their exact issue IDs, polling for updates. Browser showed `issue_a6fd78357d19` as awaiting review. Reviewer decisions still require the review token. |

## Seller pricing and negotiation

1. Capture and inspect garment evidence.
2. Review the condition report and save seller declarations.
3. Save the asking price in INR. Negotiation is optional; an enabled negotiation requires a positive private minimum at or below asking.
4. Acknowledge limitations and publish. Prices are fixed after publication in this prototype, except that a legacy published listing may receive its first explicit price.
5. Direct purchases use the asking price. Offers go through the seller's backend rule; neither the language model nor condition grades choose a price.
6. An offer at or above asking returns asking. An offer between minimum and asking is accepted. A lower offer counters halfway between offer and asking, rounded up to ₹10 and constrained to seller limits. Maximum five rounds per negotiation ID. Restarting an unauthenticated session is not a production rate limit.
7. The buyer must confirm a purchase or accept a counteroffer. Quotes expire after 30 minutes. Below-asking escrow requires the matching unused quote, correct item, currency and current asking price, while rechecking the private minimum.
8. HTTP and MCP purchases share the same validation. A held/released/partial purchase prevents buying the same one-of-one garment again. Backend locks protect the single-process prototype; cross-instance transactions and authenticated quote ownership remain pending.

Example: asking ₹1,500, private minimum ₹1,200. Offer ₹1,000 produces ₹1,250; accepting that quote creates simulated escrow for ₹1,250. The minimum is not returned in search, listing, condition-record or offer payloads. The seller's separate price request necessarily sends their chosen minimum to the backend.

Older funded test mandates retain their original amounts and currencies; they are never automatically converted. Open an older seller-managed Pass and use **Seller: set asking price** for listings that have no explicit price. Historical records/reports are preserved. `price_band` remains a compatibility field populated as `[asking, asking]`, not an estimated range, in current public records.

## Additional problems found

- `tshirt` did not reliably match `t-shirt`, and brand had no structured search filter. Normalize garment-type punctuation and add brand/currency filters.
- Budget filtering used the low end of an estimated band. It now uses the seller's asking price.
- A minimum-grade filter accepted an item if only its highest possible grade met the threshold. Every grade in the uncertainty set must now meet it.
- Buyer cards omitted seller-declared flaws; these now appear separately from visible observations.
- The app could silently resize mismatched crop dimensions; this now fails instead of manufacturing a coordinate correspondence.
- Padding could bring unsupported alignment borders into a valid inner box. Check the entire padded area before crop judging.
- Combined received video/photo evidence could drop the photos. Both API inspection and frontend submission now retain both inputs, including reviewer-requested evidence.
- The delivery page could use an escrow ID belonging to another item, acknowledge a non-purchase only in device state, or keep an old report after a new purchase. Add item matching, require an attached escrow for All good, select the report belonging to the purchase, and refresh displayed review/payment state.
- Already-purchased garments remained in search results and accepted new offers. Hide them from available search, expose purchase availability on their Pass, reject further offers and price edits, and link to delivery/review status.
- Duplicate purchase confirmations could create several holds for a one-off garment. Central purchase validation now rejects a second active/completed purchase.
- Home's received-item action pointed to a fixed fixture. It now opens real issue history; delivery links follow actual purchases.
- Price-only saves unnecessarily reran listing translations. Reuse translations only when the source text is exactly unchanged; changed disclosures still invalidate them.
- Raw validation arrays could appear as JSON errors. Render readable validation messages and a useful agent-service failure message.

## Validation completed

- **147 regression checks passed** across the offline-focused suite, covering pricing, escrow bounds, quote expiry, duplicate holds, private-minimum exposure, media metadata, Help discovery, replay source labels, mismatched crops, padded masks, nonblocking agent tools, seller drafts, human review and existing components.
- **12 legacy harness checks passed** in a separate process. Separate execution avoids its module-level environment/fixture side effects.
- Next.js production build and TypeScript checks passed. The final frontend production build also passed after all UI edits.
- Browser checks: Celio search renders two cards and thumbnails; Help opens the real pending issue; existing limitation punctuation is corrected; historical report shows labelled side-by-side evidence.
- One live buyer search: **15.92 seconds**, two results, one search tool call, no automatic Q&A calls.
- One **isolated live workflow** passed **14 HTTP stages**: real Gemini seller photo inspection (24.48 seconds including local inference initialization), disclosure, INR asking price/private minimum, publication, media listing, search, counteroffer, explicit escrow confirmation, received evidence/report, Help history, human evidence request, appended evidence and human refund decision. The issue stayed held before human review. Same-photo received evidence correctly produced `cant_tell` with source labels. No active user listing or payment was changed by this test.
- Two additional live Gemini checks rejected the reported full-view pair (16.52 seconds) and neck/side crops (4.60 seconds) as noncomparable. These are negative-case checks, not a precision/recall evaluation.
- The actual reported neck/side pair was rejected before defect judging when rerun from temporary copies. Its missing usable garment focus had previously been only a warning.

Local raw results: `fieldwork-ai/data/results/local-audit-2026-10-18/live-workflow.json`. The original historical report is backed up beside it as `historical-report-original.json`; these JSON/media artifacts remain excluded from Git. Three replay-pair labels were recovered by near-identical image matching; three historical crop source labels were recovered from the retained warp filenames. Assessment and human-review status were not changed.

Reproduce the live test from `fieldwork-ai/` with Vertex/ADC configured, the existing HF cache selected, an **isolated** `FW_STORE_DIR`, and a test `FW_REVIEW_TOKEN`:

```bash
python eval/local_workflow_audit.py --photo /absolute/path/to/garment.jpg --out /absolute/path/to/audit-results
```

The evaluator sets explicit test-actor prices ₹1,500 / ₹1,200 and reuses the photo for a replay control. `workflow_smoke.py`, `workflow_eval.py` and `organized_workflow.py` were updated for explicit seller pricing and separate acceptance-control records, so they do not purchase the same garment twice.

## What this does not establish

No full new 15-garment model evaluation was run during this audit. Previous 15-case results predate these correspondence changes and remain historical. The live received test reuses the source image, rather than testing an independently captured delivery. Rejecting the reported bad alignment demonstrates that case's guard, not accurate alignment recovery or improved hole/stain recall. There is no new damage precision/recall, independent received-session accuracy, model retraining, human decision-quality assessment or cloud deployment claim.

Strict correspondence checks may increase `cant_tell` and add a Gemini call for a geometrically plausible view. Clear matched-region captures are still needed. Browser testing covered representative search/media/status paths; it does not establish every mobile device, video codec or camera permission flow. Shared Help history and unauthenticated seller/quote ownership are prototype limitations, not multi-user production access controls.


## Follow-up: saved ₹400 purchase and lost tab progress

The xFisics charcoal sweatpants purchase was already durable: mandate `md_6c55a5ccb5`, item `g_0ca8a31bf3`, INR 400, status held. The missing UI came from component-local confirmation state and the absence of a purchase-history view. It was not a failed or missing escrow.

Added shared-prototype purchase/listing history endpoints, Saved purchases on Buy, Saved listings/resume links on Sell, and route-independent form/conversation state. Navigation now returns to the last screen in each flow. Serializable drafts use browser-tab session storage; selected media, private minimum entries, reviewer tokens and in-flight flags stay in memory. Leaving the camera stops access without uploading a partial clip. A pending API response updates the draft store even while its page is unmounted.

Browser checks confirmed: the INR 400 held purchase appears in history and opens the matching delivery page; unsent buyer text survives Buy → Sell → Buy; a real buyer model response completes while Sell is open and remains on return; three selected photos survive navigation; an unsaved seller asking price survives departure/return without a backend price change; buyer conversation survives a page reload; and an unsent received-issue description survives navigation. Temporary test edits were not submitted. No new purchase, acceptance, issue or settlement was created.

49 focused backend checks and seven frontend state-store checks pass; the frontend production build/typecheck passes. This is UI-state persistence, not durable background jobs: full reloads require reselecting media/re-entering memory-only inputs, and a backend restart still loses ADK's in-memory conversation context. History is shared until account/ownership authorization is implemented.
