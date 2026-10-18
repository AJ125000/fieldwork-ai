# R7-02: Frontier research idea cards (apparel)

Date: 8 Oct 2026. Scope: only items NOT already in ROADMAP-APPAREL.md. Best first.
Stages: A capture, B condition, C record, D search, E handover, F dispute.
Evidence tags: [read] = I opened the page/README; [snippet] = seen only in search snippets, verify before relying; [inference] = my own proposal, no paper tests it.
Licences are for code unless stated. Always re-check the weights licence before baking into the image.

---

## 1. Planted-change test bed from Gemini image editing
- **Stage:** E (also F)
- **What:** Take each listing photo and have Gemini image editing (Nano Banana, `gemini-2.5-flash-image`, or the newer image model) add a localised stain, snag, hole, fade patch or removed-flaw, using a mask we choose. Then run the handover gate on (original, edited) pairs. We get hundreds of pairs with known ground-truth location, not the ~10 hand-made ones in the roadmap.
- **Why new:** The roadmap plans a handful of physical plants (washable marker, lint). This scales change-recall measurement ~20x and gives per-size recall curves ("recall at 1 cm, 2 cm, 5 cm"). It also fixes weakness 8 (small validation set) for the recall half of the table. It does not replace real negatives for the false-match rate.
- **Evidence:** Stain removal/addition and local edits are documented Nano Banana capabilities [snippet: Google/Vercel model pages]. No paper tests realism for garments. Keep a real-plant subset as the honesty check and report both.
- **Paper / code:** Model docs https://ai.google.dev/gemini-api/docs/models/gemini-2.5-flash-image . All outputs carry an invisible SynthID mark, so tag these as synthetic in the data folder and never mix them into real-photo test splits.
- **Licence:** Gemini API terms (no repo).
- **Use in 10 days:** 0.5 day to script (prompt + mask + "keep everything else identical"), 1 day to filter bad edits by eye/difference check. Report "recall on real plants N=x, on synthetic N=y".
- **Effort:** 1.5 days. **Judge wow:** 4

## 2. Mask-controlled synthetic defects to fix sparse stain/hole labels
- **Stage:** B
- **What:** Stains are 71% blank and holes 95% blank in the training set (roadmap risk 3). Generate extra positives: paste Gemini-edited stains/holes/pilling onto clean training garments inside a known mask, so the mask head and crop classifier get free pixel labels. Train on real + synthetic, test only on the 356 verified real positives and our 40 garments.
- **Why new:** The roadmap mitigates sparsity by dropping the stain/hole heads. This is the one lever that could bring them back as a real trained result, which is the strongest answer to "looks like a Gemini wrapper".
- **Evidence:** DefectFill (CVPR 2025) reports state-of-the-art classification/localisation after training on its synthetic defects (MVTec AD) [snippet]. SeaS (ICCV 2025) reports +8.66% pixel AP for synthesis-based detection and +12.79 IoU supervised segmentation [read]. These are industrial, not garment, results. Ablation (with vs without synthetic) is the claim we would publish.
- **Paper / code:** DefectFill https://arxiv.org/abs/2503.13985 (I found NO official code; treat as concept only). Gemini editing is the practical route.
- **Licence:** Gemini API terms; training on outputs of the model is our own responsibility to check.
- **Use in 10 days:** 300 to 500 synthetic positives, retrain the masked heads, report real-only vs real+synthetic on real positives.
- **Effort:** 2 days. **Judge wow:** 4

## 3. Agentic Vision (Gemini 3 Flash with code execution) as the defect inspector
- **Stage:** B, E, F
- **What:** Turn on code execution so the model zooms, crops, rotates and annotates the image itself (Think, Act, Observe loop) before answering "is there a stain on the left cuff?". Use it for the confirm step on Gemini boxes and for the aligned crop-pair judge in handover.
- **Why new:** Roadmap uses Gemini boxes plus a separate crop classifier. This lets the model re-inspect high-res detail on demand and gives us a clean ablation row: plain Gemini vs Gemini with code execution vs ours.
- **Evidence:** Google claims a consistent 5 to 10% quality gain across vision benchmarks with code execution on, and a 5% gain for one customer on plan checking [snippet: Google blog, secondary coverage]. First-party number, not independent. Some operations (rotate) still need explicit prompting.
- **Paper / code:** https://blog.google/innovation-and-ai/technology/developers-tools/agentic-vision-gemini-3-flash/ (API: enable code execution tool).
- **Licence:** Gemini API terms.
- **Use in 10 days:** Add as a switch on the existing Gemini call, store the crops it produced as evidence (nice for the cited record). Measure on our 40 garments. Cost and latency go up; report both.
- **Effort:** 1 day. **Judge wow:** 4

