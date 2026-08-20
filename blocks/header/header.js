import { getMetadata } from '../../scripts/aem.js';
import { loadFragment } from '../fragment/fragment.js';

// media query match that indicates mobile/tablet width
const isDesktop = window.matchMedia('(min-width: 900px)');

function closeOnEscape(e) {
  if (e.code === 'Escape') {
    const nav = document.getElementById('nav');
    const navSections = nav.querySelector('.nav-sections');
    if (!navSections) return;
    const navSectionExpanded = navSections.querySelector('[aria-expanded="true"]');
    if (navSectionExpanded && isDesktop.matches) {
      // eslint-disable-next-line no-use-before-define
      toggleAllNavSections(navSections);
      navSectionExpanded.focus();
    } else if (!isDesktop.matches) {
      // eslint-disable-next-line no-use-before-define
      toggleMenu(nav, navSections);
      nav.querySelector('button').focus();
    }
  }
}

function closeOnFocusLost(e) {
  const nav = e.currentTarget;
  if (!nav.contains(e.relatedTarget)) {
    const navSections = nav.querySelector('.nav-sections');
    if (!navSections) return;
    const navSectionExpanded = navSections.querySelector('[aria-expanded="true"]');
    if (navSectionExpanded && isDesktop.matches) {
      // eslint-disable-next-line no-use-before-define
      toggleAllNavSections(navSections, false);
    } else if (!isDesktop.matches) {
      // eslint-disable-next-line no-use-before-define
      toggleMenu(nav, navSections, false);
    }
  }
}

function openOnKeydown(e) {
  const focused = document.activeElement;
  const isNavDrop = focused.className === 'nav-drop';
  if (isNavDrop && (e.code === 'Enter' || e.code === 'Space')) {
    const dropExpanded = focused.getAttribute('aria-expanded') === 'true';
    // eslint-disable-next-line no-use-before-define
    toggleAllNavSections(focused.closest('.nav-sections'));
    focused.setAttribute('aria-expanded', dropExpanded ? 'false' : 'true');
  }
}

function focusNavSection() {
  document.activeElement.addEventListener('keydown', openOnKeydown);
}

/**
 * Toggles all nav sections
 * @param {Element} sections The container element
 * @param {Boolean} expanded Whether the element should be expanded or collapsed
 */
function toggleAllNavSections(sections, expanded = false) {
  if (!sections) return;
  sections.querySelectorAll('.nav-sections .default-content-wrapper > ul > li').forEach((section) => {
    section.setAttribute('aria-expanded', expanded);
  });
}

/**
 * Toggles the entire nav
 * @param {Element} nav The container element
 * @param {Element} navSections The nav sections within the container element
 * @param {*} forceExpanded Optional param to force nav expand behavior when not null
 */
function toggleMenu(nav, navSections, forceExpanded = null) {
  const expanded = forceExpanded !== null ? !forceExpanded : nav.getAttribute('aria-expanded') === 'true';
  const button = nav.querySelector('.nav-hamburger button');
  document.body.style.overflowY = (expanded || isDesktop.matches) ? '' : 'hidden';
  nav.setAttribute('aria-expanded', expanded ? 'false' : 'true');
  toggleAllNavSections(navSections, expanded || isDesktop.matches ? 'false' : 'true');
  button.setAttribute('aria-label', expanded ? 'Open navigation' : 'Close navigation');
  // enable nav dropdown keyboard accessibility
  if (navSections) {
    const navDrops = navSections.querySelectorAll('.nav-drop');
    if (isDesktop.matches) {
      navDrops.forEach((drop) => {
        if (!drop.hasAttribute('tabindex')) {
          drop.setAttribute('tabindex', 0);
          drop.addEventListener('focus', focusNavSection);
        }
      });
    } else {
      navDrops.forEach((drop) => {
        drop.removeAttribute('tabindex');
        drop.removeEventListener('focus', focusNavSection);
      });
    }
  }

  // enable menu collapse on escape keypress
  if (!expanded || isDesktop.matches) {
    // collapse menu on escape press
    window.addEventListener('keydown', closeOnEscape);
    // collapse menu on focus lost
    nav.addEventListener('focusout', closeOnFocusLost);
  } else {
    window.removeEventListener('keydown', closeOnEscape);
    nav.removeEventListener('focusout', closeOnFocusLost);
  }
}

/**
 * loads and decorates the header, mainly the nav
 * @param {Element} block The header block element
 */
