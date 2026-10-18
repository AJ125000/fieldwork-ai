# Fieldwork

A local prototype for evidence-backed second-hand garment listings and human review of buyer-reported issues. The repository includes the Next.js app, Python API, Gemini agents, frozen vision-model inference, classifier training tools and evaluation code.

## Current workflow

1. Seller records a garment video and/or supplies photos.
2. Gemini creates an evidence-linked condition record. SigLIP 2 and small trained heads provide a condition grade set; grades do not determine prices.
3. The seller reviews the unpublished draft, declares known issues, adds evidence if needed, sets an INR asking price and optional private negotiation minimum, acknowledges limitations and explicitly publishes it.
4. Buyers see photos/video, search by seller asking price and ask evidence-grounded questions. Negotiated quotes require explicit purchase confirmation; payment mandates are simulated.
5. Explicit **All good** releases the simulated payment. **Raise an issue** captures received-garment evidence and opens human review.
6. SigLIP pairing, garment-focused geometric alignment, Gemini region correspondence checks, DINOv2/colour proposals and Gemini crop judgments prepare a suggested assessment and evidence report. Every issue keeps funds held until a human decision; an AI assessment cannot settle it.

The experimental regional defect and context-confirmation sequence is evaluated separately and is **not enabled in the production seller pipeline**. Context-model agreement is not independent ground truth.

## Local setup

Prerequisites: Conda and Google Cloud CLI for Vertex authentication. The Conda environment supplies Python 3.12 and Node.js 24.

```bash
cd fieldwork-ai
conda env create -f environment.yml
conda activate fieldwork
gcloud auth application-default login
gcloud auth application-default set-quota-project YOUR_PROJECT_ID
export FW_USE_VERTEX=1
export FW_GCP_PROJECT=YOUR_PROJECT_ID
export FW_GCP_LOCATION=global
export FW_REVIEW_TOKEN='CHOOSE_A_LOCAL_REVIEWER_KEY'
python -m uvicorn fieldwork.api:app --host 127.0.0.1 --port 8000
```

In another terminal:

```bash
conda activate fieldwork
cd fieldwork-app
npm ci
NEXT_PUBLIC_API_BASE=http://localhost:8000 npm run dev -- --port 3000
```

Open http://localhost:3000. Open `/review` for the reviewer console and enter the configured reviewer key. Credentials belong in the Google credential store or local environment, never in Git. A template is provided in [.env.example](.env.example); shell commands above set the variables explicitly, and the API does not automatically load that file.

Public SigLIP 2 and DINOv2-small checkpoints download to the Hugging Face cache on first use. `fieldwork-ai/models/heads.joblib` is the small runtime classifier artifact; candidate experiment artifacts are separate and excluded. No DINOv3 access is needed.

The seller sets the asking price in INR; automatic price estimates and demo currency conversions are removed. Negotiation is optional, bounded to five rounds per negotiation, and uses backend rules. A negotiated quote expires after 30 minutes and must be explicitly confirmed. An existing estimated band is not a purchase price: older seller-managed listings need an explicit asking price.

The Buy page includes saved purchases recovered from the backend, and Sell includes saved listings with resume links. Conversations, unsent text, per-garment form edits and navigation destinations survive tab switches. Serializable drafts also use browser-tab session storage; selected files and private minimum inputs stay in memory and must be reselected/re-entered after a full page reload. Active camera recordings stop without submitting when leaving a route.

Open `/help` for pending reports and issue history. The local prototype history is shared; buyer ownership authentication remains unfinished. Existing funded test mandates keep their original amounts/currencies and are not converted.

See [the local workflow audit](LOCAL-WORKFLOW-AUDIT.md) for the ten reported issues, fixes, evidence and remaining limitations.

## Code and documentation

| Path | Purpose |
|---|---|
| `fieldwork-ai/fieldwork/` | API, seller drafts, evidence pipeline, agents, simulated escrow and human-review persistence |
| `fieldwork-app/` | Seller, buyer and reviewer interfaces |
| `fieldwork-ai/train/` | Dataset/label audit, embeddings, classifier fitting and evaluation |
| `fieldwork-ai/eval/` | Component experiments and workflow evaluation tools |
| [AI-ARCHITECTURE.md](AI-ARCHITECTURE.md) | Current contracts, implementation changes and pipeline |
| [WORKFLOW-ASSESSMENT.md](WORKFLOW-ASSESSMENT.md) | Observed strengths, weaknesses and priorities |
| [MODEL-TRAINING-STATUS.md](MODEL-TRAINING-STATUS.md) | Training results, model-promotion decisions and limitations |
| [CAPTURE-GUIDE.md](CAPTURE-GUIDE.md) | Capture protocol for independently labelled workflow testing |
| [Evaluation plan](fieldwork-ai/eval/EVALUATION-PLAN.md) | Component and end-to-end evaluation protocol |
| [Data/artifact policy](DATA-AND-ARTIFACTS.md) | Included reports and excluded local datasets/media |
| `research/`, `submission/` | Research and historical proposal/demo documents |

Historical roadmap/submission documents may describe retired automatic dispute decisions or planned capabilities. Use the current architecture and assessment documents for implementation status.

## Checks

From `fieldwork-ai/` in the active environment:

```bash
python -m pytest tests/test_defect_sequence.py tests/test_regional_defects.py tests/test_image_orientation.py tests/test_evidence_integrity.py -q
```

The local audit passed 147 regression checks and 12 separately run legacy harness checks, plus a frontend production build and an isolated live seller-to-human-review test. They check evidence/state handling, not model accuracy. Other tests may require local datasets, model downloads or live Gemini access; read the relevant evaluator instructions before running them.

## Current limits

This is a prototype: payments are simulated; buyer/seller ownership authentication and cross-instance transactions remain unfinished. Development captures show weak alignment, broad grade ranges and uncertain defect detection. Independent received-session accuracy, human-review agreement and final unseen-garment evaluation remain pending. Cloud deployment is on hold for local testing.
