import { axios } from '../main.mjs';
import { qrCodeAnzeigen } from '../utilities/qrcode.mjs';
import { getSitzplan, hauptSeiteSitzplaene } from './sitzplan.mjs';
import { getAlleGaesteInEinerVerans } from '../gaesteliste/gastListe.mjs';
import { prevNextPfeileErstellen } from '../utilities/pfeile.mjs';
import {
  naechsteSeite,
  vorherigeSeite,
  wechselSeite
} from '../utilities/paginierung.mjs';

let stuehleAnzahl;
const mainContainer = document.querySelector('.container');

/**
 * erstellt Tische einer Veranstaltung laut der angegebenen Anzahl in Sitzplan
 * @param {Plan} plan
 */
async function createTische (plan) {
  try {
    const tObj = {
      veranstaltung: plan.veranstaltung,
      tischnr: 0,
      belegt: false,
      personen: []
    };

    for (let i = 0; i < plan.anzahlTische; i++) {
      tObj.tischnr = i + 1;
      const { data } = await axios.post('/api/Tische/', tObj);
      plan.tische.push(data.tisch._id);
      await axios.put(`/api/Plaene/${plan._id}`, plan);
    }
  } catch (error) {
    console.error(error);
  }
}

/**
 * Holt alle Tische einer Veranstaltung
 * @param {Plan} plan - der Plan der Veranstaltung
 * @returns {Array} - Alle Tische einer Veranstaltung
 */
async function getTischeInPlan (plan) {
  const tische = [];
  try {
    for (const tisch of plan.tische) {
      const { data } = await axios.get(`/api/Tische/${tisch}`);
      tische.push(data.tisch);
    }
  } catch (error) {
    console.error(error);
  }
  return tische.sort((t1, t2) => t1.tischnr - t2.tischnr);
}

/**
 * Anzeigt alle Tische einer Veranstaltung
 * @param {ObjectID} vId
 * @param {String} veranstaltungsTitle
 */
async function tischeAnzeigen (vId, title) {
  try {
    const plan = await getSitzplan(vId);
    stuehleAnzahl = plan.stuehleProTisch;

    const tische = await getTischeInPlan(plan);

    const section = document.createElement('section');
    section.id = 'services';
    section.className = 'services';
    const h1 = document.createElement('h1');
    h1.className = 'heading';
    h1.textContent = 'Tische in ';
    section.appendChild(h1);
    const span = document.createElement('span');
    span.textContent = title;
    h1.appendChild(span);
    const boxCon = document.createElement('div');
    boxCon.className = 'box-container';
    section.appendChild(boxCon);
    const pfeile = prevNextPfeileErstellen();
    section.appendChild(pfeile);
    mainContainer.innerHTML = '';
    mainContainer.appendChild(section);
    const prev = document.getElementById('previous');
    const next = document.getElementById('next');

    if (tische.length > 0) {
      prev.addEventListener('click', (e) => {
        e.preventDefault();
        vorherigeSeite(tische, 'plan');
      });
      next.addEventListener('click', (e) => {
        e.preventDefault();
        naechsteSeite(tische, 'plan');
      });
      await wechselSeite(1, tische, 'plan');
      window.addEventListener('resize', async () => {
        await wechselSeite(1, tische, 'plan');
      });
    } else {
      window.alert('Leider gibt es Keine Tische');
      await hauptSeiteSitzplaene();
    }
  } catch (error) {
    console.error(error);
  }
}

/**
 * importiert den Tisch im index i
 * @param {Number} i
 * @param {Tisch} tische
 */
async function tischeImportieren (i, tische) {
  const belegt = tische[i].belegt;
  const boxCon = document.querySelector('.box-container');
  const box = document.createElement('div');
  box.id = `tisch${i}`;
  box.className = 'box';
  boxCon.appendChild(box);

  const h3 = document.createElement('h3');
  h3.className = 'heading3';
  h3.innerHTML = `<span>Tisch ${tische[i].tischnr}</span> <br>
  Anzahle der Stühle: <span>${stuehleAnzahl}</span> <br>
  Frei Plätze: ${tische[i].belegt === true ? '<span>Nein</span>' : '<span>Ja</span>'
    }
  `;
  const icon = document.createElement('i');
  icon.className = 'fa fa-info';
  icon.style = belegt
    ? 'background: gray;'
    : 'background:linear-gradient(to right, orange, tomato);';
  icon.setAttribute('id', `tisch${i + 1}`);
  box.appendChild(h3);
  box.appendChild(icon);

  icon.addEventListener('click', (e) => {
    e.preventDefault();
    tischInfoAnzeigen(tische[i]);
  });
}

/**
 * zeigt die Informationen des eingegebenen Tischs
 * @param {Tisch} tisch
 */
