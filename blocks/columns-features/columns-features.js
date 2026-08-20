export default function decorate(block) {
  // first cell that is only an image becomes the media column
  [...block.children].forEach((row) => {
    [...row.children].forEach((col) => {
      const pic = col.querySelector('picture');
      if (pic && col.children.length === 1) {
        col.classList.add('columns-features-media');
      } else {
        col.classList.add('columns-features-list');
      }
    });
  });
}
