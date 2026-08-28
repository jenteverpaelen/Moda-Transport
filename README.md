# Moda — Website

De volledige online aanwezigheid van **Moda** uit Heusden-Zolder, met één overzichtspagina
en drie onderdelen: luchthavenvervoer, transport en travel.

Gebouwd met **[Astro](https://astro.build)** en gehost op **Cloudflare**. De site wordt
vooraf omgezet naar gewone HTML-bestanden: er draait geen server en er is geen database.
Dus niets dat kan stukgaan, en gratis te hosten.

Het reisbureau beheert zijn reizen zelf via een beheerscherm op `/admin/`, dat gewoon
bestanden in deze repo schrijft. Zie **[CMS.md](CMS.md)**.

> *"Reizen zonder zorgen"*

---

## 🚀 Lokaal werken

Eén keer de onderdelen installeren:

```bash
npm install
```

Daarna de site starten terwijl je eraan werkt (past zich meteen aan bij elke wijziging):

```bash
npm run dev
```

Open het adres dat in je scherm verschijnt, meestal <http://localhost:4321>.

| Commando | Wat het doet |
| --- | --- |
| `npm run dev` | Start de site lokaal terwijl je eraan werkt |
| `npm run build` | Bouwt de kant-en-klare site naar `dist/` |
| `npm run preview` | Toont de gebouwde site zoals hij online komt |
| `npm run deploy` | Bouwt de site en zet hem meteen online bij Cloudflare |

> Dubbelklikken op een HTML-bestand werkt niet, en dat hoort zo:
> gebruik `npm run dev`.

## ✏️ Waar pas je wat aan?

De teksten en opmaak staan in de pagina's zelf. De gegevens die het vaakst wijzigen staan
apart, zodat je daarvoor niet in de HTML hoeft:

| Bestand of map | Wat erin staat | Ook via `/admin/` |
| --- | --- | --- |
| `src/content/reizen/*.md` | De reizen: één bestand per reis | ✅ |
| `public/content/travel-settings.json` | Contactgegevens van het reisbureau | ✅ |
| `public/content/settings.json` | Contactgegevens van vervoer en transport | ✅ |
| `public/content/prices.json` | Luchthavens, tarieven, supplementen en korting | — |
| `public/content/reviews.json` | Klantenreviews | — |

Pas je zo'n bestand aan en push je het, dan zet Cloudflare de site vanzelf opnieuw online.

> **Let op:** blijf bij geldige JSON — dubbele aanhalingstekens rond tekst, en geen komma
> achter het laatste item. Klopt een bestand niet, dan valt de site netjes terug op de
> waarden die in de code staan; er gaat dus niets stuk, maar je wijziging is niet zichtbaar.

## 📁 Structuur

```
Moda-Transport/
├── src/
│   ├── pages/                 ← de pagina's van de site
│   │   ├── index.astro        ← het overzicht (de hoofdpagina)
│   │   ├── luchthaven/        ← luchthavenvervoer
│   │   ├── transport/         ← transport & sneltransport
│   │   └── travel/            ← Moda Travel, met reizen/[slug].astro
│   ├── content/reizen/        ← 👈 de reizen, beheerd via /admin/
│   ├── content.config.mjs     ← welke velden een reis heeft
│   ├── assets/travel/reizen/  ← foto's bij de reizen (worden verkleind)
│   ├── layouts/               ← kop, menu en footer per onderdeel
│   └── lib/                   ← kleine hulpjes
├── public/                    ← wordt onaangeroerd meegekopieerd
│   ├── admin/                 ← 👈 het beheerscherm
│   ├── content/               ← 👈 de gegevens hierboven
│   ├── assets/css|js|images/  ← vormgeving, scripts en foto's
│   ├── _redirects             ← doorstuurregels
│   ├── robots.txt
│   └── sitemap.xml
├── astro.config.mjs           ← instellingen van de bouwstap
├── wrangler.jsonc             ← instellingen voor Cloudflare
├── CMS.md                     ← het beheerscherm instellen
├── .nvmrc                     ← Node-versie voor Cloudflare
└── dist/                      ← het bouwresultaat (staat niet in de repo)
```

De adressen op de site volgen de mappen in `src/pages/`:
`/` · `/luchthaven/` · `/transport/` · `/travel/`

Elke reis krijgt automatisch een eigen adres op basis van zijn bestandsnaam:
`src/content/reizen/bon-bini.md` wordt `/travel/reizen/bon-bini/`.

## ☁️ Online zetten (Cloudflare)

De site staat bij Cloudflare onder de naam **`moda-transport`**. Elke push naar de branch
zet hem vanzelf opnieuw online.

Cloudflare doet daarbij twee dingen:

1. **Bouwen** met `npm run build`, wat de kant-en-klare bestanden in `dist/` zet.
2. **Online zetten** met `npx wrangler deploy`, dat enkel die bestanden uploadt.

Wat waar staat, ligt vast in **`wrangler.jsonc`**:

```jsonc
{
  "name": "moda-transport",
  "compatibility_date": "2026-08-01",
  "assets": { "directory": "./dist" }
}
```

> Dit bestand moet blijven staan. Ontbreekt het, dan gaat Cloudflare het project zelf
> proberen in te stellen en bouwt het de site om naar een draaiende server. Dat werkt hier
> niet, en dan faalt de bouwstap.

Er staat bewust géén `main` in: zonder dat draait er geen server, alleen de gewone
bestanden. `public/_redirects` en de Node-versie in `.nvmrc` worden vanzelf opgepikt.

Wil je vanaf je eigen computer online zetten, dan kan dat met één commando:

```bash
npm run deploy
```

Een eigen domein koppel je in Cloudflare bij de site onder **Domains & Routes**.

## ✉️ Formulieren

De contact- en offerteformulieren versturen via **Web3Forms** (gratis, geen server nodig).
Lukt dat niet, dan opent de site automatisch het e-mailprogramma van de bezoeker als
terugvaloptie.

## 🧑‍💼 Reizen beheren

Het reisbureau logt in op **`/admin/`** met een GitHub-account en beheert daar de reizen en
de contactgegevens. Wat ze opslaan komt als bestand in deze repo terecht, waarna Cloudflare
de site opnieuw opbouwt.

Het instellen van dat scherm (één keer een inlogscriptje op Cloudflare en een GitHub-app)
staat stap voor stap in **[CMS.md](CMS.md)**.

> Nog niet ingesteld? Vul dan eerst `base_url` in bij `public/admin/config.yml`.

## 📸 Foto's vervangen

Foto's die bij een reis horen, gaan in `src/assets/travel/reizen/` — die worden bij het
bouwen automatisch verkleind en in de juiste verhouding bijgesneden. Het beheerscherm doet
dat vanzelf.

Andere foto's zet je in `public/assets/images/` en verwijs je aan met een pad dat begint met
`/assets/images/…`. Die blijven zoals ze zijn.

---

Gemaakt met oog voor snelheid, toegankelijkheid en eenvoud in onderhoud.
