/* =========================================================================
   MODA — interactie
   -------------------------------------------------------------------------
   Eén scriptje voor de hele site. Alles hier is aanvulling: zet het uit en
   elke pagina blijft leesbaar, elke link werkt, en het bord op de startpagina
   toont nog altijd een volledig ingevuld voorbeeld.
   ========================================================================= */

/* Zelfde gratis dienst als de andere formulieren van Moda. Zonder geldige
   sleutel valt alles netjes terug op e-mail. */
const WEB3FORMS_KEY = "b15f5257-ac69-4f87-8c9f-99a86f80578a";

const rustig = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

document.addEventListener("DOMContentLoaded", function () {
  balk();
  mobielMenu();
  terugrekening();
  verschijnen();
  ritBalk();
  rekenaar();
  formulieren();
  voorinvullen();
  const jaar = document.getElementById("jaartal");
  if (jaar) jaar.textContent = new Date().getFullYear();
});

/* -------------------------------------------------------------------------
   1. Bovenbalk en menu
   ------------------------------------------------------------------------- */
function balk() {
  const kop = document.getElementById("kopBalk");
  if (!kop) return;
  const kijk = function () { kop.classList.toggle("is-gescrold", window.scrollY > 24); };
  kijk();
  window.addEventListener("scroll", kijk, { passive: true });
}

function mobielMenu() {
  const knop = document.getElementById("luik");
  const menu = document.getElementById("menu");
  if (!knop || !menu) return;
  const sluit = function () {
    menu.classList.remove("is-open");
    knop.classList.remove("is-open");
    knop.setAttribute("aria-expanded", "false");
    knop.setAttribute("aria-label", "Menu openen");
    document.body.style.overflow = "";
  };
  knop.addEventListener("click", function () {
    const open = menu.classList.toggle("is-open");
    knop.classList.toggle("is-open", open);
    knop.setAttribute("aria-expanded", String(open));
    knop.setAttribute("aria-label", open ? "Menu sluiten" : "Menu openen");
    document.body.style.overflow = open ? "hidden" : "";
  });
  menu.querySelectorAll("a").forEach(function (a) { a.addEventListener("click", sluit); });
  document.addEventListener("keydown", function (e) { if (e.key === "Escape") sluit(); });
}

/* =========================================================================
   2. DE TERUGREKENING
   -------------------------------------------------------------------------
   Het bord op de startpagina. Je zet je vertrekuur en je luchthaven, en het
   rekent terug tot het uur waarop de wekker moet.

   De rekensom, van achteren naar voren:
     u bent aan de balie   = vertrek − 2 u
     wij rijden weg        = balie − rijtijd − 15 min marge voor verkeer
     wij bellen aan        = wegrijden − 5 min om in te laden
     uw wekker             = aanbellen − 45 min

   De rijtijden staan in public/content/prices.json en zijn schattingen bij
   normaal verkeer. Er is geen live koppeling met vluchten of met verkeer, en
   de pagina doet ook niet alsof.
   ========================================================================= */
const CHECKIN_MIN = 120;   /* aan de balie zijn, twee uur voor vertrek */
const MARGE_MIN   = 15;    /* marge voor verkeer */
const INLADEN_MIN = 5;     /* van aanbellen tot wegrijden */
const OPSTAAN_MIN = 45;    /* van wekker tot aanbellen */