## 4. Selective LLM judge with a provable agreement guarantee ("Trust or Escalate")
- **Stage:** F
- **What:** Replace "run adjudication twice with order swapped" as the only confidence signal. Estimate judge confidence with simulated annotators (several judge personas/prompts voting), accept the ruling only above a threshold calibrated so agreement with human labels is guaranteed at a chosen level (e.g. 85%), otherwise escalate: cheap judge (Flash-Lite) first, stronger judge second, human last.
- **Why new:** The roadmap uses Learn-then-Test for the handover gate but only a swap-and-compare heuristic for the dispute judge. This brings the same statistical guarantee to the judge and gives a cost story (cascade).
- **Evidence:** ICLR 2025 (oral). Headline: a Mistral-7B cascade guarantees over 80% human agreement at about 80% coverage on a Chatbot Arena subset where GPT-4 rarely reaches 80% [snippet].
- **Paper / code:** https://arxiv.org/abs/2407.18370 . I could not find an official repo; the method is simple enough to reimplement (about 100 lines on top of our own labelled disputes).
- **Licence:** n/a.
- **Use in 10 days:** Needs a labelled set. Our ~20 synthetic disputes are too few for a tight guarantee: say so and report the interval.
- **Effort:** 2 days. **Judge wow:** 4

## 5. Per-claim conformal filtering of the listing and answers (ConfLVLM)
- **Stage:** C
- **What:** Treat every sentence the VLM writes about a garment as a hypothesis, score it with a cheap uncertainty signal, and drop claims above a conformally calibrated threshold, giving a bound on the share of false claims that reach the record.
- **Why new:** Roadmap enforces abstention in code for unseen regions, but has no statistical bound on false claims inside shown regions. This gives "at most x% of claims in the record are wrong, with 90% confidence" as a headline.
- **Evidence:** EMNLP 2025. On LLaVA-1.5 scene descriptions the claim error rate fell from 87.8% to 10.0% with a 95.3% true-positive rate for filtering errors [read]. Also tested on radiology reports and documents.
- **Paper / code:** https://arxiv.org/abs/2502.20560 . No repo link on the arXiv page; implement as split conformal on claim scores using our own labelled claims.
- **Licence:** n/a.
- **Use in 10 days:** Label ~300 claims from the 40 garments (true/false), calibrate, report error rate before and after.
- **Effort:** 1.5 days. **Judge wow:** 4

## 6. Parallax-liveness sweep: one 5 second video as proof of physical presence
- **Stage:** A
- **What:** Instead of (or alongside) the card/nonce, ask for a short slow sweep over the flat-lay. Run a feed-forward multi-view model on sampled frames and check that the frames are geometrically consistent (a coherent depth/pose solution). A screen replay or a stock photo cannot give consistent parallax. As a side benefit, pick the sharpest frames automatically and cut seller friction from 4+ shots to one gesture.
- **Why new:** The roadmap's capture proof is nonce + duplicate search + forensics flag. This adds a physics-based signal not based on trained fake detectors. This is [inference]; I found no paper on parallax as listing liveness. The research gap is open.
- **Evidence:** MapAnything is a universal feed-forward metric 3D model accepting images (and video through its demo), outputs depth, points, poses, intrinsics and a metric scaling factor [read]. I found NO study showing that a 10 s video beats 4 photos for condition or identity grading; do not claim it. Claim only friction and liveness.
- **Paper / code:** https://github.com/facebookresearch/map-anything , paper https://arxiv.org/abs/2509.13414 .
- **Licence:** Code Apache-2.0. Use weights `facebook/map-anything-apache` (Apache-2.0); default weights are CC-BY-NC. VGGT-1B original weights are CC-BY-NC, avoid [snippet].
- **Use in 10 days:** CPU inference may be slow; run on the vision Cloud Run with a small frame count (8 to 12). Test 5 real sweeps vs 5 photos-of-a-screen. Kill if it cannot separate them.
- **Effort:** 2 days. **Judge wow:** 4

