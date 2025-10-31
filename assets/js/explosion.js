// Baseado em: https://codepen.io/Majid-Manzarpour/pen/PwYrYdg
// Adaptado para Three.js r128 e paleta de cores do usuário.

const container = document.getElementById('hero-canvas');
const titleElement = document.querySelector('.hero-title');
if (!container || !titleElement) {
    console.error('Container ou título não encontrados para a animação de explosão.');
} else {
    // --- Configurações da Animação ---
    const ANIMATION_DURATION = 5000; // 5 segundos
    const FADE_IN_START = 3000; // 3 segundos
    const FADE_IN_DURATION = 2000; // 2 segundos (3s a 5s)
    const PARTICLE_COUNT = 1000;
    const COLORS = [
        0x007bff, // Azul (cor de detalhe)
        0xffffff  // Branco
    ];

    // --- Variáveis Globais Three.js ---
    let camera, scene, renderer;
    let particles, geometry, material;
    let startTime = Date.now();
    let isAnimating = true;

    // --- Estrutura de Partícula ---
    const particleProps = [];
    const particleVelocities = [];

    // --- Inicialização Three.js ---
    function init() {
        // Câmera
        camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 10000);
        camera.position.z = 1000;

        // Cena
        scene = new THREE.Scene();
        scene.background = new THREE.Color(0x121212); // Fundo preto/cinza escuro

        // Geometria de Partículas
        geometry = new THREE.BufferGeometry();
        const positions = [];
        const colors = [];

        // Cores para atribuição
        const color = new THREE.Color();

        for (let i = 0; i < PARTICLE_COUNT; i++) {
            // Posição inicial (centro)
            positions.push(0, 0, 0);

            // Cor aleatória entre as definidas
            const selectedColor = COLORS[Math.floor(Math.random() * COLORS.length)];
            color.setHex(selectedColor);
            colors.push(color.r, color.g, color.b);

            // Propriedades da explosão
            const angle = Math.random() * Math.PI * 2;
            const speed = Math.random() * 10 + 5;
            const velocity = new THREE.Vector3(
                Math.cos(angle) * speed,
                Math.sin(angle) * speed,
                (Math.random() - 0.5) * speed
            );
            particleVelocities.push(velocity);
            particleProps.push({
                life: 1.0,
                decay: Math.random() * 0.005 + 0.005,
                color: selectedColor
            });
        }

        geometry.setAttribute('position', new THREE.Float3deArray(positions, 3));
        geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));

        // Material
        material = new THREE.PointsMaterial({
            size: 5,
            vertexColors: true,
            blending: THREE.AdditiveBlending,
            transparent: true,
            sizeAttenuation: true
        });

        // Partículas
        particles = new THREE.Points(geometry, material);
        scene.add(particles);

        // Renderer
        renderer = new THREE.WebGLRenderer({ antialias: true });
        renderer.setPixelRatio(window.devicePixelRatio);
        renderer.setSize(window.innerWidth, window.innerHeight);
        container.appendChild(renderer.domElement);

        // Event Listeners
        window.addEventListener('resize', onWindowResize, false);
    }

    // --- Redimensionamento ---
    function onWindowResize() {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    }

    // --- Animação ---
    function animate() {
        if (!isAnimating) return;

        requestAnimationFrame(animate);

        const positions = geometry.attributes.position.array;
        const colors = geometry.attributes.color.array;
        const now = Date.now();
        const elapsed = now - startTime;

        // 1. Atualizar Posição e Vida das Partículas
        for (let i = 0; i < PARTICLE_COUNT; i++) {
            const i3 = i * 3;

            // Aplicar velocidade
            positions[i3] += particleVelocities[i].x;
            positions[i3 + 1] += particleVelocities[i].y;
            positions[i3 + 2] += particleVelocities[i].z;

            // Aplicar gravidade (opcional, mas adiciona realismo)
            // particleVelocities[i].y -= 0.1;

            // Atualizar vida e opacidade
            particleProps[i].life -= particleProps[i].decay;
            const opacity = Math.max(0, particleProps[i].life);

            // Aplicar opacidade ao material (não diretamente à cor no THREE.PointsMaterial, mas podemos simular com a cor)
            // Para THREE.PointsMaterial, a opacidade afeta todas as partículas.
            // Para controlar a opacidade individual, precisaríamos de um shader customizado,
            // mas vamos simplificar e usar a vida para controlar a escala ou a cor.
            // Aqui, vamos usar a vida para controlar o tamanho (sizeAttenuation: true)

            // Simular o fade-out mudando a cor para o fundo
            if (particleProps[i].life < 0.5) {
                const fadeFactor = particleProps[i].life * 2; // 1.0 a 0.0
                const initialColor = new THREE.Color(particleProps[i].color);
                const finalColor = new THREE.Color(0x121212); // Cor do fundo

                colors[i3] = initialColor.r * fadeFactor + finalColor.r * (1 - fadeFactor);
                colors[i3 + 1] = initialColor.g * fadeFactor + finalColor.g * (1 - fadeFactor);
                colors[i3 + 2] = initialColor.b * fadeFactor + finalColor.b * (1 - fadeFactor);
            }
        }

        geometry.attributes.position.needsUpdate = true;
        geometry.attributes.color.needsUpdate = true;

        // 2. Controlar o Fade-in do Título
        if (elapsed >= FADE_IN_START) {
            const fadeElapsed = elapsed - FADE_IN_START;
            const opacity = Math.min(1, fadeElapsed / FADE_IN_DURATION);
            titleElement.style.opacity = opacity;
        }

        // 3. Parar a Animação
        if (elapsed >= ANIMATION_DURATION) {
            isAnimating = false;
            // Opcional: remover o canvas para liberar recursos
            // container.removeChild(renderer.domElement);
            // Mostrar o texto com opacidade total
            titleElement.style.opacity = 1; 
        }

        renderer.render(scene, camera);
    }

    // --- Iniciar ---
    init();
    animate();
}
