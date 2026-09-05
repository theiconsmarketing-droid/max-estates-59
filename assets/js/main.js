/* ============================================================
   MAX ESTATES SECTOR 59 — Main JavaScript
   Scroll animations, form handling, nav, counters.
   ============================================================ */

(function () {
  'use strict';

  // ── Pause animations on hidden tab ──
  document.addEventListener('visibilitychange', () => {
    document.body.classList.toggle('paused', document.hidden);
  });

  // ── Navbar scroll effect ──
  const navbar = document.querySelector('.navbar');
  let lastScroll = 0;

  function handleNavbar() {
    const y = window.scrollY;
    if (y > 60) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
    lastScroll = y;
  }
  window.addEventListener('scroll', handleNavbar, { passive: true });
  handleNavbar();

  // ── Mobile toggle ──
  const mobileToggle = document.getElementById('mobileToggle');
  const navLinks = document.getElementById('navLinks');

  if (mobileToggle && navLinks) {
    mobileToggle.addEventListener('click', () => {
      const isOpen = navLinks.classList.toggle('mobile-open');
      mobileToggle.setAttribute('aria-expanded', isOpen);
    });

    // Close menu on link click
    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('mobile-open');
        mobileToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // ── Smooth scroll for anchor links ──
  document.querySelectorAll('a[href^="#"]:not([data-modal="true"])').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        e.preventDefault();
        const offset = navbar.offsetHeight + 16;
        const y = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top: y, behavior: 'smooth' });
      }
    });
  });

  // ── Scroll reveal animations ──
  const revealElements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');

  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in');
          // Retire stagger delays after entrance
          const delay = parseFloat(getComputedStyle(entry.target).transitionDelay) * 1000;
          if (delay > 0) {
            setTimeout(() => {
              entry.target.style.transitionDelay = '0ms';
            }, delay + 800);
          }
        }
      });
    },
    {
      threshold: 0.1,
      rootMargin: '0px 0px -40px 0px'
    }
  );

  revealElements.forEach(el => revealObserver.observe(el));

  // ── Counter animation ──
  const counters = document.querySelectorAll('.counter');

  const counterObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          counterObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.5 }
  );

  counters.forEach(counter => counterObserver.observe(counter));

  function animateCounter(el) {
    const target = parseFloat(el.dataset.target);
    const isDecimal = el.dataset.decimal === 'true';
    const duration = 2000;
    const startTime = performance.now();

    function easeOutCubic(t) {
      return 1 - Math.pow(1 - t, 3);
    }

    function update(now) {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easedProgress = easeOutCubic(progress);
      const current = easedProgress * target;

      if (isDecimal) {
        el.textContent = current.toFixed(2);
      } else {
        el.textContent = Math.floor(current);
      }

      if (progress < 1) {
        requestAnimationFrame(update);
      } else {
        el.textContent = isDecimal ? target.toFixed(2) : target;
      }
    }

    requestAnimationFrame(update);
  }

  // ── Form Endpoints ──
  // Replace this with your published Google Apps Script Web App URL
  const GOOGLE_SHEETS_WEBHOOK_URL = 'https://script.google.com/macros/s/AKfycbw-4XKZTJStKCNNw3Ux3f2MYN562UHWC5TdfBchNr60S6-c9oIgv330o-c2xIaArSowcQ/exec';
  const FORMSUBMIT_URL = 'https://formsubmit.co/ajax/iconsn6@gmail.com';

  // ── Form handling ──
  function setupForm(formId, successId) {
    const form = document.getElementById(formId);
    const success = document.getElementById(successId);

    if (!form || !success) return;

    form.addEventListener('submit', function (e) {
      e.preventDefault();

      // Basic validation
      const inputs = form.querySelectorAll('input[required], select[required]');
      let valid = true;

      inputs.forEach(input => {
        if (!input.value.trim()) {
          valid = false;
          input.style.borderColor = '#e74c3c';
          input.addEventListener('input', function handler() {
            input.style.borderColor = '';
            input.removeEventListener('input', handler);
          });
        }
      });

      // Email validation
      const emailInput = form.querySelector('input[type="email"]');
      if (emailInput && emailInput.value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailInput.value)) {
        valid = false;
        emailInput.style.borderColor = '#e74c3c';
      }

      // Phone validation
      const phoneInput = form.querySelector('input[type="tel"]');
      if (phoneInput && phoneInput.value && !/^[\+]?[\d\s-]{8,15}$/.test(phoneInput.value.trim())) {
        valid = false;
        phoneInput.style.borderColor = '#e74c3c';
      }

      if (!valid) return;

      // Collect form data
      const formData = new FormData(form);
      const data = {};
      formData.forEach((value, key) => { data[key] = value; });
      data.website   = window.location.hostname || 'maxestates59gurgaon.in';
      data._subject  = `New Lead — Max Estates Sector 59 (${data.website})`;
      data._template = 'table';
      data._captcha  = 'false';
      data.source    = formId; // track which form was submitted
      data.timestamp = new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });

      // Disable submit button while sending
      const submitBtn = form.querySelector('button[type="submit"]');
      const originalHTML = submitBtn.innerHTML;
      submitBtn.innerHTML = 'Submitting...';
      submitBtn.style.opacity = '0.7';
      submitBtn.style.pointerEvents = 'none';

      const promises = [];

      // 1. Post to Google Apps Script Webhook (for Google Sheet logging)
      if (GOOGLE_SHEETS_WEBHOOK_URL && !GOOGLE_SHEETS_WEBHOOK_URL.includes('YOUR_GOOGLE_APPS_SCRIPT_WEBAPP_URL')) {
        promises.push(
          fetch(GOOGLE_SHEETS_WEBHOOK_URL, {
            method: 'POST',
            mode: 'no-cors',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
          }).catch(err => console.warn('Google Sheets Webhook error:', err))
        );
      }

      // 2. Post to FormSubmit AJAX (for instant email delivery to iconsn6@gmail.com)
      if (FORMSUBMIT_URL) {
        promises.push(
          fetch(FORMSUBMIT_URL, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Accept': 'application/json'
            },
            body: JSON.stringify(data)
          })
          .then(res => res.json())
          .catch(err => console.warn('FormSubmit error:', err))
        );
      }

      // Handle UI after submission attempts — redirect to thank-you page
      // so GTM fires and Google Ads conversion is tracked
      Promise.allSettled(promises).then(() => {
        window.location.href = 'thank-you.html';
      }).catch(() => {
        // Redirect anyway so conversion tracking still fires
        window.location.href = 'thank-you.html';
      });
    });
  }

  setupForm('heroForm', 'heroFormSuccess');
  setupForm('ctaForm', 'ctaFormSuccess');
  setupForm('modalForm', 'modalFormSuccess');

  // ── Modal logic ──
  const ctaModal = document.getElementById('ctaModal');
  const modalClose = document.getElementById('modalClose');
  const modalTriggers = document.querySelectorAll('[data-modal="true"]');

  if (ctaModal) {
    function openModal(e) {
      if(e) e.preventDefault();
      ctaModal.classList.add('active');
      document.body.style.overflow = 'hidden';
    }
    
    function closeModal() {
      ctaModal.classList.remove('active');
      document.body.style.overflow = '';
    }

    modalTriggers.forEach(trigger => trigger.addEventListener('click', openModal));
    
    if (modalClose) {
      modalClose.addEventListener('click', closeModal);
    }

    ctaModal.addEventListener('click', (e) => {
      if (e.target === ctaModal) {
        closeModal();
      }
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && ctaModal.classList.contains('active')) {
        closeModal();
      }
    });
  }

  // ── Floating CTA visibility (show after scrolling past hero on mobile) ──
  const floatingCta = document.getElementById('floatingCta');
  const hero = document.getElementById('hero');

  if (floatingCta && hero) {
    const floatingObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (!entry.isIntersecting) {
            floatingCta.style.transform = 'translateY(0)';
          } else {
            floatingCta.style.transform = 'translateY(100%)';
          }
        });
      },
      { threshold: 0.1 }
    );
    floatingObserver.observe(hero);
  }

  // ── Parallax effect on hero image ──
  const heroBg = document.querySelector('.hero-bg img');
  if (heroBg && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
    let ticking = false;
    window.addEventListener('scroll', () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          const y = window.scrollY;
          if (y < window.innerHeight * 1.5) {
            heroBg.style.transform = `scale(${1.08 + y * 0.00008}) translateY(${y * 0.15}px)`;
          }
          ticking = false;
        });
        ticking = true;
      }
    }, { passive: true });
  }

  // ── Stat cards hover glow ──
  document.querySelectorAll('.stat-card, .config-card, .trust-card, .amenity-card').forEach(card => {
    card.addEventListener('mousemove', function (e) {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      card.style.setProperty('--glow-x', `${x}px`);
      card.style.setProperty('--glow-y', `${y}px`);
    });
  });

  // ── Reduced motion: live toggle ──
  const rmq = matchMedia('(prefers-reduced-motion: reduce)');
  rmq.addEventListener('change', (e) => {
    if (e.matches) {
      // Pin all reveals to final state
      revealElements.forEach(el => el.classList.add('in'));
      // Pin counters to final values
      counters.forEach(el => {
        const target = parseFloat(el.dataset.target);
        const isDecimal = el.dataset.decimal === 'true';
        el.textContent = isDecimal ? target.toFixed(2) : target;
      });
    }
  });

  // If reduced motion is already on at load, pin everything
  if (rmq.matches) {
    revealElements.forEach(el => el.classList.add('in'));
    counters.forEach(el => {
      const target = parseFloat(el.dataset.target);
      const isDecimal = el.dataset.decimal === 'true';
      el.textContent = isDecimal ? target.toFixed(2) : target;
    });
  }

})();
