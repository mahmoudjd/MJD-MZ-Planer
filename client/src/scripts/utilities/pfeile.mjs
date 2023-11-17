/**
 * erstellt einen Div Element mit icons von Pfeile und Seitenr
 * @returns div der enthält die previous und next pfeile bzw. die Seitenummer
 **/

function prevNextPfeileErstellen () {
  const prevIcon = document.createElement('i');
  prevIcon.className = 'fa fa-arrow-left';
  prevIcon.id = 'previous';

  const nextIcon = document.createElement('i');
  nextIcon.className = 'fa fa-arrow-right';
  nextIcon.id = 'next';

  const divIcons = document.createElement('div');
  divIcons.className = 'iconsPfeile';
  divIcons.id = 'iconsPfeile';

  const span = document.createElement('span');
  span.id = 'seite-nummer';

  divIcons.append(prevIcon, span, nextIcon);

  return divIcons;
}

export { prevNextPfeileErstellen };
