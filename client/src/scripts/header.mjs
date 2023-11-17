export function createHeader () {
  // Create the header element
  // Create the logo link and add a click event listener to reload the page
  const logoLink = document.createElement('a');
  logoLink.classList.add('logo');
  logoLink.href = '';
  logoLink.textContent = 'MJd&MZ-Planer';
  logoLink.addEventListener('click', function () {
    window.location.reload();
  });

  const iconsPart = document.createElement('div');
  iconsPart.classList.add('icons-part');
  // Create the schnelle-seiten div
  const schnelleSeiten = document.createElement('div');
  schnelleSeiten.classList.add('schnelle-seiten');

  // Create the icons div and add the menu button icon
  const iconsDiv = document.createElement('div');
  iconsDiv.classList.add('icons');
  const menuBtnIcon = document.createElement('div');
  menuBtnIcon.classList.add('fas', 'fa-bars');
  menuBtnIcon.id = 'menu-btn';
  iconsDiv.appendChild(menuBtnIcon);
  // create icom um theme zu wechseln
  const themeWechsel = document.createElement('div');
  themeWechsel.classList.add('fas', 'fa-moon');
  themeWechsel.id = 'theme-switch';

  iconsDiv.appendChild(themeWechsel);
  const iconTheme = document.createElement('div');
  iconTheme.classList.add('icons2');
  iconTheme.appendChild(themeWechsel);

  // Create the navigation links and add click event listeners
  const navLinksDiv = document.createElement('nav');
  navLinksDiv.classList.add('navbar');

  const vNavLink = document.createElement('a');
  vNavLink.href = '#';
  vNavLink.id = 'vNav';
  vNavLink.textContent = 'Veranstaltungen';

  const gNavLink = document.createElement('a');
  gNavLink.href = '#';
  gNavLink.id = 'gNav';
  gNavLink.textContent = 'Gästelisten';

  const sNavLink = document.createElement('a');
  sNavLink.href = '#';
  sNavLink.id = 'sNav';
  sNavLink.textContent = 'Sitzpläne';

  navLinksDiv.appendChild(vNavLink);
  navLinksDiv.appendChild(gNavLink);
  navLinksDiv.appendChild(sNavLink);

  // Add the header elements to the DOM
  const header = document.querySelector('.header');
  header.appendChild(logoLink);
  header.appendChild(iconsPart);
  iconsPart.appendChild(schnelleSeiten);
  iconsPart.appendChild(iconTheme);
  iconsPart.appendChild(iconsDiv);
  iconsPart.appendChild(navLinksDiv);
  createSchnellWechselHSeiten(schnelleSeiten);
}

// const schnelleSeite = document.querySelector('.schnelle-seiten');

/**
 * erstellt den Teil der schnellen Wechel in die Hauptseiten in Header
 * @param {Element} container container div
 */
function createSchnellWechselHSeiten (container) {
  for (const i of [1, 2, 3]) {
    const a = document.createElement('a');
    a.id = `aHeader${i}`;
    switch (i) {
      case 1:
        a.innerHTML = '<i class="fa fa-calendar"></i> Veranstaltungen';
        break;
      case 2:
        a.innerHTML = '<i class="fas fa-users"></i> Gästeliste';
        break;
      case 3:
        a.innerHTML = '<i class="fas fa-table"></i> Sitzpläne';
        break;
    }
    container.appendChild(a);
  }
}
