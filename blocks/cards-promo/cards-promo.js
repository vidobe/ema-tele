export default function decorate(block) {
  const ul = document.createElement('ul');
  [...block.children].forEach((row) => {
    const li = document.createElement('li');
    while (row.firstElementChild) li.append(row.firstElementChild);

    // The first cell holding only a picture is the card background.
    [...li.children].forEach((div) => {
      const pic = div.querySelector('picture');
      if (pic && div.children.length === 1) {
        const img = pic.querySelector('img');
        if (img) li.style.backgroundImage = `url('${img.getAttribute('src')}')`;
        div.remove();
      } else {
        div.classList.add('cards-promo-body');
      }
    });
    ul.append(li);
  });
  block.replaceChildren(ul);
}
