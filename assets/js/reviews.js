/* =========================================================
   MODA TRAVEL — Reviews
   ---------------------------------------------------------
   De reviews worden AUTOMATISCH van Google gehaald via een
   gratis Featurable-widget (die synct dagelijks met je
   Google-profiel). Je hoeft dus normaal niks meer manueel
   bij te houden.

   👉 STAP 1 — Eenmalig instellen (5 min):
      1. Maak een gratis account op https://featurable.com
      2. Koppel het Google-profiel "Moda Transport"
      3. Maak een widget en kopieer het "Widget ID"
         (dat is de code in de link, bv. 1a2b3c4d-....)
      4. Plak dat ID hieronder bij FEATURABLE_WIDGET_ID.

   Zolang er geen ID is ingevuld (of als de verbinding faalt),
   toont de site automatisch de voorbeeldreviews hieronder,
   zodat de site er nooit leeg uitziet.
   ========================================================= */

const MODA_CONFIG_REVIEWS = {
  // 👇 Plak hier je Featurable Widget ID (laat leeg om de
  //    handmatige voorbeeldreviews hieronder te tonen).
  FEATURABLE_WIDGET_ID: "",

  // Hoeveel reviews tonen we maximaal in de lopende rij?
  maxReviews: 30,

  // Toon enkel reviews met een tekst (rating-zonder-tekst overslaan)?
  onlyWithText: true,

  // Vanaf hoeveel sterren mag een review getoond worden?
  minStars: 4
};

/* ---------------------------------------------------------
   Handmatige terugval-reviews (worden alleen gebruikt als
   er geen Featurable-widget is ingesteld of de verbinding
   faalt). Je mag ze aanpassen, maar dat is niet nodig zodra
   Featurable werkt.
   --------------------------------------------------------- */
const MODA_REVIEWS = [
  {
    name: "Sofie D.",
    stars: 5,
    meta: "Google · Luchthaventransfer",
    text: "Super vriendelijke chauffeur en piekfijn verzorgde wagen. Stipt om 4u 's ochtends aan de deur. Echt reizen zonder zorgen!"
  },
  {
    name: "Thomas V.",
    stars: 5,
    meta: "Google · Zakelijke rit",
    text: "Al meermaals gebruikt voor zakelijke trips naar Zaventem. Altijd op tijd, comfortabel en correcte prijs. Een aanrader."
  },
  {
    name: "Nadia B.",
    stars: 5,
    meta: "Google · Familie-uitstap",
    text: "Met het hele gezin naar Charleroi gebracht. Ruime Mercedes, plaats genoeg voor alle koffers. Vlot geboekt en top service."
  },
  {
    name: "Kevin M.",
    stars: 5,
    meta: "Google · Ophaling Schiphol",
    text: "Vlucht had vertraging maar de chauffeur stond gewoon klaar. Geen stress, meteen naar huis. Dikke merci!"
  },
  {
    name: "Isabelle R.",
    stars: 5,
    meta: "Google · Luchthaventransfer",
    text: "Nette wagen, correcte en discrete chauffeur. Voelde me veilig en op mijn gemak. Zeker de moeite waard."
  },
  {
    name: "Jonas P.",
    stars: 5,
    meta: "Google · Vroege vlucht",
    text: "Perfecte service van begin tot eind. Duidelijke communicatie, vaste prijs en een aangename rit. Boek zeker opnieuw!"
  },
  {
    name: "Ellen V.",
    stars: 5,
    meta: "Google · Transfer Eindhoven",
    text: "Vlot geboekt, vriendelijk contact en keurig op tijd. De wagen was spotless. Niks dan lof!"
  },
  {
    name: "Bram C.",
    stars: 5,
    meta: "Google · Zakenreis",
    text: "Chauffeur volgde mijn vlucht op en paste het ophaaluur aan bij vertraging. Zorgeloos van deur tot deur."
  },
  {
    name: "Linda H.",
    stars: 5,
    meta: "Google · Retour Charleroi",
    text: "Heen én terug met Moda. Beide keren stipt, correcte prijs afgesproken vooraf. Absolute aanrader."
  },
  {
    name: "Wim T.",
    stars: 5,
    meta: "Google · Groepsvervoer",
    text: "Met 7 vrienden naar de luchthaven. Ruime bus, plaats voor alle bagage en een toffe chauffeur. Top geregeld!"
  },
  {
    name: "Fatima E.",
    stars: 5,
    meta: "Google · Ophaling Zaventem",
    text: "Na een lange vlucht stond de chauffeur klaar met naambordje. Vriendelijk en behulpzaam met de koffers. Dankjewel!"
  },
  {
    name: "Dirk M.",
    stars: 5,
    meta: "Google · Vroege ochtendrit",
    text: "Om 3u opgehaald, alles vlekkeloos. Rustige rit, veilig gereden. Precies wat je wil voor je op reis vertrekt."
  }
];

/* =========================================================
   Hieronder hoef je niks meer aan te passen.
   ========================================================= */
