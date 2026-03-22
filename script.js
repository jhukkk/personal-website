(() => {
  'use strict';

  /* ========================================
     CUSTOM CURSOR
     ======================================== */
  const dot  = document.getElementById('cursor-dot');
  const ring = document.getElementById('cursor-ring');
  let mouseX = -100, mouseY = -100;
  let dotX   = -100, dotY   = -100;
  let ringX  = -100, ringY  = -100;

  const isTouchDevice = () =>
    'ontouchstart' in window || navigator.maxTouchPoints > 0;

  if (!isTouchDevice()) {
    document.addEventListener('mousemove', e => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    });

    const animateCursor = () => {
      dotX  += (mouseX - dotX)  * 0.2;
      dotY  += (mouseY - dotY)  * 0.2;
      ringX += (mouseX - ringX) * 0.08;
      ringY += (mouseY - ringY) * 0.08;

      dot.style.left  = `${dotX}px`;
      dot.style.top   = `${dotY}px`;
      ring.style.left = `${ringX}px`;
      ring.style.top  = `${ringY}px`;

      requestAnimationFrame(animateCursor);
    };
    animateCursor();

    const hoverTargets = 'a, button, .skill-tag, .exp-card, .proj-card, .edu-courses__grid span';
    document.querySelectorAll(hoverTargets).forEach(el => {
      el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
      el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
    });
  }

  /* ========================================
     NAV SCROLL STATE
     ======================================== */
  const nav = document.getElementById('nav');
  let lastScroll = 0;

  const onScroll = () => {
    const y = window.scrollY;
    nav.classList.toggle('nav--scrolled', y > 60);
    lastScroll = y;
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ========================================
     MOBILE MENU
     ======================================== */
  const toggle = document.getElementById('nav-toggle');
  const mobileMenu = document.getElementById('mobile-menu');

  toggle.addEventListener('click', () => {
    toggle.classList.toggle('active');
    mobileMenu.classList.toggle('open');
    document.body.style.overflow = mobileMenu.classList.contains('open') ? 'hidden' : '';
  });

  mobileMenu.querySelectorAll('.mobile-menu__link').forEach(link => {
    link.addEventListener('click', () => {
      toggle.classList.remove('active');
      mobileMenu.classList.remove('open');
      document.body.style.overflow = '';
    });
  });

  /* ========================================
     SCROLL REVEAL (Intersection Observer)
     ======================================== */
  const revealEls = document.querySelectorAll('.reveal-up');

  const heroSection = document.getElementById('hero');
  const heroReveals = heroSection
    ? heroSection.querySelectorAll('.reveal-up')
    : [];

  requestAnimationFrame(() => {
    setTimeout(() => {
      heroReveals.forEach(el => el.classList.add('visible'));
    }, 100);
  });

  const revealObserver = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.08, rootMargin: '0px 0px -20px 0px' }
  );

  revealEls.forEach(el => {
    if (!el.closest('#hero')) {
      revealObserver.observe(el);
    }
  });

  /* ========================================
     ACTIVE NAV LINK HIGHLIGHT
     ======================================== */
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav__link');

  const sectionObserver = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const id = entry.target.getAttribute('id');
          navLinks.forEach(link => {
            link.classList.toggle(
              'nav__link--active',
              link.getAttribute('href') === `#${id}`
            );
          });
        }
      });
    },
    { threshold: 0.3 }
  );

  sections.forEach(sec => sectionObserver.observe(sec));

  /* ========================================
     SMOOTH ANCHOR SCROLL (fallback)
     ======================================== */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', e => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });

  /* ========================================
     PARALLAX GRID on HERO (subtle mouse)
     ======================================== */
  const heroGrid = document.querySelector('.hero__grid');

  if (heroGrid && !isTouchDevice()) {
    document.addEventListener('mousemove', e => {
      const x = (e.clientX / window.innerWidth  - 0.5) * 10;
      const y = (e.clientY / window.innerHeight - 0.5) * 10;
      heroGrid.style.transform = `translate(${x}px, ${y}px)`;
    });
  }
})();
