const canvas = document.getElementById('particle-canvas');
const ctx = canvas.getContext('2d');

// Ajustar tamaño del canvas al tamaño de la ventana
function resizeCanvas() {
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

// Configuración
const PARTICLE_COUNT = 100;
const PARTICLES = [];

// Generar partículas
for (let i = 0; i < PARTICLE_COUNT; i++) {
PARTICLES.push({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    vx: (Math.random() - 0.5) * 1.5,
    vy: (Math.random() - 0.5) * 1.5,
    radius: Math.random() * 2 + 1,
});
}

function draw() {
ctx.clearRect(0, 0, canvas.width, canvas.height);

PARTICLES.forEach(p => {
    // Movimiento
    p.x += p.vx;
    p.y += p.vy;

    // Rebote en bordes
    if (p.x <= 0 || p.x >= canvas.width) p.vx *= -1;
    if (p.y <= 0 || p.y >= canvas.height) p.vy *= -1;

    // Dibujar partícula
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
    ctx.fill();
});

requestAnimationFrame(draw);
}

draw();
