document.documentElement.classList.add('motion-ready');
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
const hero = document.querySelector('.hero');
const booking = document.querySelector('.booking');
const video = document.querySelector('.hero-video');
const cards = [...document.querySelectorAll('.service-card')];
const toTop = document.querySelector('.to-top');
const clamp = (n, min = 0, max = 1) => Math.min(max, Math.max(min, n));
let scrollScheduled = false;
let bookingVisible = false;

function renderScroll() {
  scrollScheduled = false;
  toTop.classList.toggle('is-visible', window.scrollY > window.innerHeight * .7 && !bookingVisible);
  if (reducedMotion.matches) return;

  const heroProgress = clamp(-hero.getBoundingClientRect().top / hero.offsetHeight);
  hero.style.setProperty('--video-shift', `${(heroProgress * hero.offsetHeight * .28).toFixed(1)}px`);
  hero.style.setProperty('--copy-shift', `${(heroProgress * hero.offsetHeight * .12).toFixed(1)}px`);
  hero.style.setProperty('--copy-opacity', (1 - heroProgress * .55).toFixed(3));

  for (const [index, card] of cards.entries()) {
    const rect = card.getBoundingClientRect();
    const progress = clamp((window.innerHeight - rect.top) / (window.innerHeight + rect.height));
    const drift = [48, -38, 54][index] * (.5 - progress);
    card.style.setProperty('--drift', `${drift.toFixed(1)}px`);
  }
}
function scheduleScroll() {
  if (!scrollScheduled) {
    scrollScheduled = true;
    requestAnimationFrame(renderScroll);
  }
}
window.addEventListener('scroll', scheduleScroll, { passive: true });
window.addEventListener('resize', scheduleScroll, { passive: true });
reducedMotion.addEventListener('change', scheduleScroll);
scheduleScroll();

const cardObserver = new IntersectionObserver(entries => {
  for (const entry of entries) {
    if (entry.isIntersecting) {
      entry.target.classList.add('is-visible');
      window.setTimeout(() => entry.target.classList.add('is-settled'), 1050);
      cardObserver.unobserve(entry.target);
    }
  }
}, { threshold: .12, rootMargin: '0px 0px 7% 0px' });
for (const card of cards) cardObserver.observe(card);

const bookingObserver = new IntersectionObserver(([entry]) => {
  bookingVisible = entry.isIntersecting;
  scheduleScroll();
});
bookingObserver.observe(booking);

const videoObserver = new IntersectionObserver(([entry]) => {
  if (entry.isIntersecting && !reducedMotion.matches) video.play().catch(() => {});
  else video.pause();
}, { rootMargin: '180px' });
videoObserver.observe(hero);
reducedMotion.addEventListener('change', () => {
  if (reducedMotion.matches) video.pause();
  else if (hero.getBoundingClientRect().bottom > 0) video.play().catch(() => {});
});
document.querySelector('#year').textContent = new Date().getFullYear();
