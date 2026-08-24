import { decorateIcons } from '../../scripts/aem.js';

export default function decorate(block) {
  const box = block.firstElementChild;
  if (!box) return;

  // Move the "Spring naar" jump-link row above the box as a filter pill row.
  const jumpRow = [...box.children].find((row) => row.querySelector('a'));
  if (jumpRow) {
    jumpRow.classList.add('nav-filter-row');
    block.prepend(jumpRow);
  }

  // The notice content box: mark heading + body so we can style them.
  const paras = [...box.children];
  if (paras[0]) {
    paras[0].classList.add('notice-heading');
    // prepend an info icon to the heading
    const icon = document.createElement('span');
    icon.className = 'icon icon-info';
    paras[0].prepend(icon, ' ');
  }
  // remaining paragraphs form the indented body
  const body = document.createElement('div');
  body.className = 'notice-body';
  paras.slice(1).forEach((p) => body.append(p));
  if (body.children.length) box.append(body);

  // close button (top-right)
  const close = document.createElement('button');
  close.type = 'button';
  close.className = 'notice-close';
  close.setAttribute('aria-label', 'Sluiten');
  close.innerHTML = '<span class="icon icon-close"></span>';
  close.addEventListener('click', () => {
    block.style.display = 'none';
  });
  box.append(close);

  // render the icon spans (icon-info, icon-close) into <img> tags
  decorateIcons(block);
}
