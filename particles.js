/* 
  ===========================================
  PARTICLES & EFFECTS (HTML5 Canvas)
  ===========================================
*/

const canvas = document.getElementById('particles-canvas');
const ctx = canvas.getContext('2d');

let particlesArray = [];
let trailParticles = [];
let mouse = {
    x: undefined,
    y: undefined,
    radius: 100
};

// Handle resize
window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    initParticles();
});

// Handle mouse
window.addEventListener('mousemove', (event) => {
    mouse.x = event.x;
    mouse.y = event.y;
    spawnTrail(event.x, event.y, 1);
});

window.addEventListener('touchmove', (event) => {
    if (event.touches.length > 0) {
        mouse.x = event.touches[0].clientX;
        mouse.y = event.touches[0].clientY;
        spawnTrail(mouse.x, mouse.y, 1);
    }
});

window.addEventListener('click', (event) => {
    spawnTrail(event.clientX, event.clientY, 5);
});

window.addEventListener('touchstart', (event) => {
    if (event.touches.length > 0) {
        spawnTrail(event.touches[0].clientX, event.touches[0].clientY, 5);
    }
});

function spawnTrail(x, y, count) {
    const colors = ['rgba(250, 218, 221, 0.8)', 'rgba(230, 184, 162, 0.8)', 'rgba(255, 255, 255, 0.9)'];
    for (let i = 0; i < count; i++) {
        let size = Math.random() * 4 + 2;
        let speedX = (Math.random() - 0.5) * 2;
        let speedY = (Math.random() - 0.5) * 2 - 1; // float up slightly
        let color = colors[Math.floor(Math.random() * colors.length)];
        trailParticles.push(new TrailParticle(x, y, size, color, speedX, speedY));
    }
}

// Function to draw a heart
function drawHeart(ctx, x, y, size, color, alpha = 1) {
    ctx.save();
    ctx.translate(x, y);
    const s = size / 10;
    ctx.scale(s, s);
    
    ctx.beginPath();
    ctx.moveTo(0, 3);
    ctx.bezierCurveTo(0, -3, -10, -5, -10, 2);
    ctx.bezierCurveTo(-10, 8, 0, 12, 0, 15);
    ctx.bezierCurveTo(0, 12, 10, 8, 10, 2);
    ctx.bezierCurveTo(10, -5, 0, -3, 0, 3);
    ctx.closePath();

    ctx.globalAlpha = alpha;
    ctx.fillStyle = color;
    ctx.fill();
    ctx.shadowBlur = 10;
    ctx.shadowColor = color;
    ctx.restore();
}

// Particle Class
class Particle {
    constructor(x, y, size, color, speedX, speedY) {
        this.x = x;
        this.y = y;
        this.size = size;
        this.baseSize = size;
        this.color = color;
        this.speedX = speedX;
        this.speedY = speedY;
    }
    
    draw() {
        drawHeart(ctx, this.x, this.y, this.size, this.color);
    }
    
    update() {
        this.x += this.speedX;
        this.y += this.speedY;
        
        // Bounce off edges
        if (this.x > canvas.width || this.x < 0) this.speedX = -this.speedX;
        if (this.y > canvas.height || this.y < 0) this.speedY = -this.speedY;
        
        // Mouse interaction
        if (mouse.x && mouse.y) {
            let dx = mouse.x - this.x;
            let dy = mouse.y - this.y;
            let distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < mouse.radius) {
                const forceDirectionX = dx / distance;
                const forceDirectionY = dy / distance;
                const force = (mouse.radius - distance) / mouse.radius;
                
                this.x -= forceDirectionX * force * 2;
                this.y -= forceDirectionY * force * 2;
                
                if (this.size < this.baseSize * 1.5) {
                    this.size += 0.5;
                }
            } else if (this.size > this.baseSize) {
                this.size -= 0.1;
            }
        }
        
        this.draw();
    }
}

class TrailParticle {
    constructor(x, y, size, color, speedX, speedY) {
        this.x = x;
        this.y = y;
        this.size = size;
        this.color = color;
        this.speedX = speedX;
        this.speedY = speedY;
        this.life = 1.0;
    }
    
    update() {
        this.x += this.speedX;
        this.y += this.speedY;
        this.life -= 0.02; // fade out
        this.draw();
    }
    
    draw() {
        drawHeart(ctx, this.x, this.y, this.size, this.color, Math.max(this.life, 0));
    }
}

function initParticles() {
    particlesArray = [];
    const numberOfParticles = Math.min((canvas.width * canvas.height) / 15000, 100);
    const colors = ['rgba(250, 218, 221, 0.4)', 'rgba(230, 184, 162, 0.4)', 'rgba(255, 255, 255, 0.6)'];
    
    for (let i = 0; i < numberOfParticles; i++) {
        let size = Math.random() * 5 + 3; // Make hearts slightly larger than circles
        let x = Math.random() * (canvas.width - size * 2) + size;
        let y = Math.random() * (canvas.height - size * 2) + size;
        let speedX = (Math.random() - 0.5) * 0.5;
        let speedY = (Math.random() - 0.5) * 0.5;
        let color = colors[Math.floor(Math.random() * colors.length)];
        
        particlesArray.push(new Particle(x, y, size, color, speedX, speedY));
    }
}

function animateParticles() {
    requestAnimationFrame(animateParticles);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    for (let i = 0; i < particlesArray.length; i++) {
        particlesArray[i].update();
    }
    
    for (let i = 0; i < trailParticles.length; i++) {
        trailParticles[i].update();
        if (trailParticles[i].life <= 0) {
            trailParticles.splice(i, 1);
            i--;
        }
    }
}

// Initial Call
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
initParticles();
animateParticles();

// Expose a function to change background state for Page 10
window.changeBackgroundGradient = function(step) {
    const bgColors = [
        'linear-gradient(135deg, var(--clr-ivory), var(--clr-blush-pink))',
        'linear-gradient(135deg, var(--clr-blush-pink), var(--clr-rose-gold))',
        'linear-gradient(135deg, var(--clr-rose-gold), var(--clr-lavender))',
        'linear-gradient(135deg, #f6d365, #fda085)', // Sunset
        'linear-gradient(135deg, #141E30, #243B55)' // Night Sky
    ];
    if(step < bgColors.length) {
        canvas.style.background = bgColors[step];
    }
};
