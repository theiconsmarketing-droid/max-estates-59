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
  const GOOGLE_SHEETS_WEBHOOK_URL = 'https://script.google.com/macros/s/AKfycbxHhNakHiHDS3-W4hNg7RiUCUE_SquL9LIpYWwDeHKaQY2y5ujQjXSo1f1rDocrYOyXxQ/exec';
  const FORMSUBMIT_URL = 'https://formsubmit.co/ajax/iconsn6@gmail.com';

  // ── Form handling ──
  function setupForm(formId, successId) {
    const form = document.getElementById(formId);
    const success = document.getElementById(successId);

    if (!form || !success) return;

    form.addEventListener('submit', function (e) {
      e.preventDefault();

      // Clear previous errors
      form.querySelectorAll('.form-error').forEach(el => {
        el.textContent = '';
        el.style.display = 'none';
      });
      form.querySelectorAll('.input-error').forEach(el => el.classList.remove('input-error'));

      let valid = true;

      // Helper: show error under a field
      function showError(input, message) {
        valid = false;
        input.classList.add('input-error');
        const errorEl = input.parentElement.querySelector('.form-error');
        if (errorEl) {
          errorEl.textContent = message;
          errorEl.style.display = 'block';
        }
        // Auto-clear on user input
        input.addEventListener('input', function handler() {
          input.classList.remove('input-error');
          if (errorEl) { errorEl.textContent = ''; errorEl.style.display = 'none'; }
          input.removeEventListener('input', handler);
        });
      }

      // Name validation
      const nameInput = form.querySelector('input[name="name"]');
      if (nameInput) {
        const name = nameInput.value.trim();
        if (!name) {
          showError(nameInput, 'Please enter your full name');
        } else if (name.length < 2) {
          showError(nameInput, 'Name must be at least 2 characters');
        } else if (!/^[a-zA-Z\s.''-]+$/.test(name)) {
          showError(nameInput, 'Name should only contain letters');
        }
      }

      // Email validation
      const emailInput = form.querySelector('input[type="email"]');
      if (emailInput) {
        const email = emailInput.value.trim();
        if (!email) {
          showError(emailInput, 'Please enter your email address');
        } else if (!/^[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}$/.test(email)) {
          showError(emailInput, 'Please enter a valid email (e.g. name@example.com)');
        }
      }

      // Indian phone number validation
      const phoneInput = form.querySelector('input[type="tel"]');
      if (phoneInput) {
        // Strip spaces, dashes, and dots for validation
        let phone = phoneInput.value.trim().replace(/[\s\-\.]/g, '');

        if (!phone) {
          showError(phoneInput, 'Please enter your phone number');
        } else {
          // Remove +91 or 91 prefix if present
          if (phone.startsWith('+91')) phone = phone.substring(3);
          else if (phone.startsWith('91') && phone.length > 10) phone = phone.substring(2);
          // Remove leading 0 if present
          if (phone.startsWith('0')) phone = phone.substring(1);

          if (!/^\d{10}$/.test(phone)) {
            showError(phoneInput, 'Enter a valid 10-digit Indian mobile number');
          } else if (!/^[6-9]/.test(phone)) {
            showError(phoneInput, 'Indian mobile numbers start with 6, 7, 8 or 9');
          }
        }
      }

      // Configuration (select) validation
      const configSelect = form.querySelector('select[name="configuration"]');
      if (configSelect && !configSelect.value) {
        showError(configSelect, 'Please select a configuration');
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
