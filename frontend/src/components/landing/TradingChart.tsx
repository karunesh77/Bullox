import { useEffect, useRef } from "react";

export default function TradingChart() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = 300;
    canvas.height = 180;

    // Generate candlestick data
    const generateCandles = () => {
      const candles = [];
      let price = 66000;
      for (let i = 0; i < 25; i++) {
        const change = (Math.random() - 0.4) * 500;
        const open = price;
        const close = price + change;
        const high = Math.max(open, close) + Math.random() * 300;
        const low = Math.min(open, close) - Math.random() * 300;
        candles.push({ open, close, high, low });
        price = close;
      }
      return candles;
    };

    const candles = generateCandles();
    const minPrice = Math.min(...candles.map(c => c.low));
    const maxPrice = Math.max(...candles.map(c => c.high));
    const range = maxPrice - minPrice;

    // Draw candles
    const candleWidth = canvas.width / candles.length;
    const padding = 20;

    candles.forEach((candle, idx) => {
      const x = idx * candleWidth + candleWidth / 2;
      const yHigh = padding + ((maxPrice - candle.high) / range) * (canvas.height - padding * 2);
      const yLow = padding + ((maxPrice - candle.low) / range) * (canvas.height - padding * 2);
      const yOpen = padding + ((maxPrice - candle.open) / range) * (canvas.height - padding * 2);
      const yClose = padding + ((maxPrice - candle.close) / range) * (canvas.height - padding * 2);

      const color = candle.close >= candle.open ? "#22C55E" : "#EF4444";

      // Wick
      ctx.strokeStyle = color;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(x, yHigh);
      ctx.lineTo(x, yLow);
      ctx.stroke();

      // Body
      ctx.fillStyle = color;
      const bodyTop = Math.min(yOpen, yClose);
      const bodyHeight = Math.abs(yClose - yOpen);
      ctx.fillRect(x - candleWidth / 3, bodyTop, (candleWidth / 3) * 2, Math.max(bodyHeight, 1));
    });

    // Add grid lines
    ctx.strokeStyle = "rgba(255, 255, 255, 0.05)";
    ctx.lineWidth = 1;
    for (let i = 0; i <= 4; i++) {
      const y = (canvas.height / 4) * i;
      ctx.beginPath();
      ctx.moveTo(padding, y);
      ctx.lineTo(canvas.width - padding, y);
      ctx.stroke();
    }
  }, []);

  return <canvas ref={canvasRef} className="w-full h-full" />;
}

