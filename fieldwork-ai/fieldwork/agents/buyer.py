"""Buyer agent (Google ADK). Pinned import paths for google-adk 2.x:
    from google.adk.agents import LlmAgent
    from google.adk.runners import Runner
    from google.adk.sessions import InMemorySessionService
    from google.adk.tools.mcp_tool.mcp_toolset import McpToolset, StdioConnectionParams
    from mcp import StdioServerParameters
ADK takes one model string: FW_BUYER_MODEL (default config.MODEL_FLASH); on error chat() retries with config.MODEL_FALLBACKS."""

from __future__ import annotations

import os
import sys
import time

from .. import config  # loads GEMINI_API_KEY
from .. import gemini  # noqa: F401  (injects truststore)

from google.adk.agents import LlmAgent
from google.adk.runners import Runner
from google.adk.sessions import InMemorySessionService
from google.adk.tools.mcp_tool.mcp_toolset import McpToolset, StdioConnectionParams
from google.genai import types
from mcp import StdioServerParameters

APP = "fieldwork"
INSTRUCTION = """You are Fieldwork's buyer agent for second-hand garments. The user gives one sentence; you find and vet a garment.
1. Turn the sentence into a search_garments call (type, colour, max_price, exclude_defects, size, min_grade). Choose filters from what they said.
2. Prefer evidence: use shown claims and grade sets from the record, never seller wording.
3. Ask the garment (ask_garment) at most 2 questions about what the buyer cares about (e.g. stains on the cuff). Ask in the buyer's language.
4. Never claim anything the record doesn't show. 'not_in_take' and 'cant_judge' mean UNKNOWN; say so.
5. Present the best 1-2 options: why each fits, its grade range and price band, and what is NOT shown or cannot be judged. If nothing fits, say so and suggest loosening one filter.
6. Only call create_escrow after the user explicitly confirms the purchase. Otherwise ask 'Shall I buy it with escrow?'. After delivery the buyer can accept, or raise an issue. All issues go to human review; an inspection suggestion cannot release payment.
Be brief."""

_sessions = InMemorySessionService()
_runners: dict[str, Runner] = {}


def _toolset() -> McpToolset:
    return McpToolset(connection_params=StdioConnectionParams(
        server_params=StdioServerParameters(command=sys.executable, args=["-m", "fieldwork.agents.mcp_server"],
                                            cwd=str(config.ROOT), env=dict(os.environ)),
        timeout=30))


def _runner(model: str) -> Runner:
    if model not in _runners:
        agent = LlmAgent(name="fieldwork_buyer", model=model, instruction=INSTRUCTION, tools=[_toolset()])
        _runners[model] = Runner(app_name=APP, agent=agent, session_service=_sessions, auto_create_session=True)
    return _runners[model]


async def _run(model: str, session_id: str, message: str) -> dict:
    text, calls = "", []
    msg = types.Content(role="user", parts=[types.Part(text=message)])
    response_start = time.monotonic()
    async for ev in _runner(model).run_async(user_id="buyer", session_id=session_id, new_message=msg):
        if gemini.log_agent_event("agent_buyer", model, ev, time.monotonic() - response_start):
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
    """Returns {text, tool_calls: [{tool, args, result}], model}."""
    models = [os.getenv("FW_BUYER_MODEL", config.MODEL_FLASH), *config.MODEL_FALLBACKS]
    last = None
    for m in models:
        try:
            out = await _run(m, session_id, message)
            out["model"] = m
            return out
        except Exception as e:  # model overloaded/unknown: try the next one
            last = e
    raise last
