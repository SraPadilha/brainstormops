/* === BrainstormOps Big Bang (Three.js) - VERSÃO CORRIGIDA === */
/* Adaptado para GitHub Pages + canvas existente + evento "heroAnimationEnd" */

let scene, camera, renderer, controls, composer;
let particleSystem, particlePositions, particleVelocities;
let galaxySystem = null;
let nebula = null;
let particleCount = 20000;
let params;
let clock = new THREE.Clock();
let canvas = document.getElementById("hero-canvas");
let titleText = document.querySelector(".hero-title");

if (!canvas) {
  console.error("❌ ERRO: canvas #hero-canvas não encontrado!");
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

  controls = new THREE.OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.05;
  controls.enabled = false; // Desativa interação do mouse no blog

  const ambientLight = new THREE.AmbientLight(0x404040, 1.5);
  scene.add(ambientLight);

  const pointLight = new THREE.PointLight(0xffffff, 2, 1000);
  pointLight.position.set(0, 0, 0);
  pointLight.castShadow = true;
  scene.add(pointLight);

  composer = new THREE.EffectComposer(renderer);
  let renderPass = new THREE.RenderPass(scene, camera);
  composer.addPass(renderPass);

  let bloomPass = new THREE.UnrealBloomPass(
    new THREE.Vector2(window.innerWidth, window.innerHeight),
    2,    // strength
    0.5,  // radius
    0     // threshold
  );
  composer.addPass(bloomPass);

  createParticleSystem();
  setupGUI();

  window.addEventListener("resize", onResize, false);
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

    let theta = Math.random() * 2 * Math.PI;
    let phi = Math.acos(Math.random() * 2 - 1);
    let speed = Math.random() * 0.5 + 0.5;

    particleVelocities[i * 3] = speed * Math.sin(phi) * Math.cos(theta);
    particleVelocities[i * 3 + 1] = speed * Math.sin(phi) * Math.sin(theta);
    particleVelocities[i * 3 + 2] = speed * Math.cos(phi);
  }

  geometry.setAttribute(
    "position",
    new THREE.BufferAttribute(particlePositions, 3)
  );

  // Restaurando a textura sprite para melhor visualização
  const sprite = generateSprite();
  const material = new THREE.PointsMaterial({
    size: 2,
    map: sprite,
    color: 0xffffff,
    blending: THREE.AdditiveBlending,
    depthTest: false,
    transparent: true,
    opacity: 0.8
  });

  particleSystem = new THREE.Points(geometry, material);
  scene.add(particleSystem);
}

/* ===================== SPRITE TEXTURE ========================= */

function generateSprite() {
  const canvas = document.createElement("canvas");
  canvas.width = 64;
  canvas.height = 64;
  const context = canvas.getContext("2d");

  // Cria um gradiente radial para o brilho
  const gradient = context.createRadialGradient(32, 32, 0, 32, 32, 32);
  gradient.addColorStop(0, "rgba(255, 255, 255, 1)");
  gradient.addColorStop(0.2, "rgba(255, 200, 200, 0.8)");
  gradient.addColorStop(0.4, "rgba(200, 100, 100, 0.6)");
  gradient.addColorStop(1, "rgba(0, 0, 0, 0)");
  context.fillStyle = gradient;
  context.fillRect(0, 0, 64, 64);

  const texture = new THREE.CanvasTexture(canvas);
  return texture;
}

/* ===================== GUI ========================= */

function setupGUI() {
  params = { 
    expansionSpeed: 50,
    particleSize: 2,
    bloomStrength: 2,
    bloomRadius: 0.5,
    bloomThreshold: 0
  };
}

/* ===================== RESIZE ========================= */

function onResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
  composer.setSize(window.innerWidth, window.innerHeight);
}

/* ===================== ANIMATION LOOP ========================= */

function animate() {
  requestAnimationFrame(animate);
  const delta = clock.getDelta();

  updateParticles(delta);
  
  // Adiciona galáxias após 10 segundos
  let elapsed = clock.elapsedTime;
  if (elapsed > 10 && !galaxySystem) {
    createGalaxyCluster();
  }
  if (elapsed > 15 && !nebula) {
    createNebula();
  }

  controls.update();
  composer.render(delta);

  if (clock.elapsedTime > 3.5 && titleText) revealTitle(); // texto sincronizado
  if (clock.elapsedTime > 6 && !window.__heroDone) finishAnimation();
}

/* ===================== PARTICLE UPDATE ========================= */

function updateParticles(delta) {
  const positions = particleSystem.geometry.attributes.position.array;
  for (let i = 0; i < particleCount; i++) {
    let index = i * 3;
    positions[index] += particleVelocities[index] * params.expansionSpeed * delta;
    positions[index + 1] += particleVelocities[index + 1] * params.expansionSpeed * delta;
    positions[index + 2] += particleVelocities[index + 2] * params.expansionSpeed * delta;
  }
  particleSystem.geometry.attributes.position.needsUpdate = true;
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
  
  geometry.setAttribute(
    "position",
    new THREE.BufferAttribute(positions, 3)
  );

  const material = new THREE.PointsMaterial({
    size: 1.5,
    color: 0xaaaaaa,
    blending: THREE.AdditiveBlending,
    transparent: true,
    opacity: 0.5,
    depthTest: false,
  });

  galaxySystem = new THREE.Points(geometry, material);
  scene.add(galaxySystem);
}

/* ===================== NEBULA ========================= */

function createNebula() {
  const nebulaGeometry = new THREE.SphereGeometry(500, 32, 32);
  const nebulaMaterial = new THREE.MeshBasicMaterial({
    map: generateNebulaTexture(),
    side: THREE.BackSide,
    transparent: true,
    opacity: 0.7,
  });
  nebula = new THREE.Mesh(nebulaGeometry, nebulaMaterial);
  scene.add(nebula);
}

/* ===================== NEBULA TEXTURE ========================= */

function generateNebulaTexture() {
  const size = 512;
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const context = canvas.getContext("2d");

  // Gradiente radial como base da nebulosa
  const gradient = context.createRadialGradient(
    size / 2,
    size / 2,
    size / 8,
    size / 2,
    size / 2,
    size / 2
  );
  gradient.addColorStop(0, "rgba(50, 0, 100, 0.8)");
  gradient.addColorStop(1, "rgba(0, 0, 0, 0.0)");
  context.fillStyle = gradient;
  context.fillRect(0, 0, size, size);

  // Adiciona pontos aleatórios simulando estrelas e gás
  for (let i = 0; i < 1000; i++) {
    context.fillStyle = "rgba(255,255,255," + Math.random() * 0.1 + ")";
    const x = Math.random() * size;
    const y = Math.random() * size;
    context.fillRect(x, y, 1, 1);
  }
  
  return new THREE.CanvasTexture(canvas);
}

/* ===================== TITLE REVEAL ========================= */

function revealTitle() {
  if (!titleText) return;
  titleText.style.transition = "transform 1.3s ease-out, opacity 1.3s";
  titleText.style.opacity = "1";
  titleText.style.transform = "translate(-50%, -50%) scale(1)";
}

/* ===================== FINISH ========================= */

function finishAnimation() {
  window.__heroDone = true;
  document.dispatchEvent(new Event("heroAnimationEnd"));
}
