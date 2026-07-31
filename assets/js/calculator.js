/* =========================================================
   MODA TRAVEL — Prijscalculator + adres-autocomplete
   ---------------------------------------------------------
   👉 HIER PAS JE DE PRIJZEN & INSTELLINGEN AAN.
   Alle bedragen staan in het CONFIG-blok hieronder.
   ========================================================= */

const MODA_CALC = {
  // Vestiging (Beringersteenweg 14, 3550 Heusden-Zolder)
  company:  { lat: 51.0271799, lon: 5.2654197 },

  // Maximale afstand (in km) waarbinnen een vaste prijs geldt
  radiusKm: 20,

  // Basisprijs geldt voor dit aantal personen; elke extra persoon kost extra
  basePersons:     2,
  extraPersonFee:  5,   // euro per extra persoon

  // Luchthavens + vaste basisprijs (enkele rit, 2 personen)
  airports: [
    { value: "zaventem",   label: "Brussels Airport — Zaventem", price: 100 },
    { value: "luik",       label: "Luik (Liège)",                price: 100 },
    { value: "antwerpen",  label: "Antwerpen",                   price: 100 },
    { value: "eindhoven",  label: "Eindhoven",                   price: 100 },
    { value: "charleroi",  label: "Brussels South — Charleroi",  price: 160 },
    { value: "dusseldorf", label: "Düsseldorf",                  price: 160 },
    { value: "amsterdam",  label: "Amsterdam — Schiphol",        price: 240 },
  ],

  // Contactgegevens die in de resultaten getoond worden
  phone:       "+3200000000",
  phoneNice:   "+32 000 00 00 00",
};

/* =========================================================
   Vanaf hier hoef je niets meer aan te passen.
   ========================================================= */