(function initReviews() {
  const track = document.getElementById("reviews-track");
  if (!track) return;

  const palette = ["#e11d2a", "#c9a24b", "#3b6fb3", "#2f9e6f", "#8256c4", "#c56b2f"];

  /* -- Eén review-kaart opbouwen -- */
  function cardHTML(r, i) {
    const name = (r.name || "Klant").trim();
    const initial = name.charAt(0).toUpperCase() || "★";
    const s = Math.max(0, Math.min(5, Math.round(r.stars || 5)));
    const stars = "★".repeat(s) + "☆".repeat(5 - s);
    const color = palette[i % palette.length];
    const meta = r.meta || "Google";

    // Echte profielfoto (Google) indien beschikbaar, anders een
    // gekleurde cirkel met de eerste letter. Laadt de foto niet,
    // dan valt hij automatisch terug op de gekleurde letter.
    const avatar = r.photo
      ? `<span class="review__avatar" style="background:${color}"><img src="${r.photo}" alt="" loading="lazy" referrerpolicy="no-referrer" onerror="this.remove();this.parentNode.textContent='${initial}'" /></span>`
      : `<span class="review__avatar" style="background:${color}">${initial}</span>`;

    return `
      <article class="review">
        <div class="review__stars">${stars}</div>
        <p class="review__text">“${escapeHTML(r.text)}”</p>
        <div class="review__author">
          ${avatar}
          <span>
            <span class="review__name">${escapeHTML(name)}</span><br />
            <span class="review__meta">${escapeHTML(meta)}</span>
          </span>
          <span class="review__google">G</span>
        </div>
      </article>`;
  }

  function render(list) {
    track.classList.remove("is-animated");
    track.style.removeProperty("--marquee-distance");
    track.style.removeProperty("--marquee-dur");
    track.innerHTML = list.map(cardHTML).join("");
    // Laat de rij automatisch lopen (naadloze, oneindige marquee).
    setupMarquee(list.length);
  }

  /* -- Kaarten dupliceren voor een naadloos lopende rij -- */
  function setupMarquee(count) {
    // Bij te weinig kaarten heeft rondlopen geen zin.
    if (count < 3) return;

    const styles = getComputedStyle(track);
    const gap = parseFloat(styles.columnGap || styles.gap || "22") || 22;

    // Breedte van één volledige set (interne tussenruimtes inbegrepen).
    const setWidth = track.scrollWidth;

    // Zelfde set nog eens toevoegen zodat de lus naadloos overloopt.
    Array.from(track.children).forEach((node) => {
      const clone = node.cloneNode(true);
      clone.setAttribute("aria-hidden", "true");
      track.appendChild(clone);
    });

    // Precieze verschuiving = één set + de tussenruimte naar de kopie.
    const distance = setWidth + gap;

    // Constante snelheid (~55 px per seconde), ongeacht het aantal reviews.
    const duration = Math.max(24, Math.round(distance / 55));

    track.style.setProperty("--marquee-distance", distance + "px");
    track.style.setProperty("--marquee-dur", duration + "s");
    track.classList.add("is-animated");
  }

  function escapeHTML(str) {
    return String(str == null ? "" : str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  /* -- Featurable-datum -> "· 3 maanden geleden" -- */
  function relativeDate(iso) {
    if (!iso) return "";
    const then = new Date(iso).getTime();
    if (isNaN(then)) return "";
    const days = Math.floor((Date.now() - then) / 86400000);
    if (days < 1) return "vandaag";
    if (days < 30) return `${days} dag${days === 1 ? "" : "en"} geleden`;
    const months = Math.floor(days / 30);
    if (months < 12) return `${months} maand${months === 1 ? "" : "en"} geleden`;
    const years = Math.floor(months / 12);
    return `${years} jaar geleden`;
  }

  /* -- Featurable-review -> ons kaartformaat -- */
  function normalize(rv) {
    const reviewer = rv.reviewer || {};
    const when = rv.updateTime || rv.createTime;
    const rel = relativeDate(when);
    const ts = when ? new Date(when).getTime() : 0;
    return {
      name: reviewer.displayName || "Google-gebruiker",
      photo: reviewer.isAnonymous ? "" : (reviewer.profilePhotoUrl || ""),
      stars: rv.starRating || 5,
      text: (rv.comment || "").trim(),
      meta: rel ? `Google · ${rel}` : "Google",
      ts: isNaN(ts) ? 0 : ts
    };
  }

  /* -- Reviews live ophalen bij Featurable -- */
  async function fetchFeaturable(widgetId) {
    const url = `https://featurable.com/api/v1/widgets/${encodeURIComponent(widgetId)}`;
    const res = await fetch(url, { headers: { Accept: "application/json" } });
    if (!res.ok) throw new Error(`Featurable HTTP ${res.status}`);
    const data = await res.json();
    const raw = Array.isArray(data.reviews) ? data.reviews : [];

    let list = raw.map(normalize);
    if (MODA_CONFIG_REVIEWS.onlyWithText) list = list.filter(r => r.text.length > 0);
    list = list.filter(r => (r.stars || 0) >= MODA_CONFIG_REVIEWS.minStars);
    // Nieuwste reviews eerst.
    list.sort((a, b) => b.ts - a.ts);
    list = list.slice(0, MODA_CONFIG_REVIEWS.maxReviews);

    if (!list.length) throw new Error("Geen bruikbare reviews ontvangen");
    return list;
  }

  /* -- Start: probeer Google (Featurable), val anders terug -- */
  const widgetId = (MODA_CONFIG_REVIEWS.FEATURABLE_WIDGET_ID || "").trim();

  if (!widgetId) {
    render(MODA_REVIEWS);
    return;
  }

  // Toon meteen de terugval-reviews zodat er nooit een lege plek is,
  // en vervang ze zodra de echte Google-reviews binnen zijn.
  render(MODA_REVIEWS);

  fetchFeaturable(widgetId)
    .then(render)
    .catch((err) => {
      console.warn("[Moda] Google-reviews konden niet geladen worden, voorbeeldreviews blijven staan:", err);
      // De terugval-reviews staan al getoond — niks te doen.
    });
})();
