/* ================================
   BrainstormOps Big Bang Animation
   VERSÃO FINAL - Texto visível
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
const TITLE_ANIMATION_DURATION = 3.5; // 3.5 segundos para o texto crescer

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

  // OrbitControls desativado
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
    1.5,
    0.4,
    0.85
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

  for (let i = 0; i < particleCount; i++) {
    particlePositions[i * 3] = 0;
    particlePositions[i * 3 + 1] = 0;
    particlePositions[i * 3 + 2] = 0;

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

  const sprite = generateSprite();
  const material = new THREE.PointsMaterial({
    size: 2,
    map: sprite,
    blending: THREE.AdditiveBlending,
    depthTest: false,
    transparent: true,
    opacity: 0.8,
    color: 0xffffff,
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

  const gradient = context.createRadialGradient(32, 32, 0, 32, 32, 32);
  gradient.addColorStop(0, "rgba(255, 255, 255, 1)");
  gradient.addColorStop(0.2, "rgba(255, 255, 255, 0.9)");
  gradient.addColorStop(0.4, "rgba(220, 220, 255, 0.6)");
  gradient.addColorStop(0.7, "rgba(180, 180, 220, 0.3)");
  gradient.addColorStop(1, "rgba(0, 0, 0, 0)");
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

  // Anima o título IMEDIATAMENTE quando começar
  if (!titleAnimationStarted && titleText) {
    titleAnimationStarted = true;
    animateTitle();
  }

  // Mostra indicador de scroll após 5 segundos
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

/* ===================== TITLE ANIMATION (CRESCIMENTO SUAVE) ========================= */
function animateTitle() {
  if (!titleText) return;

  const startTime = clock.elapsedTime;
  
  function updateTitle() {
    const elapsed = clock.elapsedTime - startTime;
    const progress = Math.min(elapsed / TITLE_ANIMATION_DURATION, 1);
    
    // Easing ease-out cubic para suavidade
    const easeProgress = 1 - Math.pow(1 - progress, 3);
    
    // Escala de 0.001 (MIUDINHO como partículas) até 1 (tamanho final)
    const scale = 0.001 + (easeProgress * 0.999);
    
    // Opacity de 0 até 1 - SEMPRE GARANTE QUE FIQUE 100% OPACO NO FINAL
    const opacity = Math.min(1, easeProgress * 1.2); // Multiplica por 1.2 pra garantir que chega em 1
    
    titleText.style.opacity = opacity.toString();
    titleText.style.transform = `translate(-50%, -50%) scale(${scale})`;
    
    if (progress < 1) {
      requestAnimationFrame(updateTitle);
    } else {
      // Garante que no final está 100% visível
      titleText.style.opacity = '1';
      titleText.style.transform = 'translate(-50%, -50%) scale(1)';
      console.log("✅ Título 100% visível!");
    }
  }
  
  updateTitle();
}

/* ===================== GALAXY CLUSTER ========================= */
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
    color: 0xffffff,
    blending: THREE.AdditiveBlending,
    transparent: true,
    opacity: 0.5,
    depthTest: false,
  });

  galaxySystem = new THREE.Points(geometry, material);
  scene.add(galaxySystem);
}
