/**
 * Accordion block.
 * Structure: each row is one item. First cell = summary/label, optional second cell = body.
 * A row with only a label becomes a collapsible header with no body (still toggles aria state).
 * An optional leading row containing only a heading (and/or an image) is treated as the
 * accordion's title/intro and is not made collapsible.
 */
export default function decorate(block) {
  [...block.children].forEach((row) => {
    const cells = [...row.children];

    // Title/intro row: contains a heading or a lone image, no plain label paragraph
    const hasHeading = row.querySelector('h1, h2, h3, h4, h5, h6');
    const isIntro = hasHeading && !row.querySelector(':scope > div > p:not(:has(picture))')
      && cells.length === 1 && row === block.firstElementChild;

    if (isIntro) {
      row.classList.add('accordion-intro');
      return;
    }

    row.classList.add('accordion-item');
    const label = cells[0];
    const body = cells[1];
    label.classList.add('accordion-item-label');

    const details = document.createElement('details');
    const summary = document.createElement('summary');
    summary.className = 'accordion-item-summary';
    while (label.firstChild) summary.append(label.firstChild);
    details.append(summary);

    if (body) {
      body.classList.add('accordion-item-body');
      details.append(body);
    }

    row.replaceChildren(details);
  });
}
