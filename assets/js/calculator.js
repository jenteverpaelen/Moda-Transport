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
  extraPersonFee:  5,    // euro per extra persoon
  stopFee:         10,   // euro per extra tussenstop
  roundTripDiscount: 0,  // korting (%) op een heen-én-terugrit (0 = geen korting)

  // Luchthavens + vaste basisprijs (enkele rit, 2 personen)
  airports: [
    { value: "zaventem",   label: "Brussels Airport (Zaventem)", price: 100 },
    { value: "luik",       label: "Luik (Liège)",                price: 100 },
    { value: "antwerpen",  label: "Antwerpen",                   price: 100 },
    { value: "eindhoven",  label: "Eindhoven",                   price: 100 },
    { value: "charleroi",  label: "Brussels South (Charleroi)",  price: 160 },
    { value: "dusseldorf", label: "Düsseldorf",                  price: 160 },
    { value: "amsterdam",  label: "Amsterdam (Schiphol)",        price: 240 },
  ],

  // Contactgegevens die in de resultaten getoond worden
  phone:       "+3211243003",
  phoneNice:   "011 24 30 03",
};

/* =========================================================
   Vanaf hier hoef je niets meer aan te passen.
   ---------------------------------------------------------
   De prijzen hierboven zijn de terugval. Staan er prijzen in
   content/prices.json (aangepast via /admin), dan worden die
   gebruikt. Lukt dat niet, dan blijft de config hierboven gelden.
   ========================================================= */
(function bootCalc() {
  fetch("content/prices.json", { cache: "no-store" })
    .then(function (r) { if (!r.ok) throw new Error("prices " + r.status); return r.json(); })
    .then(applyPrices)
    .catch(function (e) { console.warn("[Moda] content/prices.json niet geladen, vaste prijzen blijven gelden:", e); })
    .then(initCalc);

  function applyPrices(p) {
    if (typeof p.basisprijs_personen === "number") MODA_CALC.basePersons = p.basisprijs_personen;
    if (typeof p.supplement_per_extra_persoon === "number") MODA_CALC.extraPersonFee = p.supplement_per_extra_persoon;
    if (typeof p.supplement_per_tussenstop === "number") MODA_CALC.stopFee = p.supplement_per_tussenstop;
    if (typeof p.heenterug_korting_procent === "number") MODA_CALC.roundTripDiscount = p.heenterug_korting_procent;
    if (typeof p.km_straal === "number") MODA_CALC.radiusKm = p.km_straal;
    if (Array.isArray(p.luchthavens) && p.luchthavens.length) {
      MODA_CALC.airports = p.luchthavens
        .filter(function (a) { return a && a.value && a.label && typeof a.price === "number"; });
    }
  }
})();

