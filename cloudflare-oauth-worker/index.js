/**
 * Cloudflare Worker: GitHub OAuth Proxy für Decap CMS
 *
 * Dieser Worker erlaubt es Decap CMS, sich gegen GitHub zu authentifizieren,
 * damit das CMS Commits ins Repository pushen kann.
 *
 * Setup (siehe README im Hauptprojekt):
 *  1. GitHub OAuth App registrieren: https://github.com/settings/developers
 *     - Authorization callback URL: https://<dein-worker>.workers.dev/callback
 *  2. Worker deployen: `npx wrangler deploy`
 *  3. Secrets setzen:
 *     - npx wrangler secret put GITHUB_CLIENT_ID
 *     - npx wrangler secret put GITHUB_CLIENT_SECRET
 *  4. In public/admin/config.yml die Worker-URL als base_url eintragen
 */

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    // Schritt 1: Decap CMS leitet Nutzer hierher -> Weiterleitung zu GitHub
    if (url.pathname === '/auth') {
      const scope = url.searchParams.get('scope') || 'repo,user';
      const state = crypto.randomUUID();
      const githubUrl = new URL('https://github.com/login/oauth/authorize');
      githubUrl.searchParams.set('client_id', env.GITHUB_CLIENT_ID);
      githubUrl.searchParams.set('redirect_uri', `${url.origin}/callback`);
      githubUrl.searchParams.set('scope', scope);
      githubUrl.searchParams.set('state', state);
      return Response.redirect(githubUrl.toString(), 302);
    }

    // Schritt 2: GitHub leitet hierher zurück mit ?code=... -> Token holen, an Decap übergeben
    if (url.pathname === '/callback') {
      const code = url.searchParams.get('code');
      if (!code) return new Response('Missing code', { status: 400 });

      const tokenRes = await fetch('https://github.com/login/oauth/access_token', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'User-Agent': 'wanted-casting-cms',
        },
        body: JSON.stringify({
          client_id: env.GITHUB_CLIENT_ID,
          client_secret: env.GITHUB_CLIENT_SECRET,
          code,
        }),
      });

      const tokenData = await tokenRes.json();
      const token = tokenData.access_token;
      const error = tokenData.error;

      // Antwort-HTML, das das Decap-CMS-Popup-Fenster erkennt und schließt
      const status = error ? 'error' : 'success';
      const payload = error
        ? JSON.stringify({ error })
        : JSON.stringify({ token, provider: 'github' });

      const html = `<!doctype html>
<html><body>
<script>
(function() {
  function send(msg) {
    window.opener && window.opener.postMessage('authorization:github:${status}:' + ${JSON.stringify(payload)}, '*');
  }
  window.addEventListener('message', function(e) {
    if (e.data === 'authorizing:github') send();
  }, false);
  send();
})();
</script>
<p>Erfolgreich angemeldet. Du kannst dieses Fenster jetzt schließen.</p>
</body></html>`;

      return new Response(html, {
        headers: { 'Content-Type': 'text/html; charset=utf-8' },
      });
    }

    return new Response('OK — Decap CMS OAuth proxy. Endpoints: /auth, /callback', {
      headers: { 'Content-Type': 'text/plain' },
    });
  },
};
