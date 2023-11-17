import { tischeImportieren } from '../sitzplaene/tische.mjs';
import { gaesteImportieren } from '../gaesteliste/gastListe.mjs';
import { veranstaltungenImportieren } from '../veranstaltungen/veranstaltung.mjs';

let ELEMENTEPROSEITE = 0;
let AKTUELLESEITE = 1;

/**
 * berechnet die Anzahl der Seiten basierend auf einer vorgegebenen
 * Anzahl von Elementen pro Seite und gibt diese zurück.
 * @param {Array} elems
 * @returns ANZAHLSEITEN
 **/
function anzahlSeitenFinden (elems) {
  return Math.ceil(elems.length / ELEMENTEPROSEITE);
}

/**
 * aktualisieren die Seite auf die vorherige Seite
 * @param {String} check um die methode auszuwählen
 * @param {Array} elems
 **/
function vorherigeSeite (elems, check) {
  if (AKTUELLESEITE > 1) {
    AKTUELLESEITE--;
    wechselSeite(AKTUELLESEITE, elems, check);
  }
}

/**
 * aktualisieren die Seite auf die nächste Seite
 * @param {Array} elems
 * @param {String} check
 **/
function naechsteSeite (elems, check) {
  if (AKTUELLESEITE < anzahlSeitenFinden(elems)) {
    AKTUELLESEITE++;
    wechselSeite(AKTUELLESEITE, elems, check);
  }
}

/**
 * Wechseln und anzeigen die Siete laut der eingebenen Seitennummer
 * @param {Number} seiteNr die Nummer der Seite
 * @param {Array} elems
 * @param {String} check nimmt den Wert
 * und wählt die passende Methode aufzurufen
 **/
async function wechselSeite (seiteNr, elems, check) {
  const aktuelleSeite = Math.max(1, Math.min(seiteNr, anzahlSeitenFinden(elems)));
  const aktuellenSeiteNr = document.getElementById('seite-nummer');
  const prev = document.getElementById('previous');
  const next = document.getElementById('next');
  const boxCon = document.querySelector('.box-container');

  AKTUELLESEITE = aktuelleSeite;
  seitenElementeResize();
  if (aktuellenSeiteNr === null) return;
  aktuellenSeiteNr.textContent = `${aktuelleSeite}/${anzahlSeitenFinden(elems)}`;
  boxCon.innerHTML = '';

  // Verwende eine Map-Struktur, um die richtige Funktion aufzurufen
  const importFunctions = new Map([
    ['gast', gaesteImportieren],
    ['plan', tischeImportieren],
    ['veranstaltung', veranstaltungenImportieren]
  ]);

  const ersteElem = (aktuelleSeite - 1) * ELEMENTEPROSEITE;
  const letzteElem = aktuelleSeite * ELEMENTEPROSEITE;
  for (let i = ersteElem; i < letzteElem && i < elems.length; i++) {
    const importFunction = importFunctions.get(check);
    if (importFunction) {
      await importFunction(i, elems);
    }
  }

  prev.style.display = 'inline-block';
  next.style.display = 'inline-block';

  prev.style = aktuelleSeite === 1 ? 'background:gray;' : 'background:linear-gradient(to right, orange, tomato);';
  next.style = aktuelleSeite === anzahlSeitenFinden(elems) ? 'background:gray;' : 'background:linear-gradient(to right, orange, tomato);';
}

/**
 * sorgt dafür, dass die Anzahl der auf einer Seite angezeigten Elemente
 * abhängig von der Größe des Bildschirms angepasst wird.
 **/
function anzahlElementsLautBreitePassen () {
  let width;
  let height;

  // Prüfe, ob die Eigenschaften "innerWidth" und "innerHeight" des Fensterobjekts definiert sind
  if (typeof window.innerWidth !== 'undefined') {
    width = window.innerWidth;
    height = window.innerHeight;
    // Wenn nicht, prüfe, ob die Eigenschaften "availWidth" und "availHeight" des screen-Objekts definiert sind
  } else if (typeof window.screen.availWidth !== 'undefined') {
    width = window.screen.availWidth;
    height = window.screen.availHeight;
  }

  // Abhängig von der Bildschirmbreite setzen Sie die Anzahl der auf einer Seite anzuzeigenden Elemente
  if (width >= 2404) {
    ELEMENTEPROSEITE = height >= 750 ? 14 : 7;
  } else if (width >= 2057 && width < 2404) {
    ELEMENTEPROSEITE = height >= 750 ? 12 : 6;
  } else if (width >= 1709 && width < 2057) {
    ELEMENTEPROSEITE = height >= 750 ? 10 : 5;
  } else if (width > 1362 && width < 1709) {
    ELEMENTEPROSEITE = height >= 750 ? 8 : 4;
  } else if (width > 1016 && width <= 1362) {
    ELEMENTEPROSEITE = height >= 750 ? 6 : 3;
  } else if (width >= 890 && width <= 1016) {
    ELEMENTEPROSEITE = height >= 750 ? 4 : 2;
  } else if (width < 890) {
    ELEMENTEPROSEITE = 2;
  }
}

/**
 * wenn width geändert wird,
 * dann wird die anzahl der Elemente laut der aktuelle
 * Breite und Höhe angepasst
 **/
function seitenElementeResize () {
  anzahlElementsLautBreitePassen();
  window.addEventListener('resize', (e) => {
    e.preventDefault();
    anzahlElementsLautBreitePassen();
  });
}

export { vorherigeSeite, naechsteSeite, wechselSeite };
