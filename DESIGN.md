# Ontwerpsysteem — moda-sneltransport.be

## Het concept: de terugrekening

Wie luchthavenvervoer zoekt heeft één vraag: *ga ik mijn vlucht halen?* Moda
beantwoordt die vraag elke dag aan de telefoon door terug te rekenen vanaf het
vertrekuur. Die berekening ís de site.

Alles telt terug vanaf één getal:

```
UW VLUCHT VERTREKT   10:35
BALIE DICHT          09:35   −1u00
U BENT BINNEN        08:35   −2u00
WIJ RIJDEN           07:20   −3u15
WIJ BELLEN AAN       07:05   −3u30
UW WEKKER            06:20   −4u15
```

De startpagina opent niet met een banner maar met dat bord, en het werkt: je
zet je vertrekuur en je luchthaven, en de hele pagina rekent mee. Het antwoordt
op de vraag waarmee de bezoeker kwam, nog voor hij zijn naam heeft gegeven.

Het bord is meteen de verkoop: onderaan staat de vaste prijs voor die
luchthaven, en de knop neemt alles mee naar het reserveringsformulier.

## Waarom donker

Niet als effect. **Hun ritten vertrekken om vier uur 's ochtends.** De klant
plant die rit de avond ervoor, in bed, op een telefoon, in het donker. Dat is
het gebruiksmoment, en daar hoort het scherm bij.

De hero kleurt mee met wat je invult: rekent het bord een ophaaluur uit vóór
zeven uur, dan wordt de achtergrond de nachtfoto van het stuur. Vul je een
middagvlucht in, dan wordt het lichter. De pagina toont je jouw vertrek.

## Kleur

| Token | Waarde | Waarvoor |
| --- | --- | --- |
| `--nacht` | `#0A0C0E` | de grond |
| `--asfalt` | `#14181C` | verhoogd vlak |
| `--staal` | `#212A30` | randen en tweede vlak — koel blauwgrijs, zodat het donker een tint heeft en geen zwart gat is |
| `--markering` | `#E9E7E1` | wegmarkeringswit, de lopende tekst |
| `--mist` | `#8794A0` | bijzaak (5,5:1 op nacht) |
| `--signaal` | `#E11D2A` | het rood van Moda |

**Het rood haalt geen 4,5:1 op de donkere grond.** Het mag dus nooit lopende
tekst zijn: enkel grote getallen, actieve toestanden en niet-tekstuele signalen.

De sfeer komt van hun eigen foto's, niet van kleurverlopen. Zeven echte foto's
van hun wagens en het stuur bij nacht.

## Letters

Beide lokaal, geen Google Fonts.

| Rol | Letter | Instelling |
| --- | --- | --- |
| Display | Archivo | `wdth 78`, `wght 700–800`, kapitaal |
| Lopende tekst en UI | Archivo | `wdth 100`, `wght 400–600` |
| Elk getal | Martian Mono | tabulaire cijfers |

Eén familie in twee breedtes: dat is hoe verkeersborden en vertrekborden
werken. Het smalle display laat lange Nederlandse zinnen groot passen zonder
ze te verkleinen. De mono staat er niet als kostuum maar omdat er echt gemeten
wordt: uren, prijzen, afstanden, rijtijden.

## Vormtaal

- **De wegmarkering is de scheidingslijn.** Tussen secties staat geen haarlijn
  maar een onderbroken streep, zoals de middenlijn van een baan. Dat is de
  enige plek waar de vorm iets zegt: richting.
- Geen ronde hoeken boven 2 px. Geen schaduwen als versiering.
- **Geen eyebrows** boven koppen. Een kop draagt zichzelf.
- Iconen zijn getekende SVG's in één lijndikte, geen unicode-pijltjes.
- Cijfers boven een sectie alleen waar de volgorde echt informatie is.

## Beweging

Eén geregisseerd moment: **het bord rekent zichtbaar terug.** Wijzig je het
vertrekuur, dan schuiven de cijfers van onder naar boven op hun nieuwe waarde,
rij per rij van onderaan naar boven — want zo loopt de berekening ook. Geen
klappende vertrekborden, geen losse effecten elders.

Bij `prefers-reduced-motion` verspringen de cijfers zonder schuiven.

## Browservlakken

Selectie, cursor, scrollbalk, focusring en de cijfers in tabellen krijgen
allemaal een kleur uit dit palet. Standaardwaarden van de browser horen bij
geen enkel ontwerp.
