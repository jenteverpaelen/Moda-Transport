import { getCollection } from "astro:content";

/* =========================================================
   REIZEN OPHALEN EN NETJES TONEN
   ---------------------------------------------------------
   Kleine hulpjes die de bestemmingen-pagina en de reispagina's
   allebei gebruiken, zodat een prijs of een datum overal op
   exact dezelfde manier op het scherm komt.
   ========================================================= */

/** Alle reizen die op de site mogen staan, in de juiste volgorde. */
export async function alleReizen() {
  const lijst = await getCollection("reizen", ({ data }) => data.zichtbaar !== false);
  return lijst.sort((a, b) => {
    // Eerst op het volgnummer dat het reisbureau zelf kan invullen,
    // en bij gelijke stand op de vertrekdatum (vroegste eerst).
    const va = a.data.volgorde ?? 9999;
    const vb = b.data.volgorde ?? 9999;
    if (va !== vb) return va - vb;
    const da = a.data.vertrek ? a.data.vertrek.getTime() : Number.MAX_SAFE_INTEGER;
    const db = b.data.vertrek ? b.data.vertrek.getTime() : Number.MAX_SAFE_INTEGER;
    if (da !== db) return da - db;
    return a.data.titel.localeCompare(b.data.titel, "nl-BE");
  });
}

/** 1279 -> "€ 1.279" */
export function prijsTekst(prijs) {
  if (typeof prijs !== "number" || Number.isNaN(prijs)) return "";
  return "€ " + prijs.toLocaleString("nl-BE");
}

const datumOpmaak = new Intl.DateTimeFormat("nl-BE", {
  day: "numeric",
  month: "long",
  year: "numeric",
  timeZone: "UTC", // anders schuift een datum een dag op
});

/** Een vaste datum ("31 augustus 2026") of de vrije tekst ("elke vrijdag"). */
export function vertrekTekst(data) {
  if (data.vertrek) return datumOpmaak.format(data.vertrek);
  return data.vertrektekst || "";
}

/** Korte versie voor op een tegel of knop: "31/08" of "elke vrijdag". */
export function vertrekKort(data) {
  if (data.vertrek) {
    const d = data.vertrek;
    return String(d.getUTCDate()).padStart(2, "0") + "/" + String(d.getUTCMonth() + 1).padStart(2, "0");
  }
  return data.vertrektekst || "";
}

/** Het woordje op de tegel: het eigen label, anders de reisstijl. */
export function tegelLabel(data) {
  return data.label || data.reisstijl || "";
}
