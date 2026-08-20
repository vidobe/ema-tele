export default function decorate(block) {
  // mark the active filter based on the current hash and update on click
  const links = [...block.querySelectorAll('a')];
  const setActive = () => {
    const { hash } = window.location;
    links.forEach((a) => {
      a.classList.toggle('active', a.getAttribute('href') === hash);
    });
  };
  links.forEach((a) => a.addEventListener('click', () => {
    links.forEach((l) => l.classList.remove('active'));
    a.classList.add('active');
  }));
  setActive();
  window.addEventListener('hashchange', setActive);
}
