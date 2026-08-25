export default function decorate(block) {
  const rows = [...block.children];
  // Last row is the "Ben je al klant?" bar; preceding rows are the chooser cards.
  const cardRows = rows.slice(0, -1);
  const klantRow = rows[rows.length - 1];

  const ul = document.createElement('ul');
  cardRows.forEach((row) => {
    const li = document.createElement('li');
    const cell = row.firstElementChild || row;
    // highlight card = the one with a yellow bg marker (a <strong> heading style),
    // image card = the one containing a picture.
    if (cell.querySelector('picture')) li.classList.add('cards-maat-image');
    else if (cell.querySelector('ul')) li.classList.add('cards-maat-list');
    else li.classList.add('cards-maat-highlight');
    while (row.firstChild) li.append(row.firstChild);
    ul.append(li);
  });

  if (klantRow) klantRow.classList.add('cards-maat-klant');
  block.replaceChildren(ul);
  if (klantRow) block.append(klantRow);
}
