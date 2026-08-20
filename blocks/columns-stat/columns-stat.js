export default function decorate(block) {
  [...block.children].forEach((row) => {
    [...row.children].forEach((col) => {
      const pic = col.querySelector('picture');
      if (pic && col.children.length === 1) col.classList.add('columns-stat-media');
      else col.classList.add('columns-stat-text');
    });
  });
}
