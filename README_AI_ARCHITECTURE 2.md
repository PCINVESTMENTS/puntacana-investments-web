# 🤖 AI Architecture Instructions & Critical Gotchas

**Hello Antigravity / AI Agent!** If you are reading this, DO NOT ignore it. 
This document outlines critical integration logic between Django, Sanity, and Next.js (Vercel) that MUST NOT be broken.

## 1. The Sanity-Vercel Sync Pipeline
The application uses a highly automated deployment pipeline:
- The user edits a property in the **Django Dashboard**.
- Django syncs the data to **Sanity** using `sanity_client.create_or_replace`.
- Sanity has a **Webhook** with a GROQ filter `!(_id in path("drafts.**"))` that listens for changes.
- This Webhook triggers a **Vercel Deploy Hook**, causing a full static rebuild of the Next.js frontend.

**DO NOT ATTEMPT TO CHANGE THIS FLOW.** Do not add programmatic `revalidatePath` calls from Django to Vercel, as Vercel's WAF blocks programmatic requests from the Railway backend. The Deploy Hook is the authorized mechanism.

## 2. Next.js Fetch Caching & The "Merge Logic"
In Next.js App Router, `fetch()` calls to Sanity are aggressively cached. Even when a Vercel Deploy Hook rebuilds the site, it will generate stale pages if local fallback logic overrides Sanity data.
- Look at `src/app/[lang]/page.tsx` and `src/app/[lang]/properties/page.tsx`.
- We use a specific **merge logic** where data fetched from Sanity explicitly **overrides** local hardcoded data (`src/data/properties.ts`), EXCEPT for images if Sanity's images are missing.
- **NEVER** revert the merge logic back to `return local;` or `return local || p;`. Sanity MUST remain the Source of Truth.

## 3. Image Fallbacks
Currently, Sanity properties might not have images uploaded. The code handles this by doing `image: p.image || local.image`. Do not remove this fallback, otherwise property cards will render black backgrounds.
