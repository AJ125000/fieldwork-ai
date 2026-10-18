# Credential exposure audit — 18 October 2026

No credential exposure was found in the checked Git history, build sources, public bundles, or deployment logs. This is a scoped credential audit, not a complete application security assessment.

## Checks completed

- Fetched current GitHub refs and scanned all 479 reachable Git blobs, including older commits and deleted files.
- Scanned 1,865 local build/context files and nine JavaScript bundles fetched from the public frontend.
- Downloaded and scanned all four Cloud Run source archives (304 files). The only uploaded environment file was the frontend `.env.production`, containing only `NEXT_PUBLIC_API_BASE`.
- Scanned all 1,697 available Cloud Run/build log entries in the deployment window beginning 17:15 UTC.
- Searched known Google API key, GitHub token, private-key, OAuth token patterns and the exact current reviewer credential where applicable. No matching credentials were found. Secret values were never printed in the audit output.
- Confirmed the deployed API references `FW_REVIEW_TOKEN` through Secret Manager, rather than an inline environment value. Direct secret-access IAM names only the backend runtime account; project administrators retain inherited administrative access.
- Confirmed the backend runtime account has only a Google-managed key and no downloaded user-managed service-account key.
- Confirmed the evidence bucket has no public IAM principal. Project role holders and the backend runtime retain access.
- Confirmed local reviewer credential files have mode `0600` and are ignored by Git.
- Confirmed missing/incorrect/demo reviewer credentials return 401; the design-preview API, environment-file URL and Git-config URL return 404.

## Hardening applied

Backend and frontend Docker/Cloud Build exclusions now reject environment files, private-key formats, ADC files and common service-account credential filenames. The frontend allows `.env.production` because its public API URL must be present at Next.js build time; this file must contain public configuration only. The deployment script writes only that URL. Actual `gcloud meta list-files-for-upload` checks confirmed exclusion of temporary environment/key/credential sentinels, exclusion of the backend reviewer file, and inclusion of only the intended frontend public configuration file.

The already deployed archives were clean; changing these exclusion rules does not require redeploying the running containers.

## Remaining application-security limitations

- The public prototype has no buyer/seller login, per-user authorization or rate limiting. Anonymous users can invoke paid AI endpoints. Shared listing, purchase and issue histories, and evidence served through the API, are not private per user even though the underlying bucket is private.
- The frontend currently uses the default Compute service account, which is also the source-build account. Move it to a dedicated runtime account with no project roles before broader production use.
- Repository/build scanning detects known patterns and the current reviewer key; it cannot prove that an arbitrary unknown-format secret never existed. Downloaded dependency layers were not exhaustively forensically scanned.

No credential rotation was triggered because this audit found no exposure. If a credential is later found in a public artifact, revoke/rotate it first; removing the current file does not remove old Git history or uploaded artifacts.
