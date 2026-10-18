# Fieldwork: Google model replacement research

Research date: 13 October 2026. Scope: source inspection and official Google documentation/model cards. No new model benchmarks, downloads, or paid API experiments were run for this report.

## Decision

The user permits our own trained classifiers, provided pretrained models are Google models. Therefore the ordinal heads, binary classifiers, and conformal calibration can remain.

SigLIP 2 is already Google: the current checkpoint is `google/siglip2-base-patch16-224`. DINOv2 is Meta: the checkpoint is `facebook/dinov2-small`. Do not describe both as non-Google. [Google's SigLIP 2 model card](https://huggingface.co/google/siglip2-base-patch16-224)

Two viable tracks:

1. **Smallest compliance change:** retain SigLIP 2 for grading and matching; test Google SigLIP 2 spatial features in place of DINOv2. This is the closest architectural replacement, but is not a Gemini/Gemma-branded stack.
2. **Gemini/Gemma migration:** evaluate local EmbeddingGemma 2 for global embeddings and crop comparison, retrain our heads on its features, and retain Gemini 3.8 Flash for evidence extraction and defect judgment. Compare hosted Gemini Embedding 2 as the cloud alternative. This is the recommended experiment if Gemini/Gemma branding is a product requirement.

Neither track is proven better on garments. Public multimodal benchmarks establish capabilities, not same-garment matching, tiny-defect recall, or safe escrow decisions.

## 1. What actually needs replacing

| Component | Current mechanism | Required output |
|---|---|---|
| `fieldwork/take/grade.py` | Frozen SigLIP 2 embeddings → ordinal condition/pilling heads and binary stain/hole heads | Grade sets and classifier scores |
| `train/embed.py`, `train/heads.py` | Cached dataset embeddings → fitted heads → held-out calibration | New training features, model artifact, and evaluation |
| `fieldwork/unbox/pipeline.py` | SigLIP 2 cosine similarity; threshold 0.6 | Listing-frame/unboxing-frame pairs |
| `fieldwork/unbox/diff.py` | DINOv2 spatial patch similarity plus Lab colour differences | Ranked change boxes and scores |
| `fieldwork/unbox/judge.py` | Gemini compares crop pairs | Defect code, severity, uncertainty, explanation |

The code has two representation problems: a global vector for whole-image comparison/classification, and local spatial features for change localization. A replacement for one does not automatically solve the other.

AKAZE, RANSAC, image cropping, hashing, Lab differences, replay checks, and conformal calibration are algorithms, not third-party pretrained models. PyTorch, Transformers, OpenCV, and scikit-learn are libraries; their presence does not determine model provenance.

## 2. Closest Gemini/Gemma replacements for SigLIP 2

### EmbeddingGemma 2 — first local candidate

Checkpoint: `google/embeddinggemma-2`. Google's October 2026 release supports image, video, audio, and text embeddings. It produces 768-dimensional vectors; image/text-only configuration disables the audio encoder and uses roughly 440M parameters. It supports local inference. [Model card](https://ai.google.dev/gemma/docs/embeddinggemma/model_card_2?hl=en), [Google checkpoint](https://huggingface.co/google/embeddinggemma-2)

**Proposed application:** preserve an `embed(paths) -> normalized matrix` interface, use image inputs without seller descriptions, and feed the resulting vectors into our existing classifier architecture. Also use the vectors for frame pairing.

**Why it fits:** it is explicitly trained to produce similarity representations, so it is conceptually closer to SigLIP than a general chat model. It can keep inference local and reuse our lightweight training/calibration approach.

**What changes:** regenerate every dataset embedding; refit condition, pilling, stain, and hole heads; recalibrate conformal sets and frame-pair thresholds. Even if feature dimensions happen to match, old heads do not work with a different embedding space.

**Important implementation details:** Google's tutorial uses SentenceTransformers, accepts images as `{"image": path}`, supports larger visual token budgets, and warns against float16; CPU float32 is a sensible first test. Local throughput, memory, checkpoint access, and installed-library compatibility must be measured. The new model may be heavier than the present backbone. [Official inference tutorial](https://ai.google.dev/gemma/docs/embeddinggemma/multimodal-embeddinggemma-with-sentence-transformers)

**Limits:** image similarity is not physical identity. Embeddings may deliberately ignore a small stain while preserving garment semantics. Higher resolution and garment-region crops should be experimental variables, not assumed fixes.

### Gemini Embedding 2 — first hosted candidate

Model ID: `gemini-embedding-2`. Google's model documentation lists multimodal inputs and 3072-dimensional vectors. The Gemini API supports reduced dimensions, including 768; Google also documents the model on its cloud platform. [Cloud model page](https://docs.cloud.google.com/gemini-enterprise-agent-platform/models/gemini/embedding-2), [Gemini embedding guide](https://ai.google.dev/gemini-api/docs/embeddings)

**Proposed application:** substitute hosted image embeddings for `embed()`, cache vectors, and retrain the same heads. Start with a declared output dimension and keep it fixed across training and inference.

**Why it fits:** no embedding weights need to be hosted in the API container. It is a reasonable benchmark against EmbeddingGemma 2 when cloud latency and cost are acceptable.

**Operational limits:** training thousands of images is a paid remote workload; estimate cost and throughput from a small sample before scaling. Listing vectors should be cached, and unbox frames should be embedded once. The SDK must return a separate vector per frame: combining images into one multimodal content can create an aggregate vector and break pair matching. Verify the exact Vertex request format and returned shapes in a smoke test; our successful Flash request does not prove embedding access.

Do not use `gemini-embedding-001` or the original EmbeddingGemma as image replacements: those earlier models are text embedding models. [Original EmbeddingGemma card](https://ai.google.dev/gemma/docs/embeddinggemma/model_card), [Gemini embedding model specifications](https://ai.google.dev/gemini-api/docs/embeddings)

### Direct Gemini grading — a separate architecture candidate

Model ID: `gemini-3.8-flash`. This is the model already tested successfully for a text request in this project's Google Cloud account. Google's cloud documentation supports image/video inputs, structured outputs, and code execution. [Flash model documentation](https://docs.cloud.google.com/gemini-enterprise-agent-platform/models/gemini/3-8-flash)

**Proposed application:** give Gemini multiple views, clear grading rubrics, and relevant close-ups; ask for condition, pilling, visible defects, evidence references, and reasons to abstain. Compare it with embedding-based classifiers.

**Potential advantage:** explicit evidence and multiple views may help when one front image does not show the labelled defect. This is a hypothesis, not measured superiority.

**Tradeoff:** replacing the classifier removes its current probability/conformal mechanism. Prompted grade ranges and self-reported confidence are not calibrated prediction sets. Any reported coverage must come from a new held-out calibration/evaluation process. Keep the trained-head approach available because the user permits it.

The existing `eval/gemini_grade_baseline.py` already provides a starting point, but it samples single-image data and invokes the old model for comparison. Extend it before using it for a multi-view migration benchmark.

## 3. DINOv2: closest architectural option versus Gemini/Gemma options

### Google SigLIP 2 patch features — smallest change under the clarified rule

The SigLIP 2 research explicitly targets localization and dense features. A higher-resolution Google checkpoint such as `google/siglip2-base-patch16-384` is a plausible candidate for spatial comparisons. [SigLIP 2 paper](https://arxiv.org/abs/2502.14786), [384px checkpoint](https://huggingface.co/google/siglip2-base-patch16-384)

**Proposed application:** extract the vision encoder's spatial tokens rather than its pooled global vector. Compare normalized corresponding features on aligned images, resize the map, and combine it with the existing Lab branch.

This is structurally closer to DINOv2 than replacing its map with a generated explanation. Verify token layout, position handling, preprocessing, and aspect-ratio mapping; remove DINO-specific assumptions about 14px patches. The current 224px model could be a first experiment, but local detail at that resolution may be weak.

This route is permitted by the clarified Google-pretrained constraint. It would not satisfy an additional requirement to name every pretrained checkpoint Gemini or Gemma.

### EmbeddingGemma 2 over corresponding crops — first Gemini/Gemma experiment

Neither the documented Gemini embedding API nor the standard EmbeddingGemma pooled embedding interface supplies a DINO-style per-patch grid. Do not reshape a global vector into an image map.

Instead, **we can construct spatial comparisons ourselves**:

1. Keep AKAZE/RANSAC alignment and overlap masks.
2. Divide the garment area into corresponding overlapping crops at multiple scales.
3. Embed each crop locally with EmbeddingGemma 2.
4. Calculate crop distance, for example `1 - cosine(reference, unbox)`.
5. Fuse crop scores with normalized Lab differences and connected components.
6. Send selected crop pairs to the existing Gemini judge.

This is a proposed method, not an officially validated garment algorithm. It preserves explicit locations and a local numerical signal. Multi-scale crops can emphasize a small defect, but pooled semantics can still overlook it. Inference cost increases with crop count, and colour-only proposals must not be the sole filter for texture defects.

A hosted version using Gemini Embedding 2 is also possible, but many remote crop embeddings can make this much more expensive than whole-frame matching. Cache all listing crops and bound the number of unbox crops.

### Gemini region proposals plus the existing crop judge — first cloud ablation

Gemini can return object boxes in the normalized coordinate format already used by Fieldwork. [Image-understanding documentation](https://ai.google.dev/gemini-api/docs/image-understanding)

**Proposed application:** give it the listing/unboxing pair and request changed garment regions with coordinates, defect type, evidence, and uncertainty. Crop those regions in code and judge the crop pairs separately. Retain ordinary colour/texture proposals for comparison.

Potential advantages are semantic discrimination and explanations: a fold can differ visually without constituting damage. Risks include missing tiny defects, inaccurate boxes, latency, and correlated errors when the same model proposes and confirms changes. A second call is not an independent reviewer. Absence of a proposed box must not automatically justify releasing escrow.

For harder examples, include `gemini-4-argon` in an evaluation arm. Google's current cloud model page documents multimodal inputs, structured output, and code execution. We have not tested access or garment performance for it. [Argon model page](https://docs.cloud.google.com/gemini-enterprise-agent-platform/models/gemini/4-argon)

### Local generative alternatives

**Gemma 4 E4B and 12B instruction-tuned models** are reasonable local grading/crop-judgment candidates. The family supports image inputs, multiple-image reasoning, and configurable image resolution. These generate answers rather than retrieval embeddings. E4B's effective parameter label is not its total resident weight count; plan memory from the full checkpoint and precision. [Gemma 4 model card](https://ai.google.dev/gemma/docs/core/model_card_4)

Use `google/gemma-4-E4B-it` as the smaller local candidate and `google/gemma-4-12B-it` as a larger experiment. Local generation and fine-tuning require a separate runtime/memory benchmark; fitting on a laptop does not establish acceptable CPU Cloud Run latency.

**PaliGemma 2 mix**, particularly `google/paligemma2-3b-mix-448`, is a task-oriented option for garment localization, OCR, detection, and eventual defect fine-tuning. The mix models already support detection/segmentation task prompts; pretrained transfer checkpoints need task adaptation. They are not pretrained clothing-damage change detectors. [Google's mix release](https://developers.googleblog.com/introducing-paligemma-2-mix/), [Official checkpoint](https://huggingface.co/google/paligemma2-3b-mix-448)

PaliGemma 2 and Gemma 3 contain Google SigLIP-based vision encoders internally. They are Google models, but merely extracting those encoders would not remove SigLIP architecture in a deeper sense. [PaliGemma architecture](https://ai.google.dev/gemma/docs/paligemma/model-card-2), [Gemma 3 developer guide](https://developers.googleblog.com/en/introducing-gemma3/)

Extracting hidden visual tokens from Gemma-family internals is an experimental dense-feature route. Token compression, pooling, tiling, and positional correspondence need validation; it is not the first migration choice.

## 4. Recommended comparison

| Task | First Gemini/Gemma candidate | Comparator | Advancement criterion |
|---|---|---|---|
| Frame pairing | EmbeddingGemma 2 | Gemini Embedding 2; existing SigLIP baseline | Correct-view top-1 matching and reliable rejection of unsupported views |
| Condition/pilling | EmbeddingGemma 2 + retrained ordinal heads | Gemini Flash multi-view rubric; optional Gemma 4 | Better QWK and useful calibrated sets |
| Stains/holes | EmbeddingGemma 2 + retrained binary heads | Evidence-grounded Gemini inspection | AP on labelled data plus real visible-defect recall |
| Change localization | EmbeddingGemma crop grid + Lab | SigLIP dense features; Gemini region proposals | Small-defect recall at controlled false alarms |
| Defect judgment | Existing Gemini 3.8 Flash | Argon or local Gemma 4 | Fewer missed defects and fewer fold/light false alarms |

Recommended initial Gemini/Gemma pipeline:

```text
Selected frames → EmbeddingGemma 2 → our retrained heads → calibrated grade sets
Listing/unbox frames → EmbeddingGemma 2 → view pairing → AKAZE alignment
Aligned crop grid → EmbeddingGemma distances + Lab → proposed regions
Region crop pairs → Gemini 3.8 Flash → findings → deterministic verdict gate
```

Retain evidence lanes, crop references, replay checks, and abstention. Embedding similarity proposes correspondence; it does not prove identity. Gemini interprets visual evidence; it should not control money directly.

## 5. Evaluation and migration requirements

The stored baseline reports 3,390 test images, condition QWK 0.224, exact accuracy 32.3%, and average conformal set size 3.56. That leaves room for improvement but does not prove a new encoder will improve grading. Pilling exact accuracy is 54.3%, below its 54.8% majority baseline. Source: `fieldwork-ai/data/results/heads.json`.

Run a small fixed pilot before re-embedding the full dataset:

- Pairing: labelled listing/unbox views, similar garments, and unsupported angles; top-1 correctness and match-rejection performance.
- Grading: stratified condition/pilling examples; QWK, exact, within-one, set coverage and set size. Split by physical garment, not by frame.
- Changes: real no-change reshoots, small stains, holes, pilling, seam damage, lighting shifts, folds, and look-alike swaps. Report localization/recall, false differs, false consistent, and cant-tell share with intervals.
- Operations: cold/warm latency, local peak memory, embedding batch throughput, and measured cloud token/call cost.
- Forgery: keep synthetic damage as a separate stress-test arm; do not substitute it for real-garment results.

The old 0.6 pairing threshold and 3.5 change threshold are model-specific. Recalibrate them. Compare alternatives at matched false-alarm operating points, not equal numerical thresholds. The old conformal qhat also cannot transfer.

Version embeddings by model, revision, preprocessing, crop strategy, and dimension. Use new cache paths: `train/embed.py` currently skips existing files, so replacing the model name alone can silently reuse SigLIP features. Preserve original heads/results for the baseline.

Expected code touchpoints: `take/grade.py`, `train/embed.py`, `train/heads.py`, `unbox/pipeline.py`, `unbox/diff.py`, `unbox/gate.py`, `config.py`, the default `grade_model` metadata in `spec.py`, Docker model downloads, dependency files, and evaluation scripts. Keep API/data contracts stable where possible and coordinate any contract changes.

The currently implemented verdict gate can return consistent after only partial view alignment. Model migration should add explicit coverage/quality checks before payment release; a representation swap alone does not fix that limitation.

No application code was changed by this research. The next concrete step is a small comparison harness for EmbeddingGemma 2 and Gemini Embedding 2, plus a DINO-free localization ablation, before choosing and implementing the replacement.
