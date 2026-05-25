/* ============================================
   Hafid Benamar — Portfolio
   ============================================ */

(function () {
  'use strict';

  /* -----------------------------------
     Sticky nav border on scroll
     ----------------------------------- */
  const nav = document.querySelector('.topnav');
  const onScroll = () => {
    if (window.scrollY > 16) nav.classList.add('scrolled');
    else nav.classList.remove('scrolled');
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* -----------------------------------
     Active section in nav
     ----------------------------------- */
  const sections = Array.from(document.querySelectorAll('main section[id]'));
  const navLinks = Array.from(document.querySelectorAll('.nav-links a'));
  const linkFor = (id) => navLinks.find(a => a.getAttribute('href') === '#' + id);

  const sectionObs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        navLinks.forEach(a => a.classList.remove('active'));
        const l = linkFor(e.target.id);
        if (l) l.classList.add('active');
      }
    });
  }, { rootMargin: '-40% 0px -55% 0px', threshold: 0 });
  sections.forEach(s => sectionObs.observe(s));

  /* -----------------------------------
     Scroll reveal
     ----------------------------------- */
  const revealEls = document.querySelectorAll(
    '.section-head, .hero-stats, .hero-card, .about-grid, .stack-card, ' +
    '.tl-item, .project, .edu-card, .contact-inner, .filter-bar'
  );
  revealEls.forEach(el => el.classList.add('reveal'));

  const revealObs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('in');
        revealObs.unobserve(e.target);
      }
    });
  }, { threshold: 0.12 });
  revealEls.forEach(el => revealObs.observe(el));

  /* -----------------------------------
     Project filter
     ----------------------------------- */
  const chips = document.querySelectorAll('.filter-bar .chip');
  const projects = document.querySelectorAll('.project');
  chips.forEach(chip => {
    chip.addEventListener('click', () => {
      chips.forEach(c => c.classList.remove('active'));
      chip.classList.add('active');
      const f = chip.dataset.filter;
      projects.forEach(p => {
        const tags = (p.dataset.tags || '').split(/\s+/);
        const show = f === 'all' || tags.includes(f);
        p.classList.toggle('is-hidden', !show);
      });
    });
  });

  /* -----------------------------------
     Lightbox (placeholder shots)
     ----------------------------------- */
  const lb = document.getElementById('lightbox');
  const lbFrame = document.getElementById('lbFrame');
  const lbCap = document.getElementById('lbCap');
  const lbClose = document.getElementById('lbClose');

  document.querySelectorAll('.shot, .cover').forEach(el => {
    el.addEventListener('click', () => {
      const cs = getComputedStyle(el);
      const c1 = cs.getPropertyValue('--c1') || '#14141a';
      const c2 = cs.getPropertyValue('--c2') || '#3a3a4a';
      const label = el.querySelector('.shot-label, .cover-overlay .mono')?.textContent || '';
      const sub = el.querySelector('.cover-sub')?.textContent || '';
      lbFrame.style.setProperty('--c1', c1);
      lbFrame.style.setProperty('--c2', c2);
      lbFrame.innerHTML = `<span class="lb-label">${label}</span>`;
      lbCap.textContent = sub || 'Aperçu — placeholder';
      lb.classList.add('open');
      lb.setAttribute('aria-hidden', 'false');
    });
  });

  const closeLb = () => {
    lb.classList.remove('open');
    lb.setAttribute('aria-hidden', 'true');
  };
  lbClose.addEventListener('click', closeLb);
  lb.addEventListener('click', e => { if (e.target === lb) closeLb(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeLb(); });

  /* -----------------------------------
     Constellation background
     ----------------------------------- */
  const canvas = document.getElementById('constellation');
  const ctx = canvas.getContext('2d');
  let stars = [];
  let raf;
  let mouse = { x: -9999, y: -9999 };

  function resize() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = window.innerWidth * dpr;
    canvas.height = window.innerHeight * dpr;
    canvas.style.width = window.innerWidth + 'px';
    canvas.style.height = window.innerHeight + 'px';
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    seed();
  }
  function seed() {
    const count = Math.min(80, Math.floor(window.innerWidth * window.innerHeight / 18000));
    stars = Array.from({ length: count }, () => ({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      vx: (Math.random() - 0.5) * 0.15,
      vy: (Math.random() - 0.5) * 0.15,
      r: Math.random() * 1.2 + 0.3,
    }));
  }
  function tick() {
    if (document.body.dataset.bg === 'off') {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      raf = requestAnimationFrame(tick);
      return;
    }
    ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
    const accent = getComputedStyle(document.body).getPropertyValue('--accent').trim() || '#c8ff2b';

    stars.forEach(s => {
      s.x += s.vx;
      s.y += s.vy;
      if (s.x < 0 || s.x > window.innerWidth) s.vx *= -1;
      if (s.y < 0 || s.y > window.innerHeight) s.vy *= -1;

      ctx.beginPath();
      ctx.fillStyle = 'rgba(255,255,255,0.5)';
      ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      ctx.fill();
    });

    // Connections to mouse
    stars.forEach(s => {
      const dx = s.x - mouse.x;
      const dy = s.y - mouse.y;
      const d = Math.sqrt(dx * dx + dy * dy);
      if (d < 140) {
        ctx.beginPath();
        ctx.strokeStyle = accent;
        ctx.globalAlpha = (1 - d / 140) * 0.5;
        ctx.lineWidth = 0.6;
        ctx.moveTo(s.x, s.y);
        ctx.lineTo(mouse.x, mouse.y);
        ctx.stroke();
        ctx.globalAlpha = 1;
      }
    });

    raf = requestAnimationFrame(tick);
  }
  window.addEventListener('mousemove', e => { mouse.x = e.clientX; mouse.y = e.clientY; });
  window.addEventListener('mouseleave', () => { mouse.x = -9999; mouse.y = -9999; });
  window.addEventListener('resize', resize);
  resize();
  tick();

  /* -----------------------------------
     Tweaks Panel
     ----------------------------------- */
  const persist = (key, val) => {
    document.body.dataset[key] = val;
    try {
      window.parent.postMessage({ type: '__edit_mode_set_keys', edits: { [key]: val } }, '*');
    } catch (e) {}
  };

  // Build panel
  const panel = document.createElement('div');
  panel.className = 'tweaks';
  panel.innerHTML = `
    <h4>Tweaks <button id="tweaksClose" aria-label="Fermer">×</button></h4>
    <div class="tweak-row">
      <label>Accent</label>
      <div class="swatches" id="swAccent">
        <span class="swatch" data-v="lime"   style="--c:#c8ff2b" title="Lime"></span>
        <span class="swatch" data-v="cyan"   style="--c:#5eead4" title="Cyan"></span>
        <span class="swatch" data-v="indigo" style="--c:#a5b4fc" title="Indigo"></span>
        <span class="swatch" data-v="coral"  style="--c:#fb923c" title="Coral"></span>
        <span class="swatch" data-v="mono"   style="--c:#f3f3f5" title="Mono"></span>
      </div>
    </div>
    <div class="tweak-row">
      <label>Densité</label>
      <div class="seg" id="segDensity">
        <button data-v="compact">compact</button>
        <button data-v="comfortable">confort</button>
        <button data-v="spacious">spacieux</button>
      </div>
    </div>
    <div class="tweak-row">
      <label>Fond animé</label>
      <div class="seg" id="segBg">
        <button data-v="on">on</button>
        <button data-v="off">off</button>
      </div>
    </div>
  `;
  document.body.appendChild(panel);

  function refreshActive() {
    panel.querySelectorAll('#swAccent .swatch').forEach(s =>
      s.classList.toggle('active', s.dataset.v === document.body.dataset.accent));
    panel.querySelectorAll('#segDensity button').forEach(b =>
      b.classList.toggle('active', b.dataset.v === document.body.dataset.density));
    panel.querySelectorAll('#segBg button').forEach(b =>
      b.classList.toggle('active', b.dataset.v === document.body.dataset.bg));
  }

  panel.querySelectorAll('#swAccent .swatch').forEach(s =>
    s.addEventListener('click', () => { persist('accent', s.dataset.v); refreshActive(); }));
  panel.querySelectorAll('#segDensity button').forEach(b =>
    b.addEventListener('click', () => { persist('density', b.dataset.v); refreshActive(); }));
  panel.querySelectorAll('#segBg button').forEach(b =>
    b.addEventListener('click', () => { persist('bg', b.dataset.v); refreshActive(); }));

  panel.querySelector('#tweaksClose').addEventListener('click', () => {
    panel.classList.remove('open');
    try {
      window.parent.postMessage({ type: '__edit_mode_dismissed' }, '*');
    } catch (e) {}
  });

  // Edit-mode protocol: listener first, then announce
  window.addEventListener('message', (e) => {
    const t = e.data && e.data.type;
    if (t === '__activate_edit_mode')   { panel.classList.add('open'); refreshActive(); }
    if (t === '__deactivate_edit_mode') { panel.classList.remove('open'); }
  });
  try {
    window.parent.postMessage({ type: '__edit_mode_available' }, '*');
  } catch (e) {}

  refreshActive();

  /* -----------------------------------
     Smooth scroll fallback for nav anchors
     ----------------------------------- */
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', (e) => {
      const id = a.getAttribute('href').slice(1);
      const t = document.getElementById(id);
      if (t) {
        e.preventDefault();
        const y = t.getBoundingClientRect().top + window.scrollY - 70;
        window.scrollTo({ top: y, behavior: 'smooth' });
      }
    });
  });

})();
