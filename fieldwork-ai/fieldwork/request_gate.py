"""Serialize state-changing HTTP requests while leaving reads responsive.

Requires one API worker and one Cloud Run instance. POST requests include agent
calls, so tool-driven mutations share the same gate as direct API mutations.
"""
import asyncio
from fastapi import FastAPI, Request


def install_mutation_gate(app: FastAPI) -> None:
    mutation_lock = asyncio.Lock()

    @app.middleware("http")
    async def gate(request: Request, call_next):
        if request.method in {"GET", "HEAD", "OPTIONS"}:
            return await call_next(request)
        async with mutation_lock:
            return await call_next(request)