function terugrekening() {
  const bord = document.getElementById("bord");
  if (!bord) return;

  const invoerTijd = document.getElementById("bordVlucht");
  const invoerLucht = document.getElementById("bordLuchthaven");
  const rijen = Array.prototype.slice.call(bord.querySelectorAll(".bordrij"));
  const zin = document.querySelector("[data-bord-zin]");
  const prijsEl = bord.querySelector("[data-bord-prijs]");
  const bijEl = bord.querySelector("[data-bord-bij]");
  const knop = bord.querySelector("[data-bord-knop]");
  const hero = document.getElementById("hero");

  /* De luchthavens staan als gegevens in de keuzelijst zelf, zodat het
     scriptje niets hoeft op te halen. */
  function gekozen() {
    const o = invoerLucht.selectedOptions[0];
    return {
      value: invoerLucht.value,
      label: o.dataset.kort || o.textContent.trim(),
      prijs: parseInt(o.dataset.prijs, 10) || 0,
      km: parseInt(o.dataset.km, 10) || 0,
      rijtijd: parseInt(o.dataset.rijtijd, 10) || 60,
    };
  }

  function naarMinuten(hhmm) {
    const d = /^(\d{1,2}):(\d{2})$/.exec(hhmm || "");
    if (!d) return null;
    const u = +d[1], m = +d[2];
    if (u > 23 || m > 59) return null;
    return u * 60 + m;
  }
  function naarTijd(min) {
    const dag = Math.floor(min / 1440);
    const m = ((min % 1440) + 1440) % 1440;
    return { tekst: String(Math.floor(m / 60)).padStart(2, "0") + ":" + String(m % 60).padStart(2, "0"), dag: dag };
  }
  function duur(min) {
    const u = Math.floor(min / 60), m = min % 60;
    return (u ? u + "u" : "") + String(m).padStart(u ? 2 : 1, "0") + (u ? "" : " min");
  }

  function reken() {
    const vlucht = naarMinuten(invoerTijd.value);
    if (vlucht === null) return null;
    const l = gekozen();

    const balieDicht = vlucht - 60;
    const balie      = vlucht - CHECKIN_MIN;
    const wegrijden  = balie - l.rijtijd - MARGE_MIN;
    const aanbellen  = wegrijden - INLADEN_MIN;
    const wekker     = aanbellen - OPSTAAN_MIN;

    return {
      lucht: l,
      vlucht: vlucht,
      rijen: [
        { sleutel: "wekker",    min: wekker },
        { sleutel: "aanbellen", min: aanbellen },
        { sleutel: "wegrijden", min: wegrijden },
        { sleutel: "balie",     min: balie },
        { sleutel: "balieDicht",min: balieDicht },
        { sleutel: "vlucht",    min: vlucht },
      ],
    };
  }

  function schrijf(uitkomst) {
    if (!uitkomst) return;

    uitkomst.rijen.forEach(function (r) {
      const rij = bord.querySelector('[data-rij="' + r.sleutel + '"]');
      if (!rij) return;
      const t = naarTijd(r.min);
      const verschil = uitkomst.vlucht - r.min;
      rij.querySelector("[data-tijd]").textContent = t.tekst;
      const deltaEl = rij.querySelector("[data-delta]");
      if (deltaEl) {
        deltaEl.textContent = verschil > 0
          ? "−" + duur(verschil) + (t.dag < 0 ? " · dag ervoor" : "")
          : (t.dag < 0 ? "dag ervoor" : "");
      }
    });

    const aanbellen = uitkomst.rijen.find(function (r) { return r.sleutel === "aanbellen"; });
    const t = naarTijd(aanbellen.min);
    if (zin) zin.textContent = t.tekst;

    if (prijsEl) prijsEl.textContent = "€ " + uitkomst.lucht.prijs;
    if (bijEl) {
      bijEl.textContent = uitkomst.lucht.km + " km · rit " + duur(uitkomst.lucht.rijtijd) +
        " · tot 8 personen";
    }
    if (knop) {
      knop.href = "/reserveren/?" + new URLSearchParams({
        luchthaven: uitkomst.lucht.value,
        vlucht: invoerTijd.value,
        ophalen: t.tekst,
      }).toString();
    }

    /* Rijdt u weg voor zeven uur of na negenen? Dan is het donker, en toont
       de hero de nachtfoto. */
    if (hero) {
      const uur = Math.floor((((aanbellen.min % 1440) + 1440) % 1440) / 60);
      hero.classList.toggle("is-nacht", uur < 7 || uur >= 21);
    }
  }

  /* De cijfers verspringen van onder naar boven: de berekening loopt terug
     vanaf de vlucht, dus die rij beweegt eerst. */
  function wissel() {
    const uitkomst = reken();
    if (!uitkomst) return;
    if (rustig) { schrijf(uitkomst); return; }

    const laatste = rijen.length - 1;
    rijen.forEach(function (rij, i) {
      rij.style.setProperty("--rijvertraging", (laatste - i) * 45 + "ms");
      rij.classList.remove("is-nieuw");
      rij.classList.add("is-weg");
    });
    setTimeout(function () {
      schrijf(uitkomst);
      rijen.forEach(function (rij, i) {
        rij.classList.remove("is-weg");
        rij.style.setProperty("--rijvertraging", "0ms");
        rij.style.animationDelay = (laatste - i) * 45 + "ms";
        rij.classList.add("is-nieuw");
      });
    }, (laatste * 45) + 170);
  }

  invoerTijd.addEventListener("input", wissel);
  invoerLucht.addEventListener("change", wissel);
  schrijf(reken());
}

/* -------------------------------------------------------------------------
   3. Verschijnen bij scrollen
   ------------------------------------------------------------------------- */
