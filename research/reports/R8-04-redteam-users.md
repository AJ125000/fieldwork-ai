# R8-04: Red team on real users (Fieldwork apparel v2)

**Date:** 8 Oct 2026 · **Lens:** hostile UX researcher + marketplace PM · **Inputs:** ROADMAP-APPAREL-v2.md, ROADMAP-APPAREL.md section 1, web checks (below)

**Reading note:** tap, second and prop counts are my **walkthrough estimates** from the roadmap flow, not measurements. Day-1 action: time 5 real people with a stopwatch. External numbers are tagged by how solid they are.

---

## 0. The evidence, and what it does and does not show

| Question | What I found | Strength |
|---|---|---|
| How low is the bar sellers are used to? | Mercari Japan "AI出品サポート" (Sep 2024): upload a photo, pick a category, and name, condition and price are auto-filled; "**as few as 3 taps**". On by default. | Company press, solid |
| Do sellers quit mid-listing? | Mercari's own survey: entering details and pricing "still feels like a high hurdle"; some sellers "**stopped partway, unsure how detailed the description should be**". Photoroom case study: sellers "postpone or abandon" listings rather than shoot in a messy or private space (small homes, fear of harsh feedback in Japan). | Survey and case study, no rates published |
| A drop-off rate? | One hard number: Facebook Marketplace, **7-9% abandoned** before category autosuggest. None found for Vinted, Depop or Mercari. Mercari's target for a *free background-blur tool*: 10% adoption, **+1% listings**. | Secondary. Even a pure convenience feature is expected to move listings only about 1% |
| Listing time | A Google Cloud / Digital Commerce 360 report says Mercari AI cut listing from "5-10 minutes to about 15 seconds" (unclear which feature). | Weak, but it sets the expectation |
| Do photos matter for sales? | Academic: higher-quality photos made shoes 1.17x and handbags 1.25x more likely to sell (Letgo/eBay data). Vendor claims of "3x faster with 5+ photos" are unsourced. | Mixed. A modest effect, not 3x |
| How often do buyers report problems? | **No verified rate found** for Vinted, Depop or eBay. Vinted policy: report within 2 days of delivery. A vendor blog claims about 25% of negative Depop reviews are "not as described", no source. | Gap. Do not quote a dispute rate in the pitch |
| Do buyers check parcels at delivery? | No survey on filming or photographing unboxing. Only anecdote (parts of Asia advise recording unboxings). Wardrobing is common (13% UK, 25% US holiday survey), so a minority already games returns. | Gap |
| Is refund fraud real? | Press and Trustpilot accounts of AI-edited damage photos on Vinted in 2026, plus sellers saying Vinted sided with the buyer even with before/after photos. No official data. | Anecdotal. Supports the need, not the size |
| Bangalore meetups | OLX India safety advice is "meet in public, inspect before paying". WRI: **hygiene and condition are the top two barriers** to buying second-hand clothes in India. Nothing on meetup behaviour itself. | Indirect |

**Meaning:** the bar to beat is 3 taps and a tool that *writes the listing for you*. Sellers already drop out over "how detailed should I be?". Photo effects on sales are real but modest. We have no proof buyers do anything at delivery, and no dispute rate.

---

## 1. Persona A: casual seller in Tokyo, listing a jacket on the train

Baseline: Mercari, about 3 taps, roughly 30-90 s. Fieldwork full flow below.

