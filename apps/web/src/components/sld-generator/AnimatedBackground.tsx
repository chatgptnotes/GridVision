import { useEffect, useRef } from 'react';

export default function AnimatedBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;
    let time = 0;

    const nodes: { x: number; y: number; vx: number; vy: number; radius: number; pulse: number }[] = [];
    const lines: { from: number; to: number; progress: number; speed: number; active: boolean }[] = [];

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    // Generate grid nodes
    const cols = Math.ceil(canvas.width / 120);
    const rows = Math.ceil(canvas.height / 120);
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        nodes.push({
          x: c * 120 + 60 + (Math.random() - 0.5) * 40,
          y: r * 120 + 60 + (Math.random() - 0.5) * 40,
          vx: (Math.random() - 0.5) * 0.15,
          vy: (Math.random() - 0.5) * 0.15,
          radius: 1.5 + Math.random() * 1.5,
          pulse: Math.random() * Math.PI * 2,
        });
      }
    }

    // Generate connections
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const dx = nodes[i].x - nodes[j].x;
        const dy = nodes[i].y - nodes[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 160 && Math.random() < 0.3) {
          lines.push({
            from: i,
            to: j,
            progress: Math.random(),
            speed: 0.002 + Math.random() * 0.004,
            active: Math.random() < 0.15,
          });
        }
      }
    }

    const animate = () => {
      time += 0.016;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Update nodes
      for (const node of nodes) {
        node.x += node.vx;
        node.y += node.vy;
        node.pulse += 0.02;

        if (node.x < 0 || node.x > canvas.width) node.vx *= -1;
        if (node.y < 0 || node.y > canvas.height) node.vy *= -1;
      }

      // Draw lines
      for (const line of lines) {
        const from = nodes[line.from];
        const to = nodes[line.to];

        // Static line
        ctx.beginPath();
        ctx.moveTo(from.x, from.y);
        ctx.lineTo(to.x, to.y);
        ctx.strokeStyle = 'rgba(59, 130, 246, 0.06)';
        ctx.lineWidth = 0.5;
        ctx.stroke();

        // Animated energy pulse on active lines
        if (line.active) {
          line.progress += line.speed;
          if (line.progress > 1) {
            line.progress = 0;
            line.active = Math.random() < 0.15;
          }

          const px = from.x + (to.x - from.x) * line.progress;
          const py = from.y + (to.y - from.y) * line.progress;

          const gradient = ctx.createRadialGradient(px, py, 0, px, py, 12);
          gradient.addColorStop(0, 'rgba(59, 130, 246, 0.6)');
          gradient.addColorStop(0.5, 'rgba(59, 130, 246, 0.15)');
          gradient.addColorStop(1, 'rgba(59, 130, 246, 0)');
          ctx.beginPath();
          ctx.arc(px, py, 12, 0, Math.PI * 2);
          ctx.fillStyle = gradient;
          ctx.fill();

          // Glow trail on active line
          ctx.beginPath();
          ctx.moveTo(from.x, from.y);
          ctx.lineTo(to.x, to.y);
          ctx.strokeStyle = `rgba(59, 130, 246, ${0.12 + Math.sin(time * 3) * 0.05})`;
          ctx.lineWidth = 1;
          ctx.stroke();
        }

        // Randomly activate lines
        if (!line.active && Math.random() < 0.0005) {
          line.active = true;
          line.progress = 0;
        }
      }

      // Draw nodes
      for (const node of nodes) {
        const glow = 0.15 + Math.sin(node.pulse) * 0.1;

        // Outer glow
        const gradient = ctx.createRadialGradient(
          node.x, node.y, 0,
          node.x, node.y, node.radius * 4,
        );
        gradient.addColorStop(0, `rgba(59, 130, 246, ${glow})`);
        gradient.addColorStop(1, 'rgba(59, 130, 246, 0)');
        ctx.beginPath();
        ctx.arc(node.x, node.y, node.radius * 4, 0, Math.PI * 2);
        ctx.fillStyle = gradient;
        ctx.fill();

        // Core
        ctx.beginPath();
        ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(148, 163, 184, ${0.3 + Math.sin(node.pulse) * 0.15})`;
        ctx.fill();
      }

      animationId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0"
      style={{ opacity: 0.7 }}
    />
  );
}
