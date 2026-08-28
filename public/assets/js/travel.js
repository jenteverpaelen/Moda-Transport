/* =========================================================
   MODA TRAVEL — Interactie voor de reisbureau-pagina (/travel)
   ---------------------------------------------------------
   Zelfstandig scriptje: nav, thema, mobiel menu, reveal-animaties,
   tellers, jaartal, de "Laatste reizen"-galerij én het
   reisaanvraag-formulier (via Web3Forms). Bewust los van het
   luchthaven- en transportgedeelte.
   ========================================================= */

/* =========================================================================
   INSTAGRAM-FEED — nu voorbeelden, later live in één stap
   -------------------------------------------------------------------------
   De galerij "Laatste reizen" toont standaard de voorbeeldreizen uit
   content/travel-posts.json. Wil je de ECHTE Instagram-posts tonen?
   Vul dan hieronder één keer een JSON-feed-URL in (bv. van Behold.so of
   een eigen Cloudflare Worker). Zodra die is ingevuld, verschijnen de echte
   posts automatisch, in exact dezelfde stijl. Meer is er niet nodig.

   Voorbeeld:
     const INSTAGRAM_FEED_URL = "https://feeds.behold.so/XXXXXXXXXXXX";
   ========================================================================= */
const INSTAGRAM_FEED_URL = "";

// Aantal posts dat we tonen (Behold-gratis geeft er max. 6; een betaald plan
// of een eigen functie meer). Voorbeelden vullen aan als er minder zijn.
const FEED_MAX = 8;

/* Voorbeeldreizen, rechtstreeks in de code zodat ze ALTIJD tonen (ook wanneer je
   het bestand lokaal opent via file://, waar fetch geblokkeerd is). Zelfde inhoud
   als content/travel-posts.json. Zodra een echte feed-URL is ingesteld, worden
   deze automatisch vervangen door de echte Instagram-posts. De eerste is een
   echte post van modatravel_. Elke post heeft dezelfde opbouw als jullie posts. */
const FALLBACK_POSTS = [
  {
    images: ["/assets/images/travel/curacao.jpg", "/assets/images/travel/zakynthos.jpg"],
    link: "https://www.instagram.com/modatravel_/",
    caption: "Bon Bini !\n9 nachten verblijf in dit Boho Chick boutique hotel op Curacao 😍\nVertrek 31/08 vanuit AMS\n1279 euro inclusief ontbijtbuffet\nVan gezellige cafés tot stadsstranden en kleine winkeltjes, je vindt het allemaal op wandelafstand. Maar ook bij het Boho Bohemian Boutique kan je genieten van de lekkere gerechten.",
  },
  {
    images: ["/assets/images/travel/thailand.jpg"],
    link: "https://www.instagram.com/modatravel_/",
    caption: "Sawadee Thailand! 🌴\n12 nachten priverondreis van eiland naar eiland\nVertrek 15/10 vanuit BRU\n1890 euro inclusief binnenlandse vluchten en transfers\nVan de bruisende markten van Bangkok tot de verstilde stranden van Ko Lanta. Wij stippelen jouw ideale route uit langs de mooiste juwelen van de Thaise eilanden.",
  },
  {
    images: ["/assets/images/travel/lapland.jpg"],
    link: "https://www.instagram.com/modatravel_/",
    caption: "Wintersprookje in Lapland ❄️\n4 nachten begeleide groepsreis boven de poolcirkel\nVertrek 12/12 vanuit BRU\n1450 euro inclusief huskytocht en sneeuwscooter\nSlapen onder het noorderlicht, mushen met husky's en een sneeuwscootersafari door de ongerepte natuur. Een onvergetelijke Nederlandstalige groepsreis met vaste begeleiding.",
  },
  {
    images: ["/assets/images/travel/zakynthos.jpg"],
    link: "https://www.instagram.com/modatravel_/",
    caption: "Kalimera Zakynthos ☀️\n7 nachten in het viersterren Pelagos Blue Zante\nVertrek 05/07 vanuit BRU\n845 euro inclusief ontbijt en transfers\nEen oase van rust met zeezicht, azuurblauw water en Griekse gastvrijheid. Fly & Go en laat je verwennen aan het zwembad of op het strand.",
  },
  {
    images: ["/assets/images/travel/newyork.jpg"],
    link: "https://www.instagram.com/modatravel_/",
    caption: "The Big Apple 🗽\n5 nachten in hartje Manhattan\nVertrek 22/11 vanuit BRU\n1150 euro inclusief vlucht en hotel\nTimes Square, Central Park en de skyline vanaf de Empire State Building. Ontdek de stad die nooit slaapt, helemaal op jouw ritme.",
  },
  {
    images: ["/assets/images/travel/parijs.jpg"],
    link: "https://www.instagram.com/modatravel_/",
    caption: "Un weekend à Paris 🥐\n1 overnachting langs de Seine\nVertrek elke vrijdag vanuit Brussel\n79 euro inclusief ontbijt\nDe stad van de liefde op zijn mooist. Een korte, romantische ontsnapping met de trein, ideaal voor een verrassingsweekend.",
  },
];

