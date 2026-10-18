import asyncio
import httpx
from fastapi import FastAPI
from fieldwork.request_gate import install_mutation_gate


def test_reads_continue_during_analysis_but_mutations_do_not_overlap():
    async def scenario():
        app = FastAPI()
        entered, release = asyncio.Event(), asyncio.Event()
        active = 0
        maximum = 0
        calls = 0

        @app.get("/health")
        async def health():
            return {"ok": True}

        @app.post("/work")
        async def work():
            nonlocal active, maximum, calls
            calls += 1
            active += 1
            maximum = max(maximum, active)
            entered.set()
            if calls == 1:
                await release.wait()
            active -= 1
            return {"saved": True}

        install_mutation_gate(app)
        async with httpx.AsyncClient(transport=httpx.ASGITransport(app=app), base_url="http://test") as client:
            first = asyncio.create_task(client.post("/work"))
            await asyncio.wait_for(entered.wait(), 2)
            second = asyncio.create_task(client.post("/work"))
            try:
                response = await asyncio.wait_for(client.get("/health"), 2)
                assert response.json() == {"ok": True}
                assert calls == 1
            finally:
                release.set()
            responses = await asyncio.gather(first, second)
            assert all(r.status_code == 200 for r in responses)
            assert maximum == 1 and calls == 2
    asyncio.run(scenario())
