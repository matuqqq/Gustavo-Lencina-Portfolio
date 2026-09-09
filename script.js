const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
const root = document.documentElement;
const header = document.querySelector('.site-header');
const progress = document.querySelector('.scroll-progress span');
const revealNodes = document.querySelectorAll('[data-reveal]');

document.body.classList.add('js-ready');
if (finePointer) document.body.classList.add('has-fine-pointer');
document.querySelector('#current-year').textContent = new Date().getFullYear();

revealNodes.forEach((node) => {
  if (node.dataset.delay) node.style.setProperty('--delay', node.dataset.delay);
});

const revealObserver = new IntersectionObserver(
  (entries, observer) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-visible');
      observer.unobserve(entry.target);
    });
  },
  { threshold: 0.12 },
);

revealNodes.forEach((node) => revealObserver.observe(node));

const menuToggle = document.querySelector('.menu-toggle');
const mobileMenu = document.querySelector('.mobile-menu');

function closeMenu() {
  menuToggle.setAttribute('aria-expanded', 'false');
  menuToggle.setAttribute('aria-label', 'Abrir menú');
  mobileMenu.classList.remove('is-open');
}

menuToggle.addEventListener('click', () => {
  const isOpen = menuToggle.getAttribute('aria-expanded') === 'true';
  menuToggle.setAttribute('aria-expanded', String(!isOpen));
  menuToggle.setAttribute('aria-label', isOpen ? 'Abrir menú' : 'Cerrar menú');
  mobileMenu.classList.toggle('is-open', !isOpen);
});

document.querySelectorAll('[data-nav-link]').forEach((link) => link.addEventListener('click', closeMenu));
document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') closeMenu();
});

let ticking = false;
function updateScrollState() {
  const scrollable = document.documentElement.scrollHeight - window.innerHeight;
  progress.style.transform = `scaleX(${scrollable > 0 ? window.scrollY / scrollable : 0})`;
  header.classList.toggle('is-scrolled', window.scrollY > 20);
  if (!reducedMotion) root.style.setProperty('--scroll-y', Math.min(window.scrollY * 0.0001, 0.06));
  ticking = false;
}

window.addEventListener('scroll', () => {
  if (!ticking) {
    window.requestAnimationFrame(updateScrollState);
    ticking = true;
  }
}, { passive: true });
updateScrollState();

if (!reducedMotion && finePointer) {
  const dot = document.querySelector('.cursor-dot');
  const ring = document.querySelector('.cursor-ring');
  window.addEventListener('pointermove', (event) => {
    dot.style.transform = `translate(${event.clientX}px, ${event.clientY}px) translate(-50%, -50%)`;
    ring.style.transform = `translate(${event.clientX}px, ${event.clientY}px) translate(-50%, -50%)`;
    const x = (event.clientX / window.innerWidth - 0.5).toFixed(3);
    root.style.setProperty('--pointer-x', x);
  }, { passive: true });
  document.querySelectorAll('a, button, input, textarea').forEach((element) => {
    element.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
    element.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
  });
}

const sections = [...document.querySelectorAll('main section[id]')];
const navLinks = [...document.querySelectorAll('[data-nav-link]')];
const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;
    navLinks.forEach((link) => link.classList.toggle('is-active', link.getAttribute('href') === `#${entry.target.id}`));
  });
}, { rootMargin: '-42% 0px -48% 0px', threshold: 0 });
sections.forEach((section) => sectionObserver.observe(section));

const filterButtons = document.querySelectorAll('[data-filter]');
const workCards = document.querySelectorAll('.work-card');
filterButtons.forEach((button) => {
  button.addEventListener('click', () => {
    const filter = button.dataset.filter;
    filterButtons.forEach((item) => {
      const active = item === button;
      item.classList.toggle('is-active', active);
      item.setAttribute('aria-pressed', String(active));
    });
    workCards.forEach((card) => {
      const visible = filter === 'all' || card.dataset.category === filter;
      card.classList.toggle('is-hidden', !visible);
      card.setAttribute('aria-hidden', String(!visible));
    });
  });
});

const projectDialog = document.querySelector('#project-dialog');
const dialogImage = document.querySelector('#dialog-image');
const dialogTitle = document.querySelector('#dialog-title');
const dialogType = document.querySelector('#dialog-type');
const dialogYear = document.querySelector('#dialog-year');
const dialogDescription = document.querySelector('#dialog-description');
const dialogCount = document.querySelector('#dialog-count');
const dialogCards = [...workCards];
let activeProject = 0;

