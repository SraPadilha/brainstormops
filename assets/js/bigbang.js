/* ======================================
   BrainstormOps Big Bang Animation v2
   Mais cinematográfico e orgânico
   ====================================== */

let scene, camera, renderer, controls, composer, bloomPass;
let particleSystem, particlePositions, particleVelocities, particleSeeds, particleColors;
let galaxySystem = null;
let galaxyRotationSpeed = 0.015;
let particleCount = 24000;
let params;
let clock = new THREE.Clock();

const canvas = document.getElementById("hero-canvas");
const titleText = document.getElementById("hero-title");
const scrollIndicator = document.getElementById("scroll-indicator");

let titleAnimationStarted = false;
const TITLE_ANIMATION_DURATION = 3.5;

if (!canvas) {
  console.error("Canvas #hero-canvas não encontrado!");
} else {
  init();
  animate();
}

function init() {
  scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2(0x020611, 0.0009);

  camera = new THREE.PerspectiveCamera(
    58,
    window.innerWidth / window.innerHeight,
    0.1,
    12000
  );
  camera.position.set(0, 0, 220);

  renderer = new THREE.WebGLRenderer({
    antialias: true,
    canvas,
    alpha: true,
    powerPreference: "high-performance"
  });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.shadowMap.enabled = false;
  renderer.outputColorSpace = THREE.SRGBColorSpace;

  controls = new THREE.OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.04;
  controls.enabled = false;

  const ambientLight = new THREE.AmbientLight(0x5d6fff, 0.45);
  scene.add(ambientLight);

  const coreLight = new THREE.PointLight(0x8fd3ff, 4, 1600, 1.4);
  coreLight.position.set(0, 0, 0);
  scene.add(coreLight);

  const rimLight = new THREE.PointLight(0xb47cff, 2.5, 2200, 1.8);
  rimLight.position.set(-120, 40, 140);
  scene.add(rimLight);

  composer = new THREE.EffectComposer(renderer);
  const renderPass = new THREE.RenderPass(scene, camera);
  composer.addPass(renderPass);

  bloomPass = new THREE.UnrealBloomPass(
    new THREE.Vector2(window.innerWidth, window.innerHeight),
    1.25,
    0.9,
    0.15
  );
  bloomPass.threshold = 0.08;
  bloomPass.strength = 1.35;
  bloomPass.radius = 0.75;
  composer.addPass(bloomPass);

  createParticleSystem();
  createCoreAura();
  setupParams();

  window.addEventListener("resize", onWindowResize, false);
}

function createParticleSystem() {
  const geometry = new THREE.BufferGeometry();
  particlePositions = new Float32Array(particleCount * 3);
  particleVelocities = new Float32Array(particleCount * 3);
  particleSeeds = new Float32Array(particleCount);
  particleColors = new Float32Array(particleCount * 3);

  const colorInner = new THREE.Color(0xeef6ff);
  const colorMid = new THREE.Color(0x8ed2ff);
  const colorOuter = new THREE.Color(0x9d7cff);

  for (let i = 0; i < particleCount; i++) {
    const i3 = i * 3;
    const jitterRadius = Math.pow(Math.random(), 2.2) * 4.5;
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(2 * Math.random() - 1);

    particlePositions[i3] = jitterRadius * Math.sin(phi) * Math.cos(theta);
    particlePositions[i3 + 1] = jitterRadius * Math.sin(phi) * Math.sin(theta);
    particlePositions[i3 + 2] = jitterRadius * Math.cos(phi);

    const directionalBias = 0.65 + Math.pow(Math.random(), 1.8) * 1.55;
    const swirl = 0.18 + Math.random() * 0.35;

    particleVelocities[i3] = directionalBias * Math.sin(phi) * Math.cos(theta) - Math.sin(theta) * swirl;
    particleVelocities[i3 + 1] = directionalBias * Math.sin(phi) * Math.sin(theta) + Math.cos(theta) * swirl;
    particleVelocities[i3 + 2] = directionalBias * Math.cos(phi) * (0.75 + Math.random() * 0.6);

    particleSeeds[i] = Math.random() * 1000;

    const mix = Math.random();
    const color = mix < 0.18
      ? colorInner.clone().lerp(colorMid, mix / 0.18)
      : mix < 0.72
        ? colorMid.clone().lerp(colorOuter, (mix - 0.18) / 0.54)
        : colorOuter.clone().lerp(new THREE.Color(0x4ee6ff), (mix - 0.72) / 0.28);

    particleColors[i3] = color.r;
    particleColors[i3 + 1] = color.g;
    particleColors[i3 + 2] = color.b;
  }

  geometry.setAttribute("position", new THREE.BufferAttribute(particlePositions, 3));
  geometry.setAttribute("color", new THREE.BufferAttribute(particleColors, 3));

  const sprite = generateSprite();
  const material = new THREE.PointsMaterial({
    size: 2.6,
    map: sprite,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
    transparent: true,
    opacity: 0.92,
    vertexColors: true,
    sizeAttenuation: true
  });

  particleSystem = new THREE.Points(geometry, material);
  scene.add(particleSystem);
}

