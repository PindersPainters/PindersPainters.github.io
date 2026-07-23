/* ==========================================================================
   PINDER'S PAINTERS — SITE SCRIPTS
   Progressive enhancement: the site works without JS; this adds interactivity.
   --------------------------------------------------------------------------
   - Mobile navigation toggle (hamburger)
   - Sticky header shadow on scroll
   - Active nav link highlighting
   - FAQ accordion
   - Projects & case-study filtering
   - Footer year
   - Contact form validation
   ========================================================================== */
(function () {
  'use strict';

  document.addEventListener('DOMContentLoaded', function () {
    initNav();
    initStickyHeader();
    initActiveNav();
    initFaq();
    initFilters('.pp-proj-filter-btn', '.pp-proj-card', 'category');
    initCaseStudyFilters();
    initFooterYear();
    initContactForm();
  });

  /* ---- Mobile navigation ------------------------------------------------ */
  function initNav() {
    var nav = document.querySelector('.pp-nav');
    var toggle = document.querySelector('.pp-hamburger');
    if (!nav || !toggle) return;

    toggle.addEventListener('click', function () {
      var open = nav.classList.toggle('open');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });

    // Close the menu when a link is tapped (mobile)
    nav.querySelectorAll('.pp-navlinks a').forEach(function (link) {
      link.addEventListener('click', function () {
        nav.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
      });
    });

    // Close on Escape
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && nav.classList.contains('open')) {
        nav.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
        toggle.focus();
      }
    });
  }

  /* ---- Sticky header shadow --------------------------------------------- */
  function initStickyHeader() {
    var nav = document.querySelector('.pp-nav');
    if (!nav) return;
    var onScroll = function () {
      nav.classList.toggle('scrolled', window.scrollY > 8);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* ---- Active nav link --------------------------------------------------- */
  function initActiveNav() {
    var path = window.location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.pp-navlinks a').forEach(function (link) {
      var href = (link.getAttribute('href') || '').split('/').pop();
      if (href === path || (path === '' && href === 'index.html')) {
        link.setAttribute('aria-current', 'page');
      }
    });
  }

  /* ---- FAQ accordion ----------------------------------------------------- */
  function initFaq() {
    var buttons = document.querySelectorAll('.pp-res-faq-q');
    buttons.forEach(function (btn) {
      btn.setAttribute('aria-expanded', 'false');
      btn.addEventListener('click', function () {
        var item = btn.closest('.pp-res-faq-item');
        if (!item) return;
        var isOpen = item.classList.contains('open');
        // Accordion behaviour: close all first
        document.querySelectorAll('.pp-res-faq-item').forEach(function (i) {
          i.classList.remove('open');
          var q = i.querySelector('.pp-res-faq-q');
          if (q) q.setAttribute('aria-expanded', 'false');
        });
        if (!isOpen) {
          item.classList.add('open');
          btn.setAttribute('aria-expanded', 'true');
        }
      });
    });
  }

  /* ---- Generic filter (projects) ---------------------------------------- */
  function initFilters(btnSelector, cardSelector, dataKey) {
    var buttons = document.querySelectorAll(btnSelector);
    if (!buttons.length) return;
    buttons.forEach(function (btn) {
      btn.addEventListener('click', function () {
        var filter = btn.getAttribute('data-filter') || 'all';
        buttons.forEach(function (b) { b.classList.remove('active'); });
        btn.classList.add('active');
        document.querySelectorAll(cardSelector).forEach(function (card) {
          var match = filter === 'all' || card.dataset[dataKey] === filter;
          card.setAttribute('data-hidden', match ? 'false' : 'true');
          if (match) { card.removeAttribute('data-hidden'); }
        });
      });
    });
  }

  /* ---- Case-study filter (uses display + regrid) ------------------------ */
  function initCaseStudyFilters() {
    var buttons = document.querySelectorAll('.pp-cs-filter-btn');
    if (!buttons.length) return;
    var grid = document.getElementById('pp-cs-grid');
    buttons.forEach(function (btn) {
      btn.addEventListener('click', function () {
        var filter = btn.getAttribute('data-filter') || 'all';
        buttons.forEach(function (b) { b.classList.remove('active'); });
        btn.classList.add('active');
        var cards = document.querySelectorAll('.pp-cs-card');
        var visible = 0;
        cards.forEach(function (card) {
          var match = filter === 'all' || card.dataset.type === filter;
          card.style.display = match ? 'flex' : 'none';
          if (match) visible++;
        });
        if (grid) grid.style.gridTemplateColumns = visible === 1 ? '1fr' : 'repeat(2, 1fr)';
      });
    });
  }

  /* ---- Footer year ------------------------------------------------------- */
  function initFooterYear() {
    document.querySelectorAll('.pp-year').forEach(function (el) {
      el.textContent = new Date().getFullYear();
    });
  }

  /* ---- Contact form validation ------------------------------------------ */
  function initContactForm() {
    var form = document.getElementById('pp-contact-form');
    if (!form) return;

    var status = form.querySelector('.pp-form-status');

    form.setAttribute('novalidate', 'novalidate');

    form.addEventListener('submit', function (e) {
      var valid = true;

      form.querySelectorAll('[data-required]').forEach(function (field) {
        var wrap = field.closest('.pp-field');
        var value = (field.value || '').trim();
        var ok = value.length > 0;

        if (ok && field.type === 'email') {
          ok = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
        }
        if (ok && field.type === 'tel') {
          ok = /[0-9]{6,}/.test(value.replace(/[^0-9]/g, ''));
        }
        if (wrap) wrap.classList.toggle('invalid', !ok);
        if (!ok && valid) { field.focus(); }
        valid = valid && ok;
      });

      if (!valid) {
        e.preventDefault();
        return;
      }

      // No backend is wired up yet. If the form has no real action,
      // show a friendly confirmation instead of navigating away.
      var action = form.getAttribute('action') || '';
      if (!action || action === '#') {
        e.preventDefault();
        if (status) {
          status.className = 'pp-form-status success';
          status.textContent = 'Thanks — your enquiry is ready to send. ' +
            'Connect a form service (see README) to receive it by email, or ' +
            'call 07572 661205 in the meantime.';
        }
        form.reset();
      }
      // If a real action IS set (e.g. Formspree), let the browser submit normally.
    });

    // Clear the invalid state as the user corrects a field
    form.querySelectorAll('[data-required]').forEach(function (field) {
      field.addEventListener('input', function () {
        var wrap = field.closest('.pp-field');
        if (wrap) wrap.classList.remove('invalid');
      });
    });
  }
})();
