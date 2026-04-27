import { useEffect, useRef } from "react";

export default function Bull3D() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = 280;
    canvas.height = 280;

    let rotation = 0;
    const animate = () => {
      // Clear canvas
      ctx.fillStyle = "#0a0f1a";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Save context
      ctx.save();

      // Translate to center
      ctx.translate(canvas.width / 2, canvas.height / 2);
      ctx.rotate((rotation * Math.PI) / 180);

      // Draw bull wireframe with glow
      ctx.strokeStyle = "#3B82F6";
      ctx.lineWidth = 1.5;
      ctx.shadowColor = "#3B82F6";
      ctx.shadowBlur = 10;

      // Bull body (simplified)
      ctx.beginPath();
      ctx.ellipse(0, 0, 50, 35, 0, 0, Math.PI * 2);
      ctx.stroke();

      // Horns
      ctx.beginPath();
      ctx.moveTo(-25, -30);
      ctx.lineTo(-40, -50);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(25, -30);
      ctx.lineTo(40, -50);
      ctx.stroke();

      // Head
      ctx.beginPath();
      ctx.ellipse(0, -40, 20, 25, 0, 0, Math.PI * 2);
      ctx.stroke();

      // Legs
      for (let i = -1; i <= 1; i += 1) {
        ctx.beginPath();
        ctx.moveTo(i * 25, 35);
        ctx.lineTo(i * 25, 65);
        ctx.stroke();
      }

      // Purple glow top
      ctx.strokeStyle = "#8B5CF6";
      ctx.lineWidth = 0.5;
      ctx.shadowColor = "#8B5CF6";
      ctx.shadowBlur = 5;

      ctx.beginPath();
      ctx.ellipse(0, -35, 55, 40, 0, 0, Math.PI * 2);
      ctx.stroke();

      ctx.restore();

      rotation += 1;
      requestAnimationFrame(animate);
    };

    animate();
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="w-full h-full"
      style={{ filter: "drop-shadow(0 0 20px rgba(139, 92, 246, 0.5))" }}
    />
  );
}