document.addEventListener("DOMContentLoaded", () => {

  /* ---------- 1. Nav: achtergrond bij scrollen ---------- */
  const nav = document.getElementById("nav");
  if (nav) {
    const onScroll = () => nav.classList.toggle("is-scrolled", window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
  }

  /* ---------- 1b. Thema: standaard light, knop wisselt ---------- */
  const root = document.documentElement;
  if (root.getAttribute("data-theme") !== "dark") root.setAttribute("data-theme", "light");
  const themeBtn = document.getElementById("themeToggle");
  const metaTheme = document.querySelector('meta[name="theme-color"]');
  const syncMeta = () => {
    if (metaTheme) metaTheme.setAttribute("content", root.getAttribute("data-theme") === "light" ? "#f5f5f8" : "#0c0c0e");
  };
  syncMeta();
  if (themeBtn) {
    themeBtn.setAttribute("aria-pressed", String(root.getAttribute("data-theme") === "light"));
    themeBtn.addEventListener("click", () => {
      const next = root.getAttribute("data-theme") === "light" ? "dark" : "light";
      root.setAttribute("data-theme", next);
      themeBtn.setAttribute("aria-pressed", String(next === "light"));
      syncMeta();
    });
  }

  /* ---------- 2. Mobiel menu ---------- */
  const toggle = document.getElementById("navToggle");
  const links  = document.getElementById("navLinks");
  if (toggle && links) {
    const closeMenu = () => {
      links.classList.remove("is-open");
      toggle.classList.remove("is-open");
      toggle.setAttribute("aria-expanded", "false");
    };
    toggle.addEventListener("click", () => {
      const open = links.classList.toggle("is-open");
      toggle.classList.toggle("is-open", open);
      toggle.setAttribute("aria-expanded", String(open));
    });
    links.querySelectorAll("a").forEach(a => a.addEventListener("click", closeMenu));
  }

  /* ---------- 3. Reveal bij scrollen ---------- */
  const revealEls = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry, i) => {
        if (entry.isIntersecting) {
          const delay = entry.target.dataset.delay || (i % 4) * 80;
          setTimeout(() => entry.target.classList.add("is-visible"), delay);
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -8% 0px" });
    revealEls.forEach(el => io.observe(el));
  } else {
    revealEls.forEach(el => el.classList.add("is-visible"));
  }

  /* ---------- 4. Tellers (stats) ---------- */
  const counters = document.querySelectorAll(".stat__num[data-count]");
  const runCounter = (el) => {
    const target = parseInt(el.dataset.count, 10);
    const suffix = el.dataset.suffix || "";
    const duration = 1600;
    const start = performance.now();
    const step = (now) => {
      const p = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.floor(eased * target).toLocaleString("nl-BE") + suffix;
      if (p < 1) requestAnimationFrame(step);
      else el.textContent = target.toLocaleString("nl-BE") + suffix;
    };
    requestAnimationFrame(step);
  };
  if ("IntersectionObserver" in window) {
    const co = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) { runCounter(entry.target); co.unobserve(entry.target); }
      });
    }, { threshold: 0.6 });
    counters.forEach(c => co.observe(c));
  } else {
    counters.forEach(runCounter);
  }

  /* ---------- 5. Hero parallax (subtiel) ---------- */
  const heroImg = document.querySelector(".hero__img");
  if (heroImg && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    window.addEventListener("scroll", () => {
      const y = window.scrollY;
      if (y < window.innerHeight) heroImg.style.transform = `translateY(${y * 0.18}px) scale(1.08)`;
    }, { passive: true });
  }

  /* ---------- 6. "Laatste reizen"-galerij (Instagram-feed of voorbeelden) ---------- */
  initFeed();

  /* ---------- 7. Reisaanvraag-formulier (Web3Forms) ---------- */
  // Zelfde gratis dienst & key als de andere formulieren: aanvragen komen
  // per e-mail binnen. Zonder geldige key valt het netjes terug op mailto.
  const WEB3FORMS_ACCESS_KEY = "b15f5257-ac69-4f87-8c9f-99a86f80578a";

  const form = document.getElementById("quoteForm");
  const note = document.getElementById("formNote");
  if (form && note) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();

      if (!form.checkValidity()) {
        note.textContent = "Vul aub alle verplichte velden correct in.";
        note.className = "booking__note is-err";
        form.reportValidity();
        return;
      }

      note.textContent = "Bezig met versturen…";
      note.className = "booking__note";

      const data = Object.fromEntries(new FormData(form).entries());

      const payload = {
        access_key: WEB3FORMS_ACCESS_KEY,
        subject: `🧳 Nieuwe reisaanvraag van ${data.name || "de website"}`,
        from_name: "Moda Travel website",
        replyto: data.email || "",
        botcheck: form.botcheck && form.botcheck.checked ? true : false,
        "👤 Naam": data.name || "-",
        "📞 Telefoonnummer": data.phone || "-",
        "✉️ E-mailadres": data.email || "-",
        "🌍 Gewenste bestemming": data.destination || "-",
        "🧭 Type reis": data.triptype || "-",
        "🗓️ Reisperiode": data.period || "-",
        "👥 Aantal reizigers": data.travellers || "-",
        "💶 Budget (indicatief)": data.budget || "-",
        "📝 Opmerkingen": data.notes || "-",
      };

      fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify(payload),
      })
        .then((res) => res.json())
        .then((json) => {
          if (!json.success) throw new Error(json.message || "verzenden mislukt");
          note.textContent = "Bedankt! Uw reisaanvraag is verstuurd, wij nemen snel contact op.";
          note.className = "booking__note is-ok";
          form.reset();
        })
        .catch(() => {
          const subject = encodeURIComponent(`Reisaanvraag van ${data.name || "website"}`);
          const body = encodeURIComponent(
            `Nieuwe reisaanvraag via de website:\n\n` +
            `Naam: ${data.name}\n` +
            `Telefoon: ${data.phone}\n` +
            `E-mail: ${data.email}\n` +
            `Gewenste bestemming: ${data.destination || "-"}\n` +
            `Type reis: ${data.triptype || "-"}\n` +
            `Reisperiode: ${data.period || "-"}\n` +
            `Aantal reizigers: ${data.travellers || "-"}\n` +
            `Budget: ${data.budget || "-"}\n` +
            `Opmerkingen: ${data.notes || "-"}\n`
          );
          window.location.href = `mailto:info@modatravel.be?subject=${subject}&body=${body}`;
          note.textContent = "We openen je e-mailprogramma om de aanvraag te versturen.";
          note.className = "booking__note is-ok";
        });
    });
  }

  /* ---------- 8. Jaartal in footer ---------- */
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();
});