## 7. RoMa v2 dense warp with built-in covisibility for the handover alignment
- **Stage:** E
- **What:** Dense matching between the listing flat-lay and the handover flat-lay gives a per-pixel warp plus per-pixel overlap/precision maps. Regions with low overlap are candidate "changed or occluded" areas, with no explicit TPS, landmarks or template needed for the first pass.
- **Why new:** Roadmap normalises by landmark-driven TPS then matches sparse points (ALIKED + LightGlue). A dense matcher is a cleaner baseline and gives an extra change signal for free. It is a drop-in comparison on the 3 day-1 handover pairs.
- **Evidence:** RoMa v2 (Nov 2025) reports ScanNet-1500 AUC [34.0, 56.5, 73.9] and MegaDepth-1500 [62.8, 76.8, 86.5] [read: README]. Trained on rigid scenes, so folded cloth is an open question. Test before committing.
- **Paper / code:** https://arxiv.org/abs/2511.15706 , https://github.com/Parskatt/romav2 (PyPI `romav2`, `model.match()` and `model.sample()` return matches, overlaps, precision maps).
- **Licence:** Code MIT, except DINOv3 which has its own custom licence (appears to allow commercial use; read it) [read].
- **Use in 10 days:** GPU preferred; check CPU speed on day 1.
- **Effort:** 1 day. **Judge wow:** 3

## 8. AnomalyDINO as the one-shot change detector (replaces PatchCore fit)
- **Stage:** E
- **What:** Use the listing crop as the single "normal" reference and score the handover crop by DINOv2 patch nearest-neighbour distance. No training, no memory bank fit.
- **Why new:** Roadmap fits anomalib PatchCore on the listing crop. AnomalyDINO is built for exactly this 1-shot setting and is already in anomalib, so the swap is trivial and we can show a head-to-head.
- **Evidence:** WACV 2025 oral. One-shot MVTec-AD image AUROC 96.6, up from 93.1 for the previous best [snippet]. Industrial data, so we must report our own number.
- **Paper / code:** https://arxiv.org/abs/2405.14529 , https://github.com/dammsi/AnomalyDINO ; also in anomalib (DINOv2-Small backbone) [snippet]. INP-Former (CVPR 2025) https://github.com/luow23/INP-Former is the stronger alternative if we have a day.
- **Licence:** Repo licence not confirmed; INP-Former listed as MIT [snippet]. DINOv2 weights: verify current licence.
- **Use in 10 days:** Run both PatchCore and AnomalyDINO on the planted-change set (card 1), choose by recall at fixed false-alarm rate.
- **Effort:** 0.5 to 1 day. **Judge wow:** 3

## 9. Do not use free-form debate for adjudication: meta-judge instead
- **Stage:** F
- **What:** The roadmap has claim, policy and skeptic agents plus swapped adjudication. Published evidence says multi-agent debate amplifies position, verbosity, chain-of-thought and bandwagon bias after round one, while an LLM-as-meta-judge setup resists it better. Restructure: independent single-shot judgements, then one meta-judge that sees all, plus the swap check and the PINE-style debias.
- **Why new:** It changes a design decision, and gives a defensible reason for it in the proposal PDF. We can also run our own measure: flip party order and length-pad one side, report rate of ruling flips.
- **Evidence:** "Judging with Many Minds", Findings of EMNLP 2025 [snippet]. Debate increases bias; meta-judge more robust; PINE helps in debate but less in meta-judge.
- **Paper / code:** https://arxiv.org/abs/2505.19477 (code not verified).
- **Licence:** n/a.
- **Use in 10 days:** Mostly prompt and orchestration; the bias test suite doubles as the "order-swap and injection suite" already listed as stretch.
- **Effort:** 1 day. **Judge wow:** 3

