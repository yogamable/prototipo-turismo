const carousel = document.querySelector('.s-destacados .carousel');
const track    = carousel.querySelector('.div-cards');
const prevBtn  = carousel.querySelector('.prev');
const nextBtn  = carousel.querySelector('.next');

const MAX_VISIBLE = 3;
const STEP = 1;            // cuántas cards avanza por click
const DURATION = 2000;      // ms, igual que la animación

let visible = MAX_VISIBLE;
let animating = false;

const getGap = el => parseFloat(getComputedStyle(el).columnGap) || 0;

function metrics() {
  const cardW = track.firstElementChild.offsetWidth;
  const gap = getGap(track);
  return { cardW, gap, unit: cardW + gap };
}

function updateVisible() {
  const { cardW, gap } = metrics();
  const available =
    carousel.clientWidth - prevBtn.offsetWidth * 2 - getGap(carousel) * 2;

  visible = Math.max(1, Math.min(MAX_VISIBLE, Math.floor((available + gap) / (cardW + gap))));
  visible = Math.min(visible, track.children.length);
  carousel.style.setProperty('--visible', visible);
}

function next() {
  if (animating) return;
  animating = true;

  const step = Math.min(STEP, visible);
  const { unit } = metrics();

  track.style.transition = `transform ${DURATION}ms ease`;
  track.style.transform = `translateX(-${step * unit}px)`;

  setTimeout(() => {
    // mueve las primeras cards al final y reinicia sin animación
    track.style.transition = 'none';
    for (let i = 0; i < step; i++) track.appendChild(track.firstElementChild);
    track.style.transform = 'translateX(0)';
    animating = false;
  }, DURATION);
}

function prev() {
  if (animating) return;
  animating = true;

  const step = Math.min(STEP, visible);
  const { unit } = metrics();

  // trae las últimas cards al inicio y compensa con un desplazamiento inicial
  track.style.transition = 'none';
  for (let i = 0; i < step; i++) track.prepend(track.lastElementChild);
  track.style.transform = `translateX(-${step * unit}px)`;

  track.getBoundingClientRect(); // fuerza el reflow antes de animar

  track.style.transition = `transform ${DURATION}ms ease`;
  track.style.transform = 'translateX(0)';

  setTimeout(() => { animating = false; }, DURATION);
}

nextBtn.addEventListener('click', next);
prevBtn.addEventListener('click', prev);

window.addEventListener('resize', () => {
  track.style.transition = 'none';
  track.style.transform = 'translateX(0)';
  updateVisible();
});

updateVisible();