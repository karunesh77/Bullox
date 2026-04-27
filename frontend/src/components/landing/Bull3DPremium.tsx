import { useEffect, useRef } from "react";

export default function Bull3DPremium() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = 320;
    canvas.height = 320;

    let rotation = 0;

    const drawBull = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      ctx.save();
      ctx.translate(canvas.width / 2, canvas.height / 2 - 20);
      ctx.rotate((rotation * Math.PI) / 180);

      // Glow effect (multiple layers for intensity)
      for (let i = 3; i > 0; i--) {
        ctx.strokeStyle = `rgba(59, 130, 246, ${0.3 / i})`;
        ctx.lineWidth = 3 + i * 2;
        ctx.shadowColor = "rgba(59, 130, 246, 0.5)";
        ctx.shadowBlur = 20;

        // Body
        ctx.beginPath();
        ctx.ellipse(0, 0, 60, 45, 0, 0, Math.PI * 2);
        ctx.stroke();
      }

      // Main wireframe
      ctx.strokeStyle = "#3B82F6";
      ctx.lineWidth = 2;
      ctx.shadowColor = "#3B82F6";
      ctx.shadowBlur = 15;
      ctx.globalAlpha = 0.9;

      // Body (main)
      ctx.beginPath();
      ctx.ellipse(0, 0, 60, 45, 0, 0, Math.PI * 2);
      ctx.stroke();

      // Chest
      ctx.beginPath();
      ctx.ellipse(0, -15, 50, 35, 0, 0, Math.PI * 2);
      ctx.stroke();

      // Head
      ctx.beginPath();
      ctx.ellipse(0, -55, 25, 30, 0, 0, Math.PI * 2);
      ctx.stroke();

      // Left Horn
      ctx.beginPath();
      ctx.moveTo(-15, -75);
      ctx.quadraticCurveTo(-30, -95, -35, -110);
      ctx.stroke();

      // Right Horn
      ctx.beginPath();
      ctx.moveTo(15, -75);
      ctx.quadraticCurveTo(30, -95, 35, -110);
      ctx.stroke();

      // Front legs
      ctx.beginPath();
      ctx.moveTo(-20, 40);
      ctx.lineTo(-20, 80);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(20, 40);
      ctx.lineTo(20, 80);
      ctx.stroke();

      // Back legs
      ctx.beginPath();
      ctx.moveTo(-40, 35);
      ctx.lineTo(-40, 75);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(40, 35);
      ctx.lineTo(40, 75);
      ctx.stroke();

      // Tail
      ctx.beginPath();
      ctx.moveTo(50, 5);
      ctx.quadraticCurveTo(70, -20, 75, -40);
      ctx.stroke();

      // Horns accent (purple glow)
      ctx.strokeStyle = "#8B5CF6";
      ctx.lineWidth = 1;
      ctx.globalAlpha = 0.6;

      ctx.beginPath();
      ctx.moveTo(-15, -75);
      ctx.quadraticCurveTo(-30, -95, -35, -110);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(15, -75);
      ctx.quadraticCurveTo(30, -95, 35, -110);
      ctx.stroke();

      ctx.restore();
    };

    const animate = () => {
      drawBull();
      rotation += 1.5;
      requestAnimationFrame(animate);
    };

    animate();
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="w-full h-full"
      style={{
        filter: "drop-shadow(0 0 30px rgba(139, 92, 246, 0.6)) drop-shadow(0 0 60px rgba(59, 130, 246, 0.4))",
      }}
    />
  );
}

