# Fieldwork

**Google Cloud AI Builder Cup 2026 · Retail & Commerce · JAPAC**

## What it is

- Fieldwork turns a 12-second phone video of a used garment into a **condition record** (a list of claims, each tied to a frame from the video) that a buyer, a shopping agent and a dispute reviewer can all read.
- When the parcel arrives, the buyer films the unboxing. Gemini and computer vision compare the two videos and say **consistent with the listing**, **differs**, or **can't tell**. Money is released only on "consistent".
- If it differs, a case opens itself with both clips attached. Gemini weighs it three times and a person decides when it is unsure.

**The story:** Yuki, a student in Tokyo, sells a jacket. The buyer in Singapore says it arrived stained. Today it is her word against his. With Fieldwork, her 12-second video already shows the jacket was clean, and the unboxing check shows no difference.

## Demo flow

| Step | Who | Screen | What happens |
|---|---|---|---|
| 1 | Yuki | `/sell` | Films the jacket for 12 s with an on-screen code. Gets a record, a grade range and a listing in several languages. |
| 2 | Anyone | `/pass/[id]` | The Garment Pass. "Ask the garment" answers in the buyer's language, with the exact crop, or says "not in the take". |
| 3 | Buyer's agent | `/agent` | One sentence ("a dark wool coat, size M, no stains"). The agent searches by evidence, asks the garment questions, then opens a held payment (simulated). |
| 4 | Buyer | `/unbox/[id]` | Films the unboxing. The blink comparator flashes between the listing crop and the arrival crop. Verdict: consistent / differs / can't tell. |
| 5 | System | `/case/[id]` | If it differs: a pre-filled case, three Gemini rulings, a remedy suggestion, or hand-off to a human. |

## Architecture

```
Phone browser (Next.js: camera, take recorder, blink comparator)
        |  HTTPS
Cloud Run: one FastAPI service (Python 3.12, CPU only)
  |-- take/      frames -> Gemini video record -> Gemini zoom on flaws -> our grade head -> listing
  |-- ask.py     answers only from the public record, with crops
  |-- unbox/     pair frames -> align -> diff -> Gemini compares crops -> 3-way gate
  |-- case.py    quarantine buyer text -> Gemini x3 -> agreement check -> remedy or human
  |-- escrow.py  simulated signed payment mandate: hold, release on "consistent"
  |-- agents/    ADK buyer agent  <-- MCP -->  Fieldwork MCP server (search, get_record, ask, unbox)
Storage: local files now; Firestore + Cloud Storage on Cloud Run [[STATUS: confirm which is live]]
Models: Gemini (via google-genai) | SigLIP 2 + small classifier head | DINOv2-small | OpenCV AKAZE
```

## How each Google service is used

| Service | Use | Where in the code |
|---|---|---|
| **Gemini (Flash family, 3.x)** | Watches the take and writes the record; reads the label and the on-screen code; compares aligned crop pairs; answers buyers in their language; judges cases three times; powers the buyer agent. | `fieldwork/gemini.py`, `take/record.py`, `unbox/judge.py`, `ask.py`, `case.py` |
| **Gemini zoom (code execution tool)** | Gemini crops and enlarges a suspected flaw itself before describing it. | `eval/day1_agentic.py` tests it; [[CHECK: pipeline file name]] |
| **Google ADK** | The buyer agent: plans, calls tools, keeps a session. | `fieldwork/agents/buyer.py` |
| **Gemini Enterprise Agent Platform** | Model access and agent hosting path for the deployed service. | [[STATUS: say exactly what is used in the deployed build]] |
| **MCP (via ADK `McpToolset`)** | Lets any agent query Fieldwork conditions as tools. | `fieldwork/agents/mcp_server.py` |
| **Cloud Run** | Hosts the API and the built front end (region asia-southeast1). | `fieldwork-ai/Dockerfile`, `deploy.cmd` |
| **Cloud Build, Artifact Registry, Secret Manager** | Build and ship the container; hold the Gemini key. | `deploy.cmd`, `cloud-setup.cmd` |
| **Firestore, Cloud Storage** | Records, listings, media. | `fieldwork/store.py` |

