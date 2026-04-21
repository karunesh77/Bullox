import { useEffect, useRef, useState } from 'react';
import {
  createChart,
  CandlestickSeries,
  HistogramSeries,
  ColorType,
  CrosshairMode,
  type IChartApi,
  type ISeriesApi,
  type CandlestickData,
  type HistogramData,
  type Time,
} from 'lightweight-charts';

interface Candle {
  time: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume?: number;
}

interface CandleChartProps {
  candles: Candle[];
  symbol: string;
}

export default function CandleChart({ candles, symbol }: CandleChartProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const chartRef     = useRef<IChartApi | null>(null);
  const candleRef    = useRef<ISeriesApi<'Candlestick'> | null>(null);
  const volumeRef    = useRef<ISeriesApi<'Histogram'> | null>(null);
  const [crosshairData, setCrosshairData] = useState<CandlestickData<Time> | null>(null);

  useEffect(() => {
    if (!containerRef.current || candles.length === 0) return;

    // Clean up previous chart
    if (chartRef.current) {
      chartRef.current.remove();
      chartRef.current = null;
    }

    const chart = createChart(containerRef.current, {
      layout: {
        background: { type: ColorType.Solid, color: 'transparent' },
        textColor: '#6b7280',
        fontSize: 11,
        fontFamily: "'Inter', system-ui, sans-serif",
      },
      grid: {
        vertLines: { color: '#1f2937' },
        horzLines: { color: '#1f2937' },
      },
      crosshair: {
        mode: CrosshairMode.Normal,
        vertLine: { color: '#4b5563', labelBackgroundColor: '#374151' },
        horzLine: { color: '#4b5563', labelBackgroundColor: '#374151' },
      },
      rightPriceScale: {
        borderColor: '#1f2937',
        textColor: '#6b7280',
      },
      timeScale: {
        borderColor: '#1f2937',
        timeVisible: true,
        secondsVisible: false,
      },
      width:  containerRef.current.clientWidth,
      height: containerRef.current.clientHeight,
    });

    // Candlestick series
    const candleSeries = chart.addSeries(CandlestickSeries, {
      upColor:          '#22c55e',
      downColor:        '#ef4444',
      borderUpColor:    '#22c55e',
      borderDownColor:  '#ef4444',
      wickUpColor:      '#22c55e',
      wickDownColor:    '#ef4444',
    });

    // Volume histogram
    const volumeSeries = chart.addSeries(HistogramSeries, {
      priceFormat:    { type: 'volume' },
      priceScaleId:   'volume',
    });

    chart.priceScale('volume').applyOptions({
      scaleMargins: { top: 0.85, bottom: 0 },
    });

    // Set data
    const candleData: CandlestickData<Time>[] = candles.map(c => ({
      time:  c.time as Time,
      open:  c.open,
      high:  c.high,
      low:   c.low,
      close: c.close,
    }));

    const volumeData: HistogramData<Time>[] = candles.map(c => ({
      time:  c.time as Time,
      value: c.volume ?? 0,
      color: c.close >= c.open ? '#22c55e30' : '#ef444430',
    }));

    candleSeries.setData(candleData);
    volumeSeries.setData(volumeData);
    chart.timeScale().fitContent();

    // Crosshair tooltip
    chart.subscribeCrosshairMove((param) => {
      if (param.seriesData.has(candleSeries)) {
        const d = param.seriesData.get(candleSeries) as CandlestickData<Time>;
        setCrosshairData(d ?? null);
      } else {
        setCrosshairData(null);
      }
    });

    // Resize observer
    const ro = new ResizeObserver(() => {
      if (containerRef.current) {
        chart.applyOptions({ width: containerRef.current.clientWidth });
      }
    });
    if (containerRef.current) ro.observe(containerRef.current);

    chartRef.current  = chart;
    candleRef.current = candleSeries;
    volumeRef.current = volumeSeries;

    return () => {
      ro.disconnect();
      chart.remove();
      chartRef.current = null;
    };
  }, [candles]);

  // Update data when candles change (live)
  useEffect(() => {
    if (!candleRef.current || !volumeRef.current || candles.length === 0) return;
    const last = candles[candles.length - 1];
    candleRef.current.update({ time: last.time as Time, open: last.open, high: last.high, low: last.low, close: last.close });
    volumeRef.current.update({ time: last.time as Time, value: last.volume ?? 0, color: last.close >= last.open ? '#22c55e30' : '#ef444430' });
  }, [candles]);

  const fmt = (n: number) => n >= 1000 ? n.toLocaleString('en-IN', { maximumFractionDigits: 2 }) : n.toFixed(2);
  const d = crosshairData;
  const isUp = d ? d.close >= d.open : true;

  return (
    <div className="w-full h-full flex flex-col">
      {/* OHLC tooltip bar */}
      <div className="flex items-center gap-4 px-4 py-2 text-xs border-b border-gray-800 flex-wrap min-h-[36px]">
        <span className="font-mono font-semibold text-gray-400">{symbol}</span>
        {d ? (
          <>
            <span className="text-gray-500">O <span className="text-white">{fmt(d.open)}</span></span>
            <span className="text-gray-500">H <span className="text-green-400">{fmt(d.high)}</span></span>
            <span className="text-gray-500">L <span className="text-red-400">{fmt(d.low)}</span></span>
            <span className="text-gray-500">C <span className={isUp ? 'text-green-400' : 'text-red-400'}>{fmt(d.close)}</span></span>
            <span className={isUp ? 'text-green-400' : 'text-red-400'}>
              {isUp ? '+' : ''}{(d.close - d.open).toFixed(2)} ({(((d.close - d.open) / d.open) * 100).toFixed(2)}%)
            </span>
          </>
        ) : (
          <span className="text-gray-600">Hover over chart to see OHLC</span>
        )}
      </div>

      {/* Chart container */}
      <div ref={containerRef} className="flex-1 w-full" />
    </div>
  );
}
