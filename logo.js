/**
 * logo.js — ANVYL animated canvas logo
 * Renders a swirl of random characters orbiting behind bold "ANVYL" text.
 * Drop a <canvas id="anvyl-logo"> anywhere, then call initLogo(canvasId).
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

    // Physical size
    const W = canvas.width  = 160;
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
      ctx.fillStyle = grd;
      ctx.fillRect(0, 0, W, H);

      // Draw orbiting characters
      particles.forEach(p => {
        p.angle += p.speed;
        p.tick--;
        if (p.tick <= 0) {
          p.char = CHARS[Math.floor(Math.random() * CHARS.length)];
          p.tick = 40 + Math.floor(Math.random() * 80);
        }

        const x = cx + Math.cos(p.angle) * p.radius;
        const y = cy + Math.sin(p.angle) * p.radius * 0.55; // flatten to ellipse

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
      ctx.fillStyle = ACCENT;
      ctx.globalAlpha = 0.9;
      ctx.beginPath();
      ctx.roundRect(8, 10, 3, 24, 2);
      ctx.fill();
      ctx.globalAlpha = 1;

      // Bold "ANVYL" text on top
      ctx.font = "bold 18px 'Courier New', monospace";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.letterSpacing = "3px";

      // Subtle text glow
      ctx.shadowColor = ACCENT;
      ctx.shadowBlur = 8;
      ctx.fillStyle = ACCENT;
      ctx.fillText("ANVYL", cx + 6, cy + 1);
      ctx.shadowBlur = 0;

      frame++;
      requestAnimationFrame(draw);
    }

    draw();
  }

  // Auto-init any canvas with data-anvyl-logo attribute
  document.addEventListener("DOMContentLoaded", () => {
    document.querySelectorAll("canvas[data-anvyl-logo]").forEach(c => {
      initLogo(c.id);
    });
  });

  window.initAnvylLogo = initLogo;
})();
