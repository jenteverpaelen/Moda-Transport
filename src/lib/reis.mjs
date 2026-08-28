/* =========================================================
   Reisgegevens uitlezen
   ---------------------------------------------------------
   Haalt uit een Instagram-bijschrift de titel, prijs, vertrekdatum,
   duur en luchthaven. Dezelfde regels als in public/assets/js/travel.js,
   maar dan tijdens het bouwen, zodat elke reis een eigen pagina krijgt.
   Wijzig je hier iets, pas het dan ook daar aan.
   ========================================================= */

export function leesReis(caption) {
  const uit = { titel: "", samenvatting: "", prijs: "", prijsnoot: "",
                vertrek: "", luchthaven: "", duur: "", bestemming: "", omschrijving: "" };
  const tekst = (caption || "").replace(/\r/g, "").trim();
  if (!tekst) return uit;
  const regels = tekst.split("\n").map((r) => r.trim()).filter(Boolean);

  const prijsregel = regels.find((r) => /(\d[\d.\s]*)\s*(?:euro|€)/i.test(r)) || "";
  const p = prijsregel.match(/(\d[\d.\s]*)\s*(?:euro|€)/i);
  if (p) {
    const cijfers = p[1].replace(/[^\d]/g, "");
    if (cijfers) uit.prijs = "€ " + Number(cijfers).toLocaleString("nl-BE");
    const incl = prijsregel.match(/inclusief\s+(.+)$/i);
    if (incl) uit.prijsnoot = "inclusief " + incl[1].trim();
  }

  const vertrekregel = regels.find((r) => /vertrek/i.test(r)) || "";
  const v = vertrekregel.match(/vertrek\s+(.+?)(?:\s+vanuit\s+|$)/i);
  if (v) uit.vertrek = v[1].trim();
  const l = (vertrekregel || tekst).match(/vanuit\s+([A-Z]{3}\b|[A-Z][a-zéèëï]+)/);
  if (l) uit.luchthaven = l[1].trim();

  const d = tekst.match(/(\d+)\s*(nacht(?:en)?|overnachting(?:en)?|dag(?:en)?)/i);
  if (d) uit.duur = d[1] + " " + d[2].toLowerCase();

  uit.titel = regels[0] || "";
  if (regels[1] && !/vertrek/i.test(regels[1]) && !/(euro|€)/i.test(regels[1])) uit.samenvatting = regels[1];

  const bron = uit.samenvatting || tekst;
  const b = bron.match(/\b(?:op|naar|in)\s+([A-Z][\wéèëï]+(?:\s+[A-Z][\wéèëï]+)?)/);
  if (b) uit.bestemming = b[1].trim();

  const structureel = [regels[0], uit.samenvatting, vertrekregel, prijsregel].filter(Boolean);
  uit.omschrijving = regels.filter((r) => structureel.indexOf(r) === -1).join("\n").trim();
  return uit;
}

/** Maakt van een titel een net webadres, bv. "Bon Bini !" -> "bon-bini" */
export function maakSlug(tekst, reserve) {
  const s = (tekst || "")
    .normalize("NFD").replace(/[̀-ͯ]/g, "")   // accenten weg
    .replace(/[^\p{L}\p{N}]+/gu, "-")                    // rest wordt streepje
    .replace(/^-+|-+$/g, "")
    .toLowerCase();
  return s || ("reis-" + reserve);
}
