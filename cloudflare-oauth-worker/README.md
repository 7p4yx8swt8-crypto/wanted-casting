# wanted-casting-oauth Worker

Cloudflare Worker, der GitHub OAuth für Decap CMS abwickelt.

## Setup (einmalig)

### 1. GitHub OAuth App registrieren

- Gehe zu https://github.com/settings/developers → **OAuth Apps** → **New OAuth App**
- **Application name:** wanted-casting CMS
- **Homepage URL:** https://www.wanted-casting.de
- **Authorization callback URL:** `https://wanted-casting-oauth.<DEIN-CF-USER>.workers.dev/callback`
  (genaue URL siehst du nach dem ersten Deploy — also erst Schritt 2, dann hier zurück und Callback eintragen)
- App erstellen → **Client ID** notieren, **"Generate a new client secret"** klicken → **Client Secret** notieren

### 2. Worker deployen

```bash
cd cloudflare-oauth-worker
npm install -g wrangler        # falls noch nicht installiert
wrangler login                  # einmalig: Cloudflare-Account verknüpfen
wrangler deploy
```

Nach dem Deploy zeigt Wrangler die URL: `https://wanted-casting-oauth.<dein-user>.workers.dev`. Diese URL trägst du jetzt:
- in der GitHub OAuth App als Callback URL ein (Schritt 1)
- in `public/admin/config.yml` als `base_url` ein

### 3. Secrets setzen

```bash
wrangler secret put GITHUB_CLIENT_ID
# Bei Aufforderung die Client ID aus Schritt 1 einfügen

wrangler secret put GITHUB_CLIENT_SECRET
# Bei Aufforderung das Client Secret aus Schritt 1 einfügen
```

Fertig. Login unter `wanted-casting.de/admin` sollte jetzt funktionieren.

## Testen

`https://wanted-casting-oauth.<dein-user>.workers.dev/` öffnen — sollte einen Text zurückgeben.