## 10. Perturbation-consistency and fused confidence as the VLM abstention signal
- **Stage:** B, C, F
- **What:** Two cheap uncertainty signals for Gemini answers about defects: (a) ask the same question on small visual perturbations (crop shift, blur, brightness) and measure answer disagreement; (b) fuse the model's verbalised confidence with its token-level probability when the API gives logprobs. Feed the result to the existing conformal/abstain gate.
- **Why new:** Roadmap abstains via conformal grade sets for our own model, but has no principled uncertainty for Gemini's free-text outputs.
- **Evidence:** HEDGE/VASE-style perturbation-aware entropy reports ROC-AUC up to 0.89 for hallucination detection in medical VQA, best on video VLMs in VideoHEDGE [snippet]. EMNLP 2025 finds verbalised confidence is often miscalibrated but reasoning-with-images models are better calibrated [snippet]. "Instinct vs Reflection" (Apr 2026) fuses token and verbalised confidence and reports lower ECE and better risk-coverage, code promised [read abstract].
- **Paper / code:** https://arxiv.org/abs/2604.17274 , code to appear at github.com/Yunkaidang/Instinct-vs.-Reflection (not yet confirmed). Perturbation idea: https://arxiv.org/abs/2503.20504 (UniVRSE) and https://arxiv.org/abs/2601.08557 (VideoHEDGE).
- **Licence:** unknown.
- **Use in 10 days:** Perturbation version needs no logprobs. 3 to 5 extra calls per defect; cost goes up, so limit to defects near the decision threshold.
- **Effort:** 1 day. **Judge wow:** 3

## 11. SAM 3 text-prompted garment parts
- **Stage:** A, E
- **What:** Segment "collar", "cuff", "hem", "left sleeve", "pocket", "care label" by text, instead of relying on Fashionpedia detector classes or Gemini masks. Parts feed the template normalisation and the "3 cm from the seam" flaw ledger.
- **Why new:** Roadmap lists `garment-detector-seg` and Gemini masks. SAM 3 does open-vocabulary concept segmentation of all instances, with a presence token that separates similar prompts.
- **Evidence:** SAM 3 (Nov 2025) reports 75 to 80% of human performance on its SA-Co benchmark [snippet]. No garment-part number; test on 10 garments.
- **Paper / code:** https://arxiv.org/abs/2511.16719 , https://github.com/facebookresearch/sam3 (needs Python 3.12, PyTorch 2.7).
- **Licence:** Meta "SAM License" (not read; check commercial terms). Weights gated.
- **Use in 10 days:** Likely needs a GPU; fall back to Gemini masks if CPU-only.
- **Effort:** 1 day. **Judge wow:** 3

## 12. DINOv3 patch-feature landmark transfer (a no-training backup for HRNet landmarks)
- **Stage:** A, E
- **What:** Label landmarks once on a template garment per category (shoulder, cuff, hem, collar), then find them in any new photo via mutual nearest neighbours of DINOv3 patch features. Gives landmarks for categories where we have no trained landmark model.
- **Why new:** Roadmap relies on HRNet landmarks (and Gemini points). Foundation-feature correspondence is the "better than TPS" direction for deformable objects, and RoMa v2 already builds on DINOv3.
- **Evidence:** DINOv3 reports off-the-shelf 3D keypoint matching (NAVI) [snippet]. Two 2026 papers warn its features are not fine-grained enough to guarantee geometric accuracy, so expect centimetre-level error on garments; measure vs tape before use [snippet]. DenseMatcher (ICLR 2025, 589 assets in 23 categories) is the 3D mesh version; not suited to photos, skip [snippet].
- **Paper / code:** https://arxiv.org/abs/2508.10104 , https://github.com/facebookresearch/dinov3 .
- **Licence:** Custom "DINOv3 License", commercial use appears allowed but is not Apache; get legal read if this goes beyond the hackathon [snippet]. DINOv2 is the safer alternative.
- **Use in 10 days:** Two hours to prototype in the day-1 landmark test (compare against Gemini points and tape).
- **Effort:** 1 day. **Judge wow:** 3

## 13. Open-source anomaly synthesis as the fallback to card 2
- **Stage:** B
- **What:** If Gemini edits are inconsistent, use SeaS (MIT) to learn defect-specific generators and mask pairs, or O2MAG (training-free, needs ONE reference anomalous image) to generate more. Anomagic (Nov 2025) is zero-shot from text but I found no code.
- **Why new:** Gives a self-hosted, reproducible path, plus a clear story on how we handled the label gap. Both beat nothing for pilling and stain texture, where Gemini may fail to be local.
- **Evidence:** SeaS numbers in card 2 [read]; generates anomaly-mask pairs and normal images; the repo released generated sets for MVTec/VisA/MVTec 3D on Hugging Face. O2MAG claims state-of-the-art downstream AD but gives no numbers on the abstract page [read]. Industrial, not garments.
- **Paper / code:** SeaS https://github.com/HUST-SLOW/SeaS (https://arxiv.org/abs/2410.14987); O2MAG https://github.com/echrao/O2MAG (https://arxiv.org/abs/2603.18093); Anomagic https://arxiv.org/abs/2511.10020 (no code found).
- **Licence:** SeaS MIT (README says free commercial use) [read]; base model Stable Diffusion v1-4 is downloaded separately and has its own licence. O2MAG licence not checked.
- **Use in 10 days:** SeaS trains per category (hours on a GPU); only worth it with a Colab GPU.
- **Effort:** 3 days. **Judge wow:** 3

