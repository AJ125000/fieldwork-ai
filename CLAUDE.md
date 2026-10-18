# Fieldwork: instructions for Claude (any teammate's session)

## Read first, in this order
1. `AKSHIL-HANDOVER.md`: the full picture, honest results, who owns what.
2. `BUILD-PLAN.md`: architecture, data contracts, the day plan.
3. `ROADMAP-APPAREL-v3.md`: product concept detail.
4. `fieldwork-ai/fieldwork/spec.py`: the data contract every part depends on.
5. For UI work: `fieldwork-app/CLAUDE.md` and `fieldwork-app/DESIGN.md`.

## Ownership
- **Akshil's Claude:** AI architecture, models, training, evaluation, `AI-ARCHITECTURE.md`, `data/results/`. You may redesign anything in `fieldwork-ai/fieldwork/{take,unbox}`, `case.py`, `train/` and `eval/`.
- **Akshat's Claude:** integration, `api.py`, front end, deployment, submission docs.
- **Keep stable unless both agree:** `spec.py` (ConditionRecord), the API routes in `api.py`, and the `store.py` interface. If you must change them, write the change at the top of `AI-ARCHITECTURE.md` under "Contract changes".

## Rules
- **Never put API keys in code, chat or files.** Use the `GEMINI_API_KEY` environment variable, or Vertex via Application Default Credentials (`FW_USE_VERTEX=1`).
- **Model names come from env** (`FW_MODEL_FLASH`, `FW_MODEL_LITE`, `FW_MODEL_FALLBACKS`, `FW_MODEL_IMAGE`). Never hard-code them in feature code.
- **All Gemini calls go through `fieldwork/gemini.py`** (cost and latency logging for the results table).
- **Honest wording in anything user-facing or in results:**
  - say "consistent with the listing", "evidence", "can't tell"
  - never "verified", "certified" or "guaranteed"
  - no confidence numbers in the UI
  - report sample sizes and intervals
- **Synthetic data** (Nano Banana edits) is a stress test only. Headline numbers use real garments and real planted changes.
- **Credits:** use Sonnet subagents for well-specified modules; keep outputs lean; don't rerun expensive Gemini evals without reason.

## Environment
- Backend: Python 3.12 with `uv` in `fieldwork-ai/` (`uv sync`; behind TLS-inspecting proxies set `UV_SYSTEM_CERTS=1`).
- Tests:
  - `uv run python tests/test_cv.py`
  - `tests/test_agent.py`
  - `tests/test_harness.py`
  - `tests/test_store.py`
- API: `uv run uvicorn fieldwork.api:app --port 8000`. Demo data: `uv run python -m fieldwork.demo_seed`.
- Front end: `fieldwork-app/` (Next.js 16; read `node_modules/next/dist/docs` before using unfamiliar APIs).
- Re-download the training data (not in the zip, 2.7 GB):
  ```python
  from huggingface_hub import hf_hub_download
  files = ["data/test-00000-of-00001.parquet"] + [f"data/train-{i:05d}-of-00013.parquet" for i in range(13)]
  for f in files:
      hf_hub_download("fnauman/fashion-second-hand-front-only-rgb", f, repo_type="dataset", local_dir="data/hf")
  ```
- Embeddings: `uv run python train/embed.py --full` (resumable per shard). Heads: `uv run python train/heads.py` → `data/results/heads.json`.

## Dates
- Feature freeze: 14 Oct.
- Submit: 17 Oct.
- Team formation closes: 11 Oct.
