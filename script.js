/* =========================================================
   Kehkasha Dumasia — personal site
   Plain JavaScript, no libraries. Each block below drives
   one piece of the page.
   ========================================================= */

(function () {
  'use strict';

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- 1. Theme toggle (remembers your choice) ---------- */
  var root = document.documentElement;
  var themeBtn = document.getElementById('theme-toggle');

  var saved = null;
  try { saved = localStorage.getItem('theme'); } catch (e) { /* private mode */ }

  if (saved === 'light' || saved === 'dark') {
    root.setAttribute('data-theme', saved);
  } else if (window.matchMedia('(prefers-color-scheme: light)').matches) {
    root.setAttribute('data-theme', 'light');
  }

  themeBtn.addEventListener('click', function () {
    var next = root.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
    root.setAttribute('data-theme', next);
    try { localStorage.setItem('theme', next); } catch (e) { /* ignore */ }
  });

  /* ---------- 2. Mobile menu ---------- */
  var menuBtn = document.getElementById('menu-toggle');
  var navLinks = document.getElementById('nav-links');

  function closeMenu() {
    navLinks.classList.remove('open');
    menuBtn.setAttribute('aria-expanded', 'false');
  }

  menuBtn.addEventListener('click', function () {
    var open = navLinks.classList.toggle('open');
    menuBtn.setAttribute('aria-expanded', String(open));
  });

  navLinks.addEventListener('click', function (e) {
    if (e.target.tagName === 'A') closeMenu();
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') closeMenu();
  });

  /* ---------- 3. Typed roles in the hero ---------- */
  var roles = [
    'websites people enjoy using.',
    'things that work on every screen.',
    'small ideas into real pages.',
    'in the open, on GitHub.'
  ];
  var typedEl = document.getElementById('typed');
  var roleIndex = 0;
  var charIndex = 0;
  var deleting = false;

  function type() {
    var word = roles[roleIndex];
    charIndex += deleting ? -1 : 1;
    typedEl.textContent = word.slice(0, charIndex);

    var delay = deleting ? 35 : 65;

    if (!deleting && charIndex === word.length) {
      deleting = true;
      delay = 1900;
    } else if (deleting && charIndex === 0) {
      deleting = false;
      roleIndex = (roleIndex + 1) % roles.length;
      delay = 320;
    }
    setTimeout(type, delay);
  }

  if (reduceMotion) {
    typedEl.textContent = roles[0];
  } else {
    type();
  }

  /* ---------- 4. Reveal elements as they scroll into view ---------- */
  var revealables = document.querySelectorAll('.reveal');

  if ('IntersectionObserver' in window && !reduceMotion) {
    var revealObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry, i) {
        if (!entry.isIntersecting) return;
        // Stagger siblings slightly so groups cascade in.
        setTimeout(function () {
          entry.target.classList.add('visible');
        }, i * 90);
        revealObserver.unobserve(entry.target);
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });

    revealables.forEach(function (el) { revealObserver.observe(el); });
  } else {
    revealables.forEach(function (el) { el.classList.add('visible'); });
  }

  /* ---------- 5. Nav state, scroll progress, active link ---------- */
  var nav = document.getElementById('nav');
  var bar = document.getElementById('progress-bar');
  var sections = Array.prototype.slice.call(
    document.querySelectorAll('main section[id]')
  );
  var linkFor = {};
  navLinks.querySelectorAll('a').forEach(function (a) {
    linkFor[a.getAttribute('href').slice(1)] = a;
  });

  var ticking = false;

  function onScroll() {
    var y = window.scrollY;

    nav.classList.toggle('scrolled', y > 24);

    var max = document.documentElement.scrollHeight - window.innerHeight;
    bar.style.width = (max > 0 ? (y / max) * 100 : 0) + '%';

    // Whichever section owns the upper third of the viewport is "current".
    var marker = y + window.innerHeight * 0.32;
    var current = null;
    sections.forEach(function (s) {
      if (s.offsetTop <= marker) current = s.id;
    });

    Object.keys(linkFor).forEach(function (id) {
      linkFor[id].classList.toggle('active', id === current);
    });

    ticking = false;
  }

  window.addEventListener('scroll', function () {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(onScroll);
  }, { passive: true });

  onScroll();

  /* ---------- 6. Glow that follows the pointer ---------- */
  var glow = document.querySelector('.cursor-glow');

  if (window.matchMedia('(pointer: fine)').matches && !reduceMotion) {
    window.addEventListener('pointermove', function (e) {
      glow.style.opacity = '1';
      glow.style.transform = 'translate3d(' + e.clientX + 'px,' + e.clientY + 'px,0)';
    }, { passive: true });

    document.addEventListener('pointerleave', function () {
      glow.style.opacity = '0';
    });
  }

  /* ---------- 7. Starfield on a canvas ---------- */
  var canvas = document.getElementById('stars');
  var ctx = canvas.getContext('2d');
  var stars = [];
  var dpr = Math.min(window.devicePixelRatio || 1, 2);

  function sizeCanvas() {
    canvas.width = window.innerWidth * dpr;
    canvas.height = window.innerHeight * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    seed();
  }

  function seed() {
    // Roughly one star per 9000 px of viewport, capped so phones stay smooth.
    var count = Math.min(Math.round((window.innerWidth * window.innerHeight) / 9000), 160);
    stars = [];
    for (var i = 0; i < count; i++) {
      stars.push({
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        r: Math.random() * 1.3 + 0.3,
        a: Math.random() * 0.6 + 0.15,
        // Each star breathes at its own rate.
        phase: Math.random() * Math.PI * 2,
        speed: Math.random() * 0.02 + 0.005,
        drift: Math.random() * 0.14 + 0.02
      });
    }
  }

  function paint(t) {
    ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
    var light = root.getAttribute('data-theme') === 'light';
    var rgb = light ? '91,61,245' : '255,255,255';

    for (var i = 0; i < stars.length; i++) {
      var s = stars[i];
      s.y -= s.drift;
      if (s.y < -2) s.y = window.innerHeight + 2;

      var twinkle = s.a * (0.55 + 0.45 * Math.sin(t * s.speed + s.phase));
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(' + rgb + ',' + twinkle.toFixed(3) + ')';
      ctx.fill();
    }
    requestAnimationFrame(paint);
  }

  sizeCanvas();

  var resizeTimer;
  window.addEventListener('resize', function () {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(sizeCanvas, 150);
  });

  if (reduceMotion) {
    // Draw the field once, then leave it still.
    ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
    stars.forEach(function (s) {
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(255,255,255,' + s.a + ')';
      ctx.fill();
    });
  } else {
    requestAnimationFrame(paint);
  }

  /* ---------- 8. A small hello for anyone who opens DevTools ---------- */
  console.log(
    '%cKehkasha Dumasia%c\nThanks for looking under the hood.\nThe source lives at https://github.com/kehkashaf/kehkashaf.github.io',
    'font-size:20px;font-weight:bold;color:#7c5cff',
    'font-size:12px;color:#888'
  );
})();
