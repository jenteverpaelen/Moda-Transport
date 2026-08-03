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
   een eigen Netlify-functie). Zodra die is ingevuld, verschijnen de echte
   posts automatisch, in exact dezelfde stijl. Meer is er niet nodig.

   Voorbeeld:
     const INSTAGRAM_FEED_URL = "https://feeds.behold.so/XXXXXXXXXXXX";
   ========================================================================= */
const INSTAGRAM_FEED_URL = "";

// Aantal posts dat we tonen (Behold-gratis geeft er max. 6; een betaald plan
// of een eigen functie meer). Voorbeelden vullen aan als er minder zijn.
const FEED_MAX = 8;

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
  const fallbackUrl = grid.dataset.fallback || "../content/travel-posts.json";

  const showStatus = (msg) => {
    grid.innerHTML = `<p class="reisfeed__status">${msg}</p>`;
  };
  showStatus("Reizen worden geladen…");

  // 1) Is er een echte feed-URL? Probeer die eerst, val anders terug op de voorbeelden.
  if (feedUrl) {
    fetchJson(feedUrl)
      .then((raw) => {
        const items = normalizePosts(raw);
        if (items.length) return renderFeed(grid, items);
        return loadFallback(grid, fallbackUrl, showStatus);
      })
      .catch(() => loadFallback(grid, fallbackUrl, showStatus));
  } else {
    loadFallback(grid, fallbackUrl, showStatus);
  }
}

function loadFallback(grid, url, showStatus) {
  return fetchJson(url)
    .then((raw) => {
      const items = normalizePosts(raw);
      if (items.length) renderFeed(grid, items);
      else showStatus("Binnenkort vind je hier onze laatste reizen. Volg ons alvast op Instagram.");
    })
    .catch(() => showStatus("Binnenkort vind je hier onze laatste reizen. Volg ons alvast op Instagram."));
}

function fetchJson(url) {
  return fetch(url, { headers: { Accept: "application/json" } }).then((r) => {
    if (!r.ok) throw new Error("feed " + r.status);
    return r.json();
  });
}

/* Zet zowel onze eigen voorbeeld-vorm als de Behold-vorm om naar
   { img, link, caption }. Zo is de omschakeling naar de live feed naadloos. */
function normalizePosts(raw) {
  let list = [];
  if (Array.isArray(raw)) list = raw;
  else if (raw && Array.isArray(raw.posts)) list = raw.posts;       // onze voorbeelden / Behold
  else if (raw && Array.isArray(raw.items)) list = raw.items;       // JSON Feed-standaard
  else if (raw && Array.isArray(raw.data)) list = raw.data;         // Graph API

  const out = [];
  for (const p of list) {
    if (!p) continue;
    // Beeld: eigen 'img', of Behold sizes/mediaUrl, of Graph media_url.
    let img =
      p.img ||
      (p.sizes && (pickSize(p.sizes))) ||
      p.mediaUrl || p.media_url || p.thumbnailUrl || p.thumbnail_url || p.image || "";
    // Video's: gebruik de poster/thumbnail i.p.v. de videostream.
    const type = (p.mediaType || p.media_type || "").toString().toUpperCase();
    if (type === "VIDEO" && (p.thumbnailUrl || p.thumbnail_url)) {
      img = p.thumbnailUrl || p.thumbnail_url;
    }
    if (!img) continue;

    const link = p.link || p.permalink || p.url || "https://www.instagram.com/modatravel_/";
    const caption = (p.caption || p.prunedCaption || p.title || "").toString().trim();
    out.push({ img, link, caption });
  }
  return out.slice(0, FEED_MAX);
}

// Kies een nette maat uit een Behold 'sizes'-object.
function pickSize(sizes) {
  const s = sizes.medium || sizes.large || sizes.small || sizes.full;
  return s && s.mediaUrl ? s.mediaUrl : "";
}

function renderFeed(grid, items) {
  const igBadge =
    '<span class="reisfeed__badge" aria-hidden="true">' +
    '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">' +
    '<rect x="2" y="2" width="20" height="20" rx="5"/><circle cx="12" cy="12" r="4"/><line x1="17.5" y1="6.5" x2="17.5" y2="6.5"/></svg></span>';

  grid.innerHTML = items.map((it, i) => {
    const cap = it.caption ? `<span>${escapeHtml(it.caption)}</span>` : "";
    const alt = it.caption ? escapeHtml(it.caption.slice(0, 90)) : "Reis van Moda Travel";
    return (
      `<a class="reisfeed__item reveal" href="${escapeAttr(it.link)}" target="_blank" rel="noopener"` +
      ` aria-label="Bekijk deze reis op Instagram">` +
      `<img src="${escapeAttr(it.img)}" alt="${alt}" loading="lazy" />` +
      igBadge +
      `<span class="reisfeed__cap">${cap}</span>` +
      `</a>`
    );
  }).join("");

  // Nieuw ingevoegde tegels ook mooi laten inkomen.
  if ("IntersectionObserver" in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e, i) => {
        if (e.isIntersecting) {
          setTimeout(() => e.target.classList.add("is-visible"), (i % 4) * 70);
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.1 });
    grid.querySelectorAll(".reveal").forEach((el) => io.observe(el));
  } else {
    grid.querySelectorAll(".reveal").forEach((el) => el.classList.add("is-visible"));
  }
}

function escapeHtml(s) {
  return String(s).replace(/[&<>"']/g, (c) => (
    { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]
  ));
}
function escapeAttr(s) { return escapeHtml(s); }
