/* =========================================================
   MODA TRANSPORT — Interactie voor de transportpagina (/transport)
   ---------------------------------------------------------
   Zelfstandig scriptje: nav, thema, mobiel menu, reveal-animaties,
   tellers, jaartal én het offerteformulier (via Web3Forms).
   Bewust los van het luchthavengedeelte (main.js/calculator.js).
   ========================================================= */

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

  /* ---------- 6. Offerteformulier (Web3Forms) ---------- */
  // Zelfde gratis dienst & key als het luchthavenformulier: aanvragen komen
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
        subject: `🚚 Nieuwe transportaanvraag van ${data.name || "de website"}`,
        from_name: "Moda Transport website",
        replyto: data.email || "",
        botcheck: form.botcheck && form.botcheck.checked ? true : false,
        "👤 Naam": data.name || "-",
        "📞 Telefoonnummer": data.phone || "-",
        "✉️ E-mailadres": data.email || "-",
        "📦 Wat vervoeren": data.goods || "-",
        "📍 Ophaaladres": data.pickup || "-",
        "🎯 Leveradres": data.dropoff || "-",
        "🗓️ Gewenste datum": data.date || "-",
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
          note.textContent = "Bedankt! Uw transportaanvraag is verstuurd, wij nemen snel contact op.";
          note.className = "booking__note is-ok";
          form.reset();
        })
        .catch(() => {
          const subject = encodeURIComponent(`Transportaanvraag van ${data.name || "website"}`);
          const body = encodeURIComponent(
            `Nieuwe transportaanvraag via de website:\n\n` +
            `Naam: ${data.name}\n` +
            `Telefoon: ${data.phone}\n` +
            `E-mail: ${data.email}\n` +
            `Wat vervoeren: ${data.goods || "-"}\n` +
            `Ophaaladres: ${data.pickup || "-"}\n` +
            `Leveradres: ${data.dropoff || "-"}\n` +
            `Gewenste datum: ${data.date || "-"}\n` +
            `Opmerkingen: ${data.notes || "-"}\n`
          );
          window.location.href = `mailto:info@moda-sneltransport.be?subject=${subject}&body=${body}`;
          note.textContent = "We openen je e-mailprogramma om de aanvraag te versturen.";
          note.className = "booking__note is-ok";
        });
    });
  }

  /* ---------- 7. Jaartal in footer ---------- */
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();
});

/* =========================================================================
   Fotovenster voor het wagenpark
   -------------------------------------------------------------------------
   Elke wagenkaart draagt zijn foto's in data-fotos. Klikken op een tegel
   opent het venster; daarna kan je bladeren met de pijlen of het toetsenbord.
   ========================================================================= */
document.addEventListener("DOMContentLoaded", function () {
  var box     = document.getElementById("fotobox");
  var foto    = document.getElementById("fotoboxFoto");
  var titel   = document.getElementById("fotoboxTitel");
  var teller  = document.getElementById("fotoboxTeller");
  if (!box || !foto) return;

  var lijst = [], index = 0, naam = "", vorigeFocus = null;

  function toon(i) {
    if (!lijst.length) return;
    index = (i + lijst.length) % lijst.length;      // rondlopen
    foto.src = lijst[index];
    foto.alt = naam + ", foto " + (index + 1) + " van " + lijst.length;
    titel.textContent = naam;
    teller.textContent = (index + 1) + " / " + lijst.length;
    // buren alvast inladen, zodat bladeren vlot voelt
    [index + 1, index - 1].forEach(function (n) {
      var v = new Image(); v.src = lijst[(n + lijst.length) % lijst.length];
    });
  }

  function open(fotos, wagen, start) {
    lijst = fotos; naam = wagen;
    vorigeFocus = document.activeElement;
    toon(start);
    box.classList.add("is-open");
    box.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
    var sluit = box.querySelector(".fotobox__sluit");
    if (sluit) sluit.focus();
  }

  function sluiten() {
    if (!box.classList.contains("is-open")) return;
    box.classList.remove("is-open");
    box.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
    if (vorigeFocus && vorigeFocus.focus) vorigeFocus.focus();
  }

  // Klik op een tegel opent het venster (via delegatie, dus ook voor later toegevoegde kaarten)
  document.addEventListener("click", function (e) {
    var tegel = e.target.closest(".fleet-thumb");
    if (tegel) {
      var houder = tegel.closest(".fleet-card__fotos");
      if (!houder) return;
      open(houder.dataset.fotos.split("|"), houder.dataset.wagen || "", parseInt(tegel.dataset.i, 10) || 0);
      return;
    }
    if (e.target.closest("[data-sluit]")) { sluiten(); return; }
    var stap = e.target.closest("[data-stap]");
    if (stap) toon(index + parseInt(stap.dataset.stap, 10));
  });

  document.addEventListener("keydown", function (e) {
    if (!box.classList.contains("is-open")) return;
    if (e.key === "Escape")     sluiten();
    if (e.key === "ArrowRight") toon(index + 1);
    if (e.key === "ArrowLeft")  toon(index - 1);
  });
});
