/* ================================
   BrainstormOps Canvas Explosion
   Fiel ao CodePen original (2D)
   Texto cresce com ease-out suave
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
  const DURATION = 2000; // 2s explosão
  const TEXT_DURATION = 2000; // 2s para escalar o texto
  const PARTICLE_COUNT = 180;
  const PARTICLE_SPEED = 6;
  const TEXT_START_SCALE = 0.05;
  const TEXT_FINAL_SCALE = 1.0;

  // Ease-out cubic
  const easeOut = t => 1 - Math.pow(1 - t, 3);

  function resize() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener("resize", resize);

  // Criar partículas na origem (centro)
  function createParticles() {
    particles = [];
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = PARTICLE_SPEED * (0.6 + Math.random() * 0.4);
      particles.push({
        x: 0,
        y: 0,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        life: 1
      });
    }
  }

  function updateParticles(progress) {
    particles.forEach(p => {
      p.x += p.vx;
      p.y += p.vy;
      p.life -= 0.02; // fade natural
    });
  }

  function drawParticles() {
    ctx.fillStyle = "white";
    particles.forEach(p => {
      if (p.life > 0) {
        ctx.globalAlpha = p.life;
        ctx.fillRect(
          width / 2 + p.x,
          height / 2 + p.y,
          3,
          3
        );
      }
    });
    ctx.globalAlpha = 1;
  }

  function animate(timestamp) {
    if (!startTime) startTime = timestamp;
    const elapsed = timestamp - startTime;
    const progress = Math.min(elapsed / DURATION, 1);

    ctx.clearRect(0, 0, width, height);

    updateParticles(progress);
    drawParticles();

    // === Texto sincronizado com explosão ===
    const textProgress = Math.min(elapsed / TEXT_DURATION, 1);
    const scale = TEXT_START_SCALE + (TEXT_FINAL_SCALE - TEXT_START_SCALE) * easeOut(textProgress);
    title.style.transform = `scale(${scale})`;
    title.style.opacity = 1;

    if (progress < 1) {
      requestAnimationFrame(animate);
    } else {
      // Explosão terminou
      title.style.transform = `scale(${TEXT_FINAL_SCALE})`;
      title.style.opacity = 1;

      // Opcional: remover canvas (liberar GPU)
      // canvas.remove();

      // Notifica o restante do site que terminou
      document.dispatchEvent(new Event("heroAnimationEnd"));
      window.__heroDone = true;
    }
  }

  // Início da sequência
  createParticles();
  requestAnimationFrame(animate);
})();
