/* BrainstormOps Explosion - Canvas 2D (Fiel ao CodePen original) */

(function () {
  const canvas = document.getElementById("hero-canvas");
  const title = document.getElementById("hero-title");
  if (!canvas || !title) return;

  const ctx = canvas.getContext("2d");
  let particles = [];
  let startTime = null;
  let width, height;

  const DURATION = 3000;            // animação total (3s)
  const PARTICLE_COUNT = 400;       // mais partículas, igual ao codepen
  const INITIAL_SPEED = 6;          // velocidade inicial
  const TEXT_START_SCALE = 0.05;    // começa bem pequeno
  const TEXT_FINAL_SCALE = 1.0;     // cresce até tamanho visível

  const easeOut = t => 1 - Math.pow(1 - t, 3);

  function resize() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener("resize", resize);

  function createParticles() {
    particles = [];
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = INITIAL_SPEED * (0.6 + Math.random() * 0.6);
      particles.push({
        x: 0,
        y: 0,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        life: 1
      });
    }
  }

  function animate(timestamp) {
    if (!startTime) startTime = timestamp;
    const elapsed = timestamp - startTime;
    const progress = Math.min(elapsed / DURATION, 1);
    const eased = easeOut(progress);

    ctx.clearRect(0, 0, width, height);

    particles.forEach(p => {
      p.x += p.vx * eased * 2;
      p.y += p.vy * eased * 2;
      p.life -= 0.015;
      if (p.life > 0) {
        ctx.globalAlpha = p.life;
        ctx.fillStyle = "white";
        ctx.fillRect(width / 2 + p.x, height / 2 + p.y, 3, 3);
      }
    });

    const textScale = TEXT_START_SCALE + (TEXT_FINAL_SCALE - TEXT_START_SCALE) * eased;
    title.style.transform = `translate(-50%, -50%) scale(${textScale})`;

    if (progress < 1) {
      requestAnimationFrame(animate);
    } else {
      canvas.style.opacity = "0";
      setTimeout(() => canvas.remove(), 600);
    }
  }

  createParticles();
  requestAnimationFrame(animate);
})();

