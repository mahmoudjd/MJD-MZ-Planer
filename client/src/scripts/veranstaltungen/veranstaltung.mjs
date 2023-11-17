import { sitzplanAnlegen } from '../sitzplaene/sitzplan.mjs';
import { prevNextPfeileErstellen } from '../utilities/pfeile.mjs';
import { loescheSitzplanUndGaesteInVer, axios } from '../main.mjs';
import {
  wechselSeite,
  vorherigeSeite,
  naechsteSeite
} from '../utilities/paginierung.mjs';

const mainContainer = document.querySelector('.container');

let deleteTaste;

/**
 * buttons (anzeigen, anlegen, löschen) eine Veranstaltung
 */
function hauptSeiteVeranstaltungen () {
  const div = document.createElement('div');
  div.id = 'sub-container';
  div.classList.add('sub-container');

  const ul = document.createElement('ul');

  const li = document.createElement('li');
  const veranstaltungenAnzeigenBtn = buttonErstellen(
    'Veranstaltungen anzeigen',
    'veranstaltungenAnzeigen'
  );
  li.appendChild(veranstaltungenAnzeigenBtn);

  const li1 = document.createElement('li');
  const veranstaltungAnlegenBtn = buttonErstellen(
    'Veranstaltung anlegen',
    'veranstaltungAnlegen'
  );
  li1.appendChild(veranstaltungAnlegenBtn);

  const li2 = document.createElement('li');
  const veranstaltungLoeschenBtn = buttonErstellen(
    'Veranstaltung löschen',
    'veranstaltungLoeschen'
  );
  li2.appendChild(veranstaltungLoeschenBtn);

  ul.append(li, li1, li2);
  div.appendChild(ul);

  mainContainer.innerHTML = '';
  mainContainer.appendChild(div);

  veranstaltungenAnzeigenBtn.addEventListener('click', veranstaltungenAnzeigen);
  veranstaltungAnlegenBtn.addEventListener('click', veranstaltungAnlegen);
  veranstaltungLoeschenBtn.addEventListener('click', veranstaltungLoeschen);
}

/**
 * erstellt ein Button Element
 * @param {String} text
 * @param {String} id
 * @returns button Element
 */
function buttonErstellen (text, id) {
  const btn = document.createElement('button');
  btn.classList.add('button');
  btn.id = id;
  btn.textContent = text;
  return btn;
}

/**
 * zeigt alle Veranstaltungen an
 */
async function veranstaltungenAnzeigen () {
  deleteTaste = false;
  const section = document.createElement('section');
  section.id = 'services';
  section.className = 'services';
  const h1 = document.createElement('h1');
  h1.className = 'heading';
  h1.textContent = 'Alle Veranstaltungen';

  const boxCon = document.createElement('div');
  boxCon.className = 'box-container';

  const pfeile = prevNextPfeileErstellen();
  section.append(h1, boxCon, pfeile);

  mainContainer.innerHTML = '';
  mainContainer.appendChild(section);

  try {
    const { data } = await axios.get('/api/Veranstaltungen');

    if (data.veranstaltungen.length > 0) {
      const prev = document.getElementById('previous');
      const next = document.getElementById('next');
      prev.addEventListener('click', (e) => {
        e.preventDefault();
        vorherigeSeite(data.veranstaltungen, 'veranstaltung');
      });
      next.addEventListener('click', (e) => {
        e.preventDefault();
        naechsteSeite(data.veranstaltungen, 'veranstaltung');
      });
      await wechselSeite(1, data.veranstaltungen, 'veranstaltung');
      window.addEventListener('resize', async () => {
        await wechselSeite(1, data.veranstaltungen, 'veranstaltung');
      });
    } else {
      window.alert('leider gibt es Keine Veranstaltungen');
      hauptSeiteVeranstaltungen();
    }
  } catch (error) {
    console.error(error);
    window.alert(
      'Ein Fehler ist aufgetreten. Bitte versuchen Sie es später erneut.'
    );
  }
}

/**
 * erstellt einen Div mit Veranstaltungsiformationen
 * @param {Number} i index des Elements
 * @param {Array} v Veranstaltungen
 */
function veranstaltungenImportieren (i, v) {
  const boxCon = document.querySelector('.box-container');
  const box = document.createElement('div');
  box.id = `veranstaltung${i}`;
  box.className = 'box';
  boxCon.appendChild(box);
  const titleH3 = document.createElement('h3');
  titleH3.className = 'heading3';
  const span = document.createElement('span');
  span.textContent = `${v[i].title}`;
  titleH3.appendChild(span);
  const datumH3 = document.createElement('h3');
  datumH3.className = 'heading3';
  datumH3.textContent = `Datum am ${v[i].datum}`;
  const zeitH3 = document.createElement('h3');
  zeitH3.className = 'heading3';
  zeitH3.textContent = `Beginnzeit um ${v[i].beginnZeit} Uhr`;
  const icon = document.createElement('i');
  icon.className = 'fas fa-trash';
  icon.style = 'background: #e74c3c';
  icon.setAttribute('id', `del${i}`);

  box.append(titleH3, datumH3, zeitH3);
  if (deleteTaste) {
    box.appendChild(icon);
    icon.addEventListener('click', async () => {
      // lösche alle gaeste, den sitzplan und alle Tische
      await loescheSitzplanUndGaesteInVer(v[i]._id);
      // Dann löscht die Veranstaltung
      await axios.delete(`/api/Veranstaltungen/${v[i]._id}`);
      await veranstaltungLoeschen();
    });
  }
}