export default async function decorate(block) {
  // load nav as fragment
  const navMeta = getMetadata('nav');
  const navPath = navMeta ? new URL(navMeta, window.location).pathname : '/nav';
  const fragment = await loadFragment(navPath);

  // The fragment decoration strips bare-<strong> list items used as mega-menu
  // column headings. Fetch the raw nav HTML too so we can rebuild those columns.
  let rawNav = null;
  try {
    const resp = await fetch(`${navPath}.plain.html`);
    if (resp.ok) {
      const rawDoc = document.createElement('div');
      rawDoc.innerHTML = await resp.text();
      rawNav = rawDoc;
    }
  } catch { /* fall back to decorated fragment only */ }

  // decorate nav DOM
  block.textContent = '';
  const nav = document.createElement('nav');
  nav.id = 'nav';
  while (fragment.firstElementChild) nav.append(fragment.firstElementChild);

  const classes = ['utility', 'brand', 'sections', 'tools'];
  classes.forEach((c, i) => {
    const section = nav.children[i];
    if (section) section.classList.add(`nav-${c}`);
  });

  // utility bar (top tier): enable click dropdowns on its list items (Alle websites, NL)
  const navUtility = nav.querySelector('.nav-utility');
  if (navUtility) {
    navUtility.querySelectorAll(':scope ul > li').forEach((utilItem) => {
      if (utilItem.querySelector('ul')) {
        utilItem.classList.add('nav-drop');
        utilItem.setAttribute('aria-expanded', 'false');
        utilItem.addEventListener('click', () => {
          const expanded = utilItem.getAttribute('aria-expanded') === 'true';
          navUtility.querySelectorAll('li[aria-expanded="true"]').forEach((el) => el.setAttribute('aria-expanded', 'false'));
          utilItem.setAttribute('aria-expanded', expanded ? 'false' : 'true');
        });
      }
    });
  }

  const navBrand = nav.querySelector('.nav-brand');
  const brandLink = navBrand && navBrand.querySelector('.button');
  if (brandLink) {
    brandLink.className = '';
    brandLink.closest('.button-container').className = '';
  }

  const navSections = nav.querySelector('.nav-sections');
  if (navSections) {
    // Raw (undecorated) main-nav list items, still holding the <strong> column headings.
    const rawItems = rawNav
      ? [...rawNav.children][2]?.querySelectorAll(':scope > ul > li') || []
      : [];

    [...navSections.querySelectorAll(':scope .default-content-wrapper > ul > li')].forEach((navSection, idx) => {
      const submenu = navSection.querySelector(':scope > ul');
      if (submenu) {
        navSection.classList.add('nav-drop');
        // Build a mega-menu. Column boundaries are marked by heading <li>s
        // (a bare <strong> with no link) in the RAW nav; links following a
        // heading belong to it. The decorated fragment loses those headings.
        const rawSubmenu = rawItems[idx] ? rawItems[idx].querySelector(':scope > ul') : null;
        const source = rawSubmenu || submenu;
        const mega = document.createElement('div');
        mega.className = 'nav-mega';
        let column = null;
        const startColumn = (headingText) => {
          column = document.createElement('div');
          column.className = 'nav-mega-col';
          if (headingText) {
            const h = document.createElement('p');
            const strong = document.createElement('strong');
            strong.textContent = headingText;
            h.append(strong);
            column.append(h);
          }
          column.append(document.createElement('ul'));
          mega.append(column);
        };
        [...source.children].forEach((li) => {
          const strong = li.querySelector(':scope > strong');
          const link = li.querySelector(':scope > a');
          if (strong && !link) {
            startColumn(strong.textContent); // new column with this heading
          } else if (link) {
            if (!column) startColumn(null); // links before any heading
            const item = document.createElement('li');
            const a = document.createElement('a');
            a.href = link.getAttribute('href');
            a.textContent = link.textContent;
            item.append(a);
            column.querySelector('ul').append(item);
          }
        });
        submenu.replaceWith(mega);
      }
      navSection.addEventListener('click', () => {
        if (isDesktop.matches) {
          const expanded = navSection.getAttribute('aria-expanded') === 'true';
          toggleAllNavSections(navSections);
          navSection.setAttribute('aria-expanded', expanded ? 'false' : 'true');
        }
      });
    });
  }

  // hamburger for mobile
  const hamburger = document.createElement('div');
  hamburger.classList.add('nav-hamburger');
  hamburger.innerHTML = `<button type="button" aria-controls="nav" aria-label="Open navigation">
      <span class="nav-hamburger-icon"></span>
    </button>`;
  hamburger.addEventListener('click', () => toggleMenu(nav, navSections));
  nav.prepend(hamburger);
  nav.setAttribute('aria-expanded', 'false');
  // prevent mobile nav behavior on window resize
  toggleMenu(nav, navSections, isDesktop.matches);
  isDesktop.addEventListener('change', () => toggleMenu(nav, navSections, isDesktop.matches));

  const navWrapper = document.createElement('div');
  navWrapper.className = 'nav-wrapper';
  navWrapper.append(nav);
  block.append(navWrapper);
}
