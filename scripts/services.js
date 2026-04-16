/* ============================================================
   SERVICES PAGE — JavaScript
   Cursor · Navbar · Tabs · Scroll Reveal · Page Transition
   ============================================================ */
(function () {
  'use strict';

  /* ── PAGE TRANSITION ──────────────────────────────────── */
  const overlay = document.getElementById('pageOverlay');
  if (overlay) {
    overlay.classList.add('active');
    requestAnimationFrame(() => requestAnimationFrame(() => overlay.classList.remove('active')));
    document.querySelectorAll('a[href]').forEach(link => {
      const href = link.getAttribute('href') || '';
      if (href.startsWith('#') || href.startsWith('http') || href.startsWith('mailto') || href.startsWith('tel')) return;
      link.addEventListener('click', e => {
        e.preventDefault();
        overlay.classList.add('active');
        setTimeout(() => { window.location.href = href; }, 460);
      });
    });
  }

  /* ── CURSOR GLOW ───────────────────────────────────────── */
  const cursor = document.getElementById('cursorGlow');
  if (cursor) {
    let tx = window.innerWidth / 2, ty = window.innerHeight / 2, cx = tx, cy = ty;
    document.addEventListener('mousemove', e => { tx = e.clientX; ty = e.clientY; });
    const move = () => {
      cx += (tx - cx) * 0.08; cy += (ty - cy) * 0.08;
      cursor.style.left = cx + 'px'; cursor.style.top = cy + 'px';
      requestAnimationFrame(move);
    };
    move();
  }

  /* ── NAVBAR SCROLL ─────────────────────────────────────── */
  const navbar = document.getElementById('navbar');
  if (navbar) {
    const upd = () => navbar.classList.toggle('scrolled', window.scrollY > 36);
    window.addEventListener('scroll', upd, { passive: true }); upd();
  }

  /* ── HAMBURGER ─────────────────────────────────────────── */
  const burger   = document.getElementById('hamburger');
  const navLinks = document.getElementById('navLinks');
  if (burger && navLinks) {
    burger.addEventListener('click', () => navLinks.classList.toggle('open'));
    navLinks.querySelectorAll('.nav-link').forEach(l =>
      l.addEventListener('click', () => navLinks.classList.remove('open'))
    );
  }

  /* ── SCROLL REVEAL ─────────────────────────────────────── */
  const io = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add('visible'); io.unobserve(e.target); }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
  document.querySelectorAll('.reveal-up').forEach(el => io.observe(el));

  /* ── INDUSTRY TABS ─────────────────────────────────────── */
  const tabs   = document.querySelectorAll('.tab-btn');
  const panels = document.querySelectorAll('.tab-panel');

  function switchTab(nextTabId) {
    // Find current active panel
    const currentPanel = document.querySelector('.tab-panel.active');
    const nextPanel    = document.getElementById('panel-' + nextTabId);
    if (!nextPanel || nextPanel === currentPanel) return;

    // Animate out current
    if (currentPanel) {
      currentPanel.classList.add('animating-out');
      currentPanel.addEventListener('animationend', () => {
        currentPanel.classList.remove('active', 'animating-out');
      }, { once: true });
    }

    // Animate in next (slight delay so out plays first)
    setTimeout(() => {
      nextPanel.classList.add('active', 'animating-in');
      nextPanel.addEventListener('animationend', () => {
        nextPanel.classList.remove('animating-in');
      }, { once: true });
    }, 120);

    // Update active tab button
    tabs.forEach(t => {
      const isActive = t.dataset.tab === nextTabId;
      t.classList.toggle('active', isActive);
      t.setAttribute('aria-selected', isActive.toString());
    });
  }

  tabs.forEach(tab => {
    tab.addEventListener('click', () => switchTab(tab.dataset.tab));
  });

  /* Keyboard nav for accessibility */
  document.getElementById('tabBar')?.addEventListener('keydown', e => {
    const active = document.querySelector('.tab-btn.active');
    const list   = [...tabs];
    const idx    = list.indexOf(active);
    if (e.key === 'ArrowRight') switchTab(list[(idx + 1) % list.length].dataset.tab);
    if (e.key === 'ArrowLeft')  switchTab(list[(idx - 1 + list.length) % list.length].dataset.tab);
  });

})();
