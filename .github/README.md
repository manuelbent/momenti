# momenti

Momenti generates a single page for your event from one prompt and publishes it in one click.
Weddings, birthdays, reunions, parties, concerts, or any occasion that needs a page.
Describe your event in natural language and the AI generates a custom hero image and a structured page with sections, typography, and useful event details such as an RSVP form, a venue map, or a countdown.

Every page gets its own subdomain on `momenti.cc`. 
The moment starts with a subdomain derived from its title (for example `your-event.momenti.cc`), and you can change it to any name you like, with availability checked live as you type.
There are no domains to buy and no hosting to set up.
The moment you publish, the page is live at `https://your-event.momenti.cc`, ready to share immediately.

## How it works

A user describes their event, for example *"A cherry blossom wedding at Villa Camilla on Lake Como, July 23rd, elegant and romantic, with an RSVP section"*. The server then runs a sequential generation pipeline:

1. **Check the brief.** Prompt moderation and classification run before asset generation.
2. **Create the hero image.** `ImageGenerationController` asks `OpenAIService` to turn the event brief into a visual-only image prompt using a low-cost text model. This prompt describes the subject, composition, lighting, palette, and mood of a wide 3:2 image, without baked-in text or UI. `OpenAIService` generates the PNG, and the controller uploads it through `R2Service` to Cloudflare R2. `ImageService` only persists image records.
3. **Generate the page.** `MomentGenerationController` passes the original brief and uploaded hero image URL to `OpenAIService` and consumes its stream directly, forwarding chunks to the client over SSE. The page model includes the existing asset as an image node, preserving its URL, and chooses its placement to suit the composition. The controller saves the completed moment before the stream reports completion. Initial moment generation and patch generation continue to completion if the client disconnects.

`OpenAIService` implements `LLMServiceInterface` and records API response usage through `AiCostService` before returning results or completing streams. Callers pass a correlation ID shared across each generation, plus a Moment ID when one already exists; they do not receive usage payloads. Only total `input_tokens` and `output_tokens` are tracked. Rates live in `server/src/config/constants.ts`; image generation conservatively prices all input tokens at $0.000008 each and all output tokens at $0.000030 each, without cache discounts or text/image breakdowns. Unreported usage remains `NULL`, and the cost remains `NULL` when required input or output counts are unavailable. Moderation is free even though its token counts are unavailable. Cost-storage failures log a warning without interrupting generation.

Before opening SSE or starting AI work, moment creation and patch requests acquire the same per-user Redis reservation through `RedisService`. Acquisition is atomic; a competing request receives `409`, and Redis acquisition failures return `503` without starting generation. Validation runs before acquisition. Completion, rejection of the brief, or a terminal generation failure releases only that generation's reservation, independently of client disconnects. Image preparation failures are non-terminal and keep the reservation held. Lock operations and cleanup error handling live in `RedisService`, which controllers and middleware call directly. Reservations expire after ten minutes as crash cleanup; they are not renewed, so work exceeding that lease can overlap a later request.

Moderation, classification, image preparation, and Moment generation cache each `progress`, `chunk`, `done`, and `error` event through `RedisService.cacheGenerationEvent` before sending it over SSE. Controllers and middleware own SSE delivery; `RedisService` only stores events and returns Redis entry IDs, with no HTTP or SSE dependencies. Events are appended with `XADD` to the same Redis Stream at `generation:events:<userId>:<generationId>`, using `event` and JSON-encoded `data` fields. The Redis Stream ID is emitted as the SSE `id`, providing the cursor needed by future resume/replay behavior. Streams are retained for ten minutes after the last cached event. Caching continues after client disconnects, and releasing the generation reservation does not delete the event history. Cache failures log a warning and send live SSE without an `id`, without interrupting generation or persistence. Moderation and classification rejections cache their terminal error before releasing the lock. Image failures still use the placeholder and continue generation. Resume/replay is not implemented.

The studio opens its preview as soon as the POST `/moments` SSE connection is established, before page chunks arrive. Streamed `progress` events update preparation labels at the preview's bottom right while the brief is checked and the image is planned, generated, and uploaded. `chunk` events feed the existing incremental JSON parser and non-interactive renderer, automatically following the page as it is assembled. A `done` event stores the saved Moment on the client and opens Studio; stream errors or an interrupted connection return to the form with the prompt preserved and an error notification.
Moment creation and patch requests share the same typed stream decoder and event-handler interface. Each caller handles its own UI state; patch failures use one notification path and always clear transient streaming state.
That tree is a composition of typed nodes (box, text, image, form, map, countdown, carousel, and so on), with a page stylesheet and optional inline CSS overrides.
The studio lets the host edit any node directly, and the viewer renders it for guests.

Hero image generation is part of initial moment generation, not patch requests. Patches refine the existing page while retaining its assets and unrelated styles. Image preparation is best-effort: if image prompting, generation, or upload fails, the server logs a warning and continues Moment generation with `https://placehold.co/1536x1024/png`. The SSE response stays open and the generation lock remains held until Moment persistence completes or Moment generation fails.

## Structure

```
momenti/
├── server/       Express API for generation, editing, auth, uploads, form submissions
├── studio/       Svelte editor to create and refine moments
├── viewer/       Svelte viewer for public-facing moment pages
├── shared/       Shared types, page styling, and font loading
├── database/     Sequelize config, migrations, and seeders (SQLite)
└── moments/      Saved moment snapshots (prompt + generated JSON)
```

### server

Node.js / Express written in TypeScript. Responsibilities:

