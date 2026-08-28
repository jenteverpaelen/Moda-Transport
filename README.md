# moda-sneltransport.be — Luchthavenvervoer & Transport

De website van **Moda** uit Heusden-Zolder voor luchthavenvervoer en transport. Het
luchthavenvervoer staat op de startpagina, transport & sneltransport op `/transport/`.

Moda staat op drie adressen, elk met zijn eigen site en zijn eigen repo:

| Domein | Wat erop staat | Repo |
| --- | --- | --- |
| www.moda.be | Het overzicht van de drie onderdelen | `jenteverpaelen/moda.be` |
| **moda-sneltransport.be** | **Luchthavenvervoer en transport (deze repo)** | `jenteverpaelen/Moda-Transport` |
| modatravel.be | Het reisbureau | `jenteverpaelen/modatravel` |

Gebouwd met **[Astro](https://astro.build)** en gehost op **Cloudflare**. De site wordt
vooraf omgezet naar gewone HTML-bestanden: er draait geen server, er is geen database en er
is geen CMS. Dus niets dat kan stukgaan, en gratis te hosten.

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

| Bestand | Wat erin staat |
| --- | --- |
| `public/content/settings.json` | Telefoon, e-mail, WhatsApp-nummer en adres |
| `public/content/prices.json` | Luchthavens, tarieven, supplementen en korting |
| `public/content/reviews.json` | Klantenreviews |
| `src/lib/moda.mjs` | De adressen van de drie Moda-sites |

Pas je zo'n bestand aan en push je het, dan zet Cloudflare de site vanzelf opnieuw online.

> **Let op:** blijf bij geldige JSON — dubbele aanhalingstekens rond tekst, en geen komma
> achter het laatste item. Klopt een bestand niet, dan valt de site netjes terug op de
> waarden die in de code staan; er gaat dus niets stuk, maar je wijziging is niet zichtbaar.

## 📁 Structuur

```
Moda-Transport/
├── src/
│   ├── pages/                 ← de pagina's van de site
│   │   ├── index.astro        ← luchthavenvervoer (de startpagina)
│   │   ├── diensten.astro · vloot.astro · reviews.astro
│   │   ├── prijs.astro · reserveren.astro
│   │   └── transport/         ← transport & sneltransport
│   ├── layouts/               ← kop, menu en footer per onderdeel
│   └── lib/moda.mjs           ← 👈 de adressen van de drie sites
├── public/                    ← wordt onaangeroerd meegekopieerd
│   ├── content/               ← 👈 de gegevens hierboven
│   ├── assets/css|js|images/  ← vormgeving, scripts en foto's
│   ├── _redirects             ← doorstuurregels van de oude adressen
│   ├── robots.txt
│   └── sitemap.xml
├── astro.config.mjs           ← instellingen van de bouwstap
├── wrangler.jsonc             ← instellingen voor Cloudflare
├── .nvmrc                     ← Node-versie voor Cloudflare
└── dist/                      ← het bouwresultaat (staat niet in de repo)
```

De adressen op de site volgen de mappen in `src/pages/`:
`/` · `/diensten/` · `/vloot/` · `/reviews/` · `/prijs/` · `/reserveren/` · `/transport/`

## 🔗 Links naar de andere twee sites

De drie adressen staan op **één plek**: `src/lib/moda.mjs`. De knop *Reizen* in het menu en
de link *Alle Moda-diensten* onderaan halen hun adres daaruit. Wijst een domein nog nergens
heen, pas ze daar dan tijdelijk aan.

`public/_redirects` vangt de oude adressen op: `/luchthaven/…` gaat naar `/…`, en `/travel/…`
gaat door naar modatravel.be.

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

Het domein **moda-sneltransport.be** koppel je in Cloudflare bij de site onder
**Domains & Routes**.

## ✉️ Formulieren

De contact- en offerteformulieren versturen via **Web3Forms** (gratis, geen server nodig).
Lukt dat niet, dan opent de site automatisch het e-mailprogramma van de bezoeker als
terugvaloptie.

## 📸 Foto's vervangen

Zet je nieuwe foto in `public/assets/images/` en verwijs ernaar met een pad dat begint
met `/assets/images/…`.

---

Gemaakt met oog voor snelheid, toegankelijkheid en eenvoud in onderhoud.
