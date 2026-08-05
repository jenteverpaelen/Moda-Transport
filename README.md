# Moda — Website

De volledige online aanwezigheid van **Moda** uit Heusden-Zolder, met één overzichtspagina
en drie onderdelen: luchthavenvervoer, transport en travel.

Gebouwd met **[Astro](https://astro.build)**: de site wordt vooraf omgezet naar gewone
HTML-bestanden. Er draait dus geen server en er is geen database, wat betekent dat er
niets kan uitvallen en de site overal gratis of goedkoop te hosten is.

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

> Dubbelklikken op een HTML-bestand werkt niet meer, en dat hoort zo:
> gebruik voortaan `npm run dev`.

## 📁 Structuur

```
Moda-Transport/
├── src/pages/                 ← de pagina's van de site
│   ├── index.astro            ← het overzicht (de hoofdpagina)
│   ├── luchthaven/index.astro ← luchthavenvervoer
│   ├── transport/index.astro  ← transport & sneltransport
│   └── travel/index.astro     ← Moda Travel (reisbureau)
├── public/                    ← wordt onaangeroerd meegekopieerd
│   ├── content/               ← 👈 gegevens die de klant zelf aanpast (via /admin)
│   │   ├── settings.json      ← telefoon, e-mail, WhatsApp, adres
│   │   ├── prices.json        ← luchthavens & prijzen
│   │   ├── reviews.json       ← klantenreviews
│   │   └── travel-posts.json  ← reizen in de galerij op /travel
│   ├── admin/                 ← de beheerpagina (Decap CMS)
│   ├── assets/css|js|images/  ← vormgeving, scripts en foto's
│   ├── _redirects             ← doorstuurregels (werkt op beide hosts)
│   ├── robots.txt
│   └── sitemap.xml
├── astro.config.mjs           ← instellingen van de bouwstap
├── netlify.toml               ← bouwinstellingen voor Netlify
├── SETUP-ADMIN.md             ← 👈 hoe je de admin-login instelt
└── dist/                      ← het bouwresultaat (staat niet in de repo)
```

De adressen op de site volgen de mappen in `src/pages/`:
`/` · `/luchthaven/` · `/transport/` · `/travel/`

## ☁️ Online zetten

De gebouwde site is gewoon een map met bestanden, dus élke statische host werkt.
Op beide onderstaande platformen is dit gratis.

### Cloudflare Pages

1. Ga naar **Cloudflare → Workers & Pages → Create → Pages** en koppel deze GitHub-repo.
2. Vul in bij de bouwinstellingen:
   - **Framework preset:** `Astro`
   - **Build command:** `npm run build`
   - **Build output directory:** `dist`
3. Klik **Save and Deploy**. Elke push naar de branch zet de site vanzelf opnieuw online.

### Netlify

Niets in te stellen: `netlify.toml` staat al in de repo met het juiste bouwcommando
(`npm run build`) en de juiste map (`dist`). Koppel de repo en Netlify doet de rest.

## 🔧 De klant past zelf aan (beheerpagina)

Op **`/admin`** kan de klant met nette invulschermen zélf de **contactgegevens, prijzen
en reviews** aanpassen, zonder code. Elke aanpassing wordt opgeslagen in de bestanden in
`public/content/` en zet de site automatisch opnieuw online.

Inloggen gebeurt met een **GitHub-account**. Dat werkt op elke host, dus ook op
Cloudflare. Eén keer instellen, zie **[SETUP-ADMIN.md](SETUP-ADMIN.md)**.

## ✉️ Formulieren

De contact- en offerteformulieren versturen via **Web3Forms** (gratis, geen server nodig).
Lukt dat niet, dan opent de site automatisch het e-mailprogramma van de bezoeker als
terugvaloptie.

## 📸 Foto's vervangen

Zet je nieuwe foto in `public/assets/images/` en verwijs ernaar met een pad dat begint
met `/assets/images/…`. Via `/admin` kan de klant foto's ook zelf uploaden.

---

Gemaakt met oog voor snelheid, toegankelijkheid en eenvoud in onderhoud.
