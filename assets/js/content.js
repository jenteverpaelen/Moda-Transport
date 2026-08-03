/* =========================================================
   MODA — Inhoud inladen (contactgegevens)
   ---------------------------------------------------------
   Leest content/settings.json en vult de contactgegevens
   in op de site. Zo kan de klant die via de admin-pagina
   (/admin) aanpassen zonder code aan te raken.

   Werkt niet of bestand niet gevonden? Dan blijft gewoon
   staan wat er in index.html is ingevuld — er breekt niets.
   ========================================================= */
(function () {
  fetch("../content/settings.json", { cache: "no-store" })
    .then(function (res) {
      if (!res.ok) throw new Error("settings " + res.status);
      return res.json();
    })
    .then(applySettings)
    .catch(function (err) {
      // Stilletjes terugvallen op de vaste waarden in de HTML.
      console.warn("[Moda] content/settings.json niet geladen, vaste gegevens blijven staan:", err);
    });

  function applySettings(s) {
    var telLink = (s.telefoon_link || "").trim();
    var telText = (s.telefoon_weergave || "").trim();
    var email   = (s.email || "").trim();
    var adres   = (s.adres || "").trim();
    var wa      = (s.whatsapp_nummer || "").replace(/[^0-9]/g, "");
    var waMsg   = (s.whatsapp_bericht || "").trim();

    // Beschikbaar maken voor het boekingsformulier (main.js)
    if (email) window.MODA_EMAIL = email;

    // Telefoon (kan meerdere keren voorkomen: contact + footer)
    each("[data-content='phone']", function (el) {
      if (telLink) el.setAttribute("href", "tel:" + telLink);
      if (telText) el.textContent = telText;
    });

    // E-mail
    each("[data-content='email']", function (el) {
      if (email) {
        el.setAttribute("href", "mailto:" + email);
        el.textContent = email;
      }
    });

    // Adres (tekst + Google Maps-link)
    each("[data-content='address']", function (el) {
      if (adres) {
        el.setAttribute(
          "href",
          "https://www.google.com/maps/search/?api=1&query=" + encodeURIComponent(adres)
        );
        el.textContent = adres;
      }
    });

    // WhatsApp-knoppen (hero + zwevende knop)
    if (wa) {
      var href = "https://wa.me/" + wa + (waMsg ? "?text=" + encodeURIComponent(waMsg) : "");
      each("[data-content='whatsapp']", function (el) {
        el.setAttribute("href", href);
      });
    }
  }

  function each(sel, fn) {
    var nodes = document.querySelectorAll(sel);
    for (var i = 0; i < nodes.length; i++) fn(nodes[i]);
  }
})();