/* =========================================================================
   Feed-logica
   ========================================================================= */
function initFeed() {
  const grid = document.getElementById("reisfeed");
  if (!grid) return;

  const feedUrl = (grid.dataset.feedUrl || INSTAGRAM_FEED_URL || "").trim();
  const fallbackUrl = grid.dataset.fallback || "/content/travel-posts.json";

  const showStatus = (msg) => {
    grid.innerHTML = `<p class="reisfeed__status">${msg}</p>`;
  };
  showStatus("Reizen worden geladen…");

  // 1) Is er een echte feed-URL? Probeer die eerst, val anders terug op de voorbeelden.
  if (feedUrl) {
    fetchJson(feedUrl)
      .then((raw) => {
        const items = normalizePosts(raw);
        if (items.length) { UIT_EIGEN_BESTAND = false; return renderFeed(grid, items); }
        return loadFallback(grid, fallbackUrl, showStatus);
      })
      .catch(() => loadFallback(grid, fallbackUrl, showStatus));
  } else {
    loadFallback(grid, fallbackUrl, showStatus);
  }
}

function loadFallback(grid, url, showStatus) {
  // Bij lokaal openen (file://) blokkeert de browser fetch van lokale bestanden.
  // Dan meteen de inline voorbeelden gebruiken, zonder onnodige foutmelding.
  if (location.protocol === "file:") { useInlineSamples(grid, showStatus); return Promise.resolve(); }
  // Anders eerst het (bewerkbare) JSON-bestand; lukt dat niet, val dan terug op
  // de inline voorbeelden, zodat de reizen ALTIJD tonen.
  return fetchJson(url)
    .then((raw) => {
      const items = normalizePosts(raw);
      if (items.length) { UIT_EIGEN_BESTAND = true; renderFeed(grid, items); }
      else useInlineSamples(grid, showStatus);
    })
    .catch(() => useInlineSamples(grid, showStatus));
}