function fillDialog(index) {
  activeProject = (index + dialogCards.length) % dialogCards.length;
  const card = dialogCards[activeProject];
  dialogImage.src = card.dataset.image;
  dialogImage.alt = card.dataset.alt;
  dialogTitle.textContent = card.dataset.title;
  dialogType.textContent = card.dataset.type;
  dialogYear.textContent = card.dataset.year;
  dialogDescription.textContent = card.dataset.description;
  dialogCount.textContent = `${String(activeProject + 1).padStart(2, '0')} / ${String(dialogCards.length).padStart(2, '0')}`;
}

function openProject(index) {
  fillDialog(index);
  if (!projectDialog.open) projectDialog.showModal();
  document.body.classList.add('modal-open');
}

function closeProject() {
  if (projectDialog.open) projectDialog.close();
  document.body.classList.remove('modal-open');
}

dialogCards.forEach((card, index) => card.addEventListener('click', () => openProject(index)));
document.querySelector('.dialog-close').addEventListener('click', closeProject);
document.querySelector('#dialog-prev').addEventListener('click', () => fillDialog(activeProject - 1));
document.querySelector('#dialog-next').addEventListener('click', () => fillDialog(activeProject + 1));
projectDialog.addEventListener('click', (event) => {
  if (event.target === projectDialog) closeProject();
});
projectDialog.addEventListener('close', () => document.body.classList.remove('modal-open'));
document.addEventListener('keydown', (event) => {
  if (!projectDialog.open) return;
  if (event.key === 'ArrowLeft') fillDialog(activeProject - 1);
  if (event.key === 'ArrowRight') fillDialog(activeProject + 1);
});

const timelineData = {
  tecnopolis: { number: '01', label: 'El trabajo que conecta todas las piezas', title: 'Tecnópolis y las muestras de ciencia', text: 'Dirección artística, coordinación y producción para llevar ciencia, tecnología y curiosidad a Buenos Aires y a distintas provincias argentinas.' },
  azara: { number: '02', label: 'Arte, naturaleza y reconstrucción', title: 'Fundación Azara y los museos', text: 'Réplicas de esqueletos, ilustraciones de fauna extinta, murales y montaje de piezas junto a técnicos del Museo Argentino de Ciencias Naturales y equipos internacionales.' },
  zaragoza: { number: '03', label: 'Una práctica que cruza fronteras', title: 'España: del Tastavinsaurus a los centros de visitantes', text: 'Reconstrucción de un ejemplar emblemático para la Universidad de Zaragoza y trabajo creativo para Paleoymas, Alicante, además de proyectos en las Islas Canarias.' },
  mef: { number: '04', label: 'El presente también se documenta', title: 'Más de 60 ilustraciones para el MEF', text: 'En 2024 realizó más de 60 ilustraciones científicas para el nuevo Museo Paleontológico Egidio Feruglio, en Trelew, Chubut.' },
};
const timelineDetail = document.querySelector('#timeline-detail');
document.querySelectorAll('[data-timeline]').forEach((button) => {
  button.addEventListener('click', () => {
    const item = timelineData[button.dataset.timeline];
    document.querySelectorAll('[data-timeline]').forEach((node) => {
      const active = node === button;
      node.classList.toggle('is-active', active);
      node.setAttribute('aria-pressed', String(active));
    });
    timelineDetail.querySelector('.timeline-detail-number').textContent = item.number;
  timelineDetail.querySelector('.timeline-detail-label').textContent = item.label;
    timelineDetail.querySelector('h3').textContent = item.title;
    timelineDetail.querySelector('p:last-child').textContent = item.text;
    button.scrollIntoView({ behavior: reducedMotion ? 'auto' : 'smooth', block: 'nearest', inline: 'center' });
  });
});

const contactForm = document.querySelector('#contact-form');
const formSuccess = document.querySelector('#form-success');
contactForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  if (!contactForm.checkValidity()) {
    contactForm.reportValidity();
    return;
  }
  const data = new FormData(contactForm);
  const brief = `Hola Gustavo, soy ${data.get('name')}. Mi email es ${data.get('email')}.\n\n${data.get('message')}`;
  try {
    await navigator.clipboard.writeText(brief);
    formSuccess.textContent = 'Brief copiado. Ya podés pegarlo en tu correo o canal de contacto preferido.';
  } catch {
    formSuccess.textContent = 'Brief preparado. Copialo desde el texto ingresado y pegalo en tu canal de contacto preferido.';
  }
  formSuccess.hidden = false;
  contactForm.reset();
});
