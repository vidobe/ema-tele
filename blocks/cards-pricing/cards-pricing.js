export default function decorate(block) {
  const ul = document.createElement('ul');
  [...block.children].forEach((row) => {
    const li = document.createElement('li');
    while (row.firstElementChild) li.append(row.firstElementChild);
    [...li.children].forEach((div) => {
      div.className = 'cards-pricing-body';
    });
    // Mark cards flagged as "most chosen" (first paragraph is a badge)
    const badge = li.querySelector('.cards-pricing-body > p:first-child em');
    if (badge) li.classList.add('cards-pricing-featured');
    ul.append(li);
  });
  block.replaceChildren(ul);
}
