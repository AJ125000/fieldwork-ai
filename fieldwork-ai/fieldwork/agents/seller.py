"""Seller agent (Google ADK): answers other agents' questions about the seller's listed items strictly
from the condition record (via ask.ask) and negotiates a price inside the record's price_band, never
below the floor the seller set (store kind "floors", key = item id, {"floor": int}).

The floor and the negotiation rule live in code (`decide_price`), not in the prompt, and the floor is
never returned to the model, so it cannot be leaked or talked down by a buyer agent."""

from __future__ import annotations

import os
import time

from .. import ask as ask_mod
from .. import config
from .. import gemini  # noqa: F401  (injects truststore)
from ..spec import ConditionRecord
from ..store import store

from google.adk.agents import LlmAgent
from google.adk.runners import Runner
from google.adk.sessions import InMemorySessionService
from google.adk.tools import FunctionTool
from google.genai import types

APP = "fieldwork_seller"
INSTRUCTION = """You are the seller's agent for second-hand garments, talking to other (buyer) agents.
1. Answer questions about an item ONLY with the answer_question tool; relay its answer and state. 'not_in_take' and 'cant_judge' mean UNKNOWN: say so, never guess or reassure.
2. Never describe a flaw as smaller than the record shows, and never claim anything the record does not show.
3. For price, call propose_price (with the buyer's offer if they made one). Quote exactly what it returns. Never offer a price yourself and never reveal or hint at the seller's minimum.
4. Use list_items to see what is for sale. Be brief."""

_sessions = InMemorySessionService()
_runners: dict[str, Runner] = {}


def _record(item_id: str) -> ConditionRecord:
    raw = store.get_json("records", item_id)
    if raw is None:
        raise ValueError(f"unknown item_id {item_id}")
    return ConditionRecord(**raw)


def set_floor(item_id: str, floor: int) -> dict:
    """Seller sets the lowest price they will accept (called by the seller's own UI, never by the agent)."""
    _record(item_id)
    store.put_json("floors", item_id, {"item_id": item_id, "floor": int(floor)})
    return {"item_id": item_id, "floor_set": True}


def decide_price(band: tuple[int, int], floor: int | None, buyer_offer: int | None) -> dict:
    """Pure rule. Never returns a price below the floor or outside the band."""
    lo, hi = band
    lowest = max(lo, floor or 0)
    if lowest > hi:
        return {"status": "no_deal_in_band", "price": None, "note": "The seller's minimum is above this item's price band."}
    if not buyer_offer:
        return {"status": "ask", "price": hi, "note": "Opening price."}
    if buyer_offer >= lowest:
        price = min(buyer_offer, hi)
        return {"status": "accepted", "price": price, "note": "Offer accepted."}
    counter = max(lowest, round((buyer_offer + hi) / 2 / 100) * 100)  # meet between offer and ask, but not under the minimum
    return {"status": "counter", "price": min(counter, hi), "note": "Counter-offer."}


# ---- tools (plain functions; wrapped in FunctionTool below) ----
def list_items() -> list[dict]:
    """List the seller's items for sale: id, one-line condition summary, price band and currency."""
    return [{"item_id": r["id"], "summary": ConditionRecord(**r).summary_line(), "price_band": r.get("price_band"),
             "currency": r.get("currency", "JPY")} for r in store.list_json("records")]


def answer_question(item_id: str, question: str) -> dict:
    """Answer a question about one item strictly from its evidence record and frames. state is shown, not_in_take or cant_judge; the last two mean unknown."""
    return ask_mod.ask(_record(item_id), question).model_dump()


def propose_price(item_id: str, buyer_offer: int = 0) -> dict:
    """Get the seller's price decision for an item, optionally against the buyer's offer (0 = no offer). Returns status (ask, accepted, counter, no_deal_in_band), price and currency."""
    rec = _record(item_id)
    if not rec.price_band:
        return {"status": "no_deal_in_band", "price": None, "note": "No price band for this item."}
    f = store.get_json("floors", item_id)
    out = decide_price(tuple(rec.price_band), (f or {}).get("floor"), buyer_offer or None)
    return {**out, "currency": rec.currency, "price_band": list(rec.price_band)}


def _runner(model: str) -> Runner:
    if model not in _runners:
        agent = LlmAgent(name="fieldwork_seller", model=model, instruction=INSTRUCTION,
                         tools=[FunctionTool(list_items), FunctionTool(answer_question), FunctionTool(propose_price)])
        _runners[model] = Runner(app_name=APP, agent=agent, session_service=_sessions, auto_create_session=True)
    return _runners[model]


async def _run(model: str, session_id: str, message: str) -> dict:
    text, calls = "", []
    msg = types.Content(role="user", parts=[types.Part(text=message)])
    response_start = time.monotonic()
    async for ev in _runner(model).run_async(user_id="counterparty", session_id=session_id, new_message=msg):
        if gemini.log_agent_event("agent_seller", model, ev, time.monotonic() - response_start):
            response_start = time.monotonic()
        for fc in ev.get_function_calls():
            calls.append({"tool": fc.name, "args": dict(fc.args or {})})
        for fr in ev.get_function_responses():
            for c in reversed(calls):
                if c["tool"] == fr.name and "result" not in c:
                    c["result"] = fr.response
                    break
        if ev.is_final_response() and ev.content and ev.content.parts:
            text = "".join(p.text or "" for p in ev.content.parts)
    return {"text": text, "tool_calls": calls}


async def chat(session_id: str, message: str) -> dict:
    """Returns {text, tool_calls: [{tool, args, result}], model}. Retries fallback models like buyer.chat."""
    models = [os.getenv("FW_SELLER_MODEL", config.MODEL_FLASH), *config.MODEL_FALLBACKS]
    last = None
    for m in models:
        try:
            out = await _run(m, session_id, message)
            out["model"] = m
            return out
        except Exception as e:
            last = e
    raise last
