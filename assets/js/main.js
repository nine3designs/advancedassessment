/* Advanced Assessment & Solutions — main.js
   Restyle build — Nine3 Designs
   Nav: mobile drawer with real close button, backdrop dismiss,
        Escape-to-close, focus management and body scroll lock. */

(function () {
  'use strict';

  /* ---------------- Mobile nav ---------------- */
  var header  = document.getElementById('header');
  var toggle  = document.getElementById('navToggle');
  var nav     = document.getElementById('navLinks');
  var closeBtn  = null;
  var backdrop  = null;
  var mq      = window.matchMedia('(max-width: 880px)');

  function openNav() {
    nav.classList.add('open');
    toggle.classList.add('active');
    toggle.setAttribute('aria-expanded', 'true');
    document.body.classList.add('nav-open');
    if (backdrop) backdrop.classList.add('show');
    if (closeBtn) closeBtn.focus();
  }

  function closeNav() {
    nav.classList.remove('open');
    toggle.classList.remove('active');
    toggle.setAttribute('aria-expanded', 'false');
    document.body.classList.remove('nav-open');
    if (backdrop) backdrop.classList.remove('show');
    if (closeBtn && mq.matches) closeBtn.blur();
    toggle.focus();
  }

  if (header && nav && toggle) {
    /* Close button — injected so no HTML changes are needed */
    var li = document.createElement('li');
    li.className = 'nav-close-item';
    closeBtn = document.createElement('button');
    closeBtn.type = 'button';
    closeBtn.className = 'nav-close';
    closeBtn.setAttribute('aria-label', 'Close menu');
    closeBtn.innerHTML =
      '<svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true" focusable="false">' +
      '<line x1="5" y1="5" x2="19" y2="19" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"/>' +
      '<line x1="19" y1="5" x2="5" y2="19" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"/>' +
      '</svg>';
    closeBtn.addEventListener('click', closeNav);
    li.appendChild(closeBtn);
    nav.insertBefore(li, nav.firstChild);

    /* Backdrop behind the open drawer */
    backdrop = document.createElement('div');
    backdrop.className = 'nav-backdrop';
    backdrop.addEventListener('click', closeNav);
    document.body.appendChild(backdrop);

    toggle.addEventListener('click', function () {
      if (nav.classList.contains('open')) { closeNav(); } else { openNav(); }
    });

    /* Any link tap inside the drawer closes it */
    nav.addEventListener('click', function (e) {
      if (e.target.closest && e.target.closest('a') && mq.matches) closeNav();
    });

    /* Escape closes and returns focus to the hamburger */
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && nav.classList.contains('open')) closeNav();
    });

    /* Growing past the mobile breakpoint resets everything cleanly */
    function onMq(e) {
      if (!e.matches && nav.classList.contains('open')) {
        nav.classList.remove('open');
        toggle.classList.remove('active');
        toggle.setAttribute('aria-expanded', 'false');
        document.body.classList.remove('nav-open');
        if (backdrop) backdrop.classList.remove('show');
      }
    }
    if (mq.addEventListener) mq.addEventListener('change', onMq);
  }

  /* ---------------- Header condense on scroll ---------------- */
  var lastScroll = 0;
  window.addEventListener('scroll', function () {
    var y = window.scrollY || document.documentElement.scrollTop;
    if (header) {
      if (y > 80) header.classList.add('condensed');
      else header.classList.remove('condensed');
    }
    lastScroll = y;
  }, { passive: true });

  /* ---------------- Scroll reveals ---------------- */
  var revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && revealEls.length) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('in');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add('in'); });
  }

  /* ---------------- Animated counters ---------------- */
  function animateCounter(el) {
    var target = parseInt(el.getAttribute('data-count'), 10);
    if (isNaN(target)) return;
    var start = null;
    var dur = 1600;
    function step(ts) {
      if (!start) start = ts;
      var p = Math.min((ts - start) / dur, 1);
      var eased = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.floor(eased * target).toLocaleString('en-GB');
      if (p < 1) requestAnimationFrame(step);
      else el.textContent = target.toLocaleString('en-GB');
    }
    requestAnimationFrame(step);
  }

  var counters = document.querySelectorAll('[data-count]');
  if ('IntersectionObserver' in window && counters.length) {
    var cio = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          cio.unobserve(entry.target);
        }
      });
    }, { threshold: 0.4 });
    counters.forEach(function (el) { cio.observe(el); });
  }
})();
