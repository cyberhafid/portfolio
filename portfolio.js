/* ============================================
   Hafid Benamar — Portfolio v2 · JS
   ============================================ */
(function () {
  'use strict';

  /* Section observer for active link */
  const sections = Array.from(document.querySelectorAll('main section[id]'));
  const links = Array.from(document.querySelectorAll('.top-nav a'));
  const map = {
    about: 'about', stack: 'about', ai: 'ai', work: 'work', career: 'career',
    education: 'career', contact: 'contact', index: 'index'
  };
  const obs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        const target = map[e.target.id] || e.target.id;
        links.forEach(a => a.classList.toggle('active', a.getAttribute('href') === '#' + target));
      }
    });
  }, { rootMargin: '-40% 0px -50% 0px', threshold: 0 });
  sections.forEach(s => obs.observe(s));

  /* Work filter */
  const filters = document.querySelectorAll('.filter');
  const works = document.querySelectorAll('.work');
  filters.forEach(btn => {
    btn.addEventListener('click', () => {
      filters.forEach(f => f.classList.remove('active'));
      btn.classList.add('active');
      const f = btn.dataset.f;
      works.forEach(w => {
        const tags = (w.dataset.tags || '').split(/\s+/);
        w.classList.toggle('is-hidden', !(f === 'all' || tags.includes(f)));
      });
    });
  });

  /* Smooth scroll with offset for sticky header */
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const id = a.getAttribute('href').slice(1);
      const t = document.getElementById(id);
      if (!t) return;
      e.preventDefault();
      const y = t.getBoundingClientRect().top + window.scrollY - 80;
      window.scrollTo({ top: y, behavior: 'smooth' });
    });
  });

  /* Lightbox */
  const lb = document.getElementById('lightbox');
  const lbImg = document.getElementById('lightboxImg');
  const lbCap = document.getElementById('lightboxCap');
  const lbClose = document.getElementById('lightboxClose');
  if (lb) {
    document.querySelectorAll('.art-image, .art-thumb').forEach(a => {
      a.addEventListener('click', e => {
        e.preventDefault();
        lbImg.src = a.getAttribute('href');
        const cap = a.getAttribute('data-caption') || '';
        lbCap.innerHTML = cap;
        lb.classList.add('open');
        lb.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
      });
    });
    const closeLb = () => {
      lb.classList.remove('open');
      lb.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
      setTimeout(() => { lbImg.src = ''; }, 200);
    };
    lbClose.addEventListener('click', closeLb);
    lb.addEventListener('click', e => { if (e.target === lb) closeLb(); });
    document.addEventListener('keydown', e => { if (e.key === 'Escape' && lb.classList.contains('open')) closeLb(); });
  }

  /* Tweaks panel */
  const persist = (key, val) => {
    document.body.dataset[key] = val;
    try { window.parent.postMessage({ type: '__edit_mode_set_keys', edits: { [key]: val } }, '*'); }
    catch (e) {}
  };

  const panel = document.createElement('div');
  panel.className = 'tweaks';
  panel.innerHTML = `
    <h4>Tweaks <button id="tClose" aria-label="Fermer">×</button></h4>
    <div class="tweak-row">
      <label>Accent</label>
      <div class="swatches" id="swA">
        <span class="swatch" data-v="terracotta" style="--c:#b8472d" title="Terracotta"></span>
        <span class="swatch" data-v="navy"       style="--c:#1f3a8a" title="Navy"></span>
        <span class="swatch" data-v="forest"     style="--c:#2f6f44" title="Forest"></span>
        <span class="swatch" data-v="black"      style="--c:#1c1a15" title="Black"></span>
      </div>
    </div>
    <div class="tweak-row">
      <label>Papier</label>
      <div class="seg" id="segM">
        <button data-v="warm">chaud</button>
        <button data-v="cool">froid</button>
        <button data-v="ink">encre</button>
      </div>
    </div>
  `;
  document.body.appendChild(panel);

  function refresh() {
    panel.querySelectorAll('#swA .swatch').forEach(s =>
      s.classList.toggle('active', s.dataset.v === document.body.dataset.accent));
    panel.querySelectorAll('#segM button').forEach(b =>
      b.classList.toggle('active', b.dataset.v === document.body.dataset.mode));
  }

  panel.querySelectorAll('#swA .swatch').forEach(s =>
    s.addEventListener('click', () => { persist('accent', s.dataset.v); refresh(); }));
  panel.querySelectorAll('#segM button').forEach(b =>
    b.addEventListener('click', () => { persist('mode', b.dataset.v); refresh(); }));

  panel.querySelector('#tClose').addEventListener('click', () => {
    panel.classList.remove('open');
    try { window.parent.postMessage({ type: '__edit_mode_dismissed' }, '*'); } catch (e) {}
  });

  window.addEventListener('message', e => {
    const t = e.data && e.data.type;
    if (t === '__activate_edit_mode')   { panel.classList.add('open'); refresh(); }
    if (t === '__deactivate_edit_mode') { panel.classList.remove('open'); }
  });
  try { window.parent.postMessage({ type: '__edit_mode_available' }, '*'); } catch (e) {}

  refresh();
})();
