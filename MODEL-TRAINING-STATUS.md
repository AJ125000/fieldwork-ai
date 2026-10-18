# Training and evaluation status — 18 October 2026

## Latest: same-image regional defect experiment

The [30-photo/15-garment experiment](fieldwork-ai/data/results/defect-pass-2026-10-18/REPORT.md) completed 15 current-overview and 30 regional calls. Regional inspection adds visible garment-03 back-hem spots, but definite proposals increase 5 → 18 and owner-negative garment disagreements 1/10 → 4/10. A posthoc full-context check rejects the lettering-related hole on 01, retains the visible hole on 02 and leaves the 05 spot uncertain. This is not an independently labelled accuracy benchmark or a training run. The raw regional pass is not promoted; all heads/backbones, production inspection and grades are unchanged. Original photo hashes remain intact; 30 focused tests pass. See [review notes](fieldwork-ai/data/results/defect-pass-2026-10-18/REVIEW-NOTES.md) for model fallback, runtime/token overhead, visibility limits and pending labels.

## Owner visibility clarification — 18 October 2026

The owner confirms that garment 05's real back hole and red stain are hidden by folds in the supplied photos/video. Garment 06's real hip hole is not properly visible. These three issues are **not established visible-defect false negatives** and must be excluded from visible-defect recall until adequate evidence is supplied. Physical presence remains owner-confirmed; lack of a detection does not establish absence. The model-proposed spot/hole on garment 05 is not confirmed as the actual hidden hole.

The earlier 4/5 owner-positive garment count describes coarse agreement with physical-condition notes, **not visible-defect recall or accuracy**. No revised visible-defect accuracy is claimed without visibility annotations for the remaining issues. These cases test coverage limitations and requests for unfolded close-ups. Broad claims such as “no holes” still need qualification when fabric is folded or obscured. Raw model outputs below are retained as historical observations. The owner annotation is in `fieldwork-ai/data/results/owner-visibility-2026-10-18.json`.

## Video, coverage and alignment improvements checked

All 15 supplied videos now prepare locally, preserving original hashes/audio; four representative originals completed the full live seller API with front/back evidence and label-retake guidance. Updated candidate coverage/orientation matching is 30/30 on the same development photo probes. Up to three candidates plus AKAZE/SIFT accept 26/30 geometrically (17 AKAZE, 9 provisional SIFT). Different-garment shared-background controls also align, so fallback results are explicitly inconclusive unless separate positive difference evidence exists. These are not identity or delivery-accuracy figures. No pretrained model, trained head artifact or threshold was promoted. Reported missing defects on 05/06 remain unresolved. See `fieldwork-ai/data/results/workflow-priorities-2026-10-18/REPORT.md`; 101 focused checks, 12 separate legacy checks and frontend build/typecheck pass. Deployment remains on hold.

## Real seller captures evaluated