AP2 (Google's Agent Payments Protocol) is **imitated, not used**: our payment hold is a signed JSON "mandate" in the AP2 style. AP2 itself has no escrow; the "release only if the unboxing matches" condition is our own extension.

## Run locally

Needs Python 3.12, [uv](https://docs.astral.sh/uv/), Node 20+, and a Gemini API key.

```bash
# 1. API (port 8000)
cd fieldwork-ai
export GEMINI_API_KEY=...            # PowerShell: $env:GEMINI_API_KEY="..."
uv sync
uv run uvicorn fieldwork.api:app --reload --port 8000

# 2. Front end (port 3000)
cd ../fieldwork-app
npm install
NEXT_PUBLIC_API_BASE=http://localhost:8000 npm run dev
```

Open `http://localhost:3000/sell`. Model names come from the environment (`FW_MODEL_FLASH`, `FW_MODEL_LITE`, `FW_MODEL_FALLBACKS`), so a renamed Gemini model needs no code change.
Tests: `cd fieldwork-ai && uv run pytest tests`.
Deploy: run `fieldwork-ai/cloud-setup.cmd` once, then `deploy.cmd` (Cloud Build to Cloud Run). Live URL: [[STATUS: URL]]

## Data and licences

| Item | Used for | Licence |
|---|---|---|
| RISE / Wargön / Myrorna second-hand clothing dataset (Nauman et al.), 31,997 garments | Training and testing our condition grade | CC-BY 4.0 (credit required) |
| SigLIP 2 (`google/siglip2-base-patch16-224`) | Image features for the grade head | Apache 2.0 [[VERIFY on model card]] |
| DINOv2-small (`facebook/dinov2-small`) | Patch-level change maps in the unbox check | Apache 2.0 [[VERIFY on model card]] |
| OpenCV (AKAZE alignment) | Frame alignment | Apache 2.0 |
| Gemini models | Core reasoning | Google Cloud / Gemini API terms |
| Our own garment videos and photos | Evaluation and the demo marketplace | Own data; people shown have consented [[CONFIRM]] |

**Non-commercial items (not shipped):**
- DeepFashion / DeepFashion2: non-commercial research only. Not used.
- LightGlue with SuperPoint features: the SuperPoint weights carry a non-commercial licence [[VERIFY]]. Named in early plans as a fallback only; the shipped build uses AKAZE.

## Results

All numbers come from `fieldwork-ai/eval/`. Intervals are 95%. N is the number of test items.

| Question | Measure | Ours | Baseline | N |
|---|---|---|---|---|
| Condition grade on the dataset | Quadratic weighted kappa (agreement on an ordered scale; 1 = perfect) | [[RESULT: QWK ours]] | [[RESULT: QWK untuned Gemini]] | [[N]] |
| Grade range holds on phone takes | Share of true grades inside our range | [[RESULT: coverage]] | n/a | [[N garments]] |
| Unbox check catches real changes | Detection rate on planted changes (marker, lint, pinned snag) | [[RESULT: recall]] | [[RESULT: Gemini alone]] | [[N changes]] |
| False "consistent" on a different garment | Rate, per group (different garments / near-identical pairs) | [[RESULT: rate, rate]] | n/a | [[N, N]] |
| Zoom helps | Flaw found with Gemini zoom vs plain Gemini | [[RESULT]] | [[RESULT]] | [[N crops]] |
| Forger vs Fieldwork | Share of AI-faked damage claims caught, by how the fake was passed on (raw / JPEG / screenshot / re-photographed) | [[RESULT x4]] | n/a | [[N fakes]] |
| Cost and speed | Seconds and US$ per take / per check / per case | [[RESULT]] | n/a | all runs |

We write "to our knowledge, the first published condition-grade baseline on this dataset" only if [[CONFIRM after literature check]].

## Limitations (honest)

- **We never say "verified", "certified" or "guaranteed".** Fieldwork says "consistent with the listing" and shows evidence. It can say "can't tell", and then no money moves.
- Smell, fit and fabric feel cannot be seen in a video. They sit in a "declared, not shown" lane.
- It does not detect counterfeit brands. It records the label so an authenticator has evidence.
- The payment is simulated. No real money, no real AP2, no Google Wallet pass yet.
- The grade model is trained on dataset photos taken in a sorting hub; phone takes differ. We report coverage as measured, not as hoped.
- Small tests: [[N]] garments from our own wardrobe. Results come with intervals and are not marketplace-scale rates.
- Gemini calls can be slow or rate-limited. Demo clips have recorded fallbacks.
- Someone with the original listing video could try to replay it. We flag near-identical frames, but this is a limit, not a solved problem.
- Try-on preview: [[STATUS: built / not built]].

## Team

[[TEAM: Akshat Lathi (product, evaluation, capture); second member name and role]]. Registered on Hack2skill.