function createCoreAura() {
  const geometry = new THREE.SphereGeometry(10, 32, 32);
  const material = new THREE.MeshBasicMaterial({
    color: 0xaedcff,
    transparent: true,
    opacity: 0.08
  });

  const aura = new THREE.Mesh(geometry, material);
  aura.name = "coreAura";
  scene.add(aura);
}

function generateSprite() {
  const spriteCanvas = document.createElement("canvas");
  spriteCanvas.width = 128;
  spriteCanvas.height = 128;
  const context = spriteCanvas.getContext("2d");

  const gradient = context.createRadialGradient(64, 64, 0, 64, 64, 64);
  gradient.addColorStop(0, "rgba(255,255,255,1)");
  gradient.addColorStop(0.12, "rgba(214,240,255,0.98)");
  gradient.addColorStop(0.32, "rgba(146,210,255,0.75)");
  gradient.addColorStop(0.6, "rgba(141,118,255,0.3)");
  gradient.addColorStop(1, "rgba(0,0,0,0)");

  context.fillStyle = gradient;
  context.fillRect(0, 0, 128, 128);

  return new THREE.CanvasTexture(spriteCanvas);
}

function setupParams() {
  params = {
    expansionSpeed: 34,
    drag: 0.22,
    driftStrength: 0.75,
    particleSize: 2.6,
    bloomStrength: 1.35,
    bloomRadius: 0.75,
    bloomThreshold: 0.08
  };
}

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
  composer.setSize(window.innerWidth, window.innerHeight);
}

function animate() {
  requestAnimationFrame(animate);

  const delta = Math.min(clock.getDelta(), 0.033);
  const elapsed = clock.elapsedTime;

  updateParticles(delta, elapsed);
  updateCoreAura(elapsed);

  if (elapsed > 7.5 && !galaxySystem) {
    createGalaxyCluster();
  }

  if (galaxySystem) {
    galaxySystem.rotation.z += delta * galaxyRotationSpeed;
    galaxySystem.rotation.x = Math.sin(elapsed * 0.12) * 0.12;
  }

  if (!titleAnimationStarted && titleText) {
    titleAnimationStarted = true;
    animateTitle();
  }

  if (elapsed > 4.2 && scrollIndicator && !scrollIndicator.classList.contains("visible")) {
    scrollIndicator.classList.add("visible");
  }

  bloomPass.strength = params.bloomStrength + Math.max(0, 0.55 - elapsed * 0.08);
  controls.update();
  composer.render(delta);
}

function updateParticles(delta, elapsed) {
  const positions = particleSystem.geometry.attributes.position.array;
  const colors = particleSystem.geometry.attributes.color.array;

  const pulse = Math.max(0.22, 1.35 - elapsed * 0.16);
  const drag = Math.max(0.94, 1 - delta * params.drag);

  for (let i = 0; i < particleCount; i++) {
    const i3 = i * 3;
    const seed = particleSeeds[i];

    particleVelocities[i3] *= drag;
    particleVelocities[i3 + 1] *= drag;
    particleVelocities[i3 + 2] *= drag;

    const noise = elapsed * 0.45 + seed;
    particleVelocities[i3] += Math.sin(noise) * 0.0009 * params.driftStrength;
    particleVelocities[i3 + 1] += Math.cos(noise * 1.2) * 0.0009 * params.driftStrength;
    particleVelocities[i3 + 2] += Math.sin(noise * 0.75) * 0.0006 * params.driftStrength;

    positions[i3] += particleVelocities[i3] * params.expansionSpeed * pulse * delta;
    positions[i3 + 1] += particleVelocities[i3 + 1] * params.expansionSpeed * pulse * delta;
    positions[i3 + 2] += particleVelocities[i3 + 2] * params.expansionSpeed * pulse * delta;

    const dist = Math.sqrt(
      positions[i3] * positions[i3] +
      positions[i3 + 1] * positions[i3 + 1] +
      positions[i3 + 2] * positions[i3 + 2]
    );

    const glow = Math.max(0.35, 1 - dist / 520);
    colors[i3] *= 0.9996;
    colors[i3 + 1] = Math.min(1, colors[i3 + 1] * 0.9999 + glow * 0.0007);
    colors[i3 + 2] = Math.min(1, colors[i3 + 2] * 0.99995 + glow * 0.0011);
  }

  particleSystem.material.size = params.particleSize + Math.max(0, 1.8 - elapsed * 0.12);
  particleSystem.material.opacity = Math.max(0.35, 0.95 - elapsed * 0.03);
  particleSystem.geometry.attributes.position.needsUpdate = true;
  particleSystem.geometry.attributes.color.needsUpdate = true;
}

