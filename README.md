# Vellum

A friendly front door for making a will in Ghana. Visitors answer a few quick questions in a modal, see why a will matters for *their* situation, and leave their details so the Vellum team can follow up.

Built with Nuxt 4.

## Setup

```bash
npm install
cp .env.example .env   # then fill in the values
npm run dev            # http://localhost:3000
```

| Variable | Purpose |
|---|---|
| `NUXT_DISCORD_WEBHOOK_URL` | Discord webhook that gets a message for each enquiry. Optional — leads are saved either way. |
| `NUXT_ADMIN_TOKEN` | Protects the admin endpoint below. Generate with `openssl rand -hex 32`. |

These are read at **runtime**, never baked into the build, so set them in your host's environment for production. `npm run build` on your laptop won't post to the real Discord channel.

## How it works

- **Quiz** — `components/WillQuiz.vue`. Questions, copy and answer validation live in `shared/willQuiz.ts`, which both the page and the server import. Edit wording there.
- **Enquiries** — `POST /api/intake` validates the answers, saves the lead, then notifies Discord. If Discord is down, the lead is still kept.
- **Funnel** — the quiz sends an anonymous `POST /api/quiz-event` the first time each step is reached in a session, so you can see where people drop off. No personal data is recorded.
- **Admin** — `GET /api/admin/leads` with `Authorization: Bearer $NUXT_ADMIN_TOKEN` returns all leads plus daily funnel counts. Add `?format=csv` to download a spreadsheet.

  ```bash
  curl -H "Authorization: Bearer $NUXT_ADMIN_TOKEN" https://your-site/api/admin/leads?format=csv -o leads.csv
  ```

## Storage

Leads, funnel counts and rate limits are stored with Nitro storage under the `vellum` mount (`nuxt.config.ts`). It defaults to the filesystem at `.data/vellum`, which works on a single Node server with a persistent disk.

On serverless or multi-instance hosting (Vercel, Netlify, several containers), point the mount at shared storage instead, for example Redis:

```ts
nitro: { storage: { vellum: { driver: 'redis', url: process.env.REDIS_URL } } }
```

## Production

```bash
npm run build
NUXT_DISCORD_WEBHOOK_URL=… NUXT_ADMIN_TOKEN=… node .output/server/index.mjs
```

## Content notes

The "without a will" lines in `shared/willQuiz.ts` are written for Ghana's intestacy rules. Have a Ghanaian lawyer review them before launch, and recheck them if the intestate succession law changes.
