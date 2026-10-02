const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)');
const hero = document.querySelector('.hero-journey');
const services = document.querySelector('.services');
const booking = document.querySelector('.booking');
const cards = [...document.querySelectorAll('.service-card')];
const clipper = document.querySelector('.clipper');
const toTop = document.querySelector('.to-top');
const video = document.querySelector('.hero-video');
const clamp = (value, min = 0, max = 1) => Math.min(max, Math.max(min, value));
let ticking = false;
let bookingVisible = false;

function updateScroll() {
  ticking = false;
  const y = window.scrollY;
  toTop.classList.toggle('is-visible', y > window.innerHeight * .7 && !bookingVisible);
  if (reduceMotion.matches) return;
  const heroDistance = Math.max(1, hero.offsetHeight - window.innerHeight);
  const heroProgress = clamp(-hero.getBoundingClientRect().top / heroDistance);
  hero.style.setProperty('--hero-progress', heroProgress.toFixed(3));
  const serviceRect = services.getBoundingClientRect();
  const servicesProgress = clamp((window.innerHeight - serviceRect.top) / (serviceRect.height + window.innerHeight));
  services.style.setProperty('--services-progress', servicesProgress.toFixed(3));
  const bookingRect = booking.getBoundingClientRect();
  booking.style.setProperty('--booking-progress', clamp((window.innerHeight - bookingRect.top) / (bookingRect.height + window.innerHeight)).toFixed(3));
  for (const [index, card] of cards.entries()) {
    const rect = card.getBoundingClientRect();
    const progress = clamp((window.innerHeight - rect.top) / (window.innerHeight + rect.height));
    const distance = [48, -42, 56][index];
    card.style.setProperty('--card-y', `${((.5 - progress) * distance).toFixed(1)}px`);
    card.style.setProperty('--card-r', `${((.5 - progress) * [-3, 2, -2][index]).toFixed(2)}deg`);
  }
}
function scheduleScroll() {
  if (!ticking) { ticking = true; requestAnimationFrame(updateScroll); }
}
window.addEventListener('scroll', scheduleScroll, { passive: true });
window.addEventListener('resize', scheduleScroll, { passive: true });
reduceMotion.addEventListener('change', scheduleScroll);
const bookingObserver = new IntersectionObserver(([entry]) => {
  bookingVisible = entry.isIntersecting;
  scheduleScroll();
}, { threshold: 0 });
bookingObserver.observe(booking);
scheduleScroll();

// Keep video resources for the opening; pause when well outside view.
const videoObserver = new IntersectionObserver(([entry]) => {
  if (entry.isIntersecting && !reduceMotion.matches) video.play().catch(() => {});
  else video.pause();
}, { rootMargin: '200px' });
videoObserver.observe(hero);
if (reduceMotion.matches) video.pause();
reduceMotion.addEventListener('change', () => {
  if (reduceMotion.matches) video.pause();
  else if (hero.getBoundingClientRect().bottom > 0) video.play().catch(() => {});
});

let targetX = 0, targetY = 0, currentX = 0, currentY = 0;
let pointerFrame = 0;
function animateClipper() {
  currentX += (targetX - currentX) * .09;
  currentY += (targetY - currentY) * .09;
  clipper.style.setProperty('--clip-x', `${currentX.toFixed(1)}px`);
  clipper.style.setProperty('--clip-y', `${currentY.toFixed(1)}px`);
  clipper.style.setProperty('--clip-rot', `${(currentX * .12).toFixed(2)}deg`);
  if (Math.abs(targetX - currentX) > .1 || Math.abs(targetY - currentY) > .1) pointerFrame = requestAnimationFrame(animateClipper);
  else pointerFrame = 0;
}
services.addEventListener('pointermove', (event) => {
  if (!finePointer.matches || reduceMotion.matches) return;
  const bounds = services.getBoundingClientRect();
  targetX = clamp((event.clientX - bounds.left) / bounds.width, 0, 1) * 42 - 21;
  targetY = clamp((event.clientY - bounds.top) / bounds.height, 0, 1) * 26 - 13;
  if (!pointerFrame) pointerFrame = requestAnimationFrame(animateClipper);
}, { passive: true });
services.addEventListener('pointerleave', () => {
  targetX = targetY = 0;
  if (!pointerFrame && !reduceMotion.matches) pointerFrame = requestAnimationFrame(animateClipper);
});
document.querySelector('#year').textContent = new Date().getFullYear();
