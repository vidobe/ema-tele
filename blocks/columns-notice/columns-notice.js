export default function decorate(block) {
  const box = block.firstElementChild;
  if (!box) return;

  // Find the "Spring naar" jump-link row: the child holding the anchor links.
  const rows = [...box.children];
  const jumpRow = rows.find((row) => row.querySelector('a'));

  if (jumpRow) {
    // Move it out of the notice box and render it below as a filter pill row.
    jumpRow.classList.add('nav-filter-row');
    block.append(jumpRow);
  }
}
