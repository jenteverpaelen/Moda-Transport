import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

/* =========================================================
   REIZEN
   ---------------------------------------------------------
   Elke reis is één bestand in src/content/reizen/. De naam van het
   bestand is meteen het webadres: bon-bini.md wordt
   /travel/reizen/bon-bini/.

   Hieronder staat welke gegevens een reis heeft. Het reisbureau vult
   die in via het beheerscherm op /admin/ — dat scherm gebruikt exact
   dezelfde velden (public/admin/config.yml). Wijzig je hier iets, pas
   het dan ook daar aan.

   Enkel titel, bestemming en minstens één foto zijn verplicht; de rest
   mag leeg blijven en verdwijnt dan gewoon van de pagina.
   ========================================================= */
const reizen = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/reizen" }),
  schema: ({ image }) =>
    z.object({
      titel: z.string(),
      bestemming: z.string(),
      samenvatting: z.string().optional(),

      // Zelfde vier stijlen als op /travel/reisstijlen/
      reisstijl: z
        .enum(["Luxereizen", "Avontuurlijke reizen", "Familiereizen", "Romantische reizen"])
        .optional(),
      // Kort woordje op de tegel, bv. "Zon & zee". Leeg = de reisstijl.
      label: z.string().optional(),

      prijs: z.number().optional(),
      prijsnoot: z.string().optional(),
      // Eén vaste vertrekdatum, of vrije tekst voor reizen die vaker vertrekken
      // ("elke vrijdag"). Staat er een datum, dan wint die.
      vertrek: z.coerce.date().optional(),
      vertrektekst: z.string().optional(),
      duur: z.string().optional(),
      luchthaven: z.string().optional(),
      inbegrepen: z.array(z.string()).default([]),

      // De eerste foto is de hoofdfoto: die komt op de tegel en bovenaan
      // de reispagina. Ze worden bij het bouwen automatisch verkleind.
      fotos: z.array(image()).min(1),

      uitgelicht: z.boolean().default(false), // grote tegel in het mozaïek
      zichtbaar: z.boolean().default(true),   // uit = niet op de site, maar niet verwijderd
      volgorde: z.number().optional(),        // laag getal = eerst
      instagram: z.string().url().optional(),
    }),
});

export const collections = { reizen };
