document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('fallingCanvas');
    const ctx = canvas.getContext('2d');

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    window.addEventListener('resize', () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    });

    const particles = [];
    const particleCount = 50; // Jumlah partikel yang jatuh

    // Choose 'heart' or 'sakura'
    const particleType = 'love'; // Change to 'sakura' for sakura petals

    class Particle {
        constructor(type) {
            this.type = type;
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.size = Math.random() * 10 + 5; // Ukuran partikel
            this.speedY = Math.random() * 1.5 + 0.5; // Kecepatan jatuh
            this.speedX = Math.random() * 1 - 0.5; // Kecepatan samping (sedikit goyang)
            this.rotation = Math.random() * 360; // Rotasi awal
            this.rotationSpeed = Math.random() * 0.1 - 0.05; // Kecepatan rotasi
            this.opacity = Math.random() * 0.7 + 0.3; // Opasitas
            this.color = this.type === 'love' ? 'rgba(255, 100, 150, ' : 'rgba(255, 192, 203, '; // Pink for love, light pink for sakura
        }

        draw() {
            ctx.save();
            ctx.translate(this.x, this.y);
            ctx.rotate(this.rotation * Math.PI / 180);
            ctx.globalAlpha = this.opacity;

            if (this.type === 'love') {
                ctx.beginPath();
                ctx.moveTo(0, -this.size / 2);
                ctx.bezierCurveTo(this.size / 2, -this.size * 1.2, this.size * 1.2, this.size / 2, 0, this.size);
                ctx.bezierCurveTo(-this.size * 1.2, this.size / 2, -this.size / 2, -this.size * 1.2, 0, -this.size / 2);
                ctx.closePath();
                ctx.fillStyle = this.color + this.opacity + ')';
                ctx.fill();
            } else if (this.type === 'sakura') {
                // Drawing a simple sakura petal shape
                ctx.beginPath();
                ctx.ellipse(0, 0, this.size * 0.7, this.size * 1.5, 0, 0, Math.PI * 2);
                ctx.fillStyle = this.color + this.opacity + ')';
                ctx.fill();
            }
            ctx.restore();
        }

        update() {
            this.y += this.speedY;
            this.x += this.speedX;
            this.rotation += this.rotationSpeed;

            // Reset particle if it goes off screen
            if (this.y > canvas.height + this.size || this.x < -this.size || this.x > canvas.width + this.size) {
                this.y = -this.size;
                this.x = Math.random() * canvas.width;
                this.size = Math.random() * 10 + 5;
                this.speedY = Math.random() * 1.5 + 0.5;
                this.speedX = Math.random() * 1 - 0.5;
                this.opacity = Math.random() * 0.7 + 0.3;
            }
        }
    }

    // Create particles
    for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle(particleType));
    }

    // Animation loop
    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear canvas

        particles.forEach(particle => {
            particle.update();
            particle.draw();
        });

        requestAnimationFrame(animate);
    }

    animate();
});