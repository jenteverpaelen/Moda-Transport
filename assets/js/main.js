/* =========================================================
   MODA TRAVEL — Interactie & animaties
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {

  /* ---------- 1. Nav: achtergrond bij scrollen ---------- */
  const nav = document.getElementById("nav");
  const onScroll = () => nav.classList.toggle("is-scrolled", window.scrollY > 40);
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  /* ---------- 1b. Thema: licht / donker ---------- */
  // De site opent BEWUST altijd in dark mode; de knop laat de
  // bezoeker tijdelijk naar light mode wisselen (niet onthouden).
  const root = document.documentElement;
  root.setAttribute("data-theme", "dark");
  const themeBtn = document.getElementById("themeToggle");
  const metaTheme = document.querySelector('meta[name="theme-color"]');
  if (themeBtn) {
    themeBtn.addEventListener("click", () => {
      const next = root.getAttribute("data-theme") === "light" ? "dark" : "light";
      root.setAttribute("data-theme", next);
      themeBtn.setAttribute("aria-pressed", String(next === "light"));
      if (metaTheme) metaTheme.setAttribute("content", next === "light" ? "#f5f5f8" : "#0c0c0e");
    });
  }

  /* ---------- 2. Mobiel menu ---------- */
  const toggle = document.getElementById("navToggle");
  const links = document.getElementById("navLinks");

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

  /* ---------- 3. Reveal bij scrollen ---------- */
  const revealEls = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry, i) => {
        if (entry.isIntersecting) {
          // kleine trapsgewijze vertraging voor items in dezelfde groep
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
      const eased = 1 - Math.pow(1 - p, 3); // easeOutCubic
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

  /* ---------- 6. Boekingsformulier ---------- */
  const form = document.getElementById("bookingForm");
  const note = document.getElementById("formNote");

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    if (!form.checkValidity()) {
      note.textContent = "Vul aub alle verplichte velden correct in.";
      note.className = "booking__note is-err";
      form.reportValidity();
      return;
    }

    const data = Object.fromEntries(new FormData(form).entries());

    // Standaard: open de e-mailclient met een vooraf ingevulde aanvraag.
    // (Voor automatische verzending zonder e-mailclient: koppel later een
    //  formulierdienst zoals Formspree of Netlify Forms — zie README.)
    const subject = encodeURIComponent(`Ritaanvraag — ${data.name}`);
    const body = encodeURIComponent(
      `Nieuwe ritaanvraag via de website:\n\n` +
      `Naam: ${data.name}\n` +
      `Telefoon: ${data.phone}\n` +
      `E-mail: ${data.email}\n` +
      `Ophaaladres: ${data.from}\n` +
      `Bestemming: ${data.to}\n` +
      `Datum & tijd: ${data.date}\n` +
      `Aantal personen: ${data.pax}\n` +
      `Opmerkingen: ${data.notes || "-"}\n`
    );

    const to = window.MODA_EMAIL || "info@moda-sneltransport.be";
    window.location.href = `mailto:${to}?subject=${subject}&body=${body}`;

    note.textContent = "Bedankt! Uw e-mailprogramma opent met de aanvraag — verstuur die en wij nemen snel contact op.";
    note.className = "booking__note is-ok";
    form.reset();
  });

  /* ---------- 7. Jaartal in footer ---------- */
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();
});
