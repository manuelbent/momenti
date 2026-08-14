# momenti

Momenti generates a single page for your event from one prompt and publishes it in one click.
Weddings, birthdays, reunions, parties, concerts, or any occasion that needs a page.
Describe your event in natural language and the model produces a structured page with sections, typography, images, an RSVP form, a venue map, and a countdown.
You don't need domains or hosting. The result can be refined in a visual editor, previewed, and published.

## How it works

A user describes their event, for example *"A cherry blossom wedding at Villa Camilla on Lake Como, July 23rd, elegant and romantic, with an RSVP section"*, and the server calls an LLM to produce a structured `MomentContent` tree.
That tree is a composition of typed nodes (hero, text, image, form, map, countdown, carousel, and so on), each carrying its own CSS and content.
The studio lets the host edit any node directly, and the viewer renders it for guests.

## Structure

```
momenti/
├── server/       Express API for generation, editing, auth, uploads, form submissions
├── studio/       Svelte editor to create and refine moments
├── viewer/       Svelte viewer for public-facing moment pages
├── shared/       TypeScript types shared across packages
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
Lets authenticated users prompt for a new moment, watch generation stream in, then edit every node in the tree (text, styles, images, links, forms) before saving and publishing.

### viewer

Lightweight Svelte 5 application.  
Renders a published moment for guests from its JSON content tree.  
Handles form submissions and countdown display.

### shared

Type definitions (`MomentContent`, `MomentNode`, `FormField`, etc.) consumed by both the frontend packages and the server.

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

