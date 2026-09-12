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
  const FORMSUBMIT_URL = 'https://formsubmit.co/ajax/rathiglobalrealtyservices@gmail.com';
  const TELECRM_API_URL = 'https://next-api.telecrm.in/enterprise/6926c7d748e8b3e9aa584f34/autoupdatelead';
  const TELECRM_API_KEY = '6926c7d748e8b3e9aa584f34';

  // ── Hidden Lead Attribution & Device/IP Tracking ──
  // 1. Capture Click IDs & UTMs from URL
  const urlParams = new URLSearchParams(window.location.search);
  const tracking = {
    gclid: urlParams.get('gclid') || '',
    gbraid: urlParams.get('gbraid') || '',
    wbraid: urlParams.get('wbraid') || '',
    utm_source: urlParams.get('utm_source') || '',
    utm_medium: urlParams.get('utm_medium') || '',
    utm_campaign: urlParams.get('utm_campaign') || ''
  };

  // Persist tracking parameters across page navigation, reloads, and anchor clicks
  try {
    ['gclid', 'gbraid', 'wbraid', 'utm_source', 'utm_medium', 'utm_campaign'].forEach(key => {
      if (tracking[key]) {
        sessionStorage.setItem('_max59_' + key, tracking[key]);
        localStorage.setItem('_max59_' + key, tracking[key]);
      } else {
        tracking[key] = sessionStorage.getItem('_max59_' + key) || localStorage.getItem('_max59_' + key) || '';
      }
    });
  } catch (e) {
    // Graceful fallback for restrictive environments (e.g. Safari private mode)
  }

  // 2. Persistent Device ID & Device Type Detection
  function getDeviceId() {
    const key = '_max59_device_id';
    try {
      let id = localStorage.getItem(key) || sessionStorage.getItem(key);
      if (!id) {
        id = 'DEV-' + Math.random().toString(36).substring(2, 9).toUpperCase() + '-' + Date.now().toString(36).toUpperCase();
        localStorage.setItem(key, id);
        sessionStorage.setItem(key, id);
      }
      return id;
    } catch (e) {
      return 'DEV-' + Math.random().toString(36).substring(2, 9).toUpperCase();
    }
  }

  function getDeviceType() {
    const ua = navigator.userAgent || '';
    if (/(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(ua)) {
      return 'Tablet';
    }
    if (/Mobile|iP(hone|od)|Android|BlackBerry|IEMobile|Kindle|Silk-Accelerated|(hpw|web)OS|Opera M(obi|ini)/i.test(ua)) {
      return 'Mobile';
    }
    return 'Desktop';
  }

  const deviceId = getDeviceId();
  const deviceType = getDeviceType();

  // 3. IP Address & Geolocation (City, State/Region, Country, Postal Code)
  let geoData = {
    ip: '',
    city: '',
    region: '',
    country: '',
    postal: '',
    location: '',
    isp: ''
  };

  // Restore cached geolocation if available in sessionStorage to avoid repeated API requests
  try {
    const cached = sessionStorage.getItem('_max59_geo');
    if (cached) {
      geoData = JSON.parse(cached);
    }
  } catch (e) {}

  function syncHiddenInputs() {
    document.querySelectorAll('input[name="gclid"]').forEach(el => { el.value = tracking.gclid; });
    document.querySelectorAll('input[name="gbraid"]').forEach(el => { el.value = tracking.gbraid; });
    document.querySelectorAll('input[name="wbraid"]').forEach(el => { el.value = tracking.wbraid; });
    document.querySelectorAll('input[name="device_id"]').forEach(el => { el.value = deviceId; });
    document.querySelectorAll('input[name="device_type"]').forEach(el => { el.value = deviceType; });
    document.querySelectorAll('input[name="ip_address"]').forEach(el => { el.value = geoData.ip; });
    document.querySelectorAll('input[name="ip_location"]').forEach(el => { el.value = geoData.location; });
  }

  let geoPromise = null;
  if (!geoData.ip) {
    geoPromise = fetch('https://ipwho.is/')
      .then(res => res.json())
      .then(data => {
        if (data && data.success !== false) {
          geoData = {
            ip: data.ip || '',
            city: data.city || '',
            region: data.region || '',
            country: data.country || '',
            postal: data.postal || '',
            location: [data.city, data.region, data.country].filter(Boolean).join(', ') + (data.postal ? ` (${data.postal})` : ''),
            isp: (data.connection && (data.connection.isp || data.connection.org)) || ''
          };
          try {
            sessionStorage.setItem('_max59_geo', JSON.stringify(geoData));
          } catch (e) {}
          syncHiddenInputs();
        }
      })
      .catch(() => {
        // Fallback: at least capture public IP address via api.ipify.org
        return fetch('https://api.ipify.org?format=json')
          .then(res => res.json())
          .then(d => {
            if (d && d.ip) {
              geoData.ip = d.ip;
              geoData.location = 'Unknown Location';
              syncHiddenInputs();
            }
          })
          .catch(() => {});
      });
  } else {
    // Initial sync with cached geo
    syncHiddenInputs();
  }

  // ── Form handling ──
  function setupForm(formId, successId) {
    const form = document.getElementById(formId);
    const success = document.getElementById(successId);

    if (!form || !success) return;

    form.addEventListener('submit', async function (e) {
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

      // Ensure hidden inputs are updated
      syncHiddenInputs();

      // If geo data hasn't arrived yet on rapid submission, wait up to 600ms
      if (!geoData.ip && geoPromise) {
        try {
          await Promise.race([geoPromise, new Promise(resolve => setTimeout(resolve, 600))]);
        } catch (err) {}
      }

      // Collect form data
      const formData = new FormData(form);
      const data = {};
      formData.forEach((value, key) => { data[key] = value; });

      // Core lead data
      data.website   = window.location.hostname || 'maxestates59gurgaon.in';
      data._subject  = `New Lead — Max Estates Sector 59 (${data.website})`;
      data._template = 'table';
      data._captcha  = 'false';
      data.source    = formId; // track which form was submitted
      data.timestamp = new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });

      // Hidden marketing & tracking parameters
      data.gclid       = tracking.gclid || '';
      data.gbraid      = tracking.gbraid || '';
      data.wbraid      = tracking.wbraid || '';
      data.device_id   = deviceId;
      data.device_type = deviceType;
      data.ip_address  = geoData.ip || 'N/A';
      data.ip_location = geoData.location || 'N/A';

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

      // 2. Post to FormSubmit AJAX (for instant email delivery to rathiglobalrealtyservices@gmail.com)
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

      // 3. Post to TeleCRM Autoupdate Lead API
      if (TELECRM_API_URL) {
        let telecrmPhone = '';
        if (data.phone) {
          const rawDigits = data.phone.toString().replace(/\D/g, '');
          if (data.phone.toString().trim().startsWith('+')) {
            telecrmPhone = data.phone.toString().trim().replace(/[\s\-]/g, '');
          } else if (rawDigits.length === 10) {
            telecrmPhone = `+91${rawDigits}`;
          } else if (rawDigits.length > 10 && rawDigits.startsWith('91')) {
            telecrmPhone = `+${rawDigits}`;
          } else {
            telecrmPhone = data.phone;
          }
        }

        const telecrmPayload = {
          fields: {
            name: data.name || '',
            phone: telecrmPhone,
            email: data.email || '',
            configuration: data.configuration || '',
            source: data.source || formId,
            website: data.website || window.location.hostname,
            gclid: data.gclid || '',
            gbraid: data.gbraid || '',
            wbraid: data.wbraid || '',
            utm_source: data.utm_source || '',
            utm_medium: data.utm_medium || '',
            utm_campaign: data.utm_campaign || '',
            device_id: data.device_id || '',
            device_type: data.device_type || '',
            ip_address: data.ip_address || '',
            ip_location: data.ip_location || ''
          }
        };

        const telecrmHeaders = {
          'Content-Type': 'application/json'
        };
        // Try server proxy first (reads TELECRM_API_KEY environment variable on server), fallback to direct API
        promises.push(
          fetch('/api/telecrm', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(telecrmPayload)
          })
          .then(async res => {
            if (!res.ok && res.status === 404) {
              // Server endpoint not active (e.g. static hosting), fallback to direct TeleCRM API
              const directHeaders = { 'Content-Type': 'application/json' };
              if (TELECRM_API_KEY) directHeaders['Authorization'] = `Bearer ${TELECRM_API_KEY}`;
              return fetch(TELECRM_API_URL, {
                method: 'POST',
                headers: directHeaders,
                body: JSON.stringify(telecrmPayload)
              }).then(r => r.json());
            }
            return res.json();
          })
          .then(resData => {
            if (resData && resData.error) {
              console.warn('[TeleCRM] API notice:', resData.error);
            } else {
              console.log('[TeleCRM] Lead sync successful:', resData);
            }
            return resData;
          })
          .catch(err => console.warn('[TeleCRM] Error:', err))
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
