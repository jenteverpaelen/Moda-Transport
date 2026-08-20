# Moda — Website

De volledige online aanwezigheid van **Moda** uit Heusden-Zolder, met één overzichtspagina
en drie onderdelen: luchthavenvervoer, transport en travel.

Gebouwd met **[Astro](https://astro.build)** en gehost op **Cloudflare Pages**. De site
wordt vooraf omgezet naar gewone HTML-bestanden: er draait geen server, er is geen
database en er is geen CMS. Dus niets dat kan stukgaan, en gratis te hosten.

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

> Dubbelklikken op een HTML-bestand werkt niet, en dat hoort zo:
> gebruik `npm run dev`.

## ✏️ Waar pas je wat aan?

De teksten en opmaak staan in de pagina's zelf. De gegevens die het vaakst wijzigen staan
apart in **`public/content/`**, zodat je daarvoor niet in de HTML hoeft:

| Bestand | Wat erin staat |
| --- | --- |
| `public/content/settings.json` | Telefoon, e-mail, WhatsApp-nummer en adres |
| `public/content/prices.json` | Luchthavens, tarieven, supplementen en korting |
| `public/content/reviews.json` | Klantenreviews |
| `public/content/travel-posts.json` | De reizen in de galerij op `/travel` |

Pas je zo'n bestand aan en push je het, dan zet Cloudflare de site vanzelf opnieuw online.

> **Let op:** blijf bij geldige JSON — dubbele aanhalingstekens rond tekst, en geen komma
> achter het laatste item. Klopt een bestand niet, dan valt de site netjes terug op de
> waarden die in de code staan; er gaat dus niets stuk, maar je wijziging is niet zichtbaar.

## 📁 Structuur

```
Moda-Transport/
├── src/pages/                 ← de pagina's van de site
│   ├── index.astro            ← het overzicht (de hoofdpagina)
│   ├── luchthaven/index.astro ← luchthavenvervoer
│   ├── transport/index.astro  ← transport & sneltransport
│   └── travel/index.astro     ← Moda Travel (reisbureau)
├── public/                    ← wordt onaangeroerd meegekopieerd
│   ├── content/               ← 👈 de gegevens hierboven
│   ├── assets/css|js|images/  ← vormgeving, scripts en foto's
│   ├── _redirects             ← doorstuurregels
│   ├── robots.txt
│   └── sitemap.xml
├── astro.config.mjs           ← instellingen van de bouwstap
├── .nvmrc                     ← Node-versie voor Cloudflare
└── dist/                      ← het bouwresultaat (staat niet in de repo)
```

De adressen op de site volgen de mappen in `src/pages/`:
`/` · `/luchthaven/` · `/transport/` · `/travel/`

## ☁️ Online zetten (Cloudflare Pages)

1. Ga naar **Cloudflare → Workers & Pages → Create → Pages** en koppel deze GitHub-repo.
2. Vul in bij de bouwinstellingen:
   - **Framework preset:** `Astro`
   - **Build command:** `npm run build`
   - **Build output directory:** `dist`
3. Klik **Save and Deploy**.

Elke push naar de branch zet de site daarna vanzelf opnieuw online. De juiste Node-versie
staat al vast in `.nvmrc`, en `public/_redirects` wordt door Cloudflare automatisch
opgepikt, dus er is verder niets in te stellen.

Een eigen domein koppel je bij de Pages-site onder **Custom domains**.

## ✉️ Formulieren

De contact- en offerteformulieren versturen via **Web3Forms** (gratis, geen server nodig).
Lukt dat niet, dan opent de site automatisch het e-mailprogramma van de bezoeker als
terugvaloptie.

## 📸 Foto's vervangen

Zet je nieuwe foto in `public/assets/images/` en verwijs ernaar met een pad dat begint
met `/assets/images/…`.

---

Gemaakt met oog voor snelheid, toegankelijkheid en eenvoud in onderhoud.
