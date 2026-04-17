/* =========================================
   BrainstormOps Big Bang Animation v5 (FINAL)
   Cinematic Expansion + Brain Core + Galaxy + Twinkle
   ========================================= */

let scene, camera, renderer, controls, composer, bloomPass;
let particleSystem, particlePositions, particleVelocities, particleColors;
let brainSystem = null;
let galaxySystem = null;
let particleCount = 40000;
let clock = new THREE.Clock();

const canvas = document.getElementById("hero-canvas");
const titleText = document.getElementById("hero-title");
const scrollIndicator = document.getElementById("scroll-indicator");

const TITLE_ANIMATION_DURATION = 6.5;

if (!canvas) {
  console.error("Canvas #hero-canvas não encontrado!");
} else {
  init();
  animate();
}

function init() {
  scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2(0x020611, 0.0008);

  camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 25000);
  camera.position.set(0, 0, 320);

  renderer = new THREE.WebGLRenderer({ antialias: true, canvas, alpha: true, powerPreference: "high-performance" });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.outputColorSpace = THREE.SRGBColorSpace;

  controls = new THREE.OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.05;
  controls.enabled = false;

  const ambientLight = new THREE.AmbientLight(0x4455ff, 0.7);
  scene.add(ambientLight);

  const coreLight = new THREE.PointLight(0x00d2ff, 8, 3000, 1.8);
  scene.add(coreLight);

  composer = new THREE.EffectComposer(renderer);
  composer.addPass(new THREE.RenderPass(scene, camera));

  bloomPass = new THREE.UnrealBloomPass(new THREE.Vector2(window.innerWidth, window.innerHeight), 1.6, 0.4, 0.85);
  bloomPass.threshold = 0.05;
  bloomPass.strength = 1.8;
  bloomPass.radius = 1.3;
  composer.addPass(bloomPass);

  createParticleSystem();
  createGalaxySystem();
  
  window.addEventListener("resize", onWindowResize, false);
}

function createParticleSystem() {
  const geometry = new THREE.BufferGeometry();
  particlePositions = new Float32Array(particleCount * 3);
  particleVelocities = new Float32Array(particleCount * 3);
  particleColors = new Float32Array(particleCount * 3);

  const colorArr = [
    new THREE.Color(0x00ffff),
    new THREE.Color(0x00aaff),
    new THREE.Color(0xaa00ff),
    new THREE.Color(0xffffff)
  ];

  for (let i = 0; i < particleCount; i++) {
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(2 * Math.random() - 1);
    const speed = 0.8 + Math.random() * 7.5;
    
    particleVelocities[i * 3] = speed * Math.sin(phi) * Math.cos(theta);
    particleVelocities[i * 3 + 1] = speed * Math.sin(phi) * Math.sin(theta);
    particleVelocities[i * 3 + 2] = speed * Math.cos(phi);
    
    const color = colorArr[Math.floor(Math.random() * colorArr.length)];
    particleColors[i * 3] = color.r;
    particleColors[i * 3 + 1] = color.g;
    particleColors[i * 3 + 2] = color.b;
  }

  geometry.setAttribute("position", new THREE.BufferAttribute(particlePositions, 3));
  geometry.setAttribute("color", new THREE.BufferAttribute(particleColors, 3));

  const material = new THREE.PointsMaterial({
    size: 1.8,
    vertexColors: true,
    transparent: true,
    opacity: 1.0,
    blending: THREE.AdditiveBlending,
    depthWrite: false
  });

  particleSystem = new THREE.Points(geometry, material);
  scene.add(particleSystem);
}

function createGalaxySystem() {
  const galaxyGeometry = new THREE.BufferGeometry();
  const galaxyCount = 20000;
  const positions = new Float32Array(galaxyCount * 3);
  const starSizes = new Float32Array(galaxyCount);
  
  for (let i = 0; i < galaxyCount; i++) {
    positions[i * 3] = (Math.random() - 0.5) * 8000;
    positions[i * 3 + 1] = (Math.random() - 0.5) * 8000;
    positions[i * 3 + 2] = (Math.random() - 0.5) * 8000;
    starSizes[i] = Math.random();
  }
  
  galaxyGeometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  const material = new THREE.PointsMaterial({ size: 1.0, color: 0xffffff, transparent: true, opacity: 0.4 });
  galaxySystem = new THREE.Points(galaxyGeometry, material);
  scene.add(galaxySystem);
}

