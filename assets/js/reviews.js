/* =========================================================
   MODA TRAVEL — Reviews
   ---------------------------------------------------------
   Hieronder staan ECHTE Google-reviews van Moda Transport,
   handmatig ingevuld. Ze worden automatisch op datum
   gesorteerd (nieuwste eerst) en in een lopende rij getoond.

   👉 WIL JE DAT NIEUWE REVIEWS AUTOMATISCH BINNENKOMEN?
      Koppel dan éénmalig een gratis Featurable-widget, dan
      hoef je deze lijst nooit meer bij te werken:
      1. Maak een gratis account op https://featurable.com
      2. Koppel het Google-profiel "Moda Transport"
      3. Maak een widget en kopieer het "Widget ID"
         (de code in de link, bv. 1a2b3c4d-....)
      4. Plak dat ID hieronder bij FEATURABLE_WIDGET_ID.

   Zodra dat ID is ingevuld, worden de live Google-reviews
   getoond en dient de lijst hieronder enkel nog als terugval
   (voor als de verbinding met Featurable even uitvalt).
   ========================================================= */

const MODA_CONFIG_REVIEWS = {
  // 👇 Plak hier je Featurable Widget ID om reviews automatisch
  //    te laten binnenkomen (laat leeg om de lijst hieronder te tonen).
  FEATURABLE_WIDGET_ID: "",

  // Hoeveel reviews tonen we maximaal in de lopende rij?
  maxReviews: 30,

  // Toon enkel reviews met een tekst (rating-zonder-tekst overslaan)?
  onlyWithText: true,

  // Vanaf hoeveel sterren mag een review getoond worden?
  minStars: 4
};

/* ---------------------------------------------------------
   Echte Google-reviews (Moda Transport).
   - "date" is bij benadering (maand waarin de review verscheen);
     die bepaalt de volgorde en de "x maanden geleden"-tekst.
   - Nieuwe review toevoegen? Kopieer een blok en pas naam,
     stars, date (JJJJ-MM-DD) en text aan.
   --------------------------------------------------------- */
