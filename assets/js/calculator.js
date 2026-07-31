/* =========================================================
   MODA TRAVEL — Prijscalculator
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
  const paxIn   = document.getElementById("calc-pax");
  const result  = document.getElementById("calcResult");
  if (!form || !select || !result) return;

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

  /* -- Adres omzetten naar coördinaten via OpenStreetMap (gratis) -- */
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

  /* -- Render-helpers -- */
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
        <p>We konden dit adres niet automatisch controleren. Controleer de spelling
           (straat, nummer, postcode, gemeente) of neem gerust even contact op.</p>
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

    // Prefill het reserveerformulier met deze rit
    const toBooking = document.getElementById("calcToBooking");
    toBooking.addEventListener("click", () => {
      const set = (id, val) => { const el = document.getElementById(id); if (el) el.value = val; };
      set("from", addressText);
      set("to", airport.label);
      set("pax", pax);
      document.getElementById("reserveer").scrollIntoView({ behavior: "smooth" });
    });
  }

  /* -- Berekening bij verzenden -- */
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    if (!form.checkValidity()) { form.reportValidity(); return; }

    const airport = MODA_CALC.airports.find(a => a.value === select.value);
    if (!airport) { form.reportValidity(); return; }

    const pax  = Math.min(Math.max(parseInt(paxIn.value, 10) || 1, 1), 8);
    const base = airport.price;
    const extra = Math.max(0, pax - MODA_CALC.basePersons) * MODA_CALC.extraPersonFee;
    const price = base + extra;
    const addressText = address.value.trim();

    showLoading();

    try {
      const coords = await geocode(addressText);
      if (!coords) { showError(); return; }

      const km = distanceKm(MODA_CALC.company, coords);
      if (km > MODA_CALC.radiusKm) { showOutOfZone(km); return; }

      showPrice({ airport, price, base, extra, pax, addressText, km });
    } catch (err) {
      showError();
    }
  });
})();