function createBrainSystem() {
  const brainGeometry = new THREE.BufferGeometry();
  const brainCount = 22000;
  const positions = new Float32Array(brainCount * 3);
  const colors = new Float32Array(brainCount * 3);
  
  const color1 = new THREE.Color(0x00ffff);
  const color2 = new THREE.Color(0xbd00ff);

  for (let i = 0; i < brainCount; i++) {
    const u = Math.random() * Math.PI * 2;
    const v = Math.random() * Math.PI;
    const hemisphere = Math.random() > 0.5 ? 1 : -1;
    
    let x = 80 * Math.sin(v) * Math.cos(u) * 0.85;
    let y = 100 * Math.cos(v);
    let z = 70 * Math.sin(v) * Math.sin(u);
    
    const noise = Math.sin(x * 0.07) * Math.cos(y * 0.07) * 12;
    x += noise + (hemisphere * 12);
    y += noise;

    positions[i * 3] = x;
    positions[i * 3 + 1] = y;
    positions[i * 3 + 2] = z;

    const mixedColor = color1.clone().lerp(color2, Math.random());
    colors[i * 3] = mixedColor.r;
    colors[i * 3 + 1] = mixedColor.g;
    colors[i * 3 + 2] = mixedColor.b;
  }

  brainGeometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  brainGeometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));

  const material = new THREE.PointsMaterial({
    size: 1.2,
    vertexColors: true,
    transparent: true,
    opacity: 0,
    blending: THREE.AdditiveBlending,
    depthWrite: false
  });

  brainSystem = new THREE.Points(brainGeometry, material);
  scene.add(brainSystem);
}

function animate() {
  requestAnimationFrame(animate);
  const elapsedTime = clock.getElapsedTime();

  const positions = particleSystem.geometry.attributes.position.array;
  for (let i = 0; i < particleCount; i++) {
    positions[i * 3] += particleVelocities[i * 3];
    positions[i * 3 + 1] += particleVelocities[i * 3 + 1];
    positions[i * 3 + 2] += particleVelocities[i * 3 + 2];
    particleVelocities[i * 3] *= 0.994;
    particleVelocities[i * 3 + 1] *= 0.994;
    particleVelocities[i * 3 + 2] *= 0.994;
  }
  particleSystem.geometry.attributes.position.needsUpdate = true;
  particleSystem.rotation.y += 0.0015;

  if (elapsedTime < TITLE_ANIMATION_DURATION) {
    const progress = elapsedTime / TITLE_ANIMATION_DURATION;
    const scale = Math.pow(progress, 4.0) * 16.0; 
    const opacity = progress < 0.8 ? 1.0 : 1.0 - (progress - 0.8) / 0.2;
    
    if (titleText) {
      titleText.style.transform = `translate(-50%, -50%) scale(${scale})`;
      titleText.style.opacity = opacity;
    }
  } else {
    if (titleText) titleText.style.display = "none";
    if (scrollIndicator) scrollIndicator.classList.add("visible");
    
    if (!brainSystem) createBrainSystem();
    if (brainSystem && brainSystem.material.opacity < 0.85) {
      brainSystem.material.opacity += 0.004;
    }
    if (particleSystem.material.opacity > 0.15) {
      particleSystem.material.opacity -= 0.003;
    }
  }

  if (brainSystem) {
    brainSystem.rotation.y += 0.0025;
    brainSystem.rotation.z += 0.0008;
    const pulse = 1 + Math.sin(elapsedTime * 1.5) * 0.06;
    brainSystem.scale.set(pulse, pulse, pulse);
  }

  if (galaxySystem) {
    galaxySystem.rotation.y += 0.0003;
    galaxySystem.material.opacity = 0.3 + Math.sin(elapsedTime) * 0.1; 
  }

  controls.update();
  composer.render();
}

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
  composer.setSize(window.innerWidth, window.innerHeight);
}