| Step | Taps / seconds / props | Quit risk | Fix |
|---|---|---|---|
| Open capture, read instructions | 2 taps, 10 s | Low | One screen, no text |
| **Where to shoot.** Flat-lay needs a clean floor or bed. On a train there is no surface, and the nonce demands a *live* in-app capture, not the camera roll | Prop: a flat surface | **Very high.** Casual sellers already avoid shooting in private or messy spaces (Photoroom). The "list on the train" scenario breaks outright | Allow camera-roll photos with a lower evidence badge. Let the seller shoot at home and finish the listing on the train, as they do today |
| 4 core shots (front, back, label, flaw) | about 12 taps, 40-60 s, plus 1-2 retakes when the quality gate rejects glare or blur: +20-40 s | Medium-high. A blur/exposure/glare gate loops in a dim flat or on a moving train | Gate only hard failures (blur, wrong object); never reject for glare; auto-pick the best frame from a short burst |
| Coached close-ups (collar, cuffs, armpits, hem) | 4 shots x 3 taps = 12 taps, 60-90 s | **High.** "Show the left cuff closer" feels like a quiz | Planner asks for at most 1 extra shot, only where the model is genuinely unsure. Default 0 |
| **Fieldwork card/tag (QR + one-time code + grey patch)** | Prop: a printer or a convenience-store print run, 3-10 min. Or handwrite the code: pen + paper, 15-20 s | **Killer.** Nobody prints a tag for a jacket that has not sold; the listing is speculative | See section 5: no printed tag at listing |
| Declared flaws / seller declarations | about 5 taps, 30 s, 2-3 decisions ("worn how many times? smoke-free?") | Medium (Mercari's survey: "how detailed?" is a drop-off reason) | Pre-fill from the photos; seller confirms with one tap |
| Backlit "light-through" shot (STRETCH-2) | Prop: window or torch plus a free hand; 2 taps, 20 s | **Very high on a train** | Drop for C2C. Optional, high-value resale only |
| Witness mark (STRETCH-2) | 3 taps plus a physical mark on the garment | High; feels like a security ritual | Cut for C2C; keep for premium items |
| Review the four-lane record | about 5 taps, 20-40 s | Medium; reads as a legal form | Show a preview *as the listing*, not as a record |
| **Total** | **about 45-60 taps, 4-8 min, 4-6 extra decisions, 1-3 props** vs Mercari about 3 taps, about 1 min | | |

**Cheat / ignore:** retake until the stain is out of frame; reuse an old clean photo of the same jacket; skip the tag and take the "basic" badge; tap through declared flaws on defaults.

---

## 2. Persona B: buyer in Singapore receiving a parcel

| Step | Taps / seconds / props | Quit risk | Fix |
|---|---|---|---|
| Parcel arrives (locker, doorstep, condo guardhouse); the app prompts "do the handover check" | 1 tap | Medium: the push is a chore, not a reward | Never push a check; fold it into the existing "confirm receipt" step |
| Open parcel, keep tag on, lay the garment flat | Prop: clean floor or bed; 30-60 s | **High.** The buyer wants to try it on first. In a small flat there is no flat-lay space | Accept a hand-held or hanger shot |
| Ghost overlay: align the camera to the listing photo; it auto-snaps | about 6-12 taps, 60-120 s, steady hand, good light | **High.** Alignment is fiddly; the first failure ends the attempt | Auto-capture over a short burst; no manual alignment |
| Extra close-ups where the listing declared a flaw | 3-6 taps, 40 s | High | Only on a claim |
| Verdict "consistent / differs / can't tell" | 1 tap | Medium. "Can't tell" gives the buyer nothing | Hide it unless the buyer opens a claim |
| **Total** | **about 15-25 taps, 3-5 min, 1 prop (floor space)** | | |

**Core problem:** for most orders nothing is wrong and the buyer gains nothing from the check, so it is homework. Vinted already has a 1-tap "Everything is OK" and a 2-day window; that is the competition. A buyer who *does* have a problem is motivated and will do the work; one who doesn't, won't.
**Cheat / ignore:** skip it and tap "OK"; or, if gaming, take a dark, blurry or misaligned photo to force "differs / can't tell". Wardrobing surveys (13-25%) say a minority look for exactly this.

---

## 3. Persona C: buyer at a meetup in Bangalore

| Step | Taps / seconds / props | Quit risk | Fix |
|---|---|---|---|
| Meet at a cafe or metro station; jacket handed over | 0 | none | |
| Buyer inspects with eyes and hands (hygiene and condition are the top India barriers, so this is what they came for) | 20-60 s, no phone | none; this is the natural check | Do not interrupt it |
| Fieldwork check: flat-lay on a cafe table and ghost-overlay align | 15-25 taps, 2-4 min, a table, the seller waiting | **Near-certain refusal.** It signals distrust, slows the sale, and the buyer can already see the garment | Skip entirely |
| Payment (UPI or cash) | normal | | |

**Value at a meetup is close to zero for the buyer.** The only real value is the *seller's* later protection against "you sold me a damaged one". Meetup mode = a 5-second two-party "accepted as shown" tap (both scan one QR, or the buyer taps "accepted" in chat), nothing more. There is no escrow at a meetup, so pay-on-pass does not apply.

---

## 4. Persona D: platform trust & safety agent

| Step | Taps / seconds | Quit risk | Fix |
|---|---|---|---|
| Open the case from the queue | 1 tap | none | |
| Read the one-line outcome | 5 s | Low | Keep to a single sentence |
| View the blink comparator on the changed spot | 2 taps, 10-20 s | Low if alignment is good; otherwise the agent ignores it | Show only the flagged region |
| Check the fair-wear schedule | 1-2 taps, 10 s | Medium | Auto-apply |
| Set the refund slider | 2 taps, 10 s | Medium | Pre-set from the anchors |
| Approve | 1 tap | none | |
| **Total** | **about 8-10 taps, 45-90 s** | | |

**Hostile reads:**
- **"Can't tell" becomes a dumping ground.** If it exceeds about 25% of cases, the agent redoes everything by hand and the tool adds a step instead of removing one. Measure it.
- **Automation bias.** An agent at 100+ cases a day rubber-stamps the verdict; human approval on *every* case caps throughput and doubles cost.
- **Platforms side with buyers anyway** (Trustpilot accounts of sellers losing despite before/after photos). If policy is "refund on any plausible claim", our evidence changes little. The value must come from *fraud denial* where the evidence shows no change.
- **Cost asymmetry:** every seller pays friction at listing; the benefit lands only in the small share of orders that become disputes (rate unknown).
- **Arms race:** buyers can fake photos with the same Nano Banana tool we use. Publish the forger's win rate, knowing a high one is a headline for the other side.

---

## 5. Is the "printed Fieldwork tag" realistic for C2C?

**No, not as a prerequisite at listing.**
1. **Timing.** The tag is needed before the item sells. Most casual listings do not sell fast, so print effort is sunk for items that never sell.
2. **Props.** Casual sellers do not own printers. Japan has convenience-store printing (familiar from shipping labels), but those labels come *after* a sale, when the seller is motivated.
3. **Audience.** Casual C2C sellers list 1-5 items; the tag only pays for resellers and high-volume closets.
4. **Meetup markets** (Bangalore) have no shipping label to piggyback on.

**What works instead:**
- **Listing time:** an on-screen nonce in the live capture; if a code in frame is wanted, the seller writes it on any scrap of paper (15 s, no printing). Make this the *"stronger evidence"* badge, not the default.
- **Sale time:** the seller already prints or shows a shipping label; attach the Fieldwork code **to that label**, or to the garment's own care tag. The buyer scans it on arrival. Zero extra props, at a motivated moment.
- **Resellers:** offer sheets of pre-printed tags; they have the volume.

---

## 6. The five friction points that kill adoption, and what to make automatic

| # | Killer | Evidence it bites | What to make automatic / invisible |
|---|---|---|---|
| 1 | **Listing is about 15x longer than the incumbent's.** 45-60 taps and 4-8 min against Mercari's 3 taps; coached close-ups, declarations, quality-gate loops | Mercari: sellers stop partway on detail and pricing; Facebook: 7-9% abandon before autosuggest; Mercari expects only +1% listings from a free background tool | Default = 3 photos. AI writes title, description, size, condition and price from them (what the seller *wants*). Evidence is a by-product. At most 1 AI-requested close-up. Declarations pre-filled; seller confirms in 1 tap |
| 2 | **Live-capture-only and prop-dependent** (flat-lay surface, printed tag, backlight, scrap-paper code). Excludes train/commute listing and small-flat sellers | Photoroom: sellers avoid shooting in private or messy spaces; Tokyo sellers list in snatched moments | Accept camera-roll photos with a lower badge; defer capture to a "shoot at home" step; kill printed tag, backlight and witness mark for C2C; attach the code to the shipping label at sale time |
| 3 | **The buyer check is homework when nothing is wrong, and an insult at a meetup.** 3-5 min, floor space and alignment vs a 1-tap "OK" | No evidence buyers check at all; WRI shows in-person inspection is *the* India need | Passive by default: 1-tap confirm receipt. The guided check opens only on "Report a problem" (buyer is motivated then); auto-capture, no manual alignment. Meetup mode: 5-second two-party "accepted as shown" |
| 4 | **Pay now, benefit maybe never.** All sellers carry friction; the payoff arrives only in rare disputes, and platforms often side with buyers anyway | No verified dispute rate; seller accounts of losing despite photos | Give an immediate, visible win: auto-written listing, "Verified condition" badge with search priority, faster payout via pay-on-pass, a seller-protection promise ("if the check shows no change, you are paid"). Pilot with resellers first |
| 5 | **Back-office drag: "can't tell" and human approval on every case, plus cheating.** Agents rubber-stamp or redo work; buyers force "can't tell" with bad photos; forged damage | Vinted AI-faked-damage reports (anecdotal); wardrobing 13-25% | Auto-close "consistent"; auto-refund "differs" at high confidence, anchored to the fair-wear schedule; humans see only the escalate bucket. Treat bad-quality buyer photos as "claim not supported yet, retake", not "can't tell". Report % can't tell and the forger's win rate |

### How to make each user *want* it
- **Seller:** "Photograph once, we write your listing." Badge gives search priority and a quicker sale. Protection against false claims. Faster payout.
- **Buyer:** "Ask the garment" and "fits like" at purchase (benefit at the moment of buying). Instant refund path on a verified claim instead of a 3-day argument.
- **Meetup buyer and seller:** a 5-second "accepted as shown" slip that protects *both* from later claims.
- **T&S agent:** a queue that is 60-70% auto-closed, with the rest shown as one sentence and one flashing region.

### Day-1 tests to add
1. Stopwatch 5 casual sellers through the 3-photo and the full flow; record taps, seconds, quits.
2. Count the % of buyers who open the check unprompted in a friendly pilot (expect few).
3. Measure the quality-gate rejection rate on train-quality photos.
4. Track "can't tell" share on the planted-change bed; target below 20-25%.

---

## Sources
- Mercari AI listing support (3 taps, survey on drop-off): https://ecnomikata.com/ecnews/ecmall/44437/ · https://jp-news.mercari.com/info/40429
- Mercari 15-second claim: https://www.digitalcommerce360.com/2026/06/19/mercari-launches-us-app/
- Mercari/Photoroom (abandonment due to photo spaces, +1% target): https://www.photoroom.com/customer-stories/mercari
- Facebook Marketplace 7-9% abandonment: https://bestpractice.ai/ai-use-cases/case-studies/consumer-retail/facebook-optimises-sellers-listings-on-marketplace-using-ai
- Photo quality and sell-through (Ma et al. 2019): https://letsenhance.io/blog/all/photo-quality-marketplace-statistics/amp/
- Vinted dispute rules (2-day window): https://news.resolver.co.uk/?p=8400
- Vinted AI-faked damage reports: https://www.nssmag.com/en/fashion/45705/artificial-intelligence-ai-vinted-scams-fake-listings · https://news.resolver.co.uk/vinted-scams-how-star-seller-tori-was-betrayed-by-the-plaform/
- Wardrobing surveys: https://www.nbcnews.com/business/consumer/wardrobing-retail-fraud-soars-summer-rcna165617 · https://channelx.world/2019/01/worn-fashion-returns-highest-from-25-34-yr-olds/
- WRI, India second-hand clothing barriers: https://www.wri.org/research/secondhand-shopping-understanding-consumer-behavior-toward-pre-owned-clothing-india
- OLX India safety guidance: https://www.exchange4media.com/marketing-news/olx-launches-webwisean-initiative-to-promote-online-safety-89133.html
