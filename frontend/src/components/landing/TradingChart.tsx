import { useEffect, useRef } from "react";

export default function TradingChart() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width;
    canvas.height = rect.height;

    // Generate candlestick data
    const generateCandles = () => {
      const candles = [];
      let price = 66000;
      for (let i = 0; i < 35; i++) {
        const change = (Math.random() - 0.3) * 800;
        const open = price;
        const close = price + change;
        const high = Math.max(open, close) + Math.random() * 500;
        const low = Math.min(open, close) - Math.random() * 500;
        candles.push({ open, close, high, low });
        price = close;
      }
      return candles;
    };

    const candles = generateCandles();
    const minPrice = Math.min(...candles.map(c => c.low));
    const maxPrice = Math.max(...candles.map(c => c.high));
    const range = maxPrice - minPrice;

    // Draw background
    ctx.fillStyle = "transparent";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Add grid lines
    ctx.strokeStyle = "rgba(59, 130, 246, 0.08)";
    ctx.lineWidth = 1;
    const padding = 25;
    for (let i = 0; i <= 5; i++) {
      const y = padding + ((canvas.height - padding * 2) / 5) * i;
      ctx.beginPath();
      ctx.moveTo(padding, y);
      ctx.lineTo(canvas.width - padding, y);
      ctx.stroke();
    }

    // Draw candles with glow
    const candleWidth = (canvas.width - padding * 2) / candles.length;

    candles.forEach((candle, idx) => {
      const x = padding + idx * candleWidth + candleWidth / 2;
      const yHigh = padding + ((maxPrice - candle.high) / range) * (canvas.height - padding * 2);
      const yLow = padding + ((maxPrice - candle.low) / range) * (canvas.height - padding * 2);
      const yOpen = padding + ((maxPrice - candle.open) / range) * (canvas.height - padding * 2);
      const yClose = padding + ((maxPrice - candle.close) / range) * (canvas.height - padding * 2);

      const isGreen = candle.close >= candle.open;
      const color = isGreen ? "#22C55E" : "#EF4444";
      const glowColor = isGreen ? "rgba(34, 197, 94, 0.3)" : "rgba(239, 68, 68, 0.3)";

      // Glow effect
      ctx.shadowColor = glowColor;
      ctx.shadowBlur = 8;

      // Wick
      ctx.strokeStyle = color;
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(x, yHigh);
      ctx.lineTo(x, yLow);
      ctx.stroke();

      // Body
      ctx.shadowColor = glowColor;
      ctx.shadowBlur = 10;
      ctx.fillStyle = color;
      const bodyTop = Math.min(yOpen, yClose);
      const bodyHeight = Math.abs(yClose - yOpen);
      const bodyWidth = Math.max(candleWidth * 0.6, 2);
      ctx.fillRect(x - bodyWidth / 2, bodyTop, bodyWidth, Math.max(bodyHeight, 2));

      // Reset shadow
      ctx.shadowColor = "transparent";
      ctx.shadowBlur = 0;
    });

    // Draw smooth volume area below
    ctx.fillStyle = "rgba(59, 130, 246, 0.05)";
    ctx.fillRect(0, canvas.height * 0.85, canvas.width, canvas.height * 0.15);

  }, []);

  return <canvas ref={canvasRef} className="w-full h-full" />;
}

