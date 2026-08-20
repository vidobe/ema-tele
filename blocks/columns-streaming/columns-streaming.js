export default function decorate(block) {
  // mark the streaming banner row (single image) for full-bleed styling
  [...block.children].forEach((row) => {
    const cells = [...row.children];
    if (cells.length === 1 && cells[0].querySelector('picture')) {
      row.classList.add('columns-streaming-banner');
    } else {
      row.classList.add('columns-streaming-inbegrepen');
    }
  });
}
