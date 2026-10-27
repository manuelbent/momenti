# momenti

Momenti generates a single page for your event from one prompt and publishes it in one click.
Weddings, birthdays, reunions, parties, concerts, or any occasion that needs a page.
Describe your event in natural language and the model produces a structured page with sections, typography, images, an RSVP form, a venue map, and a countdown.

Every page gets its own subdomain on `momenti.cc`. 
The moment starts with a subdomain derived from its title (for example `your-event.momenti.cc`), and you can change it to any name you like, with availability checked live as you type.
There are no domains to buy and no hosting to set up.
The moment you publish, the page is live at `https://your-event.momenti.cc`, ready to share immediately.

## How it works

A user describes their event, for example *"A cherry blossom wedding at Villa Camilla on Lake Como, July 23rd, elegant and romantic, with an RSVP section"*, and the server calls an LLM to produce a structured `MomentContent` tree.
While its JSON is streaming, the studio incrementally parses complete nodes and renders them in a non-interactive preview that automatically follows the page as it is assembled.
That tree is a composition of typed nodes (box, text, image, form, map, countdown, carousel, and so on), with a page stylesheet and optional inline CSS overrides.
The studio lets the host edit any node directly, and the viewer renders it for guests.

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

- Streaming LLM generation via OpenAI with prompt safety middleware
- Moment CRUD, slug management, content updates, publishing
- Image uploads stored in Cloudflare R2
- Form submission collection with CSV export
- Invite-key based access control
- Redis rate limiting and stream caching

### studio

Svelte 5 single-page application.  
Lets authenticated users prompt for a new moment, watch its page assemble in a live streaming preview, then edit every node in the tree (text, styles, images, links, forms) before saving and publishing.

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

Capture and patch instructions share `server/src/services/prompts/moment-format.txt`. Composition is left to the model; maps, footers, card grids, and motion are not mandatory. Patch requests retain existing assets and unrelated styles.

Styling and streaming regressions run with the server's Vitest suite. Browser coverage exercises the real studio and viewer, including responsive frames, text editing, saving, forms, and gallery lightboxes:

```sh
npm --prefix server test -- tests/pageStyles.test.ts src/validators/PageStyleValidation.test.ts src/services/LLMService.test.ts
npm --prefix shared exec -- playwright install chromium
npm --prefix shared run test:browser
```

The browser runner starts isolated local Vite servers and mocks API requests; it does not generate paid assets or publish moments.

### database

Sequelize migrations and seeders. The default database is SQLite, configured via `database/config.cjs`.

## Tech stack

| Layer | Stack |
|---|---|
| Server | Node.js, Express, TypeScript, Sequelize, SQLite |
| AI | OpenAI (streaming) |
| Storage | Cloudflare R2 (S3-compatible) |
| Cache / Rate limiting | Redis |
| Frontend | Svelte 5, Vite, Tailwind CSS 4 |
| Testing | Vitest, Supertest |
| Process manager | PM2 |
