document.addEventListener('DOMContentLoaded', () => {
  /* ==========================================================================
     Theme Toggling (Dark / Light)
     ========================================================================== */
  const themeToggles = document.querySelectorAll('.theme-toggle');
  
  // Check for saved theme in localStorage or system preference
  const savedTheme = localStorage.getItem('theme');
  const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  
  if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
    document.documentElement.setAttribute('data-theme', 'dark');
    updateThemeIcons('dark');
  } else {
    document.documentElement.removeAttribute('data-theme');
    updateThemeIcons('light');
  }

  themeToggles.forEach(toggle => {
    toggle.addEventListener('click', () => {
      let currentTheme = document.documentElement.getAttribute('data-theme');
      let targetTheme = currentTheme === 'dark' ? 'light' : 'dark';
      
      if (targetTheme === 'dark') {
        document.documentElement.setAttribute('data-theme', 'dark');
        localStorage.setItem('theme', 'dark');
      } else {
        document.documentElement.removeAttribute('data-theme');
        localStorage.setItem('theme', 'light');
      }
      
      updateThemeIcons(targetTheme);
    });
  });

  function updateThemeIcons(theme) {
    themeToggles.forEach(toggle => {
      if (theme === 'dark') {
        toggle.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-sun"><circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/></svg>';
      } else {
        toggle.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-moon"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/></svg>';
      }
    });
  }

  /* ==========================================================================
     RTL Toggling
     ========================================================================== */
  const rtlToggles = document.querySelectorAll('.rtl-toggle');
  const savedRtl = localStorage.getItem('rtl');
  
  if (savedRtl === 'true') {
    document.documentElement.setAttribute('dir', 'rtl');
    document.body.classList.add('rtl');
  } else {
    document.documentElement.setAttribute('dir', 'ltr');
    document.body.classList.remove('rtl');
  }

  rtlToggles.forEach(toggle => {
    toggle.addEventListener('click', () => {
      const isRtl = document.documentElement.getAttribute('dir') === 'rtl';
      if (isRtl) {
        document.documentElement.setAttribute('dir', 'ltr');
        document.body.classList.remove('rtl');
        localStorage.setItem('rtl', 'false');
      } else {
        document.documentElement.setAttribute('dir', 'rtl');
        document.body.classList.add('rtl');
        localStorage.setItem('rtl', 'true');
      }
    });
  });

  /* ==========================================================================
     Hamburger Menu Logic
     ========================================================================== */
  const hamburger = document.querySelector('.hamburger');
  const drawer = document.querySelector('.drawer');
  const overlay = document.querySelector('.drawer-overlay');
  const closeDrawer = document.querySelector('.close-drawer');

  function openMenu() {
    drawer.classList.add('open');
    overlay.classList.add('open');
    document.body.style.overflow = 'hidden'; // Prevent scrolling
  }

  function closeMenu() {
    drawer.classList.remove('open');
    overlay.classList.remove('open');
    document.body.style.overflow = '';
  }

  if (hamburger) hamburger.addEventListener('click', openMenu);
  if (closeDrawer) closeDrawer.addEventListener('click', closeMenu);
  if (overlay) overlay.addEventListener('click', closeMenu);

  /* ==========================================================================
     Password Reveal (auth pages)
     ========================================================================== */
  const eyeOpen = '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>';
  const eyeOff = '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9.88 9.88a3 3 0 1 0 4.24 4.24"/><path d="M10.73 5.08A10.4 10.4 0 0 1 12 5c6.4 0 10 7 10 7a13.2 13.2 0 0 1-1.67 2.68"/><path d="M6.61 6.61A13.5 13.5 0 0 0 2 12s3.6 7 10 7a9.7 9.7 0 0 0 5.39-1.61"/><line x1="2" y1="2" x2="22" y2="22"/></svg>';

  document.querySelectorAll('.password-toggle').forEach(btn => {
    const input = btn.parentElement.querySelector('input');
    if (!input) return;
    btn.innerHTML = eyeOpen;
    btn.addEventListener('click', () => {
      const show = input.type === 'password';
      input.type = show ? 'text' : 'password';
      btn.innerHTML = show ? eyeOff : eyeOpen;
      btn.setAttribute('aria-label', show ? 'Hide password' : 'Show password');
    });
  });

  /* ==========================================================================
     Form Validation Logic (Generic & Prescription Specific)
     ========================================================================== */
  const forms = document.querySelectorAll('form[data-validate="true"]');
  
  forms.forEach(form => {
    form.addEventListener('submit', (e) => {
      e.preventDefault(); // Stop normal submission
      
      let isValid = true;
      const inputs = form.querySelectorAll('input[required], select[required], textarea[required]');
      
      inputs.forEach(input => {
        // Reset state
        input.classList.remove('error', 'success');
        const errorMsg = input.nextElementSibling;
        if (errorMsg && errorMsg.classList.contains('form-error')) {
          errorMsg.style.display = 'none';
        }
        
        // Basic Empty Check
        if (!input.value.trim()) {
          isValid = false;
          showError(input, 'This field is required');
        } else if (input.type === 'email') {
          // Email format check
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          if (!emailRegex.test(input.value)) {
            isValid = false;
            showError(input, 'Please enter a valid email address');
          } else {
            showSuccess(input);
          }
        } else if (input.type === 'password' && input.name === 'password') {
           // Password min length
           if(input.value.length < 8) {
             isValid = false;
             showError(input, 'Password must be at least 8 characters');
           } else {
             showSuccess(input);
           }
        } else if (input.type === 'password' && input.name === 'confirm_password') {
           const pwd = form.querySelector('input[name="password"]');
           if (pwd && input.value !== pwd.value) {
             isValid = false;
             showError(input, 'Passwords do not match');
           } else {
             showSuccess(input);
           }
        } else if (input.type === 'checkbox' && !input.checked) {
           isValid = false;
           showError(input, 'You must accept the terms');
        } else {
          showSuccess(input);
        }
      });

      // Special handling for Prescription File Upload
      const fileInput = form.querySelector('input[type="file"]');
      const rxTypeSelect = form.querySelector('select[name="rx_type"]');
      
      if (fileInput && rxTypeSelect) {
        fileInput.classList.remove('error', 'success');
        const errorMsg = fileInput.nextElementSibling;
        if (errorMsg && errorMsg.classList.contains('form-error')) {
          errorMsg.style.display = 'none';
        }

        const isNewRx = rxTypeSelect.value === 'new';
        if (isNewRx && fileInput.files.length === 0) {
          isValid = false;
          showError(fileInput, 'Prescription file is required for new prescriptions');
        } else if (fileInput.files.length > 0) {
          const file = fileInput.files[0];
          const validTypes = ['image/jpeg', 'image/png', 'application/pdf'];
          const maxSize = 5 * 1024 * 1024; // 5MB

          if (!validTypes.includes(file.type)) {
            isValid = false;
            showError(fileInput, 'Invalid file type. Please upload JPG, PNG, or PDF');
          } else if (file.size > maxSize) {
            isValid = false;
            showError(fileInput, 'File is too large. Max size is 5MB');
          } else {
            showSuccess(fileInput);
          }
        }
      }

      if (isValid) {
        // Show success inline
        const successMessage = form.querySelector('.form-success-message');
        if (successMessage) {
          successMessage.style.display = 'block';
          form.reset();
          // Remove success borders after reset
          form.querySelectorAll('.success').forEach(el => el.classList.remove('success'));
        } else {
          alert("Submitted successfully!");
          form.reset();
        }
      }
    });
  });

  function showError(input, message) {
    input.classList.add('error');
    let errorEl = input.nextElementSibling;
    if (!errorEl || !errorEl.classList.contains('form-error')) {
      errorEl = document.createElement('span');
      errorEl.className = 'form-error';
      input.parentNode.insertBefore(errorEl, input.nextSibling);
    }
    errorEl.textContent = message;
    errorEl.style.display = 'block';
  }

  function showSuccess(input) {
    input.classList.add('success');
  }

  /* ==========================================================================
     Premium UI Layer
     ========================================================================== */
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* --- Navbar elevation on scroll --- */
  const navbar = document.querySelector('.navbar');
  if (navbar) {
    const onScroll = () => navbar.classList.toggle('scrolled', window.scrollY > 12);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  /* --- Scroll reveal --- */
  const revealTargets = document.querySelectorAll('[data-reveal]');
  if (revealTargets.length) {
    if (reduceMotion || !('IntersectionObserver' in window)) {
      revealTargets.forEach(el => el.classList.add('revealed'));
    } else {
      const revealObserver = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('revealed');
            obs.unobserve(entry.target);
          }
        });
      }, { threshold: 0.12, rootMargin: '0px 0px -60px' });

      revealTargets.forEach(el => {
        const delay = el.getAttribute('data-reveal-delay');
        if (delay) el.style.setProperty('--reveal-delay', delay + 'ms');
        revealObserver.observe(el);
      });
    }
  }

  /* --- Cards: cursor-following glow --- */
  if (!reduceMotion) {
    document.querySelectorAll('.card').forEach(card => {
      card.addEventListener('pointermove', e => {
        const rect = card.getBoundingClientRect();
        card.style.setProperty('--mx', ((e.clientX - rect.left) / rect.width) * 100 + '%');
        card.style.setProperty('--my', ((e.clientY - rect.top) / rect.height) * 100 + '%');
      });
    });
  }

  /* --- Interactive Showcase (tabs + image stage, auto-advancing) --- */
  document.querySelectorAll('[data-showcase]').forEach(showcase => {
    const tabs = Array.from(showcase.querySelectorAll('.showcase-tab'));
    const panels = Array.from(showcase.querySelectorAll('.showcase-panel'));
    if (!tabs.length || tabs.length !== panels.length) return;

    const duration = parseInt(showcase.getAttribute('data-showcase-duration'), 10) || 6000;
    showcase.style.setProperty('--showcase-duration', duration + 'ms');

    let index = 0;
    let timer = null;

    function select(next, restart) {
      index = (next + tabs.length) % tabs.length;
      tabs.forEach((tab, i) => {
        const active = i === index;
        tab.setAttribute('aria-selected', active ? 'true' : 'false');
        tab.setAttribute('tabindex', active ? '0' : '-1');
        panels[i].classList.toggle('active', active);
        // `hidden` is the no-JS fallback; once JS runs, visibility drives the
        // crossfade and aria-hidden keeps inactive panels out of the a11y tree.
        panels[i].removeAttribute('hidden');
        panels[i].setAttribute('aria-hidden', active ? 'false' : 'true');
      });
      // Restart the CSS progress animation on the newly active tab
      const bar = tabs[index].querySelector('.showcase-tab-progress i');
      if (bar) {
        bar.style.animation = 'none';
        void bar.offsetWidth;
        bar.style.animation = '';
      }
      if (restart !== false) schedule();
    }

    function schedule() {
      clearTimeout(timer);
      if (reduceMotion) return;
      timer = setTimeout(() => select(index + 1), duration);
    }

    function pause() {
      clearTimeout(timer);
      showcase.classList.add('is-paused');
    }
    function resume() {
      showcase.classList.remove('is-paused');
      schedule();
    }

    tabs.forEach((tab, i) => {
      tab.addEventListener('click', () => select(i));
      tab.addEventListener('keydown', e => {
        if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
          e.preventDefault();
          select(index + 1);
          tabs[index].focus();
        } else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
          e.preventDefault();
          select(index - 1);
          tabs[index].focus();
        }
      });
    });

    showcase.addEventListener('pointerenter', pause);
    showcase.addEventListener('pointerleave', resume);
    showcase.addEventListener('focusin', pause);
    showcase.addEventListener('focusout', e => {
      if (!showcase.contains(e.relatedTarget)) resume();
    });
    document.addEventListener('visibilitychange', () => {
      document.hidden ? clearTimeout(timer) : schedule();
    });

    select(0);
  });

  /* --- Accordion --- */
  document.querySelectorAll('[data-accordion]').forEach(accordion => {
    const single = accordion.getAttribute('data-accordion') !== 'multi';
    const items = Array.from(accordion.querySelectorAll('.accordion-item'));

    function setOpen(item, open) {
      const trigger = item.querySelector('.accordion-trigger');
      const panel = item.querySelector('.accordion-panel');
      item.classList.toggle('open', open);
      trigger.setAttribute('aria-expanded', open ? 'true' : 'false');
      panel.style.maxHeight = open ? panel.scrollHeight + 'px' : '';
    }

    items.forEach(item => {
      const trigger = item.querySelector('.accordion-trigger');
      if (!trigger) return;
      trigger.addEventListener('click', () => {
        const willOpen = !item.classList.contains('open');
        if (single) items.forEach(other => { if (other !== item) setOpen(other, false); });
        setOpen(item, willOpen);
      });
      if (item.classList.contains('open')) setOpen(item, true);
    });

    window.addEventListener('resize', () => {
      items.forEach(item => {
        if (item.classList.contains('open')) {
          item.querySelector('.accordion-panel').style.maxHeight =
            item.querySelector('.accordion-panel').scrollHeight + 'px';
        }
      });
    });
  });

  /* --- Fulfillment estimator (no images) --- */
  const estimator = document.querySelector('[data-estimator]');
  if (estimator) {
    const feeEl = estimator.querySelector('[data-out="fee"]');
    const readyEl = estimator.querySelector('[data-out="ready"]');
    const totalEl = estimator.querySelector('[data-out="total"]');
    const noteEl = estimator.querySelector('[data-out="note"]');

    function flash(el) {
      if (!el || reduceMotion) return;
      el.classList.remove('flash');
      void el.offsetWidth;
      el.classList.add('flash');
    }

    function value(name) {
      const checked = estimator.querySelector(`input[name="${name}"]:checked`);
      return checked ? checked.value : '';
    }

    function update() {
      const type = value('est_type');       // standard | compounded
      const method = value('est_method');   // pickup | delivery
      const speed = value('est_speed');     // standard | priority

      // Preparation window in business hours
      let prepHours = type === 'compounded' ? 36 : 3;
      if (speed === 'priority') prepHours = type === 'compounded' ? 24 : 1;

      // Courier fee
      let fee = 0;
      if (method === 'delivery') fee = speed === 'priority' ? 12 : 0;

      const ready = prepHours >= 24
        ? `${Math.round(prepHours / 24 * 10) / 10} business days`
        : `${prepHours} hour${prepHours === 1 ? '' : 's'}`;

      const handoff = method === 'delivery'
        ? (speed === 'priority' ? 'same-day courier' : 'next-day courier')
        : 'in-store pickup';

      feeEl.textContent = fee === 0 ? 'Included' : `$${fee.toFixed(2)}`;
      readyEl.textContent = ready;
      totalEl.textContent = fee === 0 ? '$0.00' : `$${fee.toFixed(2)}`;
      noteEl.textContent = method === 'delivery'
        ? `Prepared in ${ready}, then dispatched by ${handoff}. Free within our 15-mile radius on standard speed.`
        : `Prepared in ${ready}. We text you the moment it is ready at the counter — no fee for pickup.`;

      [feeEl, readyEl, totalEl].forEach(flash);
    }

    estimator.querySelectorAll('input[type="radio"]').forEach(input => {
      input.addEventListener('change', update);
    });
    update();
  }

  /* --- Delivery tracker --- */
  const tracker = document.querySelector('[data-tracker]');
  if (tracker) {
    const steps = Array.from(tracker.querySelectorAll('.tracker-step'));
    const fill = tracker.querySelector('.tracker-fill');
    const detail = tracker.querySelector('.tracker-detail');
    const detailTitle = detail && detail.querySelector('h4');
    const detailBody = detail && detail.querySelector('p');
    const modes = Array.from(tracker.querySelectorAll('.tracker-mode'));
    const etaOut = tracker.querySelector('[data-track-out="eta"]');
    const prepOut = tracker.querySelector('[data-track-out="prep"]');

    const copy = {
      standard: [
        ['Received', 'Your prescription lands in our secure queue and is time-stamped. You get an SMS confirmation within minutes.'],
        ['Pharmacist review', 'A licensed pharmacist verifies the prescriber, checks your profile for interactions, and confirms insurance coverage.'],
        ['Filled & sealed', 'Your medication is counted, labelled and sealed in tamper-evident, discreet packaging with your counselling leaflet.'],
        ['Out for delivery', 'A courier collects your parcel. Live tracking arrives by SMS and delivery is contact-optional with signature on request.']
      ],
      compounded: [
        ['Received', 'Your compounding order enters the queue and our lab team reviews the formulation request against the prescriber\'s notes.'],
        ['Formulation review', 'The pharmacist confirms base, strength, excipients and any allergy exclusions — calling the prescriber if clarification is needed.'],
        ['Compounded in lab', 'Your preparation is made to order in our sterile lab, then quality-checked and documented before release.'],
        ['Out for delivery', 'Temperature-sensitive preparations travel in validated cold-chain packaging with a specialist medical courier.']
      ]
    };

    const timings = {
      standard: { times: ['0 min', '~30 min', '~2 hrs', 'Same day'], eta: 'Same or next business day', prep: '1–3 hours' },
      compounded: { times: ['0 min', '~2 hrs', '24–48 hrs', 'On completion'], eta: '2–3 business days', prep: '24–48 hours' }
    };

    let mode = 'standard';
    let active = 0;
    let demoTimer = null;
    const stopDemo = () => { clearInterval(demoTimer); demoTimer = null; };

    function render() {
      steps.forEach((step, i) => {
        step.classList.toggle('done', i < active);
        step.classList.toggle('current', i === active);
        step.setAttribute('aria-current', i === active ? 'step' : 'false');
        const time = step.querySelector('.tracker-time');
        if (time) time.textContent = timings[mode].times[i];
      });

      if (fill) fill.style.width = (active / (steps.length - 1)) * 75 + '%';

      if (detailTitle && detailBody) {
        detailTitle.textContent = copy[mode][active][0];
        detailBody.textContent = copy[mode][active][1];
        if (!reduceMotion) {
          detail.classList.remove('swap');
          void detail.offsetWidth;
          detail.classList.add('swap');
        }
      }

      if (etaOut) etaOut.textContent = timings[mode].eta;
      if (prepOut) prepOut.textContent = timings[mode].prep;
    }

    steps.forEach((step, i) => {
      step.addEventListener('click', () => { stopDemo(); active = i; render(); });
      step.addEventListener('keydown', e => {
        if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
          e.preventDefault();
          stopDemo();
          active = Math.min(active + 1, steps.length - 1);
          render();
          steps[active].focus();
        } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
          e.preventDefault();
          stopDemo();
          active = Math.max(active - 1, 0);
          render();
          steps[active].focus();
        }
      });
    });

    modes.forEach(btn => {
      btn.addEventListener('click', () => {
        stopDemo();
        mode = btn.getAttribute('data-mode');
        modes.forEach(m => m.setAttribute('aria-pressed', m === btn ? 'true' : 'false'));
        render();
      });
    });

    render();

    // Advance through the stages once when the tracker first scrolls into view
    if (!reduceMotion && 'IntersectionObserver' in window) {
      const demo = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
          if (!entry.isIntersecting) return;
          obs.disconnect();
          let i = 0;
          demoTimer = setInterval(() => {
            i += 1;
            if (i >= steps.length - 1) stopDemo();
            active = i;
            render();
          }, 1100);
        });
      }, { threshold: 0.35 });
      demo.observe(tracker);
    }
  }

  /* --- Delivery ZIP eligibility check --- */
  const zipForm = document.querySelector('[data-zip-check]');
  if (zipForm) {
    const input = zipForm.querySelector('input');
    const result = zipForm.parentElement.querySelector('.zip-result');
    // Placeholder in-radius ZIP prefixes for the demo build
    const inRadius = ['100', '101', '102', '103', '110', '112'];

    zipForm.addEventListener('submit', e => {
      e.preventDefault();
      const zip = (input.value || '').trim();
      result.classList.add('show');

      if (!/^\d{5}$/.test(zip)) {
        result.className = 'zip-result show warn';
        result.textContent = 'Please enter a valid 5-digit ZIP code.';
        return;
      }

      if (inRadius.includes(zip.slice(0, 3))) {
        result.className = 'zip-result show ok';
        result.textContent = `Good news — ${zip} is inside our 15-mile courier radius. Standard delivery is free on orders over $50.`;
      } else {
        result.className = 'zip-result show warn';
        result.textContent = `${zip} sits outside our local courier radius. We can still ship via a temperature-controlled medical courier — call (555) 123-4567 for a quote.`;
      }
    });
  }

  /* --- Trust Statistics Count Up Animation --- */
  const trustStrips = document.querySelectorAll('.trust-strip');
  if (trustStrips.length && 'IntersectionObserver' in window && !reduceMotion) {
    const statsObserver = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        obs.unobserve(entry.target);
        
        const items = entry.target.querySelectorAll('.trust-item strong');
        items.forEach(item => {
          const originalText = item.textContent.trim();
          const match = originalText.match(/^([0-9.]+)(.*)$/);
          if (!match) return;
          
          const targetValue = parseFloat(match[1]);
          const suffix = match[2];
          const isDecimal = match[1].includes('.');
          
          let startValue = 0;
          const duration = 1500;
          const startTime = performance.now();
          
          function updateCount(currentTime) {
            const elapsedTime = currentTime - startTime;
            const progress = Math.min(elapsedTime / duration, 1);
            const easeProgress = progress * (2 - progress);
            const currentValue = startValue + easeProgress * (targetValue - startValue);
            
            if (isDecimal) {
              item.textContent = currentValue.toFixed(1) + suffix;
            } else {
              item.textContent = Math.floor(currentValue) + suffix;
            }
            
            if (progress < 1) {
              requestAnimationFrame(updateCount);
            } else {
              item.textContent = originalText;
            }
          }
          requestAnimationFrame(updateCount);
        });
      });
    }, { threshold: 0.1 });
    
    trustStrips.forEach(strip => statsObserver.observe(strip));
  }

});