(function () {
  const form    = document.getElementById("calcForm");
  const select  = document.getElementById("calc-airport");
  const address = document.getElementById("calc-address");
  const acList  = document.getElementById("calc-ac-list");
  const paxIn   = document.getElementById("calc-pax");
  const result  = document.getElementById("calcResult");
  if (!form || !select || !result) return;

  // Coördinaten van het gekozen adres (uit de suggestielijst).
  // Blijft null zolang de bezoeker zelf typt zonder te kiezen.
  let selectedCoords = null;

  /* -- Vul de luchthaven-dropdown uit de config -- */
  MODA_CALC.airports.forEach(a => {
    const opt = document.createElement("option");
    opt.value = a.value;
    opt.textContent = a.label;
    select.appendChild(opt);
  });

  /* -- Afstand tussen twee coördinaten (Haversine, in km) -- */
  function distanceKm(a, b) {
    const R = 6371, toRad = d => (d * Math.PI) / 180;
    const dLat = toRad(b.lat - a.lat);
    const dLon = toRad(b.lon - a.lon);
    const h = Math.sin(dLat / 2) ** 2 +
              Math.cos(toRad(a.lat)) * Math.cos(toRad(b.lat)) * Math.sin(dLon / 2) ** 2;
    return 2 * R * Math.asin(Math.sqrt(h));
  }

  /* ===================== ADRES-AUTOCOMPLETE ===================== */

  // Maak een leesbare regel uit een Photon-resultaat
  function formatSuggestion(p) {
    const street = p.name || p.street || "";
    const line1  = [street, p.housenumber].filter(Boolean).join(" ") || (p.city || "");
    const line2  = [p.postcode, p.city].filter(Boolean).join(" ");
    return { line1, line2, full: [line1, line2].filter(Boolean).join(", ") };
  }

  // Zoek adressen via Photon (gratis, gemaakt voor type-ahead, OpenStreetMap)
  async function searchAddresses(query) {
    const c = MODA_CALC.company;
    const url = "https://photon.komoot.io/api/?limit=6&lang=default" +
                "&lat=" + c.lat + "&lon=" + c.lon + "&location_bias_scale=0.5" +
                "&q=" + encodeURIComponent(query);
    const res = await fetch(url);
    if (!res.ok) throw new Error("network");
    const data = await res.json();
    return (data.features || [])
      .filter(f => (f.properties.countrycode || "").toUpperCase() === "BE")
      .map(f => {
        const s = formatSuggestion(f.properties);
        return { ...s, lat: f.geometry.coordinates[1], lon: f.geometry.coordinates[0] };
      })
      .filter(s => s.full)
      // dubbele labels eruit
      .filter((s, i, arr) => arr.findIndex(x => x.full === s.full) === i);
  }

  let activeIndex = -1;
  let suggestions = [];

  function closeList() {
    acList.hidden = true;
    acList.innerHTML = "";
    activeIndex = -1;
    suggestions = [];
    address.setAttribute("aria-expanded", "false");
  }

  function renderList(items) {
    suggestions = items;
    activeIndex = -1;
    if (!items.length) { closeList(); return; }
    acList.innerHTML = items.map((s, i) => `
      <li class="autocomplete__item" role="option" data-i="${i}">
        <span class="autocomplete__line1">${s.line1}</span>
        <span class="autocomplete__line2">${s.line2}</span>
      </li>`).join("");
    acList.hidden = false;
    address.setAttribute("aria-expanded", "true");
  }

  function pick(i) {
    const s = suggestions[i];
    if (!s) return;
    address.value = s.full;
    selectedCoords = { lat: s.lat, lon: s.lon };
    closeList();
  }

  function setActive(i) {
    const items = acList.querySelectorAll(".autocomplete__item");
    items.forEach(el => el.classList.remove("is-active"));
    if (i >= 0 && items[i]) { items[i].classList.add("is-active"); items[i].scrollIntoView({ block: "nearest" }); }
    activeIndex = i;
  }

  // Debounce: pas zoeken na een korte pauze in het typen
  let debounce;
  address.addEventListener("input", () => {
    selectedCoords = null;               // bezoeker typt → keuze vervalt
    const q = address.value.trim();
    clearTimeout(debounce);
    if (q.length < 3) { closeList(); return; }
    debounce = setTimeout(async () => {
      try {
        const items = await searchAddresses(q);
        // enkel tonen als de tekst nog dezelfde is
        if (address.value.trim() === q) renderList(items);
      } catch (e) { closeList(); }
    }, 280);
  });

  address.addEventListener("keydown", (e) => {
    if (acList.hidden) return;
    if (e.key === "ArrowDown") { e.preventDefault(); setActive(Math.min(activeIndex + 1, suggestions.length - 1)); }
    else if (e.key === "ArrowUp") { e.preventDefault(); setActive(Math.max(activeIndex - 1, 0)); }
    else if (e.key === "Enter") {
      if (activeIndex >= 0) { e.preventDefault(); pick(activeIndex); }
    }
    else if (e.key === "Escape") { closeList(); }
  });

  acList.addEventListener("mousedown", (e) => {
    const item = e.target.closest(".autocomplete__item");
    if (item) { e.preventDefault(); pick(parseInt(item.dataset.i, 10)); }
  });

  // Sluit de lijst bij klik buiten het veld
  document.addEventListener("click", (e) => {
    if (!e.target.closest(".autocomplete")) closeList();
  });

  /* -- Fallback-geocoder (Nominatim) als er niet uit de lijst gekozen is -- */
  async function geocode(query) {
    const url = "https://nominatim.openstreetmap.org/search?format=json&limit=1&countrycodes=be&q=" +
                encodeURIComponent(query);
    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), 8000);
    try {
      const res = await fetch(url, { signal: ctrl.signal });
      if (!res.ok) throw new Error("network");
      const data = await res.json();
      if (!data.length) return null;
      return { lat: parseFloat(data[0].lat), lon: parseFloat(data[0].lon) };
    } finally {
      clearTimeout(timer);
    }
  }

  /* ===================== RESULTAAT-WEERGAVE ===================== */
  const euro = n => "€" + n.toLocaleString("nl-BE");

  function showLoading() {
    result.innerHTML = `
      <div class="calc__state">
        <span class="calc__spinner" aria-hidden="true"></span>
        <p>Even je adres controleren…</p>
      </div>`;
  }

  function showOutOfZone(km) {
    result.innerHTML = `
      <div class="calc__state calc__state--warn">
        <span class="calc__emoji">📍</span>
        <h3>Net buiten ons vaste-prijs gebied</h3>
        <p>Je adres ligt op ± ${km.toFixed(0)} km van Heusden-Zolder (max. ${MODA_CALC.radiusKm} km voor een vaste prijs).
           Geen probleem — we maken graag een prijs op maat.</p>
        <div class="calc__actions">
          <a href="tel:${MODA_CALC.phone}" class="btn btn--primary">📞 Bel ${MODA_CALC.phoneNice}</a>
          <a href="#reserveer" class="btn btn--ghost">Aanvraag op maat</a>
        </div>
      </div>`;
  }

  function showError() {
    result.innerHTML = `
      <div class="calc__state calc__state--warn">
        <span class="calc__emoji">🤔</span>
        <h3>Adres niet gevonden</h3>
        <p>Kies je adres uit de suggestielijst terwijl je typt, of neem gerust even contact op.</p>
        <div class="calc__actions">
          <a href="tel:${MODA_CALC.phone}" class="btn btn--primary">📞 Bel ${MODA_CALC.phoneNice}</a>
        </div>
      </div>`;
  }

  function showPrice({ airport, price, base, extra, pax, addressText, km }) {
    const extraLine = extra > 0
      ? `<div class="calc__row"><span>Supplement (${pax - MODA_CALC.basePersons} extra pers.)</span><span>+ ${euro(extra)}</span></div>`
      : "";
    result.innerHTML = `
      <div class="calc__state calc__state--ok">
        <span class="calc__badge">Richtprijs · enkele rit</span>
        <div class="calc__price">${euro(price)}</div>
        <p class="calc__route">${addressText} → ${airport.label}</p>

        <div class="calc__breakdown">
          <div class="calc__row"><span>Basisprijs (t.e.m. ${MODA_CALC.basePersons} pers.)</span><span>${euro(base)}</span></div>
          ${extraLine}
          <div class="calc__row calc__row--total"><span>Totaal (${pax} pers.)</span><span>${euro(price)}</span></div>
        </div>

        <p class="calc__fineprint">Binnen ${MODA_CALC.radiusKm} km (± ${km.toFixed(0)} km). Richtprijs — je krijgt steeds een definitieve bevestiging.</p>
        <button type="button" class="btn btn--primary btn--lg btn--block" id="calcToBooking">Reserveer deze rit →</button>
      </div>`;

    const toBooking = document.getElementById("calcToBooking");
    toBooking.addEventListener("click", () => {
      const set = (id, val) => { const el = document.getElementById(id); if (el) el.value = val; };
      set("from", addressText);
      set("to", airport.label);
      set("pax", pax);
      document.getElementById("reserveer").scrollIntoView({ behavior: "smooth" });
    });
  }

  /* ===================== BEREKENING ===================== */
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    closeList();
    if (!form.checkValidity()) { form.reportValidity(); return; }

    const airport = MODA_CALC.airports.find(a => a.value === select.value);
    if (!airport) { form.reportValidity(); return; }

    const pax   = Math.min(Math.max(parseInt(paxIn.value, 10) || 1, 1), 8);
    const base  = airport.price;
    const extra = Math.max(0, pax - MODA_CALC.basePersons) * MODA_CALC.extraPersonFee;
    const price = base + extra;
    const addressText = address.value.trim();

    showLoading();

    try {
      // Voorkeur: coördinaten van het gekozen adres. Anders geocoden.
      const coords = selectedCoords || await geocode(addressText);
      if (!coords) { showError(); return; }

      const km = distanceKm(MODA_CALC.company, coords);
      if (km > MODA_CALC.radiusKm) { showOutOfZone(km); return; }

      showPrice({ airport, price, base, extra, pax, addressText, km });
    } catch (err) {
      showError();
    }
  });
})();