## 14. Specialist anomaly VLM as an extra baseline row (Anomaly-OneVision, IADGPT)
- **Stage:** B
- **What:** Run Anomaly-OV and IADGPT (few-shot, in-context) on the same crops as Gemini and our model, so the results table shows "specialist anomaly VLMs fail on garments" or "match us".
- **Why new:** Roadmap baselines are majority class, untuned Gemini and human. A published specialist is a stronger comparison and shows we know the field.
- **Evidence:** Anomaly-OV (CVPR 2025) introduces Anomaly-Instruct-125k and VisA-D&R and uses a Look-Twice Feature Matching that re-weights abnormal visual tokens [snippet]; this is the same "zoom on suspicious tokens" idea as card 3. It is trained on industrial data, so garment transfer is probably weak.
- **Paper / code:** https://arxiv.org/abs/2502.07601 ; repo seemed to be https://github.com/honda-research-institute/Anomaly-OneVision (Apache-2.0 shown, base LLaVA-OneVision; I guessed the URL and it loaded, but search could not confirm it, verify). IADGPT https://arxiv.org/abs/2508.10681 .
- **Licence:** Apache-2.0 (code) per the repo page I read; dataset licence follows VisA, not checked.
- **Use in 10 days:** Only if GPU time is spare. Low value if it can't run in 2 hours.
- **Effort:** 1 day. **Judge wow:** 2

## 15. DeepEyes-7B as an open, local "zoom-in" model
- **Stage:** B (alt to card 3)
- **What:** Qwen2.5-VL-7B trained with RL to crop/zoom as part of its reasoning. A locally runnable, auditable counterpart to Gemini agentic vision, usable offline or if Gemini quotas bite.
- **Why new:** Roadmap's LoRA stretch uses Gemma 4 E4B for writing records, not for inspection. This is the "thinking with images" family, open weights.
- **Evidence:** ICLR 2026. Gains on high-resolution benchmarks (V* etc.) exist but I could not read the numbers; no defect-inspection results [read: README has chart only].
- **Paper / code:** https://arxiv.org/abs/2505.14362 , https://github.com/Visual-Agent/DeepEyes (checkpoint `ChenShawn/DeepEyes-7B`; follow-up DeepEyesV2 adds tool use).
- **Licence:** Apache-2.0 [read].
- **Use in 10 days:** Needs a 7B VLM on a GPU; skip unless card 3 proves useful and we have spare GPU.
- **Effort:** 2 to 3 days. **Judge wow:** 3

## 16. Material cross-check: care-label composition vs macro-texture class
- **Stage:** C
- **What:** OCR the care label with Gemini ("100% cotton"), photograph a macro of the fabric, and run a small texture classifier. If label and texture disagree (label says wool, texture looks polyester), show a flag in the record under "Declared by seller / Can't confirm".
- **Why new:** Roadmap skips material entirely. This is a flag, never a verdict, and fits the four-lane record.
- **Evidence:** I found no 2025 arXiv paper combining phone macro and fabric labels. Closest: TextileClass-7 dataset (cotton, cotton-mix, denim, polyester, silk, viscose, wool; varied lighting and wrinkles) [snippet], an endoscope classifier with 98% over 17 fabrics on 1,700 images (small, lab-style) [snippet], OpenTextile-NIR (71 samples, hyperspectral, not phone-only) [snippet]. Weak evidence; honest accuracy will be modest.
- **Paper / code:** https://data.mendeley.com/datasets/m2h53zr39s (TextileClass-7); https://www.ncbi.nlm.nih.gov/pmc/articles/PMC12925456/ (OpenTextile-NIR).
- **Licence:** dataset licences not checked.
- **Use in 10 days:** Linear probe on SigLIP 2 features. Low priority; cut first.
- **Effort:** 2 days. **Judge wow:** 2

