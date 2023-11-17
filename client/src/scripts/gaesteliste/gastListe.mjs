import { prevNextPfeileErstellen } from '../utilities/pfeile.mjs';
import { bestaetigungMSG } from '../utilities/bestaetigungMSG.mjs';
import {
  optionsSelectErstellen,
  optionsSelectErstellen2
} from '../utilities/optionsForSelect.mjs';
import { axios, getVeranstaltungsTiteln } from '../main.mjs';
import {
  naechsteSeite,
  vorherigeSeite,
  wechselSeite
} from '../utilities/paginierung.mjs';

let NEWSTATUS = ''; // um die neue ausgewählte Status zu speichern
let TESTSTATUS = false; // true statusBearbeiten, false Gastloeschen
let aktuelleSeite = 1; // aktuelle Seite ab 1
const mainContainer = document.querySelector('.container');

/**
 * zeigt die Auswahl-Buttons der Haupseite Gästeliste
 **/
async function hauptSeiteGaeste () {
  const div = document.createElement('div');
  div.type = 'div';
  div.id = 'sub-container';
  div.className = 'sub-container';

  const ul = document.createElement('ul');
  const li0 = document.createElement('li');
  const li1 = document.createElement('li');
  const li2 = document.createElement('li');
  const li3 = document.createElement('li');

  const select = document.createElement('select');
  select.setAttribute('id', 'alleVeranstaltungstitlen');

  const vPare = { title: '', id: '' };
  select.onchange = async () => {
    vPare.title = document.getElementById(
      'alleVeranstaltungstitlen'
    ).textContent;
    vPare.id = document.getElementById('alleVeranstaltungstitlen').value;
  };

  const btn1 = document.createElement('button');
  btn1.className = 'button';
  btn1.id = 'gaesteAnlegen';
  btn1.textContent = 'Gäste hizufügen';

  const btn2 = document.createElement('button');
  btn2.className = 'button';
  btn2.id = 'statusBearbeit';
  btn2.textContent = 'Anzeigen und bearbeiten';

  const btn3 = document.createElement('button');
  btn3.className = 'button';
  btn3.id = 'gaesteLoeschen';
  btn3.textContent = 'Gäste loeschen';

  div.appendChild(ul);
  ul.append(li0, li1, li2, li3);

  const titles = await getVeranstaltungsTiteln();
  optionsSelectErstellen2(select, titles);

  li0.appendChild(select);
  li1.appendChild(btn1);
  li2.appendChild(btn2);
  li3.appendChild(btn3);

  mainContainer.innerHTML = '';
  mainContainer.appendChild(div);

  const gaesteAnlegen = document.getElementById('gaesteAnlegen');
  gaesteAnlegen.addEventListener('click', async () => {
    try {
      const { data } = await axios.get(`/api/Veranstaltungen/${vPare.id}`);
      gaesteHinzufuegen(data.veranstaltung._id, data.veranstaltung);
    } catch (error) {
      window.alert('Bitte eine Veranstaltung auswählen!');
      console.error(error);
    }
  });

  const gaesteLoeschen = document.getElementById('gaesteLoeschen');
  gaesteLoeschen.addEventListener('click', async () => {
    try {
      await loescheAktion(vPare);
    } catch (error) {
      window.alert('Bitte eine Veranstaltung auswählen!');
      console.error(error);
    }
  });

  const bearbeiten = document.getElementById('statusBearbeit');
  bearbeiten.addEventListener('click', async () => {
    try {
      await statusBearbeitenAktion(vPare);
    } catch (error) {
      window.alert('Bitte eine Veranstaltung auswählen!');
      console.error(error);
    }
  });
}

async function loescheAktion (vPare) {
  const { data } = await axios.get(`/api/Veranstaltungen/${vPare.id}`);
  await axios.put(
    `/api/Veranstaltungen/${data.veranstaltung._id}`,
    data.veranstaltung
  );
  await gaesteLoeschenVonVeranst(data.veranstaltung._id, data.veranstaltung);
}

async function statusBearbeitenAktion (vPare) {
  const { data } = await axios.get(`/api/Veranstaltungen/${vPare.id}`);
  await axios.put(
    `/api/Veranstaltungen/${data.veranstaltung._id}`,
    data.veranstaltung
  );
  await statusBearbeiten(data.veranstaltung._id, data.veranstaltung);
}

/**
 * Gäste einer Veranstaltung in Gästeliste hinzufügen
 * @param {ObjectId} vId
 * @param {Object} veranstaltungObj
 **/
