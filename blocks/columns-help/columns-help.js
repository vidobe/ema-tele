export default function decorate(block) {
  // last row holds the contact columns; mark each cell
  const rows = [...block.children];
  const lastRow = rows[rows.length - 1];
  if (lastRow && lastRow.children.length > 1) {
    lastRow.classList.add('columns-help-links');
  }
}