function verschijnen() {
  const dingen = document.querySelectorAll(".toon");
  if (!dingen.length) return;
  if (rustig || !("IntersectionObserver" in window)) {
    dingen.forEach(function (el) { el.classList.add("is-zichtbaar"); });
    return;
  }
  const kijker = new IntersectionObserver(function (rij) {
    rij.forEach(function (e, i) {
      if (!e.isIntersecting) return;
      setTimeout(function () { e.target.classList.add("is-zichtbaar"); }, (i % 4) * 65);
      kijker.unobserve(e.target);
    });
  }, { threshold: 0.1, rootMargin: "0px 0px -6% 0px" });
  dingen.forEach(function (el) { kijker.observe(el); });
}

/* -------------------------------------------------------------------------
   4. De vaste balk op gsm
   ------------------------------------------------------------------------- */
function ritBalk() {
  const balkEl = document.querySelector("[data-ritbalk]");
  if (!balkEl || !("IntersectionObserver" in window)) return;

  const hero = document.getElementById("hero") || document.querySelector(".pkop");
  const slot = document.querySelector(".slot");
  let voorbij = !hero, bijSlot = false;

  function pas() { balkEl.classList.toggle("is-aan", voorbij && !bijSlot); }

  if (hero) {
    new IntersectionObserver(function (r) { voorbij = !r[0].isIntersecting; pas(); },
      { threshold: 0 }).observe(hero);
  }
  if (slot) {
    new IntersectionObserver(function (r) {
      bijSlot = r[0].isIntersecting || r[0].boundingClientRect.top < 0; pas();
    }, { threshold: 0 }).observe(slot);
  }
  pas();
}

/* =========================================================================
   4b. DE PRIJSREKENAAR
   -------------------------------------------------------------------------
   Het bord op de startpagina zegt hoe laat we aanbellen. Dit zegt wat het
   kost — met jouw adres, jouw gezelschap en jouw tussenstops.

   De prijsregels komen uit public/content/prices.json en staan hieronder
   gespiegeld. Het adres wordt opgezocht bij OpenStreetMap, alleen om de
   afstand tot Heusden-Zolder te kunnen tonen. Valt die dienst weg, dan blijft
   het veld een gewoon tekstveld en blijft de prijs kloppen: enkel de
   afstandscontrole vervalt dan, en dat zeggen we ook.
   ========================================================================= */
const ZAAK = { lat: 51.0271799, lon: 5.2654197 };   /* Beringersteenweg 14 */