function updateCoreAura(elapsed) {
  const aura = scene.getObjectByName("coreAura");
  if (!aura) return;

  const pulse = 1 + Math.sin(elapsed * 2.6) * 0.08;
  const expansion = 1 + Math.min(elapsed * 0.09, 1.4);
  aura.scale.setScalar(pulse * expansion);
  aura.material.opacity = Math.max(0.02, 0.12 - elapsed * 0.01);
}

function animateTitle() {
  if (!titleText) return;

  const startTime = clock.elapsedTime;

  function updateTitle() {
    const elapsed = clock.elapsedTime - startTime;
    const progress = Math.min(elapsed / TITLE_ANIMATION_DURATION, 1);
    const easeProgress = 1 - Math.pow(1 - progress, 3);
    const scale = 0.001 + easeProgress * 0.999;
    const opacity = Math.min(1, easeProgress * 1.15);
    const blur = Math.max(0, 18 - easeProgress * 18);

    titleText.style.opacity = opacity.toString();
    titleText.style.transform = `translate(-50%, -50%) scale(${scale})`;
    titleText.style.filter = `blur(${blur}px)`;

    if (progress < 1) {
      requestAnimationFrame(updateTitle);
    } else {
      titleText.style.opacity = "1";
      titleText.style.transform = "translate(-50%, -50%) scale(1)";
      titleText.style.filter = "blur(0px)";
    }
  }

  updateTitle();
}

function createGalaxyCluster() {
  const galaxyCount = 9000;
  const branches = 5;
  const spin = 0.014;
  const radius = 1400;

  const geometry = new THREE.BufferGeometry();
  const positions = new Float32Array(galaxyCount * 3);
  const colors = new Float32Array(galaxyCount * 3);

  const inner = new THREE.Color(0xffffff);
  const mid = new THREE.Color(0x8fcfff);
  const outer = new THREE.Color(0x6e63ff);

  for (let i = 0; i < galaxyCount; i++) {
    const i3 = i * 3;
    const branchAngle = ((i % branches) / branches) * Math.PI * 2;
    const randomRadius = Math.pow(Math.random(), 0.72) * radius;
    const spinAngle = randomRadius * spin;
    const randomX = Math.pow(Math.random(), 2) * (Math.random() < 0.5 ? 1 : -1) * 60;
    const randomY = Math.pow(Math.random(), 2.3) * (Math.random() < 0.5 ? 1 : -1) * 22;
    const randomZ = Math.pow(Math.random(), 2) * (Math.random() < 0.5 ? 1 : -1) * 60;
    const angle = branchAngle + spinAngle;

    positions[i3] = Math.cos(angle) * randomRadius + randomX;
    positions[i3 + 1] = randomY;
    positions[i3 + 2] = Math.sin(angle) * randomRadius + randomZ;

    const mixed = inner.clone();
    if (randomRadius < radius * 0.28) {
      mixed.lerp(mid, randomRadius / (radius * 0.28));
    } else {
      mixed.copy(mid).lerp(outer, (randomRadius - radius * 0.28) / (radius * 0.72));
    }

    colors[i3] = mixed.r;
    colors[i3 + 1] = mixed.g;
    colors[i3 + 2] = mixed.b;
  }

  geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));

  const material = new THREE.PointsMaterial({
    size: 1.7,
    map: generateSprite(),
    vertexColors: true,
    blending: THREE.AdditiveBlending,
    transparent: true,
    depthWrite: false,
    opacity: 0.48,
    sizeAttenuation: true
  });

  galaxySystem = new THREE.Points(geometry, material);
  galaxySystem.rotation.x = -0.35;
  galaxySystem.rotation.z = 0.2;
  scene.add(galaxySystem);
}
