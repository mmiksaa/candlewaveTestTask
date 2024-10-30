import React, { useEffect } from 'react';
import { createChart, CandlestickData, SolidColor } from 'lightweight-charts';

interface ChartProps {
  chartRef: React.RefObject<HTMLDivElement | null>;
  data: CandlestickData[];
}

const Chart: React.FC<ChartProps> = ({ chartRef, data }) => {
  useEffect(() => {
    if (!chartRef.current) return;

    // Настройки графика
    const chartOptions = {
      layout: {
        textColor: 'black',
        background: {
          // Указываем тип SolidColor
          type: 'solid',
          color: 'white',
        } as SolidColor,
      },
    };

    const chart = createChart(chartRef.current, chartOptions);

    const candlestickSeries = chart.addCandlestickSeries({
      upColor: '#26a69a',
      downColor: '#ef5350',
      borderVisible: false,
      wickUpColor: '#26a69a',
      wickDownColor: '#ef5350',
    });

    candlestickSeries.setData(data);

    chart.timeScale().fitContent();

    return () => {
      chart.remove();
    };
  }, [chartRef, data]);

  return null; // null, потому-что ничего не рендерим
};

export default Chart;