The supplied `fieldwork-ai/data/organized-garments/` now contains 15 owner-described garments. All 63 main/extra media hashes match its manifest. The full photo API completed 15/15 cases (garment 09 has two photos, below the UI's minimum); 14/15 original videos exceed the app's inline limit. Garment 12's supported video completed. Coarse owner-condition comparison: some defect reported on 4/5 owner-positive garments and flags on 3/10 owner-negative garments. This does not establish exact defect correctness or complete recall. Garment 06's reported hip hole and garment 05's reported back hole/red hip stain were not explicitly reported. Visibility/location adjudication is pending.

Real same-session photo/video retrieval was 29/30; AKAZE accepted only 14/30 selected pairs. The current selector lost garment 14's front. A time-bin development ablation recovered it but introduced another error, leaving retrieval 29/30; production selection is unchanged. Grading remains broad: 13/15 photo cases returned [2,3,4,5]; no reference grades are available.

Fixed an EXIF orientation mismatch demonstrated by a collar box landing on a sleeve. Gemini inputs and SigLIP now use upright pixels without changing originals. A separate live collar check produced the correct region; retrieval after the fix remained 29/30. Baseline reports retain pre-fix results; no full post-fix accuracy rerun or trained model promotion occurred. 86 focused tests, 3 evaluator tests and 12 separate harness tests pass. See `fieldwork-ai/data/results/real-captures-2026-10-18/REPORT.md` for all cases, timings and limits. Separate received-session captures and human annotations are still needed for full change/workflow accuracy; deployment remains on hold.

## Latest: component diagnostics and workflow guards

Completed controlled CV tests on 12 real public photographs with digital transformations/marks: 12/12 closed-set matches, 23/24 aligned pairs, 10/12 combined DINO+colour top-three localisations versus 8/12 colour-only localisations at fixed IoU ≥ .1. Combined proposals exceeded the existing threshold on 1/12 unchanged images. This is synthetic stress evidence, not real-capture accuracy, and does not justify retuning the production threshold.

Completed 18 live Gemini component checks: 10/10 expected buyer-answer states, four unchanged crops correctly unchanged, two added marks detected and two added marks unsure. Two additional posthoc checks of actual production-selected crops found the mark inside an oversized proposal and rejected an unchanged crease/reflection proposal. These diagnostic cases were selected after seeing failures and are not unbiased accuracy samples.

Fixed a purchase constraint bypass: HTTP and MCP escrow creation now enforce the seller's price band/minimum, positive amount and currency. Added ADK response usage logging and offline tests for both agent runners. **63 focused tests and 12 legacy harness tests pass in separate runs.** The legacy evaluator test explicitly scripts model assessments; it does not claim CV accuracy from a fake pixel judge.

Prepared 30 annotation templates (10 development, 10 calibration, 10 test) under `fieldwork-ai/data/capture-kit/`, outside the active evaluation dataset. No real captures or reference observations were invented. See `fieldwork-ai/data/results/COMPONENT-EVALUATION-2026-10-18.md` for complete results. The next dependency is independently labelled seller/received recordings, followed by manual local workflow checks; deployment remains on hold.

## Latest: source-label recovery and benchmark completed

All 28,987 targeted source records were recovered and matched, with no remaining download errors or ambiguous filenames. Four transient failed reads were successfully resumed from the cached download job. Matching checked source filenames/station suffixes, condition/pilling labels, annotation sizes and CRC checksums. The recovered label overlay and source fingerprints are in `fieldwork-ai/data/audit/original/`.

Source recovery restored 22,537 stain labels and 27,912 hole labels across train/test. **2,116 training hole labels remain genuinely unknown/excluded** rather than being assumed clean. All test rows now have source-backed or explicit known defect labels before duplicate/conflict exclusions.

| Task | Clean test N | Current app AP | New AP | Prevalence reference |
|---|---:|---:|---:|---:|
| Stains | 3,357 | 0.427 | 0.467 | 0.273 |
| Holes | 3,363 | 0.157 | 0.170 | 0.073 |

AP is ranking quality, not classification accuracy. The stain AP improvement has a paired bootstrap 95% difference interval of +0.014 to +0.064; the hole interval is -0.018 to +0.042 and does not establish an improvement. Thresholds selected on calibration labels yield about 40.0% precision / 67.9% recall for stains and 16.5% precision / 29.8% recall for holes. These heads remain weak, particularly for holes and defects not visible in the available front images.

Grade results below are unchanged. Candidates remain separate from the app artifact. **49 focused software checks pass.** The complete four-head candidate, predictions, calibration thresholds and reports are in `fieldwork-ai/data/results/heads-source-labels-2026-10-18/`. The previous null-as-negative sensitivity run remains historical; current defect results no longer depend on that assumption.

Next: improve/validate detector quality and carry out real-capture component/workflow evaluation. Manual local app testing still precedes deployment.

## Completed in this run

- Audited all 28,248 training and 3,390 test rows; fingerprinted source shards, checked raw/cached label alignment and exact image duplication.
- Found 267 duplicate-image groups, including conflicting labels; no exact-image or source-filename group crosses the provided train/test split. Preserved source filenames for all rows. These are identity proxies, not independently verified physical garment IDs.
- Fixed Yes/No and case handling. Missing defect annotations remain unknown by default. Added regression tests and corrected the finite-sample calibration order statistic.
- Completed all frozen SigLIP2 feature shards in `fieldwork-ai/data/emb-v2/`. Existing features were reused after sampled numerical checks (maximum absolute errors approximately 0.0000013) and complete label alignment; remaining features were newly generated. Sampling does not verify every legacy feature.
- Compared ordinal and multiclass logistic heads at four regularisation settings, selected on validation, refitted, calibrated independently and evaluated on cleaned test identities.
- Saved candidate models, split indices, predictions, bootstrap comparisons and reports separately; verified the app artifact is unchanged and fitting/validation/calibration groups do not overlap.
- Added a real-capture truth schema, validator, API workflow evaluator, and evaluation protocol. No labelled real captures are available yet. The new evaluator has offline checks but has not been validated with real captured cases.
- 44 focused offline checks passed: label handling/calibration, capture validation/evaluation denominators, and existing human-review/storage behaviour. These are software checks, not model accuracy samples.

## Full-data grading comparison

All 28,248 training rows were available as features. Duplicate/conflicting task labels were excluded. Test results use 3,356 unique, nonconflicting examples per grade task.

| Task | Current app exact | Candidate exact | Majority exact | Current app QWK | Candidate QWK |
|---|---:|---:|---:|---:|---:|
| Condition | 32.2% | 37.6% | 37.4% | 0.222 | 0.226 |
| Pilling | 54.6% | 54.7% | 55.2% | 0.030 | 0.114 |

Condition within-one accuracy fell from approximately 78% to 73.8%; higher exact accuracy is not an unqualified improvement. Its paired QWK difference interval includes zero. Pilling QWK improved (paired 95% difference interval approximately +0.058 to +0.111), but exact accuracy remains below majority prediction.

Candidate condition sets cover 88.9% of annotated grades with 3.38 grades per set on average; pilling sets cover 90.2% with 2.94 grades per set. These are broad dataset-level sets, not individual confidence values or validated coverage on phone videos.

**No model promotion:** evidence is insufficient for replacing the app's complete four-head artifact. See `fieldwork-ai/data/results/heads-full-2026-10-17/REPORT.md` and `report.json` for detailed results and limitations.

## Historical finding before source recovery

With unknown/null labels excluded, a stain head can be trained using explicit train labels, but known test labels have no negative class. Hole labels have insufficient explicit negative training examples. Strict stain/hole AP is therefore withheld.

A separate `heads-full-null-sensitivity-2026-10-17` run assumes null means absent. Under that **unverified assumption**, stain AP is 0.467 and hole AP 0.170. These are sensitivity results, not validated defect benchmarks, and must not be used as headline accuracy claims. Original annotation metadata must establish null semantics, or clean examples need independent annotation.

Original archive metadata was inspected using partial HTTP reads, without downloading the 26.8 GB image archive. Ten matched source-record probes confirm that mirror nulls have mixed meanings: an early record has no hole field, while later records explicitly contain the string `None`. Five sampled test records have explicit `None` in the original annotations. This explains why globally replacing nulls with "no defect" is unsafe; row-level source recovery remains necessary. Evidence is saved in `fieldwork-ai/data/audit/original/null-probes.json`, alongside the annotation-file index and original schema sample. These ten probes were not used to claim full-record label recovery.

## Remaining work

1. Original defect-label recovery and benchmark rerun are complete (see latest update). Improve weak defect detectors and obtain visible-in-image annotations; sorter labels may describe defects on unseen backs.
2. Collect real seller/received captures using `CAPTURE-GUIDE.md`; complete independent `truth.json` annotations and lock comparison groups into development/calibration/test splits.
3. Evaluate frame coverage, pairing/alignment, DINO candidate recall, Gemini crop judgments, grounded listings/answers/translations, and the human-review workflow. The public front-only dataset cannot supply paired received-garment ground truth.
4. Tune on development/calibration cases, freeze configuration, then run final unseen garments with uncertainty intervals and measured latency/token usage. Include abstentions and failed runs.
5. Complete manual local seller/buyer/reviewer testing before cloud deployment, then verify cloud persistence and restart behaviour. Deployment remains on hold for local testing.

The earlier live 17-stage smoke test on digitally edited demo media establishes integration only. It does not replace the real-capture benchmark. See `fieldwork-ai/eval/EVALUATION-PLAN.md` for the complete protocol.
