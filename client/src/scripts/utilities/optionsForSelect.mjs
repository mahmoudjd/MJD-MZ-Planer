/**
 *  erstellt und hinzufügt Optionen für ein Select Tag
 * @param {SELECT} select
 * @param {*Array} values name in select options
 **/
function optionsSelectErstellen (select, values) {
  for (const value of values) {
    const op = document.createElement('option');
    op.value = value;
    op.textContent = value;
    select.appendChild(op);
  }
}

function optionsSelectErstellen2 (select, values) {
  for (const value of values) {
    const op = document.createElement('option');
    op.value = value.id;
    op.textContent = value.title;
    select.appendChild(op);
  }
}
export { optionsSelectErstellen, optionsSelectErstellen2 };
