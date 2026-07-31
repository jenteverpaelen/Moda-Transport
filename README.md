# Moda Travel — Website

Moderne, mobielvriendelijke one-page website voor **Moda Travel**, gespecialiseerd in
luchthavenvervoer. Gebouwd in pure HTML, CSS en JavaScript — **geen build-stap nodig**,
dus supersimpel te hosten en aan te passen.

> *"Reizen zonder zorgen"*

---

## 🚀 Bekijken

Dubbelklik op `index.html` om de site lokaal in je browser te openen.
Wil je hem live zetten? Zie **Online zetten** hieronder.

## 📁 Structuur

```
Moda-Transport/
├── index.html              ← alle tekst & secties van de site
├── content/                ← 👈 gegevens die de klant zelf aanpast (via /admin)
│   ├── settings.json       ← telefoon, e-mail, WhatsApp, adres
│   ├── prices.json         ← luchthavens & prijzen
│   └── reviews.json        ← klantenreviews
├── admin/                  ← de beheerpagina (Decap CMS)
├── assets/
│   ├── css/style.css       ← vormgeving, kleuren & animaties
│   ├── js/main.js          ← menu, animaties, formulier
│   ├── js/content.js       ← laadt de gegevens uit content/ in de site
│   ├── js/reviews.js       ← reviews (leest content/reviews.json)
│   ├── js/calculator.js    ← prijscalculator (leest content/prices.json)
│   └── images/             ← logo + foto's
├── SETUP-ADMIN.md          ← 👈 hoe je de admin-login instelt
└── README.md
```

## 🔧 De klant past zelf aan (beheerpagina)

Er is een **beheerpagina** op `/admin` waar de klant met nette invulschermen
zélf **contactgegevens, prijzen en reviews** kan aanpassen — zonder code. Klikt
de klant op *Publiceren*, dan gaat de wijziging via GitHub automatisch live op
Netlify.

De schermen staan klaar; je stelt eenmalig de login in. **Volledige uitleg staat
in [`SETUP-ADMIN.md`](SETUP-ADMIN.md).**

> Wil je liever zélf beheerder blijven? Dan hoef je de admin-login niet in te
> stellen — je past de bestanden in `content/` gewoon rechtstreeks aan. De site
> valt altijd terug op vaste waarden, dus er breekt niets.

## ✏️ Zelf aanpassen (het belangrijkste)

Alles is bewust simpel gehouden. De meest voorkomende aanpassingen:

| Wat wil je aanpassen?              | Waar?                                   |
|------------------------------------|-----------------------------------------|
| **Telefoon, e-mail, WhatsApp, adres** | via `/admin` óf `content/settings.json` |
| **Prijzen / luchthavens / km-straal** | via `/admin` óf `content/prices.json`   |
| **Reviews (handmatig)**            | via `/admin` óf `content/reviews.json`  |
| Google-reviews (automatisch)       | `assets/js/reviews.js` → vul `FEATURABLE_WIDGET_ID` in |
| Teksten, titels, diensten          | `index.html`                            |
| Kleuren                            | `assets/css/style.css` bovenaan bij `:root` |
| Foto's                             | vervang bestanden in `assets/images/` (of via `/admin`) |

### ⚠️ Nog invullen vóór livegang

Contactgegevens zijn ingevuld: telefoon **011 24 30 03**, e-mail
**info@moda-sneltransport.be** en adres **Beringersteenweg 14, 3550 Heusden-Zolder**
(in `index.html` en in `assets/js/calculator.js` / `assets/js/main.js`).

Nog te doen vóór livegang:

- **WhatsApp-nummer** → er is een WhatsApp-knop in de hero én een zwevende knop linksonder.
  Zoek in `index.html` naar `32000000000` (staat 2×) en vervang door je echte gsm-nummer
  in internationaal formaat zonder `+` (bv. `32470123456`). Zolang dat placeholder-nummer
  erin staat, opent WhatsApp maar zonder geldig gesprek.
- **Google-reviews link** → zoek `google.com/search?q=Moda+Transport` en zet de link naar je
  echte Google Business-pagina
