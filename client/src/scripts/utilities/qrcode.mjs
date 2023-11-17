import qrcode from 'qrcode';

/**
 * Optionen für die QR-Code-Erstellung
 */
const qrCodeOptionen = {
  errorCorrectionLevel: 'H',
  type: 'image/png',
  width: 350,
  color: {
    dark: '#000000',
    light: '#f2f2f2'
  }
};

/**
 * Erstellt einen QR-Code-Bild aus einem gegebenen Eingabe (das "id"-Parameter)
 * @param {Array} id
 * @return {Promise<String>} Der generierte QR-Code in Form einer Daten-URL
 */
function qrCodeErstellen (id) {
  return new Promise((resolve, reject) => {
    qrcode.toDataURL(id, qrCodeOptionen, (error, url) => {
      if (error) reject(error);
      resolve(url);
    });
  });
}

/**
 * Erstellt und zeigt ein QR-Code-Bild im HTML-Seite
 * @param {Array} id
 */
async function qrCodeAnzeigen (id) {
  try {
    // Generate QR code
    const qrCodeUrl = await qrCodeErstellen(id);

    // container für den QR-code ertellen
    const qrCodeContainer = document.createElement('section');
    qrCodeContainer.id = 'sub-container';
    qrCodeContainer.classList.add('sub-container');

    const headingElement = document.createElement('header');
    headingElement.classList.add('heading');
    const headingText = document.createElement('h1');
    headingText.textContent = 'QR-Code';
    headingElement.appendChild(headingText);

    const boxContainer = document.createElement('div');
    boxContainer.classList.add('box-container');

    // Bild des QR-codes erstellen
    const qrCodeImage = document.createElement('img');
    qrCodeImage.id = 'qr-code';
    qrCodeImage.classList.add('qrcode');
    qrCodeImage.src = qrCodeUrl;

    // Herunterladen-button erstellen
    const downloadContainer = document.createElement('div');
    const downloadLink = document.createElement('a');
    downloadLink.href = qrCodeUrl;
    downloadLink.download = `qrcode-${id[0]}`;
    const downloadButton = document.createElement('button');
    downloadButton.classList.add('button');
    downloadButton.textContent = 'Herunterladen';
    downloadLink.appendChild(downloadButton);
    downloadContainer.appendChild(downloadLink);

    boxContainer.appendChild(qrCodeImage);
    qrCodeContainer.append(headingElement, boxContainer, downloadContainer);

    const mainContainer = document.querySelector('.container');
    mainContainer.innerHTML = '';
    mainContainer.appendChild(qrCodeContainer);
  } catch (error) {
    console.error(error);
  }
}

export { qrCodeAnzeigen };
