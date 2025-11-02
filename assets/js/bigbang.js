/* ================================
   BrainstormOps Big Bang Animation
   Explosão BRANCA + Sem nebulosa roxa
   ================================ */

let scene, camera, renderer, controls, composer;
let particleSystem, particlePositions, particleVelocities;
let galaxySystem = null;
let particleCount = 20000;
let params;
let clock = new THREE.Clock();

// Elementos do DOM
const canvas = document.getElementById("hero-canvas");
const titleText = document.getElementById("hero-title");
const scrollIndicator = document.getElementById("scroll-indicator");

// Controle de animação do texto
let titleAnimationStarted = false;
const TITLE_ANIMATION_DURATION = 4; // 4 segundos para o texto crescer

if (!canvas) {
  console.error("❌ Canvas #hero-canvas não encontrado!");
} else {
  init();
  animate();
}

/* ===================== INIT ========================= */
function init() {
  scene = new THREE.Scene();

  camera = new THREE.PerspectiveCamera(
    60,
    window.innerWidth / window.innerHeight,
    0.1,
    10000
  );
  camera.position.set(0, 0, 200);

  renderer = new THREE.WebGLRenderer({
    antialias: true,
    canvas: canvas,
    alpha: true
  });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.shadowMap.enabled = true;

  // OrbitControls desativado para apresentação
  controls = new THREE.OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.05;
  controls.enabled = false;

  // Luzes
  const ambientLight = new THREE.AmbientLight(0x404040, 1.5);
  scene.add(ambientLight);

  const pointLight = new THREE.PointLight(0xffffff, 2, 1000);
  pointLight.position.set(0, 0, 0);
  pointLight.castShadow = true;
  scene.add(pointLight);

  // Post-processing (Bloom)
  composer = new THREE.EffectComposer(renderer);
  const renderPass = new THREE.RenderPass(scene, camera);
  composer.addPass(renderPass);

  const bloomPass = new THREE.UnrealBloomPass(
    new THREE.Vector2(window.innerWidth, window.innerHeight),
    1.5,  // strength
    0.4,  // radius
    0.85  // threshold
  );
  bloomPass.threshold = 0;
  bloomPass.strength = 2;
  bloomPass.radius = 0.5;
  composer.addPass(bloomPass);

  createParticleSystem();
  setupParams();

  window.addEventListener("resize", onWindowResize, false);
}

/* ===================== PARTICLE SYSTEM ========================= */
function createParticleSystem() {
  const geometry = new THREE.BufferGeometry();
  particlePositions = new Float32Array(particleCount * 3);
  particleVelocities = new Float32Array(particleCount * 3);

  // Todas as partículas começam no centro (singularidade Big Bang)
  for (let i = 0; i < particleCount; i++) {
    particlePositions[i * 3] = 0;
    particlePositions[i * 3 + 1] = 0;
    particlePositions[i * 3 + 2] = 0;

    // Direção aleatória (esfera)
    const theta = Math.random() * 2 * Math.PI;
    const phi = Math.acos(Math.random() * 2 - 1);
    const speed = Math.random() * 0.5 + 0.5;

    particleVelocities[i * 3] = speed * Math.sin(phi) * Math.cos(theta);
    particleVelocities[i * 3 + 1] = speed * Math.sin(phi) * Math.sin(theta);
    particleVelocities[i * 3 + 2] = speed * Math.cos(phi);
  }

  geometry.setAttribute(
    "position",
    new THREE.BufferAttribute(particlePositions, 3)
  );

  // Material com sprite texture BRANCA
  const sprite = generateSprite();
  const material = new THREE.PointsMaterial({
    size: 2,
    map: sprite,
    blending: THREE.AdditiveBlending,
    depthTest: false,
    transparent: true,
    opacity: 0.8,
    color: 0xffffff, // Branco puro
  });

  particleSystem = new THREE.Points(geometry, material);
  scene.add(particleSystem);
}

