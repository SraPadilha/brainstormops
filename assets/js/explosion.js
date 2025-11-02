/* ================================
   BrainstormOps Canvas Explosion
   Fiel ao CodePen original (Canvas 2D)
   Com easing + texto sincronizado
   ================================ */

(function () {
  const canvas = document.getElementById("hero-canvas");
  const title = document.querySelector(".hero-title");

  if (!canvas || !title) {
    console.warn("Canvas ou título não encontrados.");
    return;
  }

  const ctx = canvas.getContext("2d");
  let particles = [];
  let startTime = null;
  let width, height;
  const DURATION = 3000; // 3s explosão total
  const TEXT_DURATION = 3000;
  const PARTICLE_COUNT = 300;
  const INITIAL_SPEED = 4.5;
  const TEXT_START_SCALE = 0.05;
  const TEXT_FINAL_SCALE = 1.0;

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
      const speed = INITIAL_SPEED * (0.5 + Math.random() * 0.8);
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

    ctx.clearRect(0, 0, width, height);

    const eased = easeOut(progress);

    particles.forEach(p => {
      p.x += p.vx * eased * 2.2;   // força realista
      p.y += p.vy * eased * 2.2;
      p.life -= 0.01;
      if (p.life > 0) {
        ctx.globalAlpha = p.life;
        ctx.fillStyle = "white";
        ctx.fillRect(width / 2 + p.x, height / 2 + p.y, 3, 3);
      }
    });

    // === Texto cresce sincronizado ===
    const textProgress = Math.min(elapsed / TEXT_DURATION, 1);
    const textScale = TEXT_START_SCALE + (TEXT_FINAL_SCALE - TEXT_START_SCALE) * easeOut(textProgress);
    title.style.transform = `translate(-50%, -50%) scale(${textScale})`;

    if (progress < 1) {
      requestAnimationFrame(animate);
    } else {
      document.dispatchEvent(new Event("heroAnimationEnd"));
      window.__heroDone = true;
    }
  }

  createParticles();
  requestAnimationFrame(animate);
})();

