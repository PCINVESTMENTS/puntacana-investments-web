# Project Rules: Punta Cana Investments Web

## Property Uploading & Sync

1. **Sanity Room Fields:** When creating or updating properties via the Sanity API or script, ALWAYS use `beds` and `baths`. Never use `bedrooms` or `bathrooms`, as the frontend card UI specifically maps to `beds` and `baths`.
2. **Translation Completeness:** Every new property payload MUST include `titleEn` and `titleFr` alongside `title` (or `titleEs`). If these are omitted, the Next.js frontend will fail to map the localized titles for the English and French pages, breaking the UI aesthetics.
3. **Massive Multilingual SEO Injection:** 
   - The `seo` object must be exhaustively populated for `es`, `en`, and `fr`.
   - Inject 40-50 high-intent keywords per language. Target terms for Canadian snowbirds ("retire in dominican republic", "canadian buying property punta cana"), US buyers ("us citizen buying house in dominican republic"), Quebec/France ("québécois investissement immobilier république dominicaine"), and local investors.
   - Meta titles and descriptions must be highly transactional ("buy", "invest", "comprar") and respect Google's character limits.
   - The URL `slug` must be optimized without special characters and contain the exact keyword (e.g., `apartamento-1-habitacion-epic-punta-cana`).
4. **Google-Compliant Markdown Styling for Subtitles:**
   - To render the premium "luxury-gold" gradient on the Next.js frontend, subtitles MUST be formatted using standard H3 or H4 Markdown (e.g., `### Subtitle` or `#### Subtitle`) in the description fields.
   - You MUST precede the `### ` with an empty line, otherwise `ReactMarkdown` may fail to parse it correctly as a header.
   - Do NOT use bolding (`**Subtitle**`) as a substitute for headings, because `ReactMarkdown` will render it as `<strong>` which strips the gold gradient and harms SEO hierarchy.
5. **Gallery Completeness Verification:** Before finalizing a property upload, ALWAYS execute `ls -t /Users/puntacanainvestments/.gemini/antigravity-ide/brain/<conversation-id>/media*` to check the artifact directory for ALL user-uploaded media files. Compare timestamps meticulously to guarantee that zero photos are skipped during the Sanity `gallery` update.
6. **Strict Isolation Principle:** When uploading or modifying a new property, DO NOT touch page configuration files (`page.tsx`, layout, styling), routing logic, or data mapping components (like `mappers.ts`) unless explicitly requested. Furthermore, DO NOT touch, modify, or recalculate the SEO, URLs, or metadata of any existing properties. What is already there must remain completely isolated and unchanged.
7. **Property ID Type Strictness:** When creating a property payload for Sanity, ensure the `id` field is explicitly cast as a `Number` (e.g. `Math.floor(...)` directly, NOT `.toString()`). The Next.js frontend has a strict filter that drops any property from rendering if `typeof p.id !== 'number'`.
8. **Minimalist Luxury UI Aesthetics:** When adjusting property cards, maintain a compact and premium layout. Property titles (`h3`) should use moderate sizes (`text-lg md:text-xl`), and overlay badges (Price, Status) must use small fonts and tight paddings (e.g. `text-[9px] px-2 py-1.5`) to prevent overlapping on mobile screens while preserving the straddle-line design.
