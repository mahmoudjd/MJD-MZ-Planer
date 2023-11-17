import { tischeAnzeigen, createTische } from './tische.mjs';
import { bestaetigungMSG } from '../utilities/bestaetigungMSG.mjs';
import { veranstaltungAnlegen } from '../veranstaltungen/veranstaltung.mjs';
import {
  optionsSelectErstellen,
  optionsSelectErstellen2
} from '../utilities/optionsForSelect.mjs';
import { axios, getVeranstaltungsTiteln } from '../main.mjs';

// globale Veranstaltung ID
// let globalId = '';
const mainContainer = document.querySelector('.container');

/**
 * HauptSite eines Sitzplans einer Veranstaltung
 */
async function hauptSeiteSitzplaene () {
  try {
    const div = document.createElement('div');
    div.type = 'div';
    div.id = 'sub-container';
    div.className = 'sub-container';

    const ul = document.createElement('ul');
    const li1 = document.createElement('li');
    const select = document.createElement('select');
    select.id = 'alleVeranstaltungstitlenS';

    const titles = await getVeranstaltungsTiteln();
    optionsSelectErstellen2(select, titles);

    const li2 = document.createElement('li');
    const btn = document.createElement('button');
    btn.id = 'SitzplanBearbeiten';
    btn.className = 'button';
    btn.textContent = 'Tische der Veranstaltung';

    ul.append(li1, li2);
    li1.appendChild(select);
    li2.appendChild(btn);
    div.appendChild(ul);

    const vPare = {
      title: '',
      id: ''
    };

    select.onchange = () => {
      vPare.title = document.getElementById(
        'alleVeranstaltungstitlenS'
      ).textContent;
      vPare.id = document.getElementById('alleVeranstaltungstitlenS').value;
    };

    mainContainer.innerHTML = '';
    mainContainer.appendChild(div);

    const bearb = document.getElementById('SitzplanBearbeiten');
    bearb.addEventListener('click', async (e) => {
      e.preventDefault();
      // const vId = mapVeranstaltungen.get(`${vPare.title}`);
      if (vPare.id) {
        const { data } = await axios.get(`/api/Veranstaltungen/${vPare.id}`);
        if (data.veranstaltung.sitzplan) {
          await tischeAnzeigen(vPare.id, data.veranstaltung.title);
        } else {
          window.alert('Es wurde noch keinen Sitzplan erstellt');
          sitzplanAnlegen(vPare.id);
        }
      } else {
        window.alert('Bitte eine Veranstaltung auswählen!');
      }
    });
  } catch (error) {
    console.error(error);
  }
}

/**
 * erstellt einen Sitzplan für dir Veranstaltung
 * @param vId
 */
function sitzplanAnlegen (vId) {
  const plan = {
    veranstaltung: vId,
    typeTisch: '',
    anzahlTische: 0,
    stuehleProTisch: 0,
    tische: []
  };

  const div = document.createElement('div');
  div.id = 'sub-container';
  div.className = 'sub-container';

  const header = document.createElement('h2');
  header.textContent = 'Sitzplan erstellen';
  div.appendChild(header);

  const ul = document.createElement('ul');
  div.appendChild(ul);

  const li1 = document.createElement('li');
  ul.appendChild(li1);

  const labelTische = document.createElement('label');
  labelTische.textContent = 'Anzahl der Tische:';
  li1.appendChild(labelTische);

  const inputTische = document.createElement('input');
  inputTische.id = 'anzahlTische';
  inputTische.type = 'number';
  li1.appendChild(inputTische);
  inputTische.addEventListener('change', () => {
    plan.anzahlTische = inputTische.value;
  });

  const li2 = document.createElement('li');
  ul.appendChild(li2);
  const labelStuehle = document.createElement('label');
  labelStuehle.textContent = 'Stühle pro Tisch:';
  li2.appendChild(labelStuehle);

  const inputStuehle = document.createElement('input');
  inputStuehle.id = 'anzahlStuehle';
  inputStuehle.type = 'number';
  li2.appendChild(inputStuehle);

  inputStuehle.addEventListener('change', () => {
    plan.stuehleProTisch = inputStuehle.value;
  });

  const li3 = document.createElement('li');
  ul.appendChild(li3);
  const labelType = document.createElement('label');
  labelType.textContent = 'Type der Tisch:';
  li3.appendChild(labelType);

  const select = document.createElement('select');
  select.id = 'typeTisch';

  li3.appendChild(select);

  const values = ['Type auswählen:', 'einseitig', 'zweiseitig'];
  optionsSelectErstellen(select, values);

  select.addEventListener('change', () => {
    plan.typeTisch = select.value;
  });

  const button = document.createElement('button');
  button.id = 'addPlan';
  button.className = 'button';
  button.textContent = 'Bestimmen';
  ul.appendChild(button);

  mainContainer.innerHTML = '';
  mainContainer.appendChild(div);

  button.addEventListener('click', async () => {
    try {
      await planHinzufuegen(plan);
    } catch (error) {
      console.error(error);
    }
  });
}

/**
 * fügt ein plan in die Databanken hinzu.
 * @param plan
 */
async function planHinzufuegen (plan) {
  if (plan.typeTisch && plan.anzahlTische > 0 && plan.stuehleProTisch > 0) {
    const { data } = await axios.post('/api/Plaene', plan);
    const veranstaltung = { sitzplan: data.plan._id };
    await axios.put(
      `/api/Veranstaltungen/${plan.veranstaltung}`,
      veranstaltung
    );

    createTische(data.plan);
    veranstaltungAnlegen();
    // Bestätigung des Hinzufügens zeigen
    bestaetigungMSG(
      `Die Veranstaltung wurde erfolgreich mit Sitzplan und ${data.plan.anzahlTische} Tischen angelegt!`
    );
  } else {
    window.alert(
      'Bitte alle Felder eingeben und keine nigative Nummern abgeben!'
    );
  }
}

/**
 * findet den Sitzplan einer Veranstaltung
 * @param vId
 */
async function getSitzplan (vId) {
  try {
    const { data } = await axios.get(`/api/Veranstaltungen/${vId}`);

    const planData = await axios.get(
      `/api/Plaene/${data.veranstaltung.sitzplan}`
    );

    return planData.data.plan;
  } catch (error) {
    console.error(error);
    return null;
  }
}

export { getSitzplan, sitzplanAnlegen, hauptSeiteSitzplaene };
