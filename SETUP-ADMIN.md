# Beheerpagina instellen (`/admin`)

Op `/admin` past de klant zélf de **contactgegevens, prijzen en reviews** aan, zonder code.
Elke aanpassing wordt opgeslagen in de bestanden in `public/content/` en zet de site
automatisch opnieuw online.

Inloggen gebeurt met een **GitHub-account**. Dat werkt op **elke host** (Cloudflare Pages,
Netlify, …), want er is geen dienst van de host zelf voor nodig.

Je hoeft dit **één keer** te doen, en het duurt ongeveer 10 minuten. Alles is gratis.

---

## Waarom die extra stap?

Een statische site mag zelf geen wachtwoorden afhandelen, dus er is één klein
tussenstukje nodig dat het inloggen bij GitHub afhandelt: een zogenaamde
**OAuth-helper**. Dat is een gratis mini-programmaatje dat op Cloudflare draait.

---

## Stap 1 — GitHub OAuth-app aanmaken

1. Ga naar GitHub → **Settings → Developer settings → OAuth Apps → New OAuth App**.
2. Vul in:
   - **Application name:** `Moda CMS`
   - **Homepage URL:** het adres van je site, bv. `https://moda.be`
   - **Authorization callback URL:** `https://JOUW-HELPER.workers.dev/callback`
     *(dat adres krijg je pas in stap 2 — vul hier voorlopig iets in en pas het daarna aan)*
3. Klik **Register application**.
4. Noteer de **Client ID** en klik op **Generate a new client secret** om ook een
   **Client Secret** te krijgen. Bewaar die twee even.

## Stap 2 — De gratis OAuth-helper plaatsen (Cloudflare)

1. Maak (of open) een gratis account op **cloudflare.com**.
2. Gebruik de kant-en-klare helper **`sveltia-cms-auth`** — die werkt ook voor Decap CMS:
   <https://github.com/sveltia/sveltia-cms-auth>
   Klik daar op de **Deploy**-knop in de README en volg de stappen.
3. Zet bij de Worker deze instellingen (*Settings → Variables*):
   - `GITHUB_CLIENT_ID` → de Client ID uit stap 1
   - `GITHUB_CLIENT_SECRET` → het Client Secret uit stap 1
   - `ALLOWED_DOMAINS` → je eigen domein, bv. `moda.be`
4. Je Worker krijgt nu een adres zoals `https://moda-cms-auth.jouwnaam.workers.dev`.
5. **Ga terug naar de GitHub OAuth-app uit stap 1** en zet dat adres, met `/callback`
   erachter, bij *Authorization callback URL*.

## Stap 3 — Het adres invullen in de config

Open **`public/admin/config.yml`**. Onderaan het `backend`-blok staat deze regel
uitgeschakeld:

```yaml
  # base_url: https://JOUW-HELPER.workers.dev
```

Haal het `#` weg en vul je eigen Worker-adres in:

```yaml
backend:
  name: github
  repo: jenteverpaelen/moda-transport
  branch: claude/moda-transport-website-xo8e61
  base_url: https://moda-cms-auth.jouwnaam.workers.dev
```

> **Let op de `branch`-regel.** Die moet de branch zijn waarvan je site live staat.
> Stap je later over naar `main`, pas hem dan hier aan.

Commit en push die wijziging. Klaar.

## Stap 4 — Testen

1. Ga naar `https://jouwsite.be/admin/`.
2. Klik op **Login with GitHub** en geef toestemming.
3. Je ziet nu de invulschermen voor Contactgegevens, Prijzen en Reviews.
4. Pas iets aan en klik **Publish**. Na ongeveer een minuut staat het online.

---

## Wie kan er inloggen?

Iedereen met **schrijfrechten op de GitHub-repo**. Wil je dat de klant zelf kan
aanpassen, nodig hem dan uit als *collaborator* op de repo
(GitHub → repo → **Settings → Collaborators**).

## Problemen oplossen

| Wat je ziet | Wat er aan de hand is |
| --- | --- |
| Knop *Login with GitHub* doet niets | `base_url` ontbreekt of staat verkeerd in `config.yml` |
| Foutmelding over `redirect_uri` | De *callback URL* in de GitHub-app klopt niet (moet eindigen op `/callback`) |
| Wel ingelogd, maar niets kan opgeslagen worden | Het account heeft geen schrijfrechten op de repo |
| Aanpassing niet zichtbaar op de site | De host is nog aan het bouwen; wacht een minuutje en ververs |
| Verkeerde branch | `branch:` in `config.yml` komt niet overeen met de branch die live staat |
