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
  tarieven();
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

/* -------------------------------------------------------------------------
   4b. De tarieventabel rekent mee
   -------------------------------------------------------------------------
   Aantal personen en heen-en-terug passen alle prijzen tegelijk aan. De
   regels staan in public/content/prices.json en worden hier gespiegeld:
   de eerste twee personen zitten in de basisprijs, daarna een supplement,
   en heen en terug samen geeft korting op het totaal.
   ------------------------------------------------------------------------- */
const BASIS_PERSONEN = 2, PER_EXTRA = 5, HEENTERUG_KORTING = 10;

function tarieven() {
  const tabel = document.querySelector("[data-tarieven]");
  const personenEl = document.getElementById("tarPersonen");
  const richtingEl = document.getElementById("tarRichting");
  if (!tabel || !personenEl || !richtingEl) return;

  const rijen = Array.prototype.slice.call(tabel.querySelectorAll("[data-basis]"));

  function pas() {
    let personen = parseInt(personenEl.value, 10);
    if (!Number.isFinite(personen) || personen < 1) personen = 1;
    if (personen > 8) personen = 8;
    const beide = richtingEl.value === "beide";

    rijen.forEach(function (rij) {
      const basis = parseInt(rij.dataset.basis, 10);
      let prijs = basis + Math.max(0, personen - BASIS_PERSONEN) * PER_EXTRA;
      if (beide) prijs = Math.round(prijs * 2 * (1 - HEENTERUG_KORTING / 100));
      rij.querySelector("[data-prijs]").textContent = "€ " + prijs;
    });
  }

  personenEl.addEventListener("input", pas);
  richtingEl.addEventListener("change", pas);
  pas();
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
  zet("vluchtuur", q.get("vlucht"));
  zet("ophaaluur", q.get("ophalen"));

  const notitie = document.getElementById("opmerkingen");
  if (notitie && q.get("vlucht")) {
    const tekst = "Vlucht om " + q.get("vlucht") +
      (q.get("ophalen") ? ", volgens de site ophalen om " + q.get("ophalen") : "");
    notitie.value = notitie.value ? notitie.value + "\n" + tekst : tekst;
  }
}
