import "./src/main.jsx";

const menuToggle = document.getElementById('menuToggle');
const primaryNav = document.getElementById('primaryNav');
const progress = document.getElementById('scrollProgress');

menuToggle?.addEventListener('click', () => {
  const isOpen = menuToggle.getAttribute('aria-expanded') === 'true';
  menuToggle.setAttribute('aria-expanded', String(!isOpen));
  menuToggle.setAttribute('aria-label', isOpen ? 'Open navigation' : 'Close navigation');
  primaryNav.classList.toggle('open', !isOpen);
});

function closeMobileNav(returnFocus = false) {
  if (menuToggle.getAttribute('aria-expanded') !== 'true') return;
  menuToggle.setAttribute('aria-expanded', 'false');
  menuToggle.setAttribute('aria-label', 'Open navigation');
  primaryNav.classList.remove('open');
  if (returnFocus) menuToggle.focus();
}

primaryNav?.querySelectorAll('a').forEach((link) => {
  link.addEventListener('click', () => closeMobileNav());
});

menuToggle?.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') closeMobileNav(true);
});
primaryNav?.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') closeMobileNav(true);
});
window.addEventListener('resize', () => {
  if (window.innerWidth > 900) closeMobileNav();
});

const workGrid = document.querySelector('.work-grid');
const projectDetails = [...document.querySelectorAll('.project-showcase details')];
function updateProjectLayout() {
  const openCount = projectDetails.filter((details) => details.open).length;
  workGrid.classList.toggle('projects-collapsed', openCount === 0);
  workGrid.classList.toggle('project-single-expanded', openCount === 1);
  workGrid.classList.toggle('projects-expanded-both', openCount === projectDetails.length);
}
projectDetails.forEach((details) => details.addEventListener('toggle', updateProjectLayout));
updateProjectLayout();

function updateProgress() {
  const scrollable = document.documentElement.scrollHeight - window.innerHeight;
  const amount = scrollable > 0 ? (window.scrollY / scrollable) * 100 : 0;
  progress.style.width = `${Math.min(100, Math.max(0, amount))}%`;
}
window.addEventListener('scroll', updateProgress, { passive: true });
updateProgress();

const revealItems = document.querySelectorAll('.reveal');
if ('IntersectionObserver' in window && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  const observer = new IntersectionObserver((entries, currentObserver) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        currentObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -35px 0px' });
  revealItems.forEach((item) => observer.observe(item));
} else {
  revealItems.forEach((item) => item.classList.add('is-visible'));
}

const sections = [...document.querySelectorAll('main section[id]')];
const navLinks = [...document.querySelectorAll('.primary-nav a[href^="#"]')];
if ('IntersectionObserver' in window) {
  const activeObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      navLinks.forEach((link) => {
        link.classList.toggle('active', link.getAttribute('href') === `#${entry.target.id}`);
      });
    });
  }, { rootMargin: '-35% 0px -55% 0px' });
  sections.forEach((section) => activeObserver.observe(section));
}

document.getElementById('currentYear').textContent = new Date().getFullYear();