function useInlineSamples(grid, showStatus) {
  const items = normalizePosts({ posts: FALLBACK_POSTS });
  UIT_EIGEN_BESTAND = true;
  if (items.length) renderFeed(grid, items);
  else showStatus("Binnenkort vind je hier onze laatste reizen. Volg ons alvast op Instagram.");
}

function fetchJson(url) {
  return fetch(url, { headers: { Accept: "application/json" } }).then((r) => {
    if (!r.ok) throw new Error("feed " + r.status);
    return r.json();
  });
}

// Alle gerenderde reizen.
let REIZEN = [];
// Komen ze uit content/travel-posts.json? Dan is er voor elke reis een eigen
// pagina gebouwd. Bij een live Instagram-feed bestaat die pagina niet en
// verwijzen we naar de post zelf.
let UIT_EIGEN_BESTAND = false;

/* Zet zowel onze eigen voorbeeld-vorm als de Behold-/Graph-vorm om naar één model:
   { images[], link, caption, + geparste velden }. Zo is de omschakeling naadloos. */
function normalizePosts(raw) {
  let list = [];
  if (Array.isArray(raw)) list = raw;
  else if (raw && Array.isArray(raw.posts)) list = raw.posts;       // onze voorbeelden / Behold
  else if (raw && Array.isArray(raw.items)) list = raw.items;       // JSON Feed-standaard
  else if (raw && Array.isArray(raw.data)) list = raw.data;         // Graph API

  const out = [];
  for (const p of list) {
    if (!p) continue;
    const images = collectImages(p);
    if (!images.length) continue;
    const link = p.link || p.permalink || p.url || "https://www.instagram.com/modatravel_/";
    const caption = (p.caption || p.prunedCaption || p.title || "").toString().trim();
    out.push(Object.assign({ images, link, caption }, parsePost(caption)));
  }
  return out.slice(0, FEED_MAX);
}

// Verzamel één of meerdere beeld-URL's uit een post (eigen vorm, Behold of Graph API).
function collectImages(p) {
  const imgs = [];
  const push = (u) => { if (typeof u === "string" && u && imgs.indexOf(u) === -1) imgs.push(u); };
  if (Array.isArray(p.images) && p.images.length) {
    p.images.forEach((x) => push(typeof x === "string" ? x : (x && (x.img || x.url || x.mediaUrl))));
  } else {
    const type = (p.mediaType || p.media_type || "").toString().toUpperCase();
    if (type === "VIDEO") push(p.thumbnailUrl || p.thumbnail_url);
    if (p.sizes) push(pickSize(p.sizes));
    push(p.img || p.mediaUrl || p.media_url || p.thumbnailUrl || p.thumbnail_url || p.image);
    if (p.children && Array.isArray(p.children.data)) {
      p.children.data.forEach((c) => c && push(c.media_url || c.thumbnail_url || (c.sizes && pickSize(c.sizes))));
    }
  }
  return imgs;
}

// Kies een nette maat uit een Behold 'sizes'-object.
function pickSize(sizes) {
  const s = sizes.medium || sizes.large || sizes.small || sizes.full;
  return s && s.mediaUrl ? s.mediaUrl : "";
}

