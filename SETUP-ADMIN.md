# 🔧 Admin instellen — zo kan de klant zelf aanpassen

De site heeft nu een **beheerpagina** op `/admin` (dus bv. `https://jouwsite.be/admin`).
Daar kan de klant met nette invulschermen aanpassen — **zonder code**:

- **Contactgegevens** — telefoon, e-mail, WhatsApp-nummer, adres
- **Prijzen** — basisprijs per luchthaven, supplementen, km-straal
- **Reviews** — reviews toevoegen/aanpassen/verwijderen

Klikt de klant op **Publiceren**, dan wordt de wijziging automatisch opgeslagen op
GitHub en zet Netlify de site binnen ~1 minuut opnieuw live. De klant merkt van
GitHub of Netlify niets.

> De schermen staan er al klaar. Je moet nog **één keer de login instellen**.
> Kies hieronder **Optie A** (eenvoudigst) of **Optie B** (toekomstvast).

---

## Vooraf: 1 regel controleren

Open `admin/config.yml` en kijk bij `branch:`. Zet die op de branch waarvan je
site **live** staat op Netlify (bij de meeste sites is dat `main`). Staat je site
live vanaf een andere branch, zet die naam daar.

---

## Optie A — Inloggen via Netlify (eenvoudigst, ~5 min)

Werkt als je site op **Netlify** staat en je account **Identity** aanbiedt.

1. **Site op Netlify** — staat de site er nog niet? Sleep de projectmap op
   netlify.com of koppel de GitHub-repo.
2. In Netlify: **Site configuration → Identity → Enable Identity**.
3. Nog steeds bij Identity: **Services → Git Gateway → Enable Git Gateway**.
4. Bij **Identity → Registration** zet je **"Invite only"** (anders kan iedereen
   zich registreren).
5. Klik **Invite users** en nodig het e-mailadres van de klant uit (en dat van
   jezelf). Zij krijgen een mailtje om een wachtwoord te kiezen.
6. Voeg in `index.html` vlak vóór `</head>` deze regel toe zodat de
   uitnodigingslink netjes werkt:

   ```html
   <script src="https://identity.netlify.com/v1/netlify-identity-widget.js"></script>
   ```

7. In `admin/config.yml` moet het `backend`-blok op **Optie A** staan
   (`name: git-gateway`) — dat is standaard al zo.

Klaar. De klant surft naar `jouwsite.be/admin`, logt in met e-mail + wachtwoord,
en kan aanpassen.

> ⚠️ Netlify is Identity aan het uitfaseren. Zie je de knop "Enable Identity"
> niet meer in je account? Gebruik dan **Optie B**.

---

## Optie B — Inloggen met GitHub (toekomstvast)

Hiervoor log je in met een GitHub-account. Je hebt één klein gratis
tussenstukje nodig (een "OAuth-helper") omdat een statische site zelf geen
wachtwoorden mag afhandelen. Dit duurt ~10 min en gebruikt Cloudflare (gratis).

1. **GitHub OAuth-app aanmaken**
   - Ga naar GitHub → **Settings → Developer settings → OAuth Apps → New OAuth App**.
   - *Application name:* `Moda CMS`
   - *Homepage URL:* `https://jouwsite.be`
   - *Authorization callback URL:* `https://JOUW-HELPER.workers.dev/callback`
     (die URL krijg je in stap 2 — je kan hem daarna hier invullen)
   - Klik **Register**, en noteer de **Client ID** en genereer een **Client Secret**.

2. **Gratis OAuth-helper plaatsen (Cloudflare Workers)**
   - Maak een gratis account op **cloudflare.com**.
   - Gebruik de kant-en-klare helper **`sveltia-cms-auth`**
     (werkt ook voor Decap): volg de "Deploy"-knop in de README op
     `https://github.com/sveltia/sveltia-cms-auth`.
   - Vul bij de Worker de instellingen in:
     `GITHUB_CLIENT_ID`, `GITHUB_CLIENT_SECRET` (uit stap 1) en
     `ALLOWED_DOMAINS` = `jouwsite.be`.
   - Je Worker krijgt een adres zoals `https://moda-cms-auth.workers.dev`.
     Zet dat (met `/callback`) terug in de GitHub OAuth-app uit stap 1.

3. **Config aanzetten** — open `admin/config.yml` en zet het `backend`-blok op
   **Optie B**: haal de 3 regels van Optie A weg en zet deze aan:

   ```yaml
   backend:
     name: github
     repo: jenteverpaelen/moda-transport
     branch: main
     base_url: https://moda-cms-auth.workers.dev
   ```

Klaar. De klant surft naar `jouwsite.be/admin`, klikt **Login with GitHub** en
kan aanpassen. (De klant heeft dan wel een GitHub-account nodig, of jij maakt er
één voor hen aan.)

---

## Even lokaal uitproberen (optioneel)

Wil je de schermen zien zonder inloggen, op je eigen computer?

1. Installeer Node.js (nodejs.org).
2. In de projectmap: `npx decap-server` laten draaien.
3. Open de site met een lokale server, bv. `npx serve` en ga naar
   `http://localhost:3000/admin`.

Omdat `local_backend: true` in de config staat, praat de admin dan met je lokale
map — handig om te oefenen. Op de echte site (Netlify) gebruikt hij automatisch
de login uit Optie A of B.

---

## Wat als er iets misgaat?

De site is zo gebouwd dat hij **nooit stukgaat** door de admin: als een
databestand ontbreekt of niet laadt, toont de site gewoon de vaste waarden die
in de code staan. De klant kan dus niets "kapotklikken" aan de layout — enkel de
tekst/prijzen/reviews in de daarvoor bestemde velden.
