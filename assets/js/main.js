/* ====== Navigation scroll ====== */
const navbar = document.getElementById('navbar');
if (navbar) {
  window.addEventListener('scroll', () => {
    if (window.scrollY > 30) navbar.classList.add('scrolled');
    else navbar.classList.remove('scrolled');
  });
}

/* ====== Mobile menu ====== */
function toggleMenu() {
  const mn = document.getElementById('mobileNav');
  const mb = document.getElementById('menuBtn');
  if (!mn || !mb) return;
  mn.classList.toggle('active');
  mb.classList.toggle('active');
  document.body.style.overflow = mn.classList.contains('active') ? 'hidden' : '';
}
window.toggleMenu = toggleMenu;
window.addEventListener('resize', () => {
  if (window.innerWidth > 1024) {
    const mn = document.getElementById('mobileNav');
    const mb = document.getElementById('menuBtn');
    if (mn) mn.classList.remove('active');
    if (mb) mb.classList.remove('active');
    document.body.style.overflow = '';
  }
});

/* ====== Reveal on scroll ====== */
const io = new IntersectionObserver((entries) => {
  entries.forEach((e) => {
    if (e.isIntersecting) {
      e.target.classList.add('visible');
      io.unobserve(e.target);
    }
  });
}, { threshold: 0.12, rootMargin: '0px 0px -50px 0px' });

document.querySelectorAll('.card, .process-step, .gallery-item, .coating-card, .reveal').forEach((el) => io.observe(el));

/* ====== Banner slider ====== */
(function () {
  const slider = document.querySelector('.banner-slider');
  if (!slider) return;
  const slides = Array.from(slider.querySelectorAll('.slide'));
  const dots = Array.from(slider.querySelectorAll('.slider-dot'));
  const prev = slider.querySelector('.slider-arrow.prev');
  const next = slider.querySelector('.slider-arrow.next');
  let i = 0;
  let t;
  const DUR = 6000;

  function go(n) {
    slides[i].classList.remove('active');
    dots[i] && dots[i].classList.remove('active');
    i = (n + slides.length) % slides.length;
    slides[i].classList.add('active');
    dots[i] && dots[i].classList.add('active');
    restart();
  }
  function restart() {
    clearTimeout(t);
    t = setTimeout(() => go(i + 1), DUR);
  }

  dots.forEach((d, idx) => d.addEventListener('click', () => go(idx)));
  if (prev) prev.addEventListener('click', () => go(i - 1));
  if (next) next.addEventListener('click', () => go(i + 1));

  // touch swipe
  let sx = 0;
  slider.addEventListener('touchstart', (e) => { sx = e.touches[0].clientX; }, { passive: true });
  slider.addEventListener('touchend', (e) => {
    const dx = e.changedTouches[0].clientX - sx;
    if (Math.abs(dx) > 50) go(i + (dx < 0 ? 1 : -1));
  });

  // pause on hover
  slider.addEventListener('mouseenter', () => clearTimeout(t));
  slider.addEventListener('mouseleave', restart);

  slides[0].classList.add('active');
  dots[0] && dots[0].classList.add('active');
  restart();
})();

/* ====== Feedback form ====== */
(function () {
  const form = document.getElementById('feedbackForm');
  if (!form) return;
  const status = form.querySelector('.form-status');
  const consentLabel = form.querySelector('.consent-check');
  const consentBox = form.querySelector('#f-consent');
  if (consentBox) {
    consentBox.addEventListener('change', () => {
      if (consentBox.checked) consentLabel.classList.remove('error');
    });
  }

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const data = new FormData(form);
    const name = (data.get('name') || '').toString().trim();
    const phone = (data.get('phone') || '').toString().trim();
    const email = (data.get('email') || '').toString().trim();
    const consent = consentBox && consentBox.checked;

    if (!name || (!phone && !email)) {
      status.className = 'form-status error';
      status.textContent = 'Заполните имя и телефон или email.';
      return;
    }
    if (!consent) {
      status.className = 'form-status error';
      status.textContent = 'Необходимо согласие на обработку персональных данных.';
      consentLabel && consentLabel.classList.add('error');
      consentLabel && consentLabel.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }
    // здесь должен быть реальный POST на ваш бекенд / mailto-fallback
    // имитация:
    status.className = 'form-status success';
    status.textContent = 'Спасибо! Заявка отправлена. Мы свяжемся с вами в ближайшее время.';
    form.reset();
  });
})();
