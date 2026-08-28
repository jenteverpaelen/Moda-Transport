# Reizen beheren — het beheerscherm instellen

Het reisbureau beheert de reizen zelf op **`/admin/`**. Daar voegen ze een reis toe, passen
ze er een aan of halen ze er een weg. Wat ze opslaan, gaat als gewoon bestand naar GitHub,
en Cloudflare zet de site daarna binnen een minuut of twee vanzelf opnieuw online.

Er komt geen database of server bij kijken. Het beheerscherm is één pagina die enkel in hun
browser draait.

---

## Wat er al klaarstaat

| Bestand | Wat het is |
| --- | --- |
| `public/admin/index.html` | De beheerpagina zelf |
| `public/admin/config.yml` | Welke schermen en velden ze te zien krijgen |
| `src/content/reizen/*.md` | De reizen, één bestand per reis |
| `src/assets/travel/reizen/` | De foto's die bij de reizen horen |

Eén ding moet nog ingevuld worden voor iemand kan inloggen: **`base_url`** in
`public/admin/config.yml`. Dat is de rest van deze uitleg.

---

## Waarom er een inlogscriptje nodig is

De site bestaat enkel uit vaste bestanden; er draait geen server. Iemand aanmelden bij GitHub
kan dus niet vanuit de pagina zelf: daar is één klein tussenstukje voor nodig dat de
aanmelding afhandelt. Dat is een gratis scriptje van de makers van het beheerscherm, dat je
één keer op Cloudflare zet.

Het staat volledig los van de website: het kan er dus niets aan stukmaken.

## Stap 1 — Het scriptje op Cloudflare zetten

1. Ga naar **<https://github.com/sveltia/sveltia-cms-auth>**.
2. Klik daar op de knop **Deploy to Cloudflare Workers** en log in met je Cloudflare-account.
3. Na het plaatsen krijg je een adres te zien, iets als
   `https://sveltia-cms-auth.jouwnaam.workers.dev`. **Noteer dat adres**, je hebt het nog
   twee keer nodig.

## Stap 2 — Een inlogapp aanmaken bij GitHub

1. Ga naar **GitHub → Settings → Developer settings → OAuth Apps → New OAuth App**.
2. Vul in:
   - **Application name:** `Moda beheerscherm`
   - **Homepage URL:** `https://moda.be`
   - **Authorization callback URL:** het adres uit stap 1, met `/callback` erachter,
     dus bijvoorbeeld `https://sveltia-cms-auth.jouwnaam.workers.dev/callback`
3. Klik **Register application**.
4. Je ziet nu een **Client ID**. Klik op **Generate a new client secret** en kopieer ook die
   (die krijg je maar één keer te zien).

## Stap 3 — De twee sleutels bij het scriptje zetten

Ga in Cloudflare naar je Worker → **Settings → Variables and Secrets** en voeg toe:

| Naam | Waarde |
| --- | --- |
| `GITHUB_CLIENT_ID` | de Client ID uit stap 2 |
| `GITHUB_CLIENT_SECRET` | de Client secret uit stap 2 (als **Secret**, niet als gewone variabele) |
| `ALLOWED_DOMAINS` | `moda.be` — zo kan enkel vanaf jullie eigen site ingelogd worden |

Bewaren, en de Worker opnieuw laten plaatsen als Cloudflare daarom vraagt.

## Stap 4 — Het adres invullen in de site

Open `public/admin/config.yml` en vervang:

```yaml
  base_url: VUL_HIER_JE_WORKER_URL_IN
```

door het adres uit stap 1:

```yaml
  base_url: https://sveltia-cms-auth.jouwnaam.workers.dev
```

Controleer meteen ook de regel eronder:

```yaml
  branch: claude/moda-transport-website-xo8e61
```

Daar moet de branch staan die **Cloudflare bouwt**. Draait de site later gewoon op `main`,
zet er dan `main`.

Pushen, en klaar.

## Stap 5 — De dames toegang geven

1. Ze maken elk een gratis GitHub-account aan op <https://github.com/signup>.
2. Jij nodigt ze uit: **repo → Settings → Collaborators → Add people**, met rol **Write**.
3. Ze aanvaarden de uitnodiging via de mail die ze krijgen.

Meer moeten ze nooit met GitHub doen. Vanaf dan gaan ze gewoon naar **moda.be/admin**,
klikken op *Sign In with GitHub*, en zien ze het beheerscherm.

---

## Hoe zij het gebruiken

**Een reis toevoegen**

1. Naar `moda.be/admin` en inloggen.
2. Links op **Reizen**, dan rechtsboven op **Nieuw**.
3. Titel, bestemming en minstens één foto invullen — de rest mag leeg blijven.
4. Op **Opslaan** klikken.

Een paar minuten later staat de reis als tegel op *Bestemmingen*, met een eigen pagina erbij.

**Een reis weghalen**

Openen en op **Verwijderen** klikken. Wil je hem enkel tijdelijk van de site halen, zet dan
**Op de website** uit: dan blijft alles bewaard en kan je hem later weer aanzetten.

**Foto's**

Gewoon slepen of kiezen. Ze worden bij het bouwen automatisch verkleind en in de juiste
verhouding bijgesneden, dus grote foto's van de computer zijn geen probleem.

**Volgorde**

De reis met **Uitgelicht** aan krijgt de grote tegel vooraan. Daarna bepaalt het
**Volgnummer** de volgorde (laag getal eerst). Vul je dat niet in, dan sorteert hij op
vertrekdatum.

---

## Goed om te weten

**Ergens anders inloggen dan via de knop.** Werkt de aanmelding even niet, dan kan je met
*Sign In Using Access Token* binnen met een persoonlijke GitHub-token. Handig als noodoplossing.

**Lokaal uitproberen.** Draai `npm run dev` en ga naar `http://localhost:4321/admin/index.html`.
Kies daar **Work with Local Repository** en wijs je eigen map aan: dan bewerk je de bestanden
op je computer, zonder GitHub.

**Het beheerscherm bijwerken.** In `public/admin/index.html` staat het versienummer vast:

```html
<script src="https://unpkg.com/@sveltia/cms@^0.201.0/dist/sveltia-cms.js"></script>
```

Dat is bewust: zo verandert het scherm niet vanzelf. Wil je naar een nieuwere versie, pas dan
het nummer aan, `npm run build`, en kijk `/admin/` even na voor je pusht.

**Velden bijwerken.** De velden staan op twee plaatsen: `public/admin/config.yml` (wat zij
zien) en `src/content.config.mjs` (wat de site verwacht). Verander je er één, verander dan
allebei.