const MODA_REVIEWS = [
  {
    name: "Jalisa Pollaris",
    stars: 5,
    date: "2026-06-15",
    text: "Alles wat perfect gelopen! En superlieve chauffeur."
  },
  {
    name: "Jesse De Loore",
    stars: 5,
    date: "2026-06-15",
    text: "Uitstekende service. Alles snel en goed geregeld."
  },
  {
    name: "Larissa Cutillas-Carpe",
    stars: 5,
    date: "2026-03-15",
    text: "Perfect op tijd en geweldige service. We zouden het zo opnieuw doen!"
  },
  {
    name: "Erik",
    stars: 5,
    date: "2026-03-15",
    text: "Top ervaring, fijn op tijd, zowel brengen als afhalen."
  },
  {
    name: "Gilbert Buekenberghs",
    stars: 5,
    date: "2026-02-15",
    text: "Jente heeft ons rustig en vriendelijk allemaal naar huis gebracht. Nu we hem kennen wordt de samenwerking vanzelfsprekend."
  },
  {
    name: "Linda Vangeneugden",
    stars: 5,
    date: "2026-02-15",
    text: "Alles naar wens, zeer vriendelijk personeel, altijd op tijd, merciekes."
  },
  {
    name: "Nuria Martín",
    stars: 5,
    date: "2025-12-15",
    text: "Zeer tevreden over de afhaling en retour. Een vriendelijk en bekwaam team. Fijne feestdagen!"
  },
  {
    name: "Veerle Vanstiphout",
    stars: 5,
    date: "2025-12-15",
    text: "Heel tevreden van onze airportservice. Snelle en duidelijke communicatie via WhatsApp, stipt en vriendelijk! Bedankt!"
  },
  {
    name: "Celine Schepers",
    stars: 5,
    date: "2025-09-15",
    text: "We zijn in alle luxe en met heel goede service opgehaald en naar de luchthaven gebracht. Onze koffers werden ingeladen door de chauffeur zelf. Een leuke babbel onderweg gaf mijn vriend al minder stress om te vliegen. Bij de retour werden we opgewacht in de aankomsthal en werd mijn koffer zelfs aangenomen. De taxi was weer top in orde, luxueus en ruim. We kiezen zeker opnieuw voor deze taxiservice en raden ze iedereen aan!"
  },
  {
    name: "Greet Thys",
    stars: 5,
    date: "2025-09-15",
    text: "Heel vriendelijke chauffeur die goed op tijd was, perfect reed en vlot babbelde. De prijzen waren beter dan elders en het was een hele goede ervaring."
  },
  {
    name: "Rita Schroyen",
    stars: 5,
    date: "2025-09-15",
    text: "Jente, onze jonge (vrijwel) vaste chauffeur van Moda Travel voor luchthavenvervoer, altijd heel stipt, vriendelijk en behulpzaam."
  },
  {
    name: "Kapsalon Liesbeth",
    stars: 5,
    date: "2025-08-15",
    text: "Wij hebben al verschillende keren gebruik gemaakt van Moda Transport en zijn super content. Zijn altijd aanwezig op het afgesproken uur. Ze brengen je veilig van en naar de luchthaven voor een eerlijke prijs. Fam. Mulkers"
  },
  {
    name: "Jan Skoczylas",
    stars: 5,
    date: "2025-08-15",
    text: "Super taxi luchthavenvervoer, met zeer goede en vriendelijke chauffeurs. Ben al meerdere malen met jullie geweest en heb al gereserveerd voor september!"
  },
  {
    name: "Sarah Wellens",
    stars: 5,
    date: "2025-08-15",
    text: "Één zeer vriendelijke jonge man. Stipt op de afspraak. Een berichtje gekregen de dag voor de afreis in Mallorca met het uur en de plaats. Alles prima verlopen."
  },
  {
    name: "Timmy Sokolowski",
    stars: 5,
    date: "2025-07-15",
    text: "Voor de 1ste keer gebruik gemaakt van Moda Transport voor luchthavenvervoer en ik ben alleen maar positief. Alles online kunnen regelen: datum, uur van vertrek/ophaling thuis en uur van ophaling in Schiphol Amsterdam. Goede en vriendelijke chauffeur Sabine, dikke pluim! Mercedes busje gewoon top. Zeker voor herhaling vatbaar, nog eens dikke merci!"
  },
  {
    name: "Fabiola Arnesano",
    stars: 5,
    date: "2025-07-15",
    text: "Wij hebben een heel fijne ervaring gehad met Moda Transport. Wat echt heel tof was, is de stiptheid en vriendelijkheid. Zelfs mijn bejaarde moeder helpen instappen. We gaan zeker terug van hun diensten gebruik maken. Bedankt voor alles Moda Travel!"
  },
  {
    name: "esther janssens",
    stars: 5,
    date: "2025-07-15",
    text: "Fijne ervaring. Vlotte afhandeling. Comfortabele taxi en op tijd op het afgesproken uur. De dag voor vertrek laten ze extra weten op welk uur ze je ophalen. Jente de chauffeur is heel vriendelijk en behulpzaam. Fijne samenwerking waar we graag nog dikwijls gebruik van zullen maken."
  },
  {
    name: "yolanda vanlaer",
    stars: 5,
    date: "2025-07-15",
    text: "Wij hebben al verschillende keren gebruik gemaakt van taxivervoer Moda, niet duur en we zijn er heel tevreden. Ze zijn netjes op het afgesproken uur ter plaatse en brengen ons veilig naar huis terug."
  },
  {
    name: "Alex Vandingelen",
    stars: 5,
    date: "2025-07-15",
    text: "Zeer stipt en behulpzaam. Zelfs toen we door een noodgeval vroeger terug moesten komen, hebben ze hun uiterste best gedaan om ons te komen afhalen op de luchthaven. Dikke pluim!"
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

  /* -- Datum -> "3 maanden geleden" -- */
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

  function withMeta(name, stars, text, ts, photo) {
    const rel = relativeDate(ts ? new Date(ts).toISOString() : null);
    return {
      name: name || "Google-gebruiker",
      photo: photo || "",
      stars: stars || 5,
      text: (text || "").trim(),
      meta: rel ? `Google · ${rel}` : "Google",
      ts: isNaN(ts) ? 0 : (ts || 0)
    };
  }

  /* -- Gemeenschappelijke filter + sortering (nieuwste eerst) -- */
  function finalize(list) {
    let out = list;
    if (MODA_CONFIG_REVIEWS.onlyWithText) out = out.filter(r => r.text.length > 0);
    out = out.filter(r => (r.stars || 0) >= MODA_CONFIG_REVIEWS.minStars);
    out.sort((a, b) => b.ts - a.ts);
    return out.slice(0, MODA_CONFIG_REVIEWS.maxReviews);
  }

  /* -- Handmatige reviews -> kaartformaat -- */
  function prepManual(list) {
    return finalize(list.map(r => {
      const ts = r.date ? new Date(r.date).getTime() : 0;
      return withMeta(r.name, r.stars, r.text, isNaN(ts) ? 0 : ts, "");
    }));
  }

  /* -- Featurable-review -> kaartformaat -- */
  function normalize(rv) {
    const reviewer = rv.reviewer || {};
    const when = rv.updateTime || rv.createTime;
    const ts = when ? new Date(when).getTime() : 0;
    const photo = reviewer.isAnonymous ? "" : (reviewer.profilePhotoUrl || "");
    return withMeta(reviewer.displayName, rv.starRating, rv.comment, isNaN(ts) ? 0 : ts, photo);
  }

  /* -- Reviews live ophalen bij Featurable -- */
  async function fetchFeaturable(widgetId) {
    const url = `https://featurable.com/api/v1/widgets/${encodeURIComponent(widgetId)}`;
    const res = await fetch(url, { headers: { Accept: "application/json" } });
    if (!res.ok) throw new Error(`Featurable HTTP ${res.status}`);
    const data = await res.json();
    const raw = Array.isArray(data.reviews) ? data.reviews : [];
    const list = finalize(raw.map(normalize));
    if (!list.length) throw new Error("Geen bruikbare reviews ontvangen");
    return list;
  }

  /* -- Reviews uit content/reviews.json (aan te passen via /admin) -- */
  async function fetchManualJson() {
    const res = await fetch("content/reviews.json", { cache: "no-store" });
    if (!res.ok) throw new Error(`reviews.json HTTP ${res.status}`);
    const data = await res.json();
    const raw = Array.isArray(data.reviews) ? data.reviews : [];
    const list = prepManual(raw);
    if (!list.length) throw new Error("Geen bruikbare reviews in reviews.json");
    return list;
  }

  /* -- Start: toon meteen de ingebouwde reviews (nooit een lege sectie),
        vervang daarna door reviews.json (indien aanwezig) en tenslotte
        door de live Google-reviews van Featurable (indien ingesteld). -- */
  render(prepManual(MODA_REVIEWS));

  fetchManualJson()
    .then(render)
    .catch((err) => {
      console.warn("[Moda] content/reviews.json niet geladen, ingebouwde reviews blijven staan:", err);
    })
    .finally(() => {
      const widgetId = (MODA_CONFIG_REVIEWS.FEATURABLE_WIDGET_ID || "").trim();
      if (!widgetId) return;
      fetchFeaturable(widgetId)
        .then(render)
        .catch((err) => {
          console.warn("[Moda] Google-reviews konden niet geladen worden, handmatige reviews blijven staan:", err);
        });
    });
})();