/**
 * neue Veranstaltung anlegen
 */
function veranstaltungAnlegen () {
  const div = document.createElement('div');
  div.id = 'sub-container';
  div.className = 'sub-container';

  const h = document.createElement('h2');
  h.textContent = 'Veranstaltung Anlegen';
  div.appendChild(h);

  const ul = document.createElement('ul');
  div.appendChild(ul);

  const titleInput = inputsErstellen('Title:', 'text', 'titleVeranstaltung');
  const dateInput = inputsErstellen('Datum:', 'date', 'datumVeranstaltung');
  const timeInput = inputsErstellen('Zeit:', 'time', 'zeitVeranstaltung');

  ul.append(titleInput, dateInput, timeInput);

  const submitButton = document.createElement('button');
  submitButton.textContent = 'Sitzplan anlegen';
  submitButton.id = 'sitzplanAnlegen';
  submitButton.className = 'button';
  ul.appendChild(submitButton);

  mainContainer.innerHTML = '';
  mainContainer.appendChild(div);

  submitButton.addEventListener('click', async (e) => {
    e.preventDefault();
    const title = titleInput.querySelector('input').value;
    const datum = dateInput.querySelector('input').value;
    const zeit = timeInput.querySelector('input').value;
    const neueVeranstaltung = {
      title: title.trim(),
      datum: datum.split('T')[0],
      beginnZeit: zeit,
      sitzplan: null,
      gaesteliste: []
    };
    const veranstaltungDatum = new Date(
      `${neueVeranstaltung.datum}T${neueVeranstaltung.beginnZeit}`
    );
    const now = new Date();
    // testet das Datum und zeit, ob es gültig ist.
    if (neueVeranstaltung.datum && veranstaltungDatum >= now) {
      if (neueVeranstaltung.title && neueVeranstaltung.beginnZeit) {
        try {
          const { data } = await axios.post('/api/Veranstaltungen', neueVeranstaltung);

          sitzplanAnlegen(data.veranstaltung._id);
        } catch (error) {
          console.error(error);
        }
      } else {
        window.alert('Bitte alle Felder ausfüllen!');
      }
    } else {
      window.alert('Zeit und Datum sind ungültig!');
    }
  });
}

/**
 * erstellt input Felder für die neuen Veranstaltungen
 * @param {String} labelText
 * @param {String} type
 * @param {String} id
 * @returns list Element mit ein lable und inputfile
 */
function inputsErstellen (labelText, type, id) {
  const li = document.createElement('li');
  const label = document.createElement('label');
  label.textContent = labelText;

  const input = document.createElement('input');
  input.type = type;
  input.id = id;

  li.append(label, input);

  return li;
}

/**
 * Eine Veranstaltung auswählen und Loeschen
 **/
async function veranstaltungLoeschen () {
  deleteTaste = true;
  const section = document.createElement('section');
  section.id = 'services';
  section.className = 'services';
  const h1 = document.createElement('h1');
  h1.className = 'heading';
  h1.textContent = 'Alle Veranstaltungen';

  const boxCon = document.createElement('div');
  boxCon.className = 'box-container';

  const pfeile = prevNextPfeileErstellen();
  section.append(h1, boxCon, pfeile);

  mainContainer.innerHTML = '';
  mainContainer.appendChild(section);

  try {
    const { data } = await axios.get('/api/Veranstaltungen');

    if (data.veranstaltungen.length > 0) {
      const prev = document.getElementById('previous');
      const next = document.getElementById('next');
      prev.addEventListener('click', (e) => {
        e.preventDefault();
        vorherigeSeite(data.veranstaltungen, 'veranstaltung');
      });
      next.addEventListener('click', (e) => {
        e.preventDefault();
        naechsteSeite(data.veranstaltungen, 'veranstaltung');
      });
      await wechselSeite(1, data.veranstaltungen, 'veranstaltung');
      window.addEventListener('resize', async () => {
        await wechselSeite(1, data.veranstaltungen, 'veranstaltung');
      });
    } else {
      window.alert('leider gibt es Keine Veranstaltungen');
      hauptSeiteVeranstaltungen();
    }
  } catch (error) {
    console.error(error);
    window.alert(
      'Ein Fehler ist aufgetreten. Bitte versuchen Sie es später erneut.'
    );
  }
}

export {
  hauptSeiteVeranstaltungen,
  veranstaltungenImportieren,
  veranstaltungAnlegen
};