function initCalc() {
  const form     = document.getElementById("calcForm");
  const select   = document.getElementById("calc-airport");
  const returnSelect = document.getElementById("calc-airport-return");
  const returnField  = document.getElementById("calc-airport-return-field");
  const address  = document.getElementById("calc-address");
  const acList   = document.getElementById("calc-ac-list");
  const paxIn    = document.getElementById("calc-pax");
  const result   = document.getElementById("calcResult");
  const stopsBox = document.getElementById("calcStops");
  const addStop  = document.getElementById("addStop");
  if (!form || !select || !result) return;

  /* -- Vul beide luchthaven-dropdowns uit de config -- */
  MODA_CALC.airports.forEach(a => {
    const opt = document.createElement("option");
    opt.value = a.value;
    opt.textContent = a.label;
    select.appendChild(opt);
    if (returnSelect) returnSelect.appendChild(opt.cloneNode(true));
  });

  /* -- Type rit: naar / van / heen-en-terug -- */
  const airportLabel = document.getElementById("calc-airport-label");
  const addressLabel = document.getElementById("calc-address-label");
  const returnLabel  = document.getElementById("calc-airport-return-label");
  const TRIP_LABELS = {
    naar:   { airport: "Naar welke luchthaven?",         address: "Ophaaladres" },
    van:    { airport: "Van welke luchthaven?",          address: "Afzetadres (waar zetten we u af?)" },
    retour: { airport: "Naar welke luchthaven? (heenreis)",  address: "Uw adres (ophalen én terugbrengen)",
              airportReturn: "Van welke luchthaven? (terugreis)" }
  };
  function getTripType() {
    const r = form.querySelector("input[name='triptype']:checked");
    return r ? r.value : "naar";
  }
  function syncTripLabels() {
    const type = getTripType();
    const t = TRIP_LABELS[type] || TRIP_LABELS.naar;
    if (airportLabel) airportLabel.textContent = t.airport;
    if (addressLabel) addressLabel.textContent = t.address;
    // Tweede luchthaven enkel tonen (en verplichten) bij heen-én-terug
    const isRetour = type === "retour";
    if (returnField) returnField.hidden = !isRetour;
    if (returnSelect) {
      if (isRetour) returnSelect.setAttribute("required", "");
      else returnSelect.removeAttribute("required");
    }
    if (returnLabel && t.airportReturn) returnLabel.textContent = t.airportReturn;
  }
  form.querySelectorAll("input[name='triptype']").forEach(r => r.addEventListener("change", syncTripLabels));
  syncTripLabels();

  /* -- Afstand tussen twee coördinaten (Haversine, in km) -- */
  function distanceKm(a, b) {
    const R = 6371, toRad = d => (d * Math.PI) / 180;
    const dLat = toRad(b.lat - a.lat);
    const dLon = toRad(b.lon - a.lon);
    const h = Math.sin(dLat / 2) ** 2 +
              Math.cos(toRad(a.lat)) * Math.cos(toRad(b.lat)) * Math.sin(dLon / 2) ** 2;
    return 2 * R * Math.asin(Math.sqrt(h));
  }

  /* ===================== GEOCODING ===================== */

  function formatSuggestion(p) {
    const street = p.name || p.street || "";
    const line1  = [street, p.housenumber].filter(Boolean).join(" ") || (p.city || "");
    const line2  = [p.postcode, p.city].filter(Boolean).join(" ");
    return { line1, line2, full: [line1, line2].filter(Boolean).join(", ") };
  }

  function extractHouseNumber(text) {
    const m = text.match(/\b(\d+\s?[a-zA-Z]?(?:\s?bus\s?\w+)?)\b/i);
    return m ? m[1].trim() : "";
  }

  // Adressuggesties via Photon (gratis, voor type-ahead, OpenStreetMap)
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
        const p = f.properties;
        const s = formatSuggestion(p);
        return {
          ...s,
          street: p.name || p.street || "",
          housenumber: p.housenumber || "",
          postcode: p.postcode || "",
          city: p.city || "",
          lat: f.geometry.coordinates[1],
          lon: f.geometry.coordinates[0],
        };
      })
      .filter(s => s.full)
      .filter((s, i, arr) => arr.findIndex(x => x.full === s.full) === i);
  }

  // Fallback-geocoder (Nominatim) met slimme terugval
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

  async function geocodeRobust(text) {
    const variants = [];
    const add = v => { v = (v || "").trim().replace(/\s{2,}/g, " ").replace(/^,|,$/g, "").trim(); if (v && !variants.includes(v)) variants.push(v); };
    add(text);
    add(text.replace(/(\d+)\s?[a-zA-Z]\b/, "$1"));         // 30A → 30
    add(text.replace(/\b\d+\s?[a-zA-Z]?\b\s*,?\s*/, ""));  // huisnummer weglaten
    for (const q of variants) {
      const coords = await geocode(q);
      if (coords) return coords;
    }
    return null;
  }

  // Coördinaten van een veld: eerst de gekozen suggestie, anders geocoden
  async function resolveLocation(input) {
    if (input._coords) return input._coords;
    return await geocodeRobust(input.value.trim());
  }

  /* ===================== HERBRUIKBARE AUTOCOMPLETE ===================== */
  function makeAutocomplete(input, list) {
    let activeIndex = -1;
    let suggestions = [];
    let debounce;
    input._coords = null;

    function close() {
      list.hidden = true;
      list.innerHTML = "";
      activeIndex = -1;
      suggestions = [];
      input.setAttribute("aria-expanded", "false");
    }
    function render(items) {
      suggestions = items;
      activeIndex = -1;
      if (!items.length) { close(); return; }
      list.innerHTML = items.map((s, i) => `
        <li class="autocomplete__item" role="option" data-i="${i}">
          <span class="autocomplete__line1">${s.line1}</span>
          <span class="autocomplete__line2">${s.line2}</span>
        </li>`).join("");
      list.hidden = false;
      input.setAttribute("aria-expanded", "true");
    }
    function pick(i) {
      const s = suggestions[i];
      if (!s) return;
      let streetLine = s.line1;                 // "straat huisnummer" (of stad als terugval)
      let full = s.full;
      if (!s.housenumber && s.street) {
        const nr = extractHouseNumber(input.value);
        if (nr) { streetLine = `${s.street} ${nr}`; full = [streetLine, s.line2].filter(Boolean).join(", "); }
      }
      input.value = full;
      input._coords = { lat: s.lat, lon: s.lon };
      input._postcode = s.postcode || "";
      // Nette adresregel ZONDER postcode (voor het boekingsformulier):
      // "straat huisnummer, gemeente" — vermijd dubbele stad bij terugval.
      input._cleanAddress = [streetLine, s.city]
        .filter(Boolean)
        .filter((v, k, arr) => arr.indexOf(v) === k)
        .join(", ");
      close();
    }
    function setActive(i) {
      const els = list.querySelectorAll(".autocomplete__item");
      els.forEach(el => el.classList.remove("is-active"));
      if (i >= 0 && els[i]) { els[i].classList.add("is-active"); els[i].scrollIntoView({ block: "nearest" }); }
      activeIndex = i;
    }

    input.addEventListener("input", () => {
      input._coords = null;
      input._postcode = null;
      input._cleanAddress = null;
      const q = input.value.trim();
      clearTimeout(debounce);
      if (q.length < 3) { close(); return; }
      debounce = setTimeout(async () => {
        try {
          const items = await searchAddresses(q);
          if (input.value.trim() === q) render(items);
        } catch (e) { close(); }
      }, 280);
    });
    input.addEventListener("keydown", (e) => {
      if (list.hidden) return;
      if (e.key === "ArrowDown") { e.preventDefault(); setActive(Math.min(activeIndex + 1, suggestions.length - 1)); }
      else if (e.key === "ArrowUp") { e.preventDefault(); setActive(Math.max(activeIndex - 1, 0)); }
      else if (e.key === "Enter" && activeIndex >= 0) { e.preventDefault(); pick(activeIndex); }
      else if (e.key === "Escape") { close(); }
    });
    list.addEventListener("mousedown", (e) => {
      const item = e.target.closest(".autocomplete__item");
      if (item) { e.preventDefault(); pick(parseInt(item.dataset.i, 10)); }
    });
    document.addEventListener("click", (e) => {
      if (!list.hidden && !e.target.closest(".autocomplete") ) close();
    });

    return { close };
  }

  // Hoofd-ophaaladres
  makeAutocomplete(address, acList);

  /* ===================== TUSSENSTOPPEN ===================== */
  function addStopRow() {
    const row = document.createElement("div");
    row.className = "calc__stop";
    row.innerHTML = `
      <div class="autocomplete calc__stop-ac">
        <input type="text" class="calc__stop-input" placeholder="Adres tussenstop…" autocomplete="off"
               role="combobox" aria-autocomplete="list" aria-expanded="false" />
        <ul class="autocomplete__list" role="listbox" hidden></ul>
      </div>
      <span class="calc__stop-fee">+€${MODA_CALC.stopFee}</span>
      <button type="button" class="calc__stop-remove" aria-label="Tussenstop verwijderen">×</button>`;
    stopsBox.appendChild(row);

    const input = row.querySelector(".calc__stop-input");
    const list  = row.querySelector(".autocomplete__list");
    makeAutocomplete(input, list);
    input.focus();

    row.querySelector(".calc__stop-remove").addEventListener("click", () => {
      row.style.animation = "calc-out .2s var(--ease) forwards";
      setTimeout(() => row.remove(), 180);
    });
  }
  if (addStop) addStop.addEventListener("click", addStopRow);

  function getStopInputs() {
    return [...stopsBox.querySelectorAll(".calc__stop-input")].filter(i => i.value.trim());
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
  function showOutOfZone(km, where) {
    result.innerHTML = `
      <div class="calc__state calc__state--warn">
        <span class="calc__emoji">📍</span>
        <h3>Net buiten ons vaste-prijs gebied</h3>
        <p>${where} ligt op ± ${km.toFixed(0)} km van Heusden-Zolder (max. ${MODA_CALC.radiusKm} km voor een vaste prijs).
           Geen probleem, we maken graag een prijs op maat.</p>
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
  // Ophaaladres opsplitsen in een nette adresregel (zonder postcode) + de
  // postcode apart — voor het boekingsformulier. Gebruikt bij voorkeur de
  // gekozen suggestie; typte de bezoeker vrij, dan halen we de postcode
  // (4 cijfers) uit de tekst en strippen die eruit.
  function splitPickup() {
    if (address._cleanAddress) {
      return { addr: address._cleanAddress, postcode: address._postcode || "" };
    }
    const raw = address.value.trim();
    const m = raw.match(/\b(\d{4})\b/);
    const pc = m ? m[1] : "";
    let addr = raw;
    if (pc) {
      addr = raw.replace(pc, "")
                .replace(/\s{2,}/g, " ")
                .replace(/,\s*,/g, ",")
                .replace(/^[\s,]+|[\s,]+$/g, "")
                .trim();
    }
    return { addr: addr, postcode: pc };
  }

  function showPrice(d) {
    const { airport, airportReturn, price, rides, extraPersons, extraPerRide, supplement,
            discountPct, discount, stopsFee, stopCount, pax, addressText, stopTexts, km, triptype } = d;

    const isRetour = triptype === "retour";
    const perPax = `t.e.m. ${MODA_CALC.basePersons} pers.`;

    // Route-tekst en badge volgens de richting
    let routeText, badge;
    if (triptype === "van") {
      routeText = `${airport.label} → ${addressText}`;
      badge = "Richtprijs · enkele rit";
    } else if (isRetour) {
      // Toon beide luchthavens als ze verschillen
      routeText = airport.value === airportReturn.value
        ? `${addressText} ⇄ ${airport.label}`
        : `${airport.label} → ${addressText} → ${airportReturn.label}`;
      badge = "Richtprijs · heen en terug";
    } else {
      routeText = `${addressText} → ${airport.label}`;
      badge = "Richtprijs · enkele rit";
    }

    const via = stopTexts.length ? `<p class="calc__route calc__route--via">via ${stopTexts.join(" · ")}</p>` : "";

    // Prijsopbouw — supplement en tussenstops staan altijd apart vermeld.
    let rows = "";
    if (isRetour) {
      rows += `<div class="calc__row"><span>Heen: ${airport.label} (${perPax})</span><span>${euro(airport.price)}</span></div>`;
      rows += `<div class="calc__row"><span>Terug: ${airportReturn.label} (${perPax})</span><span>${euro(airportReturn.price)}</span></div>`;
      if (extraPersons > 0) rows += `<div class="calc__row"><span>Supplement (${extraPersons} extra pers. × 2 ritten)</span><span>+ ${euro(supplement)}</span></div>`;
    } else {
      rows += `<div class="calc__row"><span>Basisprijs (${perPax})</span><span>${euro(airport.price)}</span></div>`;
      if (extraPersons > 0) rows += `<div class="calc__row"><span>Supplement (${extraPersons} extra pers.)</span><span>+ ${euro(supplement)}</span></div>`;
    }
    if (stopCount > 0) rows += `<div class="calc__row"><span>Tussenstop${stopCount > 1 ? "pen" : ""} (${stopCount})</span><span>+ ${euro(stopsFee)}</span></div>`;
    if (discount > 0) rows += `<div class="calc__row"><span>Korting heen &amp; terug (−${discountPct}%)</span><span>− ${euro(discount)}</span></div>`;
    rows += `<div class="calc__row calc__row--total"><span>Totaal (${pax} pers.)</span><span>${euro(price)}</span></div>`;

    result.innerHTML = `
      <div class="calc__state calc__state--ok">
        <span class="calc__badge">${badge}</span>
        <div class="calc__price">${euro(price)}</div>
        <p class="calc__route">${routeText}</p>
        ${via}
        <div class="calc__breakdown">${rows}</div>
        <p class="calc__fineprint">Binnen ${MODA_CALC.radiusKm} km (± ${km.toFixed(0)} km). Richtprijs, je krijgt steeds een definitieve bevestiging.</p>
        <button type="button" class="btn btn--primary btn--lg btn--block" id="calcToBooking">Reserveer deze rit →</button>
      </div>`;

    document.getElementById("calcToBooking").addEventListener("click", () => {
      const set = (id, val) => { const el = document.getElementById(id); if (el) el.value = val; };
      if (triptype === "van") {
        // Ophaling op de luchthaven, afzetten op het adres
        set("from", airport.label);
        set("to", addressText);
        set("postcode", "");
      } else {
        // Ophaling op het adres → postcode netjes in het aparte veld
        const pickup = splitPickup();
        set("from", pickup.addr);
        set("postcode", pickup.postcode);
        set("to", isRetour && airport.value !== airportReturn.value
          ? `${airport.label} (heen) / ${airportReturn.label} (terug)`
          : airport.label);
      }
      set("pax", pax);
      const extraNotes = [];
      if (isRetour) {
        extraNotes.push(airport.value === airportReturn.value
          ? `Rit: heen én terug (${airport.label})`
          : `Rit: heen via ${airport.label}, terug via ${airportReturn.label}`);
      }
      if (stopTexts.length) extraNotes.push(`Tussenstop(pen): ${stopTexts.join("; ")}`);
      if (extraNotes.length) {
        const notes = document.getElementById("notes");
        if (notes) notes.value = extraNotes.join(" · ") + (notes.value ? `\n${notes.value}` : "");
      }
      document.getElementById("reserveer").scrollIntoView({ behavior: "smooth" });
    });
  }

  /* ===================== BEREKENING ===================== */
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    if (!form.checkValidity()) { form.reportValidity(); return; }

    const triptype  = getTripType();
    const rides     = triptype === "retour" ? 2 : 1;

    const airport = MODA_CALC.airports.find(a => a.value === select.value);
    if (!airport) { form.reportValidity(); return; }

    // Terug-luchthaven kan verschillen van de heen-luchthaven (heen-én-terug).
    // Bij naar/van is er maar één luchthaven; valt anders terug op de heen-luchthaven.
    let airportReturn = airport;
    if (triptype === "retour") {
      airportReturn = MODA_CALC.airports.find(a => a.value === returnSelect.value) || airport;
    }

    const pax       = Math.min(Math.max(parseInt(paxIn.value, 10) || 1, 1), 8);
    const stopInputs = getStopInputs();
    const stopCount = stopInputs.length;

    // Extra personen: supplement per rit (dus bij heen-én-terug telt het 2×)
    const extraPersons  = Math.max(0, pax - MODA_CALC.basePersons);
    const extraPerRide  = extraPersons * MODA_CALC.extraPersonFee;
    const supplement    = extraPerRide * rides;               // totaal supplement personen

    // Basisprijs: één luchthaven, of heen + terug (mogelijk verschillende luchthavens)
    const baseSum = triptype === "retour" ? (airport.price + airportReturn.price) : airport.price;

    const ridesTotal  = baseSum + supplement;                 // ritten samen (zonder tussenstops)
    const discountPct = triptype === "retour" ? Math.max(0, MODA_CALC.roundTripDiscount || 0) : 0;
    const discount    = Math.round(ridesTotal * discountPct / 100);
    const stopsFee    = stopCount * MODA_CALC.stopFee;        // tussenstops: eenmalig
    const price       = ridesTotal - discount + stopsFee;

    const addressText = address.value.trim();
    const stopTexts   = stopInputs.map(i => i.value.trim());
    const addrPointLabel = triptype === "van" ? "Je afzetadres" : "Je ophaaladres";

    showLoading();

    try {
      // Adres + alle tussenstops moeten binnen de zone liggen
      const points = [{ label: addrPointLabel, input: address }]
        .concat(stopInputs.map(i => ({ label: "Je tussenstop", input: i })));

      let maxKm = 0;
      for (const pt of points) {
        const coords = await resolveLocation(pt.input);
        if (!coords) { showError(); return; }
        const km = distanceKm(MODA_CALC.company, coords);
        if (km > MODA_CALC.radiusKm) { showOutOfZone(km, pt.label); return; }
        if (km > maxKm) maxKm = km;
      }

      showPrice({ airport, airportReturn, price, rides, extraPersons, extraPerRide, supplement,
                  discountPct, discount, stopsFee, stopCount, pax, addressText, stopTexts,
                  km: maxKm, triptype });
    } catch (err) {
      showError();
    }
  });
}