## 17. Raking-light second photo for pilling and fade relief
- **Stage:** A, B
- **What:** Ask for one close-up with the phone torch at a low angle (flash vs no flash pair). Surface relief such as pills shows as shadows; the pair also separates colour fade from lighting.
- **Why new:** Roadmap grades pilling from a flat front photo. [inference]: oblique lighting is how pilling is judged by eye in textile practice, and phone flash/no-flash pairs are an established way to recover normals.
- **Evidence:** A KAIST ICCP 2022 flash/no-flash RGB-D method reports 25% lower albedo error, 46% lower specular error and 30% lower normal error vs baselines [snippet]. Nothing found on fabric weave, polarisation or phone-fibre fingerprints at all; the roadmap's "skip weave fingerprint" is supported (aging also hurts any fingerprint idea [snippet]).
- **Paper / code:** https://vclab.kaist.ac.kr/iccp2022/iccp2022-paper.pdf ; Li et al. https://arxiv.org/abs/1804.05790 .
- **Licence:** n/a.
- **Use in 10 days:** Collect a flash/no-flash pair for the 15 flawed garments and eyeball whether our pilling model's error drops. Stop if it does not.
- **Effort:** 1 day. **Judge wow:** 2

## 18. SynthID check as one signal for AI-faked damage
- **Stage:** A, F
- **What:** Google's SynthID mark survives in Gemini/Nano Banana outputs. If a damage claim image carries it, flag "created or edited by Google AI". A miss proves nothing.
- **Why new:** Roadmap uses TruFor and Community Forensics (generic detectors). This is a deterministic, Google-only signal and is relevant because Vinted's refund-fraud wave used AI-edited images.
- **Evidence:** Detection is in the Gemini app (files up to 100 MB, "was this created or edited by Google AI?"); the standalone detector is waitlisted; I found no public API, so it cannot be automated yet [snippet].
- **Paper / code:** https://blog.google/technology/ai/ai-image-verification-gemini-app/ , https://support.google.com/gemini/answer/16722517 .
- **Licence:** n/a.
- **Use in 10 days:** Manual demo only (and a roadmap slide). Do not build on it.
- **Effort:** 0.5 day. **Judge wow:** 2

## 19. 3D garment reconstruction (cite, do not build)
- **Stage:** A, B
- **What:** Gaussian Garments (3DV 2025, mesh + Gaussian texture from multi-view video, ETH/MPI), ReWeaver (CVPR 2026, four views, seams and panels), "3D Garments" (Eurographics 2025, two images, 250 meshes released), GarmentCrafter (single image), DMap (2026, images or video, trained on synthetic cloth).
- **Why new:** Answers the "3D from video" question: all are research-grade, need multi-camera capture or heavy training, or have no released code I could find. None reports a condition or identity gain over photos. Even Gaussian Garments needs multi-view video.
- **Evidence:** [snippet only] Gaussian Garments repo/licence not found; DMap no code link; ReWeaver code unconfirmed.
- **Paper / code:** https://arxiv.org/abs/2409.08189 ; https://arxiv.org/abs/2602.24043 ; https://arxiv.org/abs/2503.08678 ; https://arxiv.org/abs/2412.17811 (ChatGarment, CVPR 2025, code and data published, produces sewing patterns from images: possible later route to a size/pattern estimate).
- **Licence:** mostly unknown.
- **Use in 10 days:** One roadmap slide: "10 s video is future work; here is the evidence landscape."
- **Effort:** 0 days (slide). **Judge wow:** 3 as a slide only.

---

## Dead ends checked (so nobody re-searches)
- **Garment unfolding / canonicalisation 2025 to 2026:** APS-Net (ICML 2025), FoldNet / FoldNet++, Cloth Funnels are robotics policies in simulation. Nothing applies to a photo flat-lay pipeline; TPS stays.
- **Weave fingerprint, polarisation, macro fibre identity from a phone:** no supporting literature found; closest are silk-fibre PUF with custom hardware (2022) and a survey saying phone macro needs study.
- **UniGarmentManip (2024):** already flagged in the roadmap as a stub.

## Suggested order if time is short
1. Cards 3 and 1 (one day each, change the results table most).
2. Card 5 and 4 (the two statistical guarantees; sharpest technical story for judges).
3. Card 2 (only if card 1's edits look clean).
4. Cards 8, 7 as head-to-heads on the handover pairs.
5. Card 6 only if card 1 finishes early; kill after 4 hours if it cannot separate screen replays from real sweeps.
