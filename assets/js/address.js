/* =========================================================
   MODA — Adres-autocomplete voor het contactformulier
   ---------------------------------------------------------
   Terwijl de bezoeker het ophaaladres typt, verschijnen echte
   adressuggesties (via Photon / OpenStreetMap, gratis). Kiest
   men een adres, dan wordt de POSTCODE automatisch ingevuld.
   ========================================================= */
(function () {
  // Zoekopdracht wordt licht "gebiast" richting Heusden-Zolder
  // zodat lokale adressen bovenaan komen.
  var BIAS = { lat: 51.0271799, lon: 5.2654197 };

  function searchAddresses(query) {
    var url = "https://photon.komoot.io/api/?limit=6&lang=default" +
              "&lat=" + BIAS.lat + "&lon=" + BIAS.lon + "&location_bias_scale=0.5" +
              "&q=" + encodeURIComponent(query);
    return fetch(url)
      .then(function (res) { if (!res.ok) throw new Error("network"); return res.json(); })
      .then(function (data) {
        return (data.features || [])
          .filter(function (f) { return (f.properties.countrycode || "").toUpperCase() === "BE"; })
          .map(function (f) {
            var p = f.properties;
            var street = p.name || p.street || "";
            var line1 = [street, p.housenumber].filter(Boolean).join(" ") || (p.city || "");
            var line2 = [p.postcode, p.city].filter(Boolean).join(" ");
            return {
              street: street,
              housenumber: p.housenumber || "",
              postcode: p.postcode || "",
              city: p.city || "",
              line1: line1,
              line2: line2,
              full: [line1, line2].filter(Boolean).join(", ")
            };
          })
          .filter(function (s) { return s.line1; })
          .filter(function (s, i, arr) { return arr.findIndex(function (x) { return x.full === s.full; }) === i; });
      });
  }

  function extractHouseNumber(text) {
    var m = text.match(/\b(\d+\s?[a-zA-Z]?(?:\s?bus\s?\w+)?)\b/i);
    return m ? m[1].trim() : "";
  }

  function attach(input, list, onSelect) {
    var items = [], active = -1, debounce;

    function close() {
      list.hidden = true; list.innerHTML = ""; active = -1; items = [];
      input.setAttribute("aria-expanded", "false");
    }
    function render(arr) {
      items = arr; active = -1;
      if (!arr.length) { close(); return; }
      list.innerHTML = arr.map(function (s, i) {
        return '<li class="autocomplete__item" role="option" data-i="' + i + '">' +
               '<span class="autocomplete__line1">' + s.line1 + '</span>' +
               '<span class="autocomplete__line2">' + s.line2 + '</span></li>';
      }).join("");
      list.hidden = false;
      input.setAttribute("aria-expanded", "true");
    }
    function pick(i) {
      var s = items[i]; if (!s) return;
      var hn = s.housenumber;
      if (!hn) { var typed = extractHouseNumber(input.value); if (typed) hn = typed; }
      var addr = [[s.street, hn].filter(Boolean).join(" "), s.city].filter(Boolean).join(", ");
      input.value = addr || s.full;
      close();
      if (typeof onSelect === "function") onSelect(s);
    }
    function setActive(i) {
      var els = list.querySelectorAll(".autocomplete__item");
      for (var k = 0; k < els.length; k++) els[k].classList.remove("is-active");
      if (i >= 0 && els[i]) { els[i].classList.add("is-active"); els[i].scrollIntoView({ block: "nearest" }); }
      active = i;
    }

    input.addEventListener("input", function () {
      var q = input.value.trim();
      clearTimeout(debounce);
      if (q.length < 3) { close(); return; }
      debounce = setTimeout(function () {
        searchAddresses(q)
          .then(function (r) { if (input.value.trim() === q) render(r); })
          .catch(function () { close(); });
      }, 280);
    });
    input.addEventListener("keydown", function (e) {
      if (list.hidden) return;
      if (e.key === "ArrowDown") { e.preventDefault(); setActive(Math.min(active + 1, items.length - 1)); }
      else if (e.key === "ArrowUp") { e.preventDefault(); setActive(Math.max(active - 1, 0)); }
      else if (e.key === "Enter" && active >= 0) { e.preventDefault(); pick(active); }
      else if (e.key === "Escape") { close(); }
    });
    list.addEventListener("mousedown", function (e) {
      var it = e.target.closest(".autocomplete__item");
      if (it) { e.preventDefault(); pick(parseInt(it.dataset.i, 10)); }
    });
    document.addEventListener("click", function (e) {
      if (!list.hidden && !e.target.closest(".autocomplete")) close();
    });
  }

  window.ModaAddress = { attach: attach };

  document.addEventListener("DOMContentLoaded", function () {
    var from = document.getElementById("from");
    var list = document.getElementById("from-ac-list");
    var postcode = document.getElementById("postcode");
    if (from && list) {
      attach(from, list, function (s) {
        if (postcode && s.postcode) postcode.value = s.postcode;
      });
    }
  });
})();
