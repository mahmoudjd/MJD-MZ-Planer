
/**
 * erstellt den footer Teil der Seite
 */
function createFooter () {
  const footer = document.querySelector('.footer');
  const container = document.createElement('div');
  container.className = 'box-container';
  footer.appendChild(container);
  const copyright = document.createElement('div');
  copyright.className = 'cpClass';
  copyright.innerHTML = `
      &copy; 2023 by
      <span>Web-Entwicklung, Trier University of Applied Science</span>
    `;
  footer.appendChild(copyright);
}

export { createFooter };