function gaesteHinzufuegen (vId, veranstaltungObj) {
  const gast = {
    veranstaltung: vId,
    name: '',
    kinder: false,
    status: ''
  };

  const div = document.createElement('div');
  div.type = 'div';
  div.id = 'sub-container';
  div.className = 'sub-container';

  const h2 = document.createElement('h2');
  h2.textContent = 'Gäste Hinzufügen';
  div.appendChild(h2);
  const ul = document.createElement('ul');
  div.appendChild(ul);

  const li1 = document.createElement('li');
  ul.appendChild(li1);

  const label1 = document.createElement('label');
  label1.textContent = 'Vorname: ';

  const input1 = document.createElement('input');
  input1.id = 'vorname';
  input1.type = 'text';
  input1.onchange = () => {
    const vName = document.getElementById('vorname').value;
    gast.name = vName.trim();
  };

  li1.append(label1, input1);

  const li2 = document.createElement('li');
  ul.appendChild(li2);

  const label2 = document.createElement('label');
  label2.textContent = 'Nachname: ';

  const input2 = document.createElement('input');
  input2.id = 'nachname';
  input2.type = 'text';
  input2.onchange = () => {
    const nName = document.getElementById('nachname').value;
    gast.name += ' ' + nName.trim();
  };

  li2.append(label2, input2);

  const li3 = document.createElement('li');
  ul.appendChild(li3);

  const label3 = document.createElement('label');
  label3.textContent = 'mit Kinder: ';

  const select3 = document.createElement('select');
  select3.id = 'kinder';
  select3.onchange = () => {
    gast.kinder = select3.value === 'Ja';
  };

  optionsSelectErstellen(select3, ['Nein', 'Ja']);

  li3.append(label3, select3);

  const li4 = document.createElement('li');
  ul.appendChild(li4);

  const label4 = document.createElement('label');
  label4.textContent = 'Status: ';

  const select = document.createElement('select');
  select.id = 'status';
  select.onchange = () => {
    gast.status = document.getElementById('status').value;
  };

  const values = [
    'Status auswählen:',
    'unbekannt',
    'eingeladen',
    'zugesagt',
    'abgesagt'
  ];
  optionsSelectErstellen(select, values);
  li4.append(label4, select);

  const add = document.createElement('button');
  add.id = 'addGast';
  add.className = 'button';
  add.textContent = 'hinzufügen';

  ul.appendChild(add);
  mainContainer.innerHTML = '';
  mainContainer.appendChild(div);

  const addGast = document.getElementById('addGast');
  addGast.addEventListener('click', async () => {
    await gastZurVeranstaltungHinzufuegen(gast, vId, veranstaltungObj);
  });
}

/**
 * den hinzuzufügenden Gast an die Datenbank zu senden und die Bestätigungsnachricht anzuzeigen.
 * @param {Gast} gast
 * @param {ObjectId} vId
 * @param {Veranstaltung} veranstaltungObj
 */
async function gastZurVeranstaltungHinzufuegen (gast, vId, veranstaltungObj) {
  if (gast.name) {
    let exist = false;
    exist = await gastVorhanden(vId, gast, exist);
    if (!exist) {
      await hinzufuegen(gast, veranstaltungObj, vId);
    } else {
      window.alert('name der Gast ist bereit existiert!');
    }
  } else {
    window.alert('Bitte alle Felder eingeben!');
  }
}

/**
 *  Testet, ob der neue Gast in der Veranstaltung existiert
 */
async function gastVorhanden (vId, gast, exist) {
  try {
    const gaeste = await getAlleGaesteInEinerVerans(vId);
    gaeste.forEach((element) => {
      if (
        gast.name === element.name &&
        gast.veranstaltung === element.veranstaltung
      ) {
        exist = true;
      }
    });
  } catch (error) {
    console.error(error);
  }
  return exist;
}
/**
 * speichere den neuen Gast in DB und in gaesteliste der Veranstaltung hinzufügen
 */
async function hinzufuegen (gast, veranstaltungObj, vId) {
  try {
    const { data } = await axios.post('/api/Gaeste/', gast);

    veranstaltungObj.gaesteliste.push(data.gast._id);

    await axios.put(`/api/Veranstaltungen/${vId}`, veranstaltungObj);

    gaesteHinzufuegen(data.gast.veranstaltung, veranstaltungObj);

    bestaetigungMSG(
      `${data.gast.name} wurde in ${veranstaltungObj.title} erfolgreich hinzugefügt`
    );
  } catch (err) {
    console.error(err);
  }
}