- **Google-reviews** → er staan al **echte reviews** ingevuld in `assets/js/reviews.js`. Wil je
  dat nieuwe reviews vanzelf binnenkomen? Koppel dan Featurable (zie hieronder).

## 💶 Prijscalculator

De bezoeker kiest een luchthaven, vult een ophaaladres in en het aantal personen.
Alle prijzen en instellingen staan bovenaan in `assets/js/calculator.js`:

- **Basisprijs per luchthaven** (geldt t.e.m. 2 personen)
- **Supplement per extra persoon** (standaard +€5)
- **Km-straal** waarbinnen een vaste prijs geldt (standaard 20 km rond Heusden-Zolder)

Terwijl de bezoeker typt, verschijnen echte adressuggesties (straat, postcode, gemeente)
via **Photon** — gratis en gebaseerd op OpenStreetMap. Klikt de bezoeker een adres aan,
dan zijn de coördinaten meteen gekend. Het adres wordt getoetst aan de km-straal; ligt het
verder, dan krijgt de bezoeker géén vaste prijs maar een uitnodiging om een prijs op maat
aan te vragen. Verhuist het bedrijf? Pas dan de `company`-coördinaten in `calculator.js` aan.

## ⭐ Google-reviews

Er staan al **echte Google-reviews** van Moda Transport ingevuld in `assets/js/reviews.js`.
Ze worden automatisch op datum gesorteerd (nieuwste eerst) en in een lopende rij getoond.
Een nieuwe review met de hand toevoegen? Kopieer één blok en pas `name`, `stars`,
`date` (JJJJ-MM-DD) en `text` aan.

**Liever helemaal automatisch?** Dan hoef je nooit meer iets bij te werken. Dat loopt via een
gratis dienst genaamd **Featurable**, die dagelijks met je Google-profiel synct. Zo stel je
het één keer in:

1. Maak een gratis account op **featurable.com**.
2. Koppel het Google-profiel **"Moda Transport"**.
3. Maak een widget aan en kopieer het **Widget ID** (de code in de link, bv. `1a2b3c4d-…`).
4. Open `assets/js/reviews.js` en plak dat ID bij `FEATURABLE_WIDGET_ID: ""`.

Dat is alles. Nieuwe Google-reviews verschijnen vanaf dan vanzelf op de site (met profielfoto,
sterren en datum). Bovenaan `reviews.js` kun je nog instellen hoeveel reviews je toont
(`maxReviews`), vanaf hoeveel sterren (`minStars`) en of je enkel reviews mét tekst toont
(`onlyWithText`).

> Zolang er nog geen Widget ID is ingevuld — of als de verbinding met Featurable even
> uitvalt — toont de site automatisch de reviews die in `reviews.js` staan, zodat de
> reviewsectie er nooit leeg uitziet.

## 📨 Boekingsformulier

Standaard opent het formulier de e-mailclient van de bezoeker met een vooraf ingevulde
aanvraag naar jouw adres. Wil je dat aanvragen **automatisch** in je mailbox belanden
(zonder dat de klant zelf moet versturen)? Koppel dan een gratis formulierdienst:

- **Formspree** (formspree.io) — plak je Formspree-URL in de `<form>` en verwijder de
  `mailto`-code in `main.js`, of
- **Netlify Forms** — voeg `netlify` toe aan de `<form>` tag als je op Netlify host.

## 🌐 Online zetten (gratis)

Kies één van deze — allemaal gratis en zonder server:

1. **Netlify** (aanrader): ga naar netlify.com → sleep de projectmap in het venster → klaar.
2. **Vercel**: importeer de repository op vercel.com.
3. **GitHub Pages**: repo-instellingen → Pages → branch selecteren.

Daarna kun je een eigen domein (bv. `modatravel.be`) koppelen.

## 🎨 Kenmerken

- 100% mobielvriendelijk (mobile-first)
- Licht/donker-knop rechtsboven (de site opent altijd in dark mode)
- Vloeiende scroll-animaties, hero met Ken Burns-effect, tellers, parallax
- Toegankelijk (respecteert `prefers-reduced-motion`)
- Snel: geen frameworks, geen build-stap
