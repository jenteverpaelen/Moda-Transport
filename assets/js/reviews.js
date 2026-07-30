/* =========================================================
   MODA TRAVEL — Reviews
   ---------------------------------------------------------
   👉 HIER PAS JE DE REVIEWS AAN.
   Kopieer de echte beoordelingen van je Google-pagina
   ("Moda Transport") en vul ze hieronder in. Voeg gerust
   nieuwe blokken toe of verwijder er.
   ========================================================= */

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
  }
];

/* -- Rendering (niet nodig om aan te passen) -- */
(function renderReviews() {
  const track = document.getElementById("reviews-track");
  if (!track) return;

  const palette = ["#e11d2a", "#c9a24b", "#3b6fb3", "#2f9e6f", "#8256c4", "#c56b2f"];

  track.innerHTML = MODA_REVIEWS.map((r, i) => {
    const initial = r.name.trim().charAt(0).toUpperCase();
    const stars = "★".repeat(r.stars) + "☆".repeat(5 - r.stars);
    const color = palette[i % palette.length];
    return `
      <article class="review reveal">
        <div class="review__stars">${stars}</div>
        <p class="review__text">“${r.text}”</p>
        <div class="review__author">
          <span class="review__avatar" style="background:${color}">${initial}</span>
          <span>
            <span class="review__name">${r.name}</span><br />
            <span class="review__meta">${r.meta}</span>
          </span>
          <span class="review__google">G</span>
        </div>
      </article>`;
  }).join("");
})();
