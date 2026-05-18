# wanted-casting.de — Frontend Rebuild

Neuer Frontend für **agentur wanted**, gebaut mit Astro + Tailwind, ausgelegt für Deployment auf **Cloudflare Pages** + GitHub. Der Login- und Komparsen-Bereich bleibt unverändert bei Castconnect (`online.agentur-wanted.de`) — diese Seite ist die öffentliche Marketing-Site mit eigenem CMS für aktuelle Castings.

## Stack

- **Astro** + **Tailwind CSS** — Framework + Styling
- **Decap CMS** — Content Management für Castings (Login via GitHub)
- **Cloudflare Worker** — OAuth-Proxy für CMS-Login
- **Web3Forms** — Formular-Versand
- **Cloudflare Pages** — Hosting
- **i18n** — Deutsch (default) + Englisch (`/en/...`)

## Lokal starten

Du brauchst **Node.js 18+**.

```bash
npm install
npm run dev
```

Seite läuft auf `http://localhost:4321`. Das CMS ist unter `http://localhost:4321/admin` erreichbar — im lokalen Modus schreibt es direkt in den `src/content/`-Ordner ohne Login (siehe `local_backend: true` in `admin/config.yml`).

## Vor dem ersten Deployment

### 1. Web3Forms Key (für Kontakt- und Anfrageformulare)

1. Auf [web3forms.com](https://web3forms.com) E-Mail eingeben, Key kommt sofort
2. Key eintragen in:
   - `src/pages/anfrage.astro`
   - `src/pages/kontakt.astro`

### 2. Decap CMS einrichten (siehe `cloudflare-oauth-worker/README.md`)

Damit dein Kumpel sich unter `/admin` mit GitHub einloggen kann, muss einmalig ein OAuth-Worker deployed werden:

1. **GitHub OAuth App registrieren** → https://github.com/settings/developers
2. **Worker deployen:** `cd cloudflare-oauth-worker && wrangler deploy`
3. **Worker-URL + GitHub-Repo-Pfad** in `public/admin/config.yml` eintragen

Detaillierte Schritt-für-Schritt-Anleitung im `cloudflare-oauth-worker/README.md`.

### 3. Impressum & AGB

In `src/pages/impressum.astro` und `src/pages/agb-dsgvo.astro` die Platzhalter durch echte Daten ersetzen.

## Deployment auf Cloudflare Pages

1. **GitHub-Repo erstellen, Code pushen:**
   ```bash
   git init
   git add .
   git commit -m "Initial setup"
   git branch -M main
   git remote add origin https://github.com/DEIN_USER/wanted-casting.git
   git push -u origin main
   ```

2. **Cloudflare Pages:**
   - Cloudflare Dashboard → **Workers & Pages** → **Create application** → **Pages** → **Connect to Git**
   - Repo auswählen
   - Build-Einstellungen:
     - **Framework preset:** Astro
     - **Build command:** `npm run build`
     - **Build output directory:** `dist`
   - Deploy starten

3. **Domain anbinden:** Custom domain `wanted-casting.de` hinzufügen, DNS-Anweisungen folgen. SSL automatisch.

4. **Castconnect-Subdomain (`online.agentur-wanted.de`) bleibt komplett unangetastet.**

## Castings pflegen — wie es funktioniert

### Für deinen Kumpel (nach Setup)

1. Auf `wanted-casting.de/admin` gehen
2. Mit GitHub-Account anmelden (einmaliger Klick "Authorize")
3. **Castings → New Casting** klicken
4. Formular ausfüllen (Titel, Drehzeitraum, Ort, Beschreibung, Bild, Bewerbungslink)
5. **Publish** klicken
6. Nach ca. 1 Minute live auf `wanted-casting.de/castings`

Im Hintergrund passiert: Das CMS schreibt eine Markdown-Datei in `src/content/castings/`, committed zu GitHub, Cloudflare Pages rebuildet die Site automatisch.

### Castings deaktivieren statt löschen

Im CMS gibt es einen Schalter "Aktiv anzeigen". Auf "aus" stellen → Casting verschwindet von der Website, bleibt aber im Archiv. Bei einem späteren ähnlichen Casting kann man das alte als Vorlage duplizieren.

## Struktur

```
src/
├── components/      Header, Footer
├── content/
│   ├── config.ts          Schema für Castings (Typsicherheit)
│   └── castings/          Markdown-Dateien — vom CMS verwaltet
├── i18n/            Übersetzungen DE/EN
├── layouts/         Haupt-Layout
├── pages/
│   ├── index.astro            /
│   ├── agentur.astro          /agentur
│   ├── castings/
│   │   ├── index.astro        /castings — Übersicht
│   │   └── [...slug].astro    /castings/<slug> — Detail
│   ├── anfrage.astro          /anfrage
│   ├── kontakt.astro          /kontakt
│   ├── hilfe.astro            /hilfe
│   ├── impressum.astro
│   └── agb-dsgvo.astro
└── styles/          Globales CSS
public/
├── admin/           Decap CMS Admin-Oberfläche
│   ├── index.html
│   └── config.yml
├── uploads/         Vom CMS hochgeladene Bilder (wird automatisch erstellt)
├── favicon.svg
└── robots.txt
cloudflare-oauth-worker/   Separater Worker für CMS-Login
├── index.js
├── wrangler.toml
└── README.md
```

## Anpassen

- **Farben/Schriften:** `tailwind.config.mjs`
- **Texte:** `src/i18n/ui.ts` (zentrale Übersetzungsdatei)
- **Globale Styles:** `src/styles/global.css`

## Fragen?

Frag Claude. ✌
