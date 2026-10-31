# momenti

Create an event page from a prompt, customize it in Studio, and publish it at
`your-event.momenti.cc`. Pages support images, RSVP forms, maps, countdowns,
and custom styling.

## How it works

The server checks the prompt, generates a hero image with OpenAI, and streams
the page to Studio over SSE. Users can edit the page, request AI changes, and
publish it on their own subdomain.

Redis provides per-user generation locks, stream replay, and rate limiting.
Generation continues after disconnects; Studio resumes active generations on
reload. Hero-image failures fall back to a placeholder without stopping the page.

## Structure

| Directory | Purpose |
|---|---|
| `server/` | Express API, OpenAI integration, authentication, and publishing |
| `studio/` | Svelte editor |
| `viewer/` | Svelte renderer for published pages |
| `shared/` | Shared types, page renderer, styles, and fonts |
| `database/` | Sequelize migrations and seeders for SQLite |
| `moments/` | Saved prompt and page snapshots |

## Development

Use each package's `.nvmrc`. Install dependencies from the repository root:

```sh
npm ci --prefix server
npm ci --prefix shared
npm ci --prefix studio
npm ci --prefix viewer
```

Run the needed apps with `npm --prefix <package> run dev`.
Build with `npm --prefix <package> run build` for `server`, `studio`, or `viewer`.
Run server tests with `npm --prefix server test`.
Database commands are defined in `server/package.json`; configuration lives in
`database/config.cjs`.

## Image uploads

Studio uploads custom images directly to Cloudflare R2, not through the server.
Authenticated owners request `POST /moments/:id/images` with `contentType` and
`size`. Supported formats are JPEG, PNG, WebP, GIF, and AVIF, up to 5 MiB.
The endpoint allows ten requests per minute per IP.

The response contains `{ uploadId, uploadUrl, url, headers, expiresAt }`.
Studio sends the raw file to `uploadUrl` using the returned headers and saves
the public `url` only after success. Upload URLs expire after five minutes and
bind the content type and size. Failed uploads stop saving and retain the local
preview for retry.

`R2_PUBLIC_URL` points to `https://assets.momenti.cc`; signed uploads use the R2
S3 API endpoint. Bucket CORS must allow `PUT` and `Content-Type` from Studio's
origins. Issuance is stateless and does not create image database records or
verify file contents. AI-generated hero images still upload server-side.

## Styling and deployment

Studio and Viewer share `MomentPage.svelte`. Use node-ID selectors and
`@container moment` breakpoints so editor previews match published pages.
Page CSS is scoped and validated; existing inline styles remain supported.

Packages deploy independently. Frontend builds also install shared dependencies.
The reverse proxy must honor `X-Accel-Buffering: no` for SSE responses.
