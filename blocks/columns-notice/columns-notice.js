export default function decorate(block) {
  const cols = [...block.firstElementChild.children];
  block.classList.add(`columns-notice-${cols.length}-cols`);
}