/**
 * ein Gast in einer Veranstaltung löschen
 * @param {ObjectId} vId id einer Veranstaltung
 * @param {Object} veranstaltung objekt einer Veranstaltung
 **/
async function gaesteLoeschenVonVeranst (vId, veranstaltung) {
  TESTSTATUS = false;

  const section = document.createElement('section');
  section.id = 'services';
  section.className = 'services';

  const h1 = document.createElement('h1');
  h1.className = 'heading';
  h1.textContent = 'Gäste in ';
  section.appendChild(h1);

  const span = document.createElement('span');
  span.textContent = `${veranstaltung.title}`;
  h1.appendChild(span);

  const boxCon = document.createElement('div');
  boxCon.className = 'box-container';

  const gaeste = await getAlleGaesteInEinerVerans(vId);
  section.appendChild(boxCon);

  const pfeile = prevNextPfeileErstellen();
  section.appendChild(pfeile);

  mainContainer.innerHTML = '';
  mainContainer.appendChild(section);

  const prev = document.getElementById('previous');
  const next = document.getElementById('next');

  if (gaeste.length > 0) {
    prev.addEventListener('click', (e) => {
      e.preventDefault();
      vorherigeSeite(gaeste, 'gast');
    });
    next.addEventListener('click', (e) => {
      e.preventDefault();
      naechsteSeite(gaeste, 'gast');
    });
    aktuelleSeite = 1;
    await wechselSeite(aktuelleSeite, gaeste, 'gast');
    window.addEventListener('resize', async () => {
      await wechselSeite(aktuelleSeite, gaeste, 'gast');
    });
  } else {
    window.alert('Leider gibt es Keine Gäste');
    await hauptSeiteGaeste();
  }
}

/**
 * die Status der Gast bearbeiten
 * @param {ObjectId} vId
 * @param {Veranstaltung} veranstaltung
 **/
async function statusBearbeiten (vId, veranstaltung) {
  TESTSTATUS = true;
  const section = document.createElement('section');
  section.id = 'services';
  section.className = 'services';

  const h1 = document.createElement('h1');
  h1.className = 'heading';
  h1.textContent = 'Gäste in ';
  section.appendChild(h1);

  const span = document.createElement('span');
  span.textContent = `${veranstaltung.title}`;
  h1.appendChild(span);

  const boxCon = document.createElement('div');
  boxCon.className = 'box-container';
  section.appendChild(boxCon);

  const gaeste = await getAlleGaesteInEinerVerans(vId);
  const pfeile = prevNextPfeileErstellen();

  section.appendChild(pfeile);

  mainContainer.innerHTML = '';
  mainContainer.appendChild(section);

  if (gaeste.length > 0) {
    const prev = document.getElementById('previous');
    const next = document.getElementById('next');
    prev.addEventListener('click', (e) => {
      e.preventDefault();
      vorherigeSeite(gaeste, 'gast');
    });
    next.addEventListener('click', (e) => {
      e.preventDefault();
      naechsteSeite(gaeste, 'gast');
    });
    aktuelleSeite = 1;
    wechselSeite(aktuelleSeite, gaeste, 'gast');
    window.addEventListener('resize', () => {
      wechselSeite(aktuelleSeite, gaeste, 'gast');
    });
  } else {
    window.alert('leider gibt es Keine Gaste');
    await hauptSeiteGaeste();
  }
}

/**
 * hollen alle Gäste, die in der Veranstaltung vorhanden sind.
 * @returns Array von Gaeste
 * @param vId
 **/
async function getAlleGaesteInEinerVerans (vId) {
  try {
    const { data } = await axios.get(`/api/Veranstaltungen/${vId}`);
    const gaesteIds = data.veranstaltung.gaesteliste;
    const alleGaeste = await axios.get('/api/Gaeste');
    const gaesteInVeranstaltung = alleGaeste.data.gaeste.filter((gast) =>
      gaesteIds.includes(gast._id)
    );
    return gaesteInVeranstaltung;
  } catch (err) {
    console.error(err);
    throw err;
  }
}

/**
 * importiert einen Gast laut i von der Gäste Liste einer Veranstaltung
 * @param {Number} i index
 * @param {Array} gaeste alle Gäste in der Veranstaltung
 **/
