/* ============================================================
   HOME PAGE JAVASCRIPT — Particle Constellation
   ============================================================ */

(function() {

  /* ── PARTICLE CONSTELLATION ──────────────────────────────── */
  const canvas = document.getElementById('particleCanvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let particles = [];
  let animId;

  function resize() {
    canvas.width  = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
  }

  window.addEventListener('resize', resize);
  resize();

  const PARTICLE_COUNT = 90;
  const MAX_DISTANCE   = 130;

  class Particle {
    constructor() { this.reset(); }

    reset() {
      this.x   = Math.random() * canvas.width;
      this.y   = Math.random() * canvas.height;
      this.vx  = (Math.random() - 0.5) * 0.5;
      this.vy  = (Math.random() - 0.5) * 0.5;
      this.r   = Math.random() * 2.5 + 0.5;
      this.hue = Math.random() > 0.5 ? '45,126,255' : '155,89,255';
      this.alpha = Math.random() * 0.5 + 0.3;
      this.pulseSpeed = Math.random() * 0.02 + 0.01;
      this.pulseOffset = Math.random() * Math.PI * 2;
    }

    update(t) {
      this.x += this.vx;
      this.y += this.vy;
      this.alpha = 0.3 + 0.3 * Math.sin(t * this.pulseSpeed + this.pulseOffset);

      if (this.x < 0 || this.x > canvas.width)  this.vx *= -1;
      if (this.y < 0 || this.y > canvas.height)  this.vy *= -1;
    }

    draw() {
      ctx.beginPath();
      const grad = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.r * 3);
      grad.addColorStop(0, `rgba(${this.hue}, ${this.alpha})`);
      grad.addColorStop(1, `rgba(${this.hue}, 0)`);
      ctx.fillStyle = grad;
      ctx.arc(this.x, this.y, this.r * 3, 0, Math.PI * 2);
      ctx.fill();

      ctx.beginPath();
      ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${this.hue}, ${this.alpha + 0.3})`;
      ctx.fill();
    }
  }

  for (let i = 0; i < PARTICLE_COUNT; i++) particles.push(new Particle());

  let frame = 0;
  function animate() {
    frame++;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw connections
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const a = particles[i], b = particles[j];
        const dx = a.x - b.x, dy = a.y - b.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < MAX_DISTANCE) {
          const opacity = (1 - dist / MAX_DISTANCE) * 0.25;
          const grad = ctx.createLinearGradient(a.x, a.y, b.x, b.y);
          grad.addColorStop(0, `rgba(45,126,255,${opacity})`);
          grad.addColorStop(1, `rgba(155,89,255,${opacity})`);
          ctx.beginPath();
          ctx.strokeStyle = grad;
          ctx.lineWidth = 0.8;
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.stroke();
        }
      }
    }

    particles.forEach(p => {
      p.update(frame);
      p.draw();
    });

    animId = requestAnimationFrame(animate);
  }

  animate();

  // Pause when not visible for perf
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) cancelAnimationFrame(animId);
    else animate();
  });

})();