async function tischInfoAnzeigen (tisch) {
  try {
    tisch.belegt = await istBelegt(tisch);
    const section = document.createElement('section');
    section.id = 'services';
    section.className = 'services';
    const h1 = document.createElement('h1');
    h1.className = 'heading';
    h1.textContent = 'Tisch ';
    const span = document.createElement('span');
    span.textContent = `${tisch.tischnr}`;
    h1.appendChild(span);
    const boxCon = document.createElement('div');
    boxCon.className = 'box-container';
    section.append(h1, boxCon);
    const box = document.createElement('div');
    box.className = 'sub-container';
    boxCon.appendChild(box);

    if (!tisch.belegt) {
      const ul = document.createElement('ul');
      const li1 = document.createElement('li');
      const label1 = document.createElement('label');
      label1.id = 'name';
      label1.textContent = 'Name: ';
      const input1 = document.createElement('input');
      input1.type = 'text';
      input1.id = 'gastName';
      const btn = document.createElement('button');
      btn.className = 'button';
      btn.id = 'addGast';
      btn.textContent = 'ADD';
      ul.appendChild(li1);
      li1.append(label1, input1, btn);
      box.appendChild(ul);
      btn.addEventListener('click', async () => {
        const gastName = document.getElementById('gastName').value;
        await addGastInTisch(ul, gastName, tisch);
      });
    }

    const ul2 = document.createElement('ul');
    if (tisch.personen.length > 0) {
      erstellenbelgtenPlaeze(tisch, ul2);
    }

    box.appendChild(ul2);
    mainContainer.innerHTML = '';
    mainContainer.appendChild(section);
  } catch (error) {
    console.error(error);
  }
}

function erstellenbelgtenPlaeze (tisch, ul2) {
  for (const p of tisch.personen) {
    const li = document.createElement('li');
    const span = document.createElement('span');
    span.textContent = p;
    const i = document.createElement('i');
    i.className = 'fas fa-trash';

    i.addEventListener('click', async () => {
      await entferneGastVonTisch(ul2, p, tisch);
    });
    span.addEventListener('click', async () => {
      await qrCodeGenerator(tisch, p);
    });
    li.appendChild(span);
    li.appendChild(i);
    ul2.appendChild(li);
  }
}

/**
 * es existiert eine neue Person im eingegebenen Tisch falls es frei platz gibt
 * @param {UL} ul
 * @param {String} gastName
 * @param {Tisch} tisch
 */
async function addGastInTisch (ul, gastName, tisch) {
  try {
    const belegt = await istBelegt(tisch);
    const notFoundName = await testGastName(gastName, tisch.veranstaltung);
    const name = document.getElementById('gastName').value;
    if (!name) {
      window.alert('Keine Name wurde eingegeben!');
      return;
    }
    if (belegt) {
      window.alert('Es gibt nicht mehr freie Plätze!');
      return;
    }
    if (notFoundName) {
      window.alert('Gastname ist nicht in der Gästeliste gefunden');
      return;
    }

    tisch.personen.push(gastName);
    tisch.belegt = await istBelegt(tisch);

    await axios.put(`/api/Tische/${tisch._id}`, tisch);

    const li = document.createElement('li');
    const span = document.createElement('span');

    const i = document.createElement('i');
    i.className = 'fas fa-trash';

    span.textContent = `${gastName}`;
    span.addEventListener('click', async () => {
      await qrCodeGenerator(tisch, gastName);
    });
    li.appendChild(span);
    li.appendChild(i);
    i.addEventListener('click', async () => {
      await entferneGastVonTisch(ul, gastName, tisch);
    });
    ul.appendChild(li);
  } catch (error) {
    console.error(error);
  }
}

/**
 * testet, ob der Name des Gasts in der Gastliste gefunden ist.
 * @param {String} name
 * @param {ObjectID} veranstaltung
 * @returns
 */
async function testGastName (name, veranstaltung) {
  const gaeste = await getAlleGaesteInEinerVerans(veranstaltung);
  const gefunden = gaeste.find((gast) => gast.name === name);

  return !gefunden;
}

/**
 * test, ob alle Stühle belegt sind
 * @param {Tisch} tisch
 * @returns true, falls keine freien Plätze, sonst false
 */
async function istBelegt (tisch) {
  const plan = await getSitzplan(tisch.veranstaltung);
  const personenAnzahl = plan.stuehleProTisch;
  if (tisch.personen.length < personenAnzahl) {
    return false;
  } else {
    return true;
  }
}

/**
 * entferne Gäste von Tische
 * @param {UL} ul
 * @param {String} gastName
 * @param {Tisch} tisch
 */
async function entferneGastVonTisch (ul, gastName, tisch) {
  try {
    tisch.personen = tisch.personen.filter((name) => name !== gastName);
    tisch.belegt = await istBelegt(tisch);

    await axios.put(`/api/Tische/${tisch._id}`, tisch);

    const lis = ul.getElementsByTagName('li');
    Array.from(lis).forEach((li) => {
      if (li.textContent === gastName) {
        li.remove();
      }
    });
  } catch (error) {
    console.error(error);
  }
}

/**
 * erstellt einen QR-Code für den Gast
 * @param {Tisch} tisch
 * @param {String} name
 */
async function qrCodeGenerator (tisch, name) {
  try {
    const { data } = await axios.get(
      `/api/Veranstaltungen/${tisch.veranstaltung}`
    );
    const v = data.veranstaltung;
    const infos = [name];
    infos.push(', ');
    infos.push('Veranstaltung: ' + v.title + ', ');
    infos.push('Datum: ' + v.datum + ', ');
    infos.push('Zeit: ' + v.beginnZeit + ', ');
    infos.push('Tischnr.: ' + tisch.tischnr);
    await qrCodeAnzeigen(infos);
  } catch (error) {
    console.error(error);
  }
}

export { tischeImportieren, createTische, getTischeInPlan, tischeAnzeigen };
