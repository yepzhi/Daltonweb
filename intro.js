/* ═══════════════════════════════════════════════════════
   🏎️ INTRO ANIMATION — Racing Speed Lines
   Adapted from JovenesSTEM star field intro
   ═══════════════════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {
    const overlay = document.getElementById('intro-overlay');
    const canvas = document.getElementById('intro-canvas');
    const ctx = canvas.getContext('2d');
    const gradientZoom = document.getElementById('intro-gradient');
    const speedLinesContainer = document.getElementById('speed-lines');

    // Canvas size
    let W = window.innerWidth;
    let H = window.innerHeight;
    canvas.width = W;
    canvas.height = H;

    window.addEventListener('resize', () => {
        W = window.innerWidth;
        H = window.innerHeight;
        canvas.width = W;
        canvas.height = H;
    });

    // ── Speed particles (star-field adapted for racing) ──
    const NUM_PARTICLES = 600;
    const particles = [];
    const cx = W / 2;
    const cy = H / 2;
    let speed = 1.5;
    let accel = 0.03;
    let isAccelerating = false;
    let introPhase = 'waiting'; // waiting → accelerating → transitioning → done
    let animId;

    // Colors: racing neon palette
    const colors = [
        [0, 212, 255],    // cyan
        [255, 140, 0],    // orange
        [255, 51, 102],   // red
        [255, 215, 0],    // gold
        [255, 255, 255],  // white
    ];

    class SpeedParticle {
        constructor() {
            this.reset();
        }

        reset() {
            this.x = (Math.random() - 0.5) * W * 1.5;
            this.y = (Math.random() - 0.5) * H * 1.5;
            this.z = Math.random() * W;
            this.pz = this.z;
            this.color = colors[Math.floor(Math.random() * colors.length)];
        }

        update() {
            this.z -= speed;
            if (this.z < 1) this.reset();
        }

        draw() {
            const sx = (this.x / this.z) * W / 2 + W / 2;
            const sy = (this.y / this.z) * H / 2 + H / 2;
            const px = (this.x / this.pz) * W / 2 + W / 2;
            const py = (this.y / this.pz) * H / 2 + H / 2;
            this.pz = this.z;

            if (sx < -50 || sx > W + 50 || sy < -50 || sy > H + 50) return;

            const alpha = 1 - this.z / W;
            const lineWidth = Math.min((W / this.z) * 0.12, 4);
            const [r, g, b] = this.color;

            ctx.beginPath();
            ctx.moveTo(px, py);
            ctx.lineTo(sx, sy);
            ctx.lineWidth = lineWidth;
            ctx.strokeStyle = `rgba(${r}, ${g}, ${b}, ${alpha * 0.8})`;
            ctx.stroke();
        }
    }

    // Populate
    for (let i = 0; i < NUM_PARTICLES; i++) {
        particles.push(new SpeedParticle());
    }

    // ── Road markings (dashed center line rushing toward viewer) ──
    const roadMarks = [];
    const NUM_MARKS = 15;

    for (let i = 0; i < NUM_MARKS; i++) {
        roadMarks.push({
            z: (i / NUM_MARKS) * W + Math.random() * 100,
            width: 4 + Math.random() * 3,
        });
    }

    function drawRoad() {
        // Draw a subtle road at the bottom
        const roadTop = H * 0.7;
        const roadBottom = H;

        // Road surface
        const roadGrad = ctx.createLinearGradient(0, roadTop, 0, roadBottom);
        roadGrad.addColorStop(0, 'rgba(30, 30, 50, 0)');
        roadGrad.addColorStop(0.3, 'rgba(30, 30, 50, 0.3)');
        roadGrad.addColorStop(1, 'rgba(30, 30, 50, 0.6)');
        ctx.fillStyle = roadGrad;
        ctx.fillRect(0, roadTop, W, roadBottom - roadTop);

        // Center dashes
        roadMarks.forEach(mark => {
            mark.z -= speed * 0.7;
            if (mark.z < 1) mark.z = W;

            const perspective = 1 - mark.z / W;
            const y = roadTop + (roadBottom - roadTop) * perspective * 0.8;
            const x = W / 2;
            const dashWidth = 3 + perspective * 40;
            const dashHeight = 2 + perspective * 8;
            const alpha = perspective * 0.5;

            ctx.fillStyle = `rgba(255, 215, 0, ${alpha})`;
            ctx.fillRect(x - dashWidth / 2, y, dashWidth, dashHeight);
        });
    }

    // ── Generate speed line DOM elements ──
    function generateSpeedLines() {
        for (let i = 0; i < 12; i++) {
            const line = document.createElement('div');
            line.className = 'speed-line';
            line.style.top = `${Math.random() * 100}%`;
            line.style.width = `${100 + Math.random() * 200}px`;
            line.style.animationDuration = `${0.3 + Math.random() * 0.5}s`;
            line.style.animationDelay = `${Math.random() * 0.3}s`;
            speedLinesContainer.appendChild(line);
        }
    }
    generateSpeedLines();

    // ── Text animation sequence ──
    function showIntroText() {
        const line1 = document.getElementById('intro-line-1');
        const line2 = document.getElementById('intro-line-2');
        const line3 = document.getElementById('intro-line-3');

        setTimeout(() => line1.classList.add('visible'), 500);
        setTimeout(() => line2.classList.add('visible'), 1200);
        setTimeout(() => line3.classList.add('visible'), 2000);
    }

    // ── Animation loop ──
    function animate() {
        // Clear
        ctx.fillStyle = 'rgba(0, 0, 0, 0.85)';
        ctx.fillRect(0, 0, W, H);

        // Subtle vignette
        const vignette = ctx.createRadialGradient(W / 2, H / 2, W * 0.2, W / 2, H / 2, W * 0.8);
        vignette.addColorStop(0, 'rgba(0,0,0,0)');
        vignette.addColorStop(1, 'rgba(0,0,0,0.4)');
        ctx.fillStyle = vignette;
        ctx.fillRect(0, 0, W, H);

        // Draw road
        if (speed > 5) drawRoad();

        // Update speed
        if (isAccelerating) {
            speed += accel;
            accel += 0.005;
        }

        // Draw particles
        particles.forEach(p => {
            p.update();
            p.draw();
        });

        if (speed < 45) {
            animId = requestAnimationFrame(animate);
        } else {
            triggerTransition();
        }
    }

    // ── Transition out ──
    function triggerTransition() {
        introPhase = 'transitioning';
        overlay.classList.add('accelerating');
        gradientZoom.classList.add('animate-zoom');

        setTimeout(() => {
            overlay.classList.add('intro-hidden');
            document.body.classList.remove('no-scroll');
            cancelAnimationFrame(animId);
            introPhase = 'done';

            // Auto-play music after intro
            tryAutoplayMusic();

            // Start scroll animations
            initScrollReveal();
        }, 800);
    }

    // ── Skip intro on tap/click ──
    overlay.addEventListener('click', () => {
        if (introPhase === 'done') return;
        speed = 50;
        triggerTransition();
    });

    // ── Start sequence ──
    showIntroText();

    setTimeout(() => {
        isAccelerating = true;
        introPhase = 'accelerating';
    }, 2800);

    animate();
});