function rekenaar() {
  const doos = document.getElementById("rekenaar");
  if (!doos) return;

  const regels = JSON.parse(doos.dataset.regels);
  const adresVeld = document.getElementById("rekAdres");
  const lijstEl = document.getElementById("rekSuggesties");
  const luchtEl = document.getElementById("rekLuchthaven");
  const terugEl = document.getElementById("rekTerugLuchthaven");
  const terugVak = document.getElementById("rekTerugVak");
  const personenEl = document.getElementById("rekPersonen");
  const stopsEl = document.getElementById("rekStops");
  const stopBijEl = document.getElementById("rekStopBij");
  const uit = document.getElementById("rekUitkomst");
  const knop = document.getElementById("rekKnop");

  let adresCoord = null;      /* gevuld zodra een suggestie gekozen of gevonden is */
  let adresAfstand = null;    /* km tot de zaak */
  let dienstStuk = false;     /* de adresdienst is onbereikbaar */

  const richting = () => (document.querySelector('input[name="rekRichting"]:checked') || {}).value || "heen";

  /* ---------- de rekensom ---------- */
  function bereken() {
    const heen = regels.luchthavens.find((l) => l.value === luchtEl.value) || regels.luchthavens[0];
    const r = richting();
    const terug = r === "beide"
      ? (regels.luchthavens.find((l) => l.value === terugEl.value) || heen)
      : null;

    let personen = parseInt(personenEl.value, 10);
    if (!Number.isFinite(personen) || personen < 1) personen = 1;
    if (personen > 8) personen = 8;

    const stops = Array.prototype.slice.call(stopsEl.querySelectorAll("input"))
      .filter(function (i) { return i.value.trim(); }).length;

    const posten = [];
    let totaal = 0;

    /* Bij "heen en terug" tellen we twee ritten, elk met hun eigen luchthaven. */
    const ritten = r === "beide" ? [heen, terug] : [heen];
    ritten.forEach(function (l, i) {
      const naam = r === "beide"
        ? (i === 0 ? "Heenrit naar " + l.label : "Terugrit van " + l.label)
        : (r === "van" ? "Ophalen aan " + l.label : "Rit naar " + l.label);
      posten.push({ wat: naam, bedrag: l.price });
      totaal += l.price;
    });

    const extra = Math.max(0, personen - regels.basisprijs_personen);
    if (extra > 0) {
      const bedrag = extra * regels.supplement_per_extra_persoon * ritten.length;
      posten.push({ wat: extra + (extra === 1 ? " extra persoon" : " extra personen") +
        " (" + extra * ritten.length + " × € " + regels.supplement_per_extra_persoon + ")", bedrag: bedrag });
      totaal += bedrag;
    }

    if (stops > 0) {
      const bedrag = stops * regels.supplement_per_tussenstop;
      posten.push({ wat: stops + (stops === 1 ? " tussenstop" : " tussenstops") +
        " (× € " + regels.supplement_per_tussenstop + ")", bedrag: bedrag });
      totaal += bedrag;
    }

    let korting = 0;
    if (r === "beide" && regels.heenterug_korting_procent > 0) {
      korting = Math.round(totaal * regels.heenterug_korting_procent / 100);
      posten.push({ wat: "Heen en terug samen (−" + regels.heenterug_korting_procent + "%)", bedrag: -korting, korting: true });
      totaal -= korting;
    }

    return { posten: posten, totaal: totaal, heen: heen, terug: terug, personen: personen, stops: stops, richting: r };
  }

  /* ---------- de uitkomst tonen ---------- */
  function toon() {
    const u = bereken();

    let html = '<div class="uitkomst__regels">';
    u.posten.forEach(function (p) {
      html += '<div class="uitkomst__regel' + (p.korting ? " uitkomst__regel--korting" : "") + '">' +
        "<span>" + veilig(p.wat) + "</span><span>" +
        (p.bedrag < 0 ? "− € " + Math.abs(p.bedrag) : "€ " + p.bedrag) + "</span></div>";
    });
    html += "</div>";
    html += '<dl class="uitkomst__totaal"><dt>Uw vaste prijs</dt><dd>€ ' + u.totaal + "</dd></dl>";

    /* De afstandscontrole: binnen de straal geldt de vaste prijs zonder meer. */
    if (adresAfstand !== null) {
      const binnen = adresAfstand <= regels.km_straal;
      html += '<p class="uitkomst__melding' + (binnen ? "" : " uitkomst__melding--let") + '">' +
        (binnen
          ? "Uw adres ligt binnen onze vaste-prijszone. Dit bedrag is wat u betaalt."
          : "Uw adres ligt buiten de zone van " + regels.km_straal + " km waarin deze prijs vast staat. " +
            "Bel even, dan spreken we de prijs vooraf samen af — u hoort ze nog altijd voor u vertrekt.") +
        "</p>";
      html += '<p class="uitkomst__afstand">' + adresAfstand.toFixed(1).replace(".", ",") +
        " km hemelsbreed vanaf Heusden-Zolder</p>";
    } else if (dienstStuk && adresVeld.value.trim()) {
      html += '<p class="uitkomst__melding">Het opzoeken van adressen lukt even niet, ' +
        "dus we kunnen de afstand niet nakijken. De prijs hierboven klopt wel.</p>";
    }

    html += '<div class="uitkomst__acties">' +
      '<a class="knop knop--signaal" id="rekKnopIn" href="/reserveren/">Reserveer deze rit' +
      '<svg class="ic" aria-hidden="true"><use href="#ic-rechts"/></svg></a>' +
      '<a class="knop knop--stil" href="tel:+3211243003">' +
      '<svg class="ic" aria-hidden="true"><use href="#ic-tel"/></svg>011 24 30 03</a></div>';

    uit.innerHTML = html;

    /* De knop neemt mee wat hier ingevuld is, zodat het formulier al klopt. */
    const naar = document.getElementById("rekKnopIn");
    if (naar) {
      naar.href = "/reserveren/?" + new URLSearchParams({
        luchthaven: u.heen.value,
        richting: u.richting,
        personen: String(u.personen),
        adres: adresVeld.value.trim(),
      }).toString();
    }
  }

  /* ---------- afstand tussen twee punten, hemelsbreed ---------- */
  function afstandKm(a, b) {
    const R = 6371, rad = function (d) { return (d * Math.PI) / 180; };
    const dLat = rad(b.lat - a.lat), dLon = rad(b.lon - a.lon);
    const h = Math.sin(dLat / 2) ** 2 +
      Math.cos(rad(a.lat)) * Math.cos(rad(b.lat)) * Math.sin(dLon / 2) ** 2;
    return 2 * R * Math.asin(Math.sqrt(h));
  }

  /* ---------- adressuggesties (OpenStreetMap via Photon) ---------- */
  let wacht = null, keuzes = [], actief = -1;

  function sluitLijst() { lijstEl.hidden = true; lijstEl.innerHTML = ""; actief = -1; }

  function toonLijst(items) {
    keuzes = items;
    if (!items.length) return sluitLijst();
    lijstEl.innerHTML = items.map(function (s, i) {
      return '<li role="option" id="reksug' + i + '" aria-selected="false">' +
        veilig(s.regel1) + (s.regel2 ? "<small>" + veilig(s.regel2) + "</small>" : "") + "</li>";
    }).join("");
    lijstEl.hidden = false;
    Array.prototype.slice.call(lijstEl.children).forEach(function (li, i) {
      li.addEventListener("mousedown", function (e) { e.preventDefault(); kies(i); });
    });
  }

  function kies(i) {
    const s = keuzes[i];
    if (!s) return;
    adresVeld.value = s.volledig;
    adresCoord = { lat: s.lat, lon: s.lon };
    adresAfstand = afstandKm(ZAAK, adresCoord);
    sluitLijst();
    toon();
  }

  function zetActief(i) {
    Array.prototype.slice.call(lijstEl.children).forEach(function (li, n) {
      li.setAttribute("aria-selected", String(n === i));
    });
    adresVeld.setAttribute("aria-activedescendant", i >= 0 ? "reksug" + i : "");
  }

  function zoek(vraag) {
    const url = "https://photon.komoot.io/api/?limit=6&lang=default&lat=" + ZAAK.lat +
      "&lon=" + ZAAK.lon + "&location_bias_scale=0.5&q=" + encodeURIComponent(vraag);
    return fetch(url)
      .then(function (r) { if (!r.ok) throw new Error("net"); return r.json(); })
      .then(function (data) {
        dienstStuk = false;
        return (data.features || [])
          .filter(function (f) { return (f.properties.countrycode || "").toUpperCase() === "BE"; })
          .map(function (f) {
            const p = f.properties;
            const regel1 = [p.name || p.street || "", p.housenumber].filter(Boolean).join(" ") || (p.city || "");
            const regel2 = [p.postcode, p.city].filter(Boolean).join(" ");
            return {
              regel1: regel1, regel2: regel2,
              volledig: [regel1, regel2].filter(Boolean).join(", "),
              lat: f.geometry.coordinates[1], lon: f.geometry.coordinates[0],
            };
          })
          .filter(function (s) { return s.volledig; })
          .filter(function (s, i, arr) { return arr.findIndex(function (x) { return x.volledig === s.volledig; }) === i; });
      })
      .catch(function () { dienstStuk = true; return []; });
  }

  adresVeld.addEventListener("input", function () {
    adresCoord = null; adresAfstand = null;
    clearTimeout(wacht);
    const vraag = adresVeld.value.trim();
    if (vraag.length < 3) { sluitLijst(); toon(); return; }
    wacht = setTimeout(function () {
      zoek(vraag).then(function (items) {
        toonLijst(items);
        /* Opnieuw tonen: pas nu weten we of de adresdienst antwoordde, en dat
           bepaalt of er een melding onder de prijs hoort. */
        toon();
      });
    }, 320);
    toon();
  });

  adresVeld.addEventListener("keydown", function (e) {
    if (lijstEl.hidden) return;
    if (e.key === "ArrowDown") { e.preventDefault(); actief = Math.min(actief + 1, keuzes.length - 1); zetActief(actief); }
    if (e.key === "ArrowUp")   { e.preventDefault(); actief = Math.max(actief - 1, 0); zetActief(actief); }
    if (e.key === "Enter" && actief >= 0) { e.preventDefault(); kies(actief); }
    if (e.key === "Escape") sluitLijst();
  });
  adresVeld.addEventListener("blur", function () { setTimeout(sluitLijst, 140); });

  /* ---------- richting: bij heen en terug komt er een tweede luchthaven bij ---------- */
  document.querySelectorAll('input[name="rekRichting"]').forEach(function (r) {
    r.addEventListener("change", function () {
      const beide = richting() === "beide";
      terugVak.hidden = !beide;
      toon();
    });
  });

  /* ---------- tussenstops ---------- */
  function stopErbij() {
    const rij = document.createElement("div");
    rij.className = "stoprij";
    const nr = stopsEl.children.length + 1;
    rij.innerHTML = '<input type="text" aria-label="Tussenstop ' + nr + '" placeholder="Adres van de tussenstop" />' +
      '<button type="button" class="stopweg" aria-label="Tussenstop ' + nr + ' verwijderen">' +
      '<svg class="ic" aria-hidden="true"><use href="#ic-kruis"/></svg></button>';
    stopsEl.appendChild(rij);
    rij.querySelector("input").addEventListener("input", toon);
    rij.querySelector("button").addEventListener("click", function () { rij.remove(); toon(); });
    rij.querySelector("input").focus();
    toon();
  }
  stopBijEl.addEventListener("click", stopErbij);

  [luchtEl, terugEl, personenEl].forEach(function (el) {
    el.addEventListener("input", toon);
    el.addEventListener("change", toon);
  });

  toon();
}

