import axios from 'axios';
import { createFooter } from './footer.mjs';
import { getTischeInPlan } from './sitzplaene/tische.mjs';
import { getSitzplan, hauptSeiteSitzplaene } from './sitzplaene/sitzplan.mjs';
import { hauptSeiteVeranstaltungen } from './veranstaltungen/veranstaltung.mjs';
import {
  hauptSeiteGaeste,
  getAlleGaesteInEinerVerans
} from './gaesteliste/gastListe.mjs';
import { createHeader } from './header.mjs';

createHeader();

homeSite();

createFooter();

/**
 * theme wechsel
 */
const themeWechsel = document.querySelector('#theme-switch');

themeWechsel.addEventListener('click', () => {
  themeWechsel.classList.toggle('fa-sun');
  if (!themeWechsel.classList.contains('fu-sun')) {
    document.body.classList.toggle('dark-mode');
  } else {
    document.body.classList.remove('dark-mode');
  }
});

/**
 * HaupSiten von Header click Aktionen
 **/
const menuBtn = document.querySelector('#menu-btn');
const navbar = document.querySelector('.navbar');

menuBtn.onclick = () => {
  navbar.classList.toggle('active');
};
const vClick = document.getElementById('aHeader1');
vClick.addEventListener('click', () => {
  hauptSeiteVeranstaltungen();
});
const gClick = document.getElementById('aHeader2');
gClick.addEventListener('click', async () => {
  await hauptSeiteGaeste();
});
const sClick = document.getElementById('aHeader3');
sClick.addEventListener('click', async () => {
  await hauptSeiteSitzplaene();
});

/**
 * click Aktionen, wenn die Breite klein ist
 */
const vNav = document.getElementById('vNav');
vNav.addEventListener('click', () => {
  hauptSeiteVeranstaltungen();
  navbar.classList.remove('active');
});
const gNav = document.getElementById('gNav');
gNav.addEventListener('click', async () => {
  await hauptSeiteGaeste();
  navbar.classList.remove('active');
});
const sNav = document.getElementById('sNav');
sNav.addEventListener('click', async () => {
  await hauptSeiteSitzplaene();
  navbar.classList.remove('active');
});

/**
 * erstellt die Hauptseite
 */
function homeSite () {
  const mainContainer = document.querySelector('.container');
  const subContainer = document.createElement('div');
  subContainer.id = 'sub-container';
  subContainer.className = 'sub-container';

  const btn1 = document.createElement('button');
  btn1.id = 'veranstaltung';
  btn1.className = 'button';
  btn1.textContent = 'Veranstaltungen';

  const btn2 = document.createElement('button');
  btn2.id = 'gaesteListe';
  btn2.className = 'button';
  btn2.textContent = 'Gästelisten';

  const btn3 = document.createElement('button');
  btn3.id = 'sitzplan';
  btn3.className = 'button';
  btn3.textContent = 'Sitzpläne';

  const br1 = document.createElement('br');
  const br2 = document.createElement('br');
  const br3 = document.createElement('br');

  subContainer.append(btn1, br1, btn2, br2, btn3, br3);
  mainContainer.appendChild(subContainer);

  return mainContainer;
}

/**
 * elemente der Hauptseite
 */
const veranstaltung = document.querySelector('#veranstaltung');
const gaesteListe = document.querySelector('#gaesteListe');
const sitzPlan = document.querySelector('#sitzplan');

/**
 * Hauptsite Buttonsliste Aktionen
 **/
veranstaltung.addEventListener('click', () => {
  hauptSeiteVeranstaltungen();
});
gaesteListe.addEventListener('click', async () => {
  await hauptSeiteGaeste();
});
sitzPlan.addEventListener('click', async () => {
  await hauptSeiteSitzplaene();
});

/**
 * liefert die Namen der Veranstaltungen
 * und legen den Title und der Id veranstaltungsMap (title, ID)
 * @returns alle Titeln der Verananstalungen
 */
async function getVeranstaltungsTiteln () {
  try {
    const titels = [{ title: 'Veranstaltung auswählen: ', id: '' }];
    const { data } = await axios.get('/api/Veranstaltungen');
    const veranstaltungen = data.veranstaltungen;

    for (const { _id: id, title } of veranstaltungen) {
      titels.push({ title, id });
    }

    return titels;
  } catch (error) {
    console.error(error);
  }
}

/**
 * löscht alle Gäste, die in der gelöschten Veranstaltung sind,
 * und dessen Sitzplan
 * @param id id einer Veranstaltung
 */
async function loescheSitzplanUndGaesteInVer (id) {
  try {
    const plan = await getSitzplan(id);
    const tische = await getTischeInPlan(plan);

    const gaeste = await getAlleGaesteInEinerVerans(id);
    for (const element of gaeste) {
      await axios.delete(`/api/Gaeste/${element._id}`);
    }

    for (const element of tische) {
      await axios.delete(`/api/Tische/${element._id}`);
    }

    await axios.delete(`/api/Plaene/${plan._id}`);
  } catch (error) {
    console.error(error);
  }
}

export { axios, getVeranstaltungsTiteln, loescheSitzplanUndGaesteInVer };