async function gaesteImportieren (i, gaeste) {
  const boxCon = document.querySelector('.box-container');

  const box = document.createElement('div');
  box.id = `gast${i}`;
  box.className = 'box';
  boxCon.appendChild(box);

  const h3 = document.createElement('h3');
  h3.className = 'heading3';
  h3.innerHTML = `
          ${gaeste[i].name}<br>
          aktuelle Status: <span>${gaeste[i].status}</span> <br>
          Kinder: ${gaeste[i].kinder
      ? '' + '<span>Ja</span> <br>'
      : '<span>Nein</span> <br>'
    }
        `;
  // testet ob die methode StatusBearbeiten
  let icon;
  if (TESTSTATUS) {
    // if StatusBearbeiten werden select mit statusmöglichkeiten und edit-icon addiert
    icon = gastBearbeitenDesign(i, h3, icon, box);
    // Status Bearbeiten
    icon.addEventListener('click', async (e) => {
      try {
        e.preventDefault();
        await statusDesGastsWechseln(gaeste, i);
      } catch (error) {
        console.error(error);
      }
    });
  } else {
    // Gast löschen, dann wird trash-icon addiert
    icon = loeschenDesign(icon, i, box, h3);
    // Gast Löschen
    icon.addEventListener('click', async (e) => {
      try {
        e.preventDefault();
        const deletedGast = gaeste[i];

        await gastVonVeransEntfernen(deletedGast, gaeste, i);
      } catch (error) {
        console.error(error);
      }
    });
  }
}

/**
 * erstellen das Design von Gast, beim Löschen des Gasts
 */
function loeschenDesign (icon, i, box, h3) {
  icon = document.createElement('i');
  icon.className = 'fas fa-trash';
  icon.style = 'background: #e74c3c';
  icon.setAttribute('id', `del${i}`);
  box.appendChild(h3);
  box.appendChild(icon);
  return icon;
}

/**
 * erstellen das Design von Gast, bei der Anzeigen und Status bearbeiten
 */
function gastBearbeitenDesign (i, h3, icon, box) {
  const select = document.createElement('select');
  select.id = `status${i}`;
  select.onchange = () => {
    NEWSTATUS = document.getElementById(`status${i}`).value;
  };

  const values = [
    'Status auswählen',
    'unbekannt',
    'eingeladen',
    'zugesagt',
    'abgesagt'
  ];
  optionsSelectErstellen(select, values);
  h3.appendChild(select);

  icon = document.createElement('i');
  icon.className = 'fas fa-edit';
  icon.style = 'background: #27ae60';
  icon.setAttribute('id', `edit${i}`);

  box.appendChild(h3);
  box.appendChild(icon);
  return icon;
}

/**
 * der ausgewählte Gast von Datenbanken löschen
 * @param {Gast} deletedGast
 * @param {Array} gaeste
 * @param {Numbeber} i
 */
async function gastVonVeransEntfernen (deletedGast, gaeste, i) {
  await axios.delete(`/api/Gaeste/${deletedGast._id}`);

  await removeGastFromVeranstaltung(deletedGast._id, deletedGast.veranstaltung);

  gaeste.splice(i, 1); // lösche element in Index i
  if (gaeste.length > 0) {
    await wechselSeite(aktuelleSeite, gaeste, 'gast');
  } else {
    await hauptSeiteGaeste();
  }
}

/**
 * entferne das Gastid aus der Gästeliste der Veranstaltung
 */
async function removeGastFromVeranstaltung (gastId, veranstaltungId) {
  try {
    const { data } = await axios.get(`/api/Veranstaltungen/${veranstaltungId}`);
    const gastIndex = data.veranstaltung.gaesteliste.findIndex(
      (id) => id === gastId
    );

    if (gastIndex === -1) {
      throw new Error('Gast ist nicht in Veranstaltung gefunden');
    }

    data.veranstaltung.gaesteliste.splice(gastIndex, 1);
    await axios.put(
      `/api/Veranstaltungen/${veranstaltungId}`,
      data.veranstaltung
    );
  } catch (error) {
    console.error(error);
    throw error;
  }
}

/**
 * Status des ausgewählten Gasts bei Datenbanken bearbeiten
 * @param {Array} gaeste
 * @param {Number} i
 */
async function statusDesGastsWechseln (gaeste, i) {
  gaeste[i].status = NEWSTATUS || gaeste[i].status;
  const g = gaeste[i];

  await axios.put(`/api/Gaeste/${g._id}`, g);

  await wechselSeite(aktuelleSeite, gaeste, 'gast');
}

export {
  gaesteImportieren,
  gaesteHinzufuegen,
  hauptSeiteGaeste,
  gaesteLoeschenVonVeranst,
  getAlleGaesteInEinerVerans
};
