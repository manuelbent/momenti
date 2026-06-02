# momenti

Momenti is a tool for generating landing pages from a single prompt and make them publicly accessible in literally one click.  
Describe your event in natural language and an AI model generates a fully structured page with sections, typography, images, forms, and more.  
The result can be refined in a visual editor, previewed an published.

## How it works

A user writes a prompt — *"A cherry blossom wedding at Villa Camilla on Lake Como, elegant and romantic"* — and the server calls an LLM to produce a structured `MomentContent` tree.  
That tree is a composition of typed nodes (hero, text, image, form, map, countdown, carousel, etc.) each carrying its own CSS and content.  
The studio lets the author edit any node directly; the viewer renders it for visitors.

## Structure

```
momenti/
├── server/       Express API — generation, editing, auth, uploads, form submissions
├── studio/       Svelte editor — create and refine moments
├── viewer/       Svelte viewer — public-facing moment pages
├── shared/       TypeScript types shared across packages
├── database/     Sequelize config, migrations, and seeders (SQLite)
└── moments/      Saved moment snapshots (prompt + generated JSON)
```

### server

Node.js / Express written in TypeScript. Responsibilities:

- Streaming LLM generation via OpenAI with prompt safety middleware
- Moment CRUD — slug management, content updates, publishing
- Image uploads stored in Cloudflare R2
- Form submission collection with CSV export
- Invite-key based access control
- Redis rate limiting and stream caching

### studio

Svelte 5 single-page application.  
Lets authenticated users prompt for a new moment, watch generation stream in, then edit every node in the tree — text, styles, images, links, forms — before saving and publishing.

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