- Prompt safety checks, hero-specific image prompting, custom image generation, and streaming page generation via OpenAI
- Moment CRUD, slug management, content updates, publishing
- Generated hero images and user uploads stored in Cloudflare R2
- Form submission collection with CSV export
- Invite-key based access control
- Redis rate limiting and stream caching

`GET /me` requires the `x-invite-key` header and returns `{ id: number, isGenerating: boolean }`.
`isGenerating` indicates whether the user has an active generation lock in Redis.

`GET /generations` requires the `x-invite-key` header and opens an SSE connection.
It replays the user's active generation from the beginning with the original event IDs,
then streams new events until `done` or `error`. If no generation is active, the connection closes.
Disconnecting only stops replay; it does not cancel the generation or release its lock.

`POST /moments/:id/images` requires `x-invite-key` and Moment ownership. Its JSON body
contains `nodeId`, `contentType` (JPEG, PNG, WebP, GIF, or AVIF MIME type), and `size`
(an integer byte count from 1 to 5 MiB). A dedicated IP rate limit allows ten requests
per minute. The response is `201` with `{ uploadId, uploadUrl, url, headers, expiresAt }`.
The URL authorizes an R2 `PUT` for five minutes with the specified content type and
exact content length; send the raw file with the returned headers, without application
authentication headers. Browsers set content length automatically.

URL issuance is stateless and does not store pending upload metadata. Redis is used
only for rate limiting in this upload flow. Issuance does not create an image database
record or verify image bytes. Completion, cleanup, and bucket CORS configuration are
not implemented yet. The legacy multipart `PUT /images` endpoint has been removed.
Studio keeps local blob previews until save, then requests a presigned URL for each
pending image and uploads the raw file directly to R2 using only the returned headers.
After a successful upload, it saves the permanent public `url`, never `uploadUrl`.
Upload failures stop the save and keep the failed file's preview available for retry.
The R2 bucket must allow `PUT` and `Content-Type` from the Studio origin through CORS.
Server-generated hero images continue to upload through `R2Service`.

### studio

Svelte 5 single-page application.  
Lets authenticated users prompt for a new moment, follow preparation progress while its custom hero image is generated, watch its page assemble in a live streaming preview, then edit every node in the tree (text, styles, images, links, forms) before saving and publishing.
On initialization with a saved invite key, it checks `/me` and resumes an active Moment generation through `/generations`, rebuilding the landing-page preview from replayed events.

### viewer

Lightweight Svelte 5 application.  
Renders a published moment for guests from its JSON content tree.  
Handles form submissions and countdown display.

### shared

Type definitions (`MomentContent`, `MomentNode`, `FormField`, etc.) consumed by both the frontend packages and the server.
The studio and viewer also share `MomentPage.svelte`, which scopes generated CSS to each rendered page instance.

Install its dependencies before building either frontend:

```sh
npm ci --prefix shared
npm ci --prefix studio
npm ci --prefix viewer
```

### Page styling

`MomentContent.stylesheet` is an optional CSS string. New generations emit it before `root` so the streaming preview can apply the design as nodes arrive. Existing moments without a stylesheet retain their original inline-only rendering.

Use node IDs as selectors, including descendants and pseudo-elements. The page root's ID is the place for typography, colors, and custom properties. Prefer `@container moment (max-width: ...)` for layout breakpoints: desktop/mobile previews use their own rendered widths rather than the studio window width. Inline `node.css` remains available for editor overrides and takes precedence over ordinary stylesheet rules.

Stylesheet-enabled pages implement `box.layout` as low-specificity flex/grid defaults; page CSS can override them. `variant` remains editor metadata, not a visual template. Image IDs target wrappers, with `#image-id img` controlling the crop; carousel slide IDs target the images directly.

The shared CSS parser scopes every selector, including conditional rules. It accepts flat rules and `@container`, `@media`, and `@supports`, but rejects CSS imports, resource URLs, global registrations such as `@font-face`/`@keyframes`, and nested selectors. Use image nodes, the fonts array, and built-in effects instead. The page boundary contains positioned content so generated CSS cannot cover the studio UI. Unsupported styles produce a visible error rather than being injected as global CSS.

Prompts are private readonly attributes in `OpenAIService`; initial moment generation and patch generation share its `momentFormat` attribute. Composition is left to the model; maps, footers, card grids, and motion are not mandatory. Patch requests retain existing assets and unrelated styles.

Server stylesheet validation runs with the server's Vitest suite:

```sh
npm --prefix server test -- src/validators/PageStyleValidation.test.ts src/services/OpenAIService.test.ts
```

### CI/CD

Each package deploys independently using its `.nvmrc`. Only studio and viewer deployments
track shared changes and install its dependencies to bundle it into their builds.
Shared has no standalone CI or test setup. It supplies compile-time server types without
requiring its dependencies in the server workflow and is not deployed separately.
Server uploads contain compiled code, runtime config,
package manifests, and migration inputs; development dependencies are pruned afterward.
SSE responses send `X-Accel-Buffering: no`, which the reverse proxy must honor.

### database

Sequelize migrations and seeders. The default database is SQLite, configured via `database/config.cjs`.

## Tech stack

| Layer | Stack |
|---|---|
| Server | Node.js, Express, TypeScript, Sequelize, SQLite |
| AI | OpenAI (image prompting, image generation, streaming page generation) |
| Storage | Cloudflare R2 (S3-compatible) |
| Cache / Rate limiting | Redis |
| Frontend | Svelte 5, Vite, Tailwind CSS 4 |
| Testing | Vitest, Supertest |
| Process manager | PM2 |