/* Haal uit een Instagram-bijschrift automatisch de reisgegevens.
   Opbouw van jullie posts:
     titel / duur + hotel + bestemming / "Vertrek dd/mm vanuit XXX" /
     "<prijs> euro inclusief ..." / omschrijving
   Elk niet-herkend veld blijft leeg; de omschrijving valt terug op de volle tekst. */
function parsePost(caption) {
  const out = { title: "", summary: "", price: "", priceNote: "", departure: "", airport: "", duration: "", destination: "", description: "" };
  const text = (caption || "").replace(/\r/g, "").trim();
  if (!text) return out;
  const lines = text.split("\n").map((l) => l.trim()).filter(Boolean);

  // Prijs (+ wat inbegrepen)
  const priceLine = lines.find((l) => /(\d[\d.\s]*)\s*(?:euro|€)/i.test(l)) || "";
  const priceM = priceLine.match(/(\d[\d.\s]*)\s*(?:euro|€)/i);
  if (priceM) {
    const digits = priceM[1].replace(/[^\d]/g, "");
    if (digits) out.price = "€ " + Number(digits).toLocaleString("nl-BE");
    const incl = priceLine.match(/inclusief\s+(.+)$/i);
    if (incl) out.priceNote = "inclusief " + incl[1].trim();
  }

  // Vertrekdatum + luchthaven
  const depLine = lines.find((l) => /vertrek/i.test(l)) || "";
  const depM = depLine.match(/vertrek\s+(.+?)(?:\s+vanuit\s+|$)/i);
  if (depM) out.departure = depM[1].trim();
  const airM = (depLine || text).match(/vanuit\s+([A-Z]{3}\b|[A-Z][a-zéèëï]+)/);
  if (airM) out.airport = airM[1].trim();

  // Duur
  const durM = text.match(/(\d+)\s*(nacht(?:en)?|overnachting(?:en)?|dag(?:en)?)/i);
  if (durM) out.duration = durM[1] + " " + durM[2].toLowerCase();

  // Titel + samenvatting (subtitel)
  out.title = lines[0] || "";
  if (lines[1] && !/vertrek/i.test(lines[1]) && !/(euro|€)/i.test(lines[1])) out.summary = lines[1];

  // Bestemming (best-effort): na "op|naar|in " met een hoofdletterwoord
  const destSrc = out.summary || text;
  const destM = destSrc.match(/\b(?:op|naar|in)\s+([A-Z][\wéèëï]+(?:\s+[A-Z][\wéèëï]+)?)/);
  if (destM) out.destination = destM[1].trim();

  // Omschrijving = de regels die geen herkende structuurregel zijn
  const structural = [lines[0], out.summary, depLine, priceLine].filter(Boolean);
  out.description = lines.filter((l) => structural.indexOf(l) === -1).join("\n").trim();

  return out;
}

/** Maakt van een titel hetzelfde webadres als tijdens het bouwen (src/lib/reis.mjs). */
function maakSlug(tekst, reserve) {
  const t = (tekst || "")
    .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    .replace(/[^\p{L}\p{N}]+/gu, "-")
    .replace(/^-+|-+$/g, "")
    .toLowerCase();
  return t || ("reis-" + reserve);
}