function veilig(t) {
  return String(t == null ? "" : t).replace(/[&<>"']/g, function (c) {
    return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
  });
}

/* -------------------------------------------------------------------------
   5. Formulieren — reserveren en offerte
   ------------------------------------------------------------------------- */
function formulieren() {
  document.querySelectorAll("form[data-formulier]").forEach(function (form) {
    const noot = form.querySelector("[data-noot]");
    const soort = form.dataset.formulier;

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      if (!form.checkValidity()) {
        if (noot) { noot.textContent = "Vul de verplichte velden nog even aan."; noot.className = "fnoot is-mis"; }
        form.reportValidity();
        return;
      }
      if (noot) { noot.textContent = "Bezig met versturen…"; noot.className = "fnoot"; }

      const d = Object.fromEntries(new FormData(form).entries());
      const velden = {};
      Object.keys(d).forEach(function (k) {
        if (k === "botcheck") return;
        const label = form.querySelector('[name="' + k + '"]')?.closest(".fveld")?.querySelector("label")?.textContent;
        velden[(label || k).trim()] = d[k] || "-";
      });

      fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify(Object.assign({
          access_key: WEB3FORMS_KEY,
          subject: (soort === "offerte" ? "🚚 Offerteaanvraag" : "🚖 Nieuwe rit") + " van " + (d.naam || "de website"),
          from_name: "Moda website",
          replyto: d.email || "",
          botcheck: !!(form.botcheck && form.botcheck.checked),
        }, velden)),
      })
        .then(function (r) { return r.json(); })
        .then(function (j) {
          if (!j.success) throw new Error(j.message || "verzenden mislukt");
          if (noot) {
            noot.textContent = soort === "offerte"
              ? "Verstuurd. U krijgt uw offerte meestal dezelfde werkdag."
              : "Verstuurd. Wij bevestigen uw rit telefonisch of per e-mail.";
            noot.className = "fnoot is-ok";
          }
          form.reset();
        })
        .catch(function () {
          const regels = Object.keys(velden).map(function (k) { return k + ": " + velden[k]; }).join("\n");
          window.location.href = "mailto:info@moda-sneltransport.be?subject=" +
            encodeURIComponent(soort === "offerte" ? "Offerteaanvraag" : "Reservatie") +
            "&body=" + encodeURIComponent(regels);
          if (noot) { noot.textContent = "We openen je e-mailprogramma om het door te sturen."; noot.className = "fnoot is-ok"; }
        });
    });
  });
}

/* -------------------------------------------------------------------------
   6. Komt de bezoeker van het bord? Dan het formulier alvast invullen
   ------------------------------------------------------------------------- */
function voorinvullen() {
  const q = new URLSearchParams(location.search);
  if (!q.toString()) return;
  const zet = function (id, waarde) {
    const el = document.getElementById(id);
    if (el && waarde) el.value = waarde;
  };
  zet("luchthaven", q.get("luchthaven"));
  zet("ophaaladres", q.get("adres"));
  zet("richting", q.get("richting"));
  zet("personen", q.get("personen"));
  zet("vluchtuur", q.get("vlucht"));
  zet("ophaaluur", q.get("ophalen"));

  const notitie = document.getElementById("opmerkingen");
  if (notitie && q.get("vlucht")) {
    const tekst = "Vlucht om " + q.get("vlucht") +
      (q.get("ophalen") ? ", volgens de site ophalen om " + q.get("ophalen") : "");
    notitie.value = notitie.value ? notitie.value + "\n" + tekst : tekst;
  }
}