/* ===================== SPRITE TEXTURE (BRANCA) ========================= */
function generateSprite() {
  const canvas = document.createElement("canvas");
  canvas.width = 64;
  canvas.height = 64;
  const context = canvas.getContext("2d");

  // Gradiente radial BRANCO PURO (sem tons de vermelho/rosa)
  const gradient = context.createRadialGradient(32, 32, 0, 32, 32, 32);
  gradient.addColorStop(0, "rgba(255, 255, 255, 1)");      // Centro branco brilhante
  gradient.addColorStop(0.2, "rgba(255, 255, 255, 0.9)");  // Branco forte
  gradient.addColorStop(0.4, "rgba(220, 220, 255, 0.6)");  // Branco levemente azulado
  gradient.addColorStop(0.7, "rgba(180, 180, 220, 0.3)");  // Branco suave
  gradient.addColorStop(1, "rgba(0, 0, 0, 0)");            // Transparente nas bordas
  context.fillStyle = gradient;
  context.fillRect(0, 0, 64, 64);

  return new THREE.CanvasTexture(canvas);
}

/* ===================== PARAMS ========================= */
function setupParams() {
  params = {
    expansionSpeed: 50,
    particleSize: 2,
    bloomStrength: 2,
    bloomRadius: 0.5,
    bloomThreshold: 0
  };
}

/* ===================== RESIZE ========================= */
function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
  composer.setSize(window.innerWidth, window.innerHeight);
}

/* ===================== ANIMATION LOOP ========================= */
function animate() {
  requestAnimationFrame(animate);

  const delta = clock.getDelta();
  const elapsed = clock.elapsedTime;

  updateParticles(delta);

  // Adiciona galáxias após 10 segundos
  if (elapsed > 10 && !galaxySystem) {
    createGalaxyCluster();
  }

  // NEBULOSA ROXA REMOVIDA! ✅

  // Anima o título crescendo junto com a explosão
  if (!titleAnimationStarted && titleText) {
    titleAnimationStarted = true;
    animateTitle();
  }

  // Mostra indicador de scroll após animação completa
  if (elapsed > 5 && scrollIndicator && !scrollIndicator.classList.contains('visible')) {
    scrollIndicator.classList.add('visible');
  }

  controls.update();
  composer.render(delta);
}

/* ===================== PARTICLE UPDATE ========================= */
function updateParticles(delta) {
  const positions = particleSystem.geometry.attributes.position.array;
  for (let i = 0; i < particleCount; i++) {
    const index = i * 3;
    positions[index] += particleVelocities[index] * params.expansionSpeed * delta;
    positions[index + 1] += particleVelocities[index + 1] * params.expansionSpeed * delta;
    positions[index + 2] += particleVelocities[index + 2] * params.expansionSpeed * delta;
  }
  particleSystem.geometry.attributes.position.needsUpdate = true;
}

/* ===================== TITLE ANIMATION ========================= */
function animateTitle() {
  if (!titleText) return;

  const startTime = clock.elapsedTime;
  
  function updateTitle() {
    const elapsed = clock.elapsedTime - startTime;
    const progress = Math.min(elapsed / TITLE_ANIMATION_DURATION, 1);
    
    // Easing ease-out cubic
    const easeProgress = 1 - Math.pow(1 - progress, 3);
    
    // Escala de 0.05 (pequenininho) até 1 (normal)
    const scale = 0.05 + (easeProgress * 0.95);
    
    // Opacity de 0 até 1
    const opacity = easeProgress;
    
    titleText.style.opacity = opacity;
    titleText.style.transform = `translate(-50%, -50%) scale(${scale})`;
    
    if (progress < 1) {
      requestAnimationFrame(updateTitle);
    } else {
      // Animação concluída
      console.log("✅ Título animado com sucesso!");
    }
  }
  
  updateTitle();
}

/* ===================== GALAXY CLUSTER (partículas brancas do fundo) ========================= */
function createGalaxyCluster() {
  const galaxyCount = 5000;
  const geometry = new THREE.BufferGeometry();
  const positions = new Float32Array(galaxyCount * 3);

  for (let i = 0; i < galaxyCount; i++) {
    positions[i * 3] = (Math.random() - 0.5) * 1000;
    positions[i * 3 + 1] = (Math.random() - 0.5) * 1000;
    positions[i * 3 + 2] = (Math.random() - 0.5) * 1000;
  }

  geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));

  const material = new THREE.PointsMaterial({
    size: 1.5,
    color: 0xffffff, // Branco também
    blending: THREE.AdditiveBlending,
    transparent: true,
    opacity: 0.5,
    depthTest: false,
  });

  galaxySystem = new THREE.Points(geometry, material);
  scene.add(galaxySystem);
}
