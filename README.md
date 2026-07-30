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
├── assets/
│   ├── css/style.css       ← vormgeving, kleuren & animaties
│   ├── js/main.js          ← menu, animaties, formulier
│   ├── js/reviews.js       ← 👈 HIER pas je de reviews aan
│   └── images/             ← logo + foto's
└── README.md
```

## ✏️ Zelf aanpassen (het belangrijkste)

Alles is bewust simpel gehouden. De meest voorkomende aanpassingen:

| Wat wil je aanpassen?              | Waar?                                   |
|------------------------------------|-----------------------------------------|
| Teksten, titels, diensten          | `index.html`                            |
| **Reviews toevoegen/wijzigen**     | `assets/js/reviews.js` (bovenaan)       |
| Telefoon, e-mail, WhatsApp         | zoek in `index.html` naar de placeholders (zie hieronder) |
| Kleuren                            | `assets/css/style.css` bovenaan bij `:root` |
| Foto's                             | vervang bestanden in `assets/images/`   |

### ⚠️ Nog invullen vóór livegang

Op deze plaatsen staan **voorbeeldgegevens** die je moet vervangen door de echte:

- **Telefoonnummer** → zoek `+3200000000` en `+32 000 00 00 00` (in `index.html`)
- **E-mailadres** → zoek `info@modatravel.be` (in `index.html` én `assets/js/main.js`)
- **WhatsApp** → zoek `wa.me/3200000000`
- **Google-reviews link** → zoek `google.com/search?q=Moda+Transport` en zet de link naar je
  echte Google Business-pagina
- **Reviews zelf** → vul de echte beoordelingen in via `assets/js/reviews.js`

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
- Vloeiende scroll-animaties, hero met Ken Burns-effect, tellers, parallax
- Toegankelijk (respecteert `prefers-reduced-motion`)
- Snel: geen frameworks, geen build-stap
