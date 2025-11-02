/* === BrainstormOps Big Bang (Three.js, fiel ao CodePen original) === */
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
    2,
    0.4,
    0
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

  const material = new THREE.PointsMaterial({
    size: 2,
    color: 0xffffff,
    blending: THREE.AdditiveBlending,
    depthTest: false,
    transparent: true,
    opacity: 0.8
  });

  particleSystem = new THREE.Points(geometry, material);
  scene.add(particleSystem);
}

/* ===================== GUI (DISABLED, BUT REQUIRED) ========================= */

function setupGUI() {
  params = { expansionSpeed: 50 };
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
  controls.update();
  composer.render(delta);

  if (clock.elapsedTime > 3.5) revealTitle(); // texto sincronizado
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

/* ===================== TITLE REVEAL ========================= */

function revealTitle() {
  titleText.style.transition = "transform 1.3s ease-out, opacity 1.3s";
  titleText.style.opacity = "1";
  titleText.style.transform = "translate(-50%, -50%) scale(1)";
}

/* ===================== FINISH ========================= */

function finishAnimation() {
  window.__heroDone = true;
  document.dispatchEvent(new Event("heroAnimationEnd"));
}
