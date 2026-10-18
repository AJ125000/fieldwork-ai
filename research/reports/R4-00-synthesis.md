# R4-00: Pivot synthesis: category + AI architecture (7 Oct 2026)

Sources: R4-01 (category), R4-02 (capture and authenticity), R4-03 (matching and condition), R4-04 (tuning, agents, schema, disputes). Deadline check: 11 Oct is **team formation**; submission is **18 Oct** (official site + dashboard), so we still plan to submit on 17 Oct.

## 1. Category: everyday pre-loved clothing (fallback: books)

| | Clothing (33/40) | Books (32/40) |
|---|---|---|
| Why | ThredUp listed only 59% of items received (41% not worth handling); second-hand apparel US$393B by 2030; Vinted +47% | ₹100–300 items: any manual check eats the margin; an industry grade scale exists; ISBN gives edition |
| Data for training | **RISE / Nauman 2024: 31,997 real second-hand garments × 3 photos, condition 1–5, pilling, stains, holes, damage location, CC-BY 4.0, 26.9 GB, plus a 100-item gold set with human agreement.** Nothing comparable exists for any other category | Roboflow book-damage set (small) |
| Risk | Meesho conflict (fashion is about half of Meesho's sales); fit, smell and feel can't be judged from photos; plain mass-produced items are hard to prove "same unit" | Low dispute pain; shipping ≈ item price |

**Recommendation: clothing**, if Akshat's employer policy allows it. The dataset is what makes a real, measured "tuned to the category" model possible in 10 days. Footwear goes on the "next category" slide.

## 2. AI architecture (agent workflow on ADK 2.11, Cloud Run)

A deterministic workflow spine; models only where judgement is needed; every result can abstain.

```
SELLER CAPTURE
  session nonce → QR card + handwritten code + colour patch in frame
  → [code] live quality gate (OpenCV.js: blur, exposure, glare, framing)
  → [Gemini Flash-Lite] angle/coverage check  → [capture-planner agent] next required shot
     (protocol: front, back, care label, collar, armpits, hem, cuffs, close-up of each flaw)
  → [code] authenticity: nonce verified, PDQ + embedding duplicate index, moire/recapture,
     AI/edit risk flag (Community Forensics / TruFor), signed capture manifest (C2PA, stretch)

CONDITION RECORD
  → in parallel:
      [OUR TUNED MODEL] SigLIP 2 embeddings + trained heads (condition 1–5, pilling, stain, hole),
                        trained on RISE; calibrated probabilities
      [Gemini Flash] open-vocabulary defects with boxes, 3 samples, keep defects found ≥2 times
  → [code] reconcile: agreement → "shown"; disagreement → "can't tell" / ask a close-up
  → [code] compact coded item record (taxonomy codes + region + severity + evidence IDs);
     95 tokens vs 262 for verbose JSON; rendered into any JAPAC language at read time
  → seller confirms (human in the loop) → publish

BUYER Q&A        → grounded agent, public record only, cites the photo crop

HANDOVER CHECK   → buyer's arrival photos (same QR tag still attached)
  → identity: DINOv2/SigLIP cosine + local-feature inliers (LightGlue) + recovery of
     declared flaws ("fingerprints") + QR tag + Gemini pairwise judgement ×3
  → [code] calibrated 3-way gate: MATCHES / DIFFERS / CAN'T TELL (thresholds from our validation set)
  → change map: register, diff, Gemini filters real change from wrinkles/shadows
  → buyer-preference weights (what this buyer said matters: stains vs pilling vs fading)

DISPUTE (separate service)
  → quarantined fact extractor (no tools) → parallel claim / policy / skeptic agents
  → adjudicate twice with party order swapped → [code] abstention gate
  → human approves → both parties told the reason, in their language
```

**What counts as fine-tuning here:** our own condition model trained on 32k real garments, reported against an untuned Gemini baseline with confidence intervals and a wild phone-photo test set. Stretch: Gemma 4 E4B QLoRA (free Colab T4) writing the coded defect record. Skip Gemini supervised tuning: on Vertex only Gemini 2.5 is tunable, and it retires around 16–20 Oct.

## 3. New innovation to add: the tag

Plain mass-produced garments can't be proven to be the *same unit* from photos alone (R4-03, risk 1). Fix: at listing, the seller attaches a cheap printed **Fieldwork tag** (QR + code) through the care label. It appears in listing and handover photos, and combined with the item's own wear marks gives identity that photos alone can't. It costs a few paise, which suits a low-margin category.

## 4. Ten-day cut (Claude builds; Akshat runs photos, product, story)

| Do (core) | Stretch | Skip |
|---|---|---|
| Capture protocol + quality gate + nonce/QR check | C2PA manifest, colour-card correction | MASt3R / VGGT, SAM |
| Tuned SigLIP 2 condition heads on a 2–3k RISE subset + Gemini reconcile | Gemma 4 QLoRA | Gemini SFT |
| Coded item record + multilingual render | Buyer-preference weights | Reverse image web search |
| Handover 3-way gate (embeddings + LightGlue + flaws + tag + Gemini) with calibration | AI/edit risk flag | Memory Bank, A2A, negotiation |
| Dispute case card (quarantine + order-swap + human approval) | Change map | |
| Results table: condition accuracy vs Gemini baseline; handover false-match rate | | |

## 5. Biggest risks
1. **Domain gap:** RISE photos are sorting-line shots, but sellers use phones → wild test set of 40–60 home garments, close-up asks, abstain.
2. **Small validation set:** with ~100 negative pairs, the best provable false-match rate is ~3–5%. Say so openly.
3. **Pseudo-change:** wrinkles, shadows and pose → flat-lay protocol, registration, Gemini filter.
4. **Scope vs 10 days with one non-technical lead.** Keep to the "Do" column until it works end to end.
