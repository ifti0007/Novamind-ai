/* ============================================================
   HOME PAGE v2 — JavaScript
   Particle Constellation · Ticker · Counters · Scroll Reveals
   ============================================================ */
(function () {
  'use strict';

  // ── PAGE TRANSITION ─────────────────────────────────────
  const overlay = document.getElementById('pageOverlay');
  if (overlay) {
    // Fade in (remove overlay on load)
    overlay.classList.add('active');
    requestAnimationFrame(() => requestAnimationFrame(() => overlay.classList.remove('active')));

    // Fade out on navigation
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

  // ── NAVBAR SCROLL ────────────────────────────────────────
  const navbar = document.getElementById('navbar');
  if (navbar) {
    const onScroll = () => navbar.classList.toggle('scrolled', window.scrollY > 36);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  // ── HAMBURGER ────────────────────────────────────────────
  const burger   = document.getElementById('hamburger');
  const navLinks = document.getElementById('navLinks');
  if (burger && navLinks) {
    burger.addEventListener('click', () => navLinks.classList.toggle('open'));
    navLinks.querySelectorAll('.nav-link').forEach(l => l.addEventListener('click', () => navLinks.classList.remove('open')));
  }

  // ── CURSOR GLOW ──────────────────────────────────────────
  const cursor = document.getElementById('cursorGlow');
  if (cursor) {
    let tx = window.innerWidth / 2, ty = window.innerHeight / 2;
    let cx = tx, cy = ty;
    document.addEventListener('mousemove', e => { tx = e.clientX; ty = e.clientY; });
    const moveCursor = () => {
      cx += (tx - cx) * 0.08;
      cy += (ty - cy) * 0.08;
      cursor.style.left = cx + 'px';
      cursor.style.top  = cy + 'px';
      requestAnimationFrame(moveCursor);
    };
    moveCursor();
  }

  // ── SCROLL REVEAL ─────────────────────────────────────────
  const revealEls = () => {
    const io = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

    document.querySelectorAll('.reveal-up, .slide-left, .slide-right').forEach(el => io.observe(el));
  };
  revealEls();

  // ── COUNT-UP ──────────────────────────────────────────────
  const countUp = el => {
    const raw    = el.dataset.target;
    const suffix = el.dataset.suffix || '';
    if (!raw) return; // static (like 24/7)

    const target   = parseFloat(raw);
    const isInt    = Number.isInteger(target);
    const duration = 1800;
    const start    = performance.now();

    const tick = now => {
      const p    = Math.min((now - start) / duration, 1);
      const ease = 1 - Math.pow(1 - p, 3);
      const val  = ease * target;
      el.textContent = (isInt ? Math.round(val) : val.toFixed(1)) + suffix;
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  };

  const statIO = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !entry.target._counted) {
        entry.target._counted = true;
        countUp(entry.target);
        statIO.unobserve(entry.target);
      }
    });
  }, { threshold: 0.4 });

  document.querySelectorAll('.stat-num[data-target]').forEach(el => statIO.observe(el));

  // ── TICKER ────────────────────────────────────────────────
  const tickerTrack = document.getElementById('tickerTrack');
  if (tickerTrack) {
    const industries = [
      'Med Spas',
      'Dental Offices',
      'HVAC Companies',
      'Auto Repair',
      'Chiro & Wellness',
      'Physical Therapy',
    ];
    // Build two full copies for seamless loop
    const buildItems = () => industries.map(name =>
      `<span class="ticker-item">${name}</span><span class="ticker-sep">•</span>`
    ).join('');
    tickerTrack.innerHTML = buildItems() + buildItems();
  }

  // ── PARTICLE CONSTELLATION ────────────────────────────────
  const canvas = document.getElementById('heroCanvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let W, H, particles, animId;

  const resize = () => {
    W = canvas.width  = canvas.offsetWidth;
    H = canvas.height = canvas.offsetHeight;
  };
  window.addEventListener('resize', () => { resize(); buildParticles(); });
  resize();

  const COUNT       = 90;
  const MAX_DIST    = 140;
  const COLORS      = ['45,126,255', '155,89,255'];

  class Particle {
    constructor() { this.init(); }
    init() {
      this.x   = Math.random() * W;
      this.y   = Math.random() * H;
      this.vx  = (Math.random() - 0.5) * 0.45;
      this.vy  = (Math.random() - 0.5) * 0.45;
      this.r   = Math.random() * 2 + 0.6;
      this.col = COLORS[Math.floor(Math.random() * COLORS.length)];
      this.alpha      = Math.random() * 0.45 + 0.25;
      this.pulseSpeed = Math.random() * 0.018 + 0.008;
      this.phase      = Math.random() * Math.PI * 2;
    }
    update(t) {
      this.x += this.vx;
      this.y += this.vy;
      if (this.x < 0 || this.x > W) this.vx *= -1;
      if (this.y < 0 || this.y > H) this.vy *= -1;
      this.alpha = 0.25 + 0.28 * Math.sin(t * this.pulseSpeed + this.phase);
    }
    draw() {
      // glow halo
      const g = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.r * 4);
      g.addColorStop(0, `rgba(${this.col},${this.alpha})`);
      g.addColorStop(1, `rgba(${this.col},0)`);
      ctx.beginPath();
      ctx.fillStyle = g;
      ctx.arc(this.x, this.y, this.r * 4, 0, Math.PI * 2);
      ctx.fill();
      // core
      ctx.beginPath();
      ctx.fillStyle = `rgba(${this.col},${Math.min(1, this.alpha + 0.4)})`;
      ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  const buildParticles = () => {
    particles = Array.from({ length: COUNT }, () => new Particle());
  };
  buildParticles();

  let frame = 0;
  const render = () => {
    frame++;
    ctx.clearRect(0, 0, W, H);

    // connections
    for (let i = 0; i < particles.length; i++) {
      const a = particles[i];
      for (let j = i + 1; j < particles.length; j++) {
        const b  = particles[j];
        const dx = a.x - b.x, dy = a.y - b.y;
        const d  = Math.sqrt(dx * dx + dy * dy);
        if (d < MAX_DIST) {
          const alpha = (1 - d / MAX_DIST) * 0.22;
          const lg = ctx.createLinearGradient(a.x, a.y, b.x, b.y);
          lg.addColorStop(0, `rgba(45,126,255,${alpha})`);
          lg.addColorStop(1, `rgba(155,89,255,${alpha})`);
          ctx.beginPath();
          ctx.strokeStyle = lg;
          ctx.lineWidth = 0.75;
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.stroke();
        }
      }
    }

    particles.forEach(p => { p.update(frame); p.draw(); });
    animId = requestAnimationFrame(render);
  };

  render();

  // Pause when tab hidden
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) cancelAnimationFrame(animId);
    else render();
  });

})();
