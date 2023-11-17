
const mainContainer = document.querySelector('.container');

/**
 * eine Benachrichtigung auf der Benutzeroberfläche anzeigen.
 * @param {String} msg
 */
function bestaetigungMSG (msg) {
  const notification = document.createElement('div');
  notification.textContent = msg;
  notification.classList.add('notification');
  mainContainer.firstChild.appendChild(notification);

  // entfernt die Benachrichtigung nach 4 Sekunden aus dem mainContainer-Element, wenn sie noch vorhanden ist.
  setTimeout(() => {
    if (mainContainer.firstChild.contains(notification)) {
      mainContainer.firstChild.removeChild(notification);
    }
  }, 4000);
}

export { bestaetigungMSG };