function renderFeed(grid, items) {
  REIZEN = items;

  grid.innerHTML = items.map((it, i) => {
    const cover = it.images[0];
    const title = it.title || "Reis van Moda Travel";
    // Uit ons eigen bestand? Dan bestaat er een volwaardige reispagina.
    const doel = UIT_EIGEN_BESTAND ? "/travel/reizen/" + maakSlug(it.title, i) + "/" : it.link;
    const extern = UIT_EIGEN_BESTAND ? "" : ' target="_blank" rel="noopener"';
    const badges = [];
    if (it.price) badges.push(`<span class="reiscard__badge">💶 ${escapeHtml(it.price)}</span>`);
    if (it.duration) badges.push(`<span class="reiscard__badge">🌙 ${escapeHtml(it.duration)}</span>`);
    else if (it.departure) badges.push(`<span class="reiscard__badge">📅 ${escapeHtml(it.departure)}</span>`);
    const sum = it.summary || it.destination || "";
    return (
      `<a class="reiscard reveal" href="${escapeAttr(doel)}"${extern}` +
      ` aria-label="Bekijk reis: ${escapeAttr(title)}">` +
        `<div class="reiscard__media">` +
          `<img src="${escapeAttr(cover)}" alt="${escapeAttr(title)}" loading="lazy" />` +
          (it.images.length > 1 ? `<span class="reiscard__count" aria-hidden="true">1/${it.images.length}</span>` : ``) +
          (badges.length ? `<div class="reiscard__badges">${badges.join("")}</div>` : ``) +
        `</div>` +
        `<div class="reiscard__body">` +
          `<h3 class="reiscard__title">${escapeHtml(title)}</h3>` +
          (sum ? `<p class="reiscard__sum">${escapeHtml(sum)}</p>` : ``) +
          `<span class="reiscard__more">Bekijk reis →</span>` +
        `</div>` +
      `</a>`
    );
  }).join("");

  if ("IntersectionObserver" in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e, i) => {
        if (e.isIntersecting) {
          setTimeout(() => e.target.classList.add("is-visible"), (i % 3) * 80);
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.1 });
    grid.querySelectorAll(".reveal").forEach((el) => io.observe(el));
  } else {
    grid.querySelectorAll(".reveal").forEach((el) => el.classList.add("is-visible"));
  }
}

/* ---------- Fotovenster op de reispagina ---------- */
document.addEventListener("DOMContentLoaded", function () {
  const box = document.getElementById("fotobox");
  const foto = document.getElementById("fotoboxFoto");
  const teller = document.getElementById("fotoboxTeller");
  if (!box || !foto) return;

  const lijst = (box.dataset.fotos || "").split("|").filter(Boolean);
  let index = 0, vorigeFocus = null;

  function toon(i) {
    if (!lijst.length) return;
    index = (i + lijst.length) % lijst.length;
    foto.src = lijst[index];
    foto.alt = "Foto " + (index + 1) + " van " + lijst.length;
    if (teller) teller.textContent = (index + 1) + " / " + lijst.length;
  }
  function sluiten() {
    box.classList.remove("is-open");
    box.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
    if (vorigeFocus && vorigeFocus.focus) vorigeFocus.focus();
  }

  document.addEventListener("click", function (e) {
    const tegel = e.target.closest(".reisfoto");
    if (tegel) {
      vorigeFocus = document.activeElement;
      toon(parseInt(tegel.dataset.i, 10) || 0);
      box.classList.add("is-open");
      box.setAttribute("aria-hidden", "false");
      document.body.style.overflow = "hidden";
      const sluit = box.querySelector(".fotobox__sluit");
      if (sluit) sluit.focus();
      return;
    }
    if (e.target.closest("[data-sluit]")) { sluiten(); return; }
    const stap = e.target.closest("[data-stap]");
    if (stap && box.classList.contains("is-open")) toon(index + parseInt(stap.dataset.stap, 10));
  });

  document.addEventListener("keydown", function (e) {
    if (!box.classList.contains("is-open")) return;
    if (e.key === "Escape") sluiten();
    if (e.key === "ArrowRight") toon(index + 1);
    if (e.key === "ArrowLeft") toon(index - 1);
  });
});

/* ---------- Komt de bezoeker van een reispagina? Dan het formulier alvast invullen ---------- */
document.addEventListener("DOMContentLoaded", function () {
  const veld = document.getElementById("destination");
  if (!veld) return;
  const slug = new URLSearchParams(location.search).get("reis");
  if (!slug) return;

  fetch("/content/travel-posts.json", { headers: { Accept: "application/json" } })
    .then((r) => r.json())
    .then((raw) => {
      const posts = normalizePosts(raw);
      const reis = posts.find((p, i) => maakSlug(p.title, i) === slug);
      if (!reis) return;
      veld.value = reis.destination || reis.title || "";
      const notities = document.getElementById("notes");
      if (notities) {
        const ref = "Interesse in: " + (reis.title || "") + (reis.departure ? " (vertrek " + reis.departure + ")" : "");
        notities.value = notities.value ? notities.value + "\n" + ref : ref;
      }
    })
    .catch(() => {});
});

function escapeHtml(s) {
  return String(s).replace(/[&<>"']/g, (c) => (
    { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]
  ));
}
function escapeAttr(s) { return escapeHtml(s); }
