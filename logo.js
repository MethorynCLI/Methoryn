/**
 * logo.js — CORVUS animated canvas logo
 * Renders a swirl of random characters orbiting behind bold "CORVUS" text.
 * Drop a <canvas id="corvus-logo"> anywhere, then call initLogo(canvasId).
 */

(function () {
  const CHARS = "░▒▓█▄▀▌▐╱╲◉●◆▲▪!@#$%^&*_-+=?<>[]{}~.,;:|";
  const ACCENT = "#00dcaa";
  const DIM    = "rgba(0,220,170,0.18)";
  const GLOW   = "rgba(0,220,170,0.07)";

  function initLogo(canvasId) {
    const canvas = document.getElementById(canvasId);
    if (!canvas) return;
    const ctx = canvas.getContext("2d");

    // Physical size — wider to fit CORVUS (6 chars)
    const W = canvas.width  = 190;
    const H = canvas.height = 44;
    const cx = W / 2;
    const cy = H / 2;

    // Particles — each orbits at a slightly different radius/speed/phase
    const particles = Array.from({ length: 28 }, (_, i) => ({
      char:   CHARS[Math.floor(Math.random() * CHARS.length)],
      angle:  (i / 28) * Math.PI * 2,
      radius: 14 + Math.random() * 12,
      speed:  (0.004 + Math.random() * 0.006) * (Math.random() < 0.5 ? 1 : -1),
      size:   7 + Math.random() * 4,
      alpha:  0.12 + Math.random() * 0.25,
      // swap char occasionally
      tick:   Math.floor(Math.random() * 80),
    }));

    let frame = 0;

    function draw() {
      ctx.clearRect(0, 0, W, H);

      // Subtle glow behind centre
      const grd = ctx.createRadialGradient(cx, cy, 2, cx, cy, 32);
      grd.addColorStop(0, GLOW);
      grd.addColorStop(1, "transparent");
      ctx.save();
      ctx.fillStyle = grd;
      ctx.fillRect(0, 0, W, H);
      ctx.restore();

      // Draw orbiting characters
      particles.forEach(p => {
        p.angle += p.speed;
        p.tick--;
        if (p.tick <= 0) {
          p.char = CHARS[Math.floor(Math.random() * CHARS.length)];
          p.tick = 40 + Math.floor(Math.random() * 80);
        }

        const x = cx + Math.cos(p.angle) * p.radius;
        const y = cy + Math.sin(p.angle) * p.radius * 0.55;

        ctx.save();
        ctx.globalAlpha = p.alpha;
        ctx.fillStyle = ACCENT;
        ctx.font = `${p.size}px 'Courier New', monospace`;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(p.char, x, y);
        ctx.restore();
      });

      // Left accent bar
      ctx.save();
      ctx.fillStyle = ACCENT;
      ctx.globalAlpha = 0.9;
      ctx.beginPath();
      ctx.roundRect(8, 10, 3, 24, 2);
      ctx.fill();
      ctx.restore();

      // Bold "CORVUS" text — fully reset state before drawing
      ctx.save();
      ctx.globalAlpha = 1;
      ctx.fillStyle = ACCENT;
      ctx.font = "bold 17px 'Courier New', monospace";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.shadowColor = ACCENT;
      ctx.shadowBlur = 8;
      ctx.fillText("CORVUS", cx + 4, cy + 1);
      ctx.restore();

      frame++;
      requestAnimationFrame(draw);
    }

    draw();
  }

  // Auto-init any canvas with data-corvus-logo attribute
  document.addEventListener("DOMContentLoaded", () => {
    document.querySelectorAll("canvas[data-corvus-logo]").forEach(c => {
      initLogo(c.id);
    });
  });

  window.initCorvusLogo = initLogo;
})();
