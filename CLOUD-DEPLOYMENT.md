# Google Cloud demo deployment

Project: `project-5c967997-3711-4585-9ed`

Region: `asia-southeast1`

- App: https://fieldwork-web-53419303349.asia-southeast1.run.app
- API: https://fieldwork-api-53419303349.asia-southeast1.run.app
- Reviewer console: https://fieldwork-web-53419303349.asia-southeast1.run.app/review
- Issue history: https://fieldwork-web-53419303349.asia-southeast1.run.app/help

Firestore stores records and workflow state; a private Cloud Storage bucket stores evidence. The API serves evidence through its media route. Vertex AI uses the runtime service account; no Gemini API key is required. The reviewer credential lives in Secret Manager and in the ignored local `.env.review` file.

The Cloud Run demo accepts up to 30 MiB of photos and video combined per request. Video duration remains limited to 60 seconds. The application-level 50 MiB video limit applies where the hosting transport permits it.

The demo keeps one backend instance warm. The API uses one instance with up to 16 concurrent HTTP requests. Application middleware serializes state-changing requests, including agent calls; read-only requests can continue during analysis. Keep one API worker and one instance because workflow transitions use process-local locks. Payments are simulated. Buyer/seller authentication and private per-user histories remain unfinished; this deployment is a shared hackathon prototype.

The sample `fx_` listings are hand-made fixtures. Their photos are bundled in the repository and copied into cloud storage. A real seller upload uses the Gemini/SigLIP analysis pipeline before publication. Condition grades do not set prices: sellers choose an INR asking price, and optional negotiation uses a backend-enforced private minimum.

Deployment validation results are recorded separately in the ignored `fieldwork-ai/data/results/cloud-smoke-test.json` file. Those checks verify integration; they do not establish real-world defect accuracy.

Cloud JSON documents use a versioned string envelope inside Firestore because garment outlines contain nested arrays. Reads also accept older flat documents. Media files remain in Cloud Storage.

## Launch validation

62 focused backend tests, 7 frontend state tests, and the Next.js production build passed. A live cloud test passed seller photo analysis, disclosure, INR pricing, publication, negotiation, purchase history, issue escalation, reviewer authorization, and a simulated refund. Underpriced checkout and buyer release during an open issue were rejected. The first seller analysis took about 69 seconds; buyer search took about 16 seconds.

The received-evidence check reused the seller sample photos, so the gate flagged replayed listing media and returned `cant_tell`. This tests safe escalation and workflow integration, not independent received-garment accuracy.

A deployment follow-up fixed Cloud Run 429 responses caused by a single occupied request slot. A regression test verifies that reads continue while two mutation requests execute sequentially. The received-garment page clears stale connection errors after loading successfully and provides a read-only purchase-status refresh.

Live follow-up validation: 24/24 read requests succeeded while a Gemini buyer-agent request was active (median read latency 0.141 seconds, maximum 2.765 seconds). This is a small diagnostic, not a production load benchmark. The reported buyer purchase stayed held, and the refreshed received-garment page showed its current state without the stale connection warning.
