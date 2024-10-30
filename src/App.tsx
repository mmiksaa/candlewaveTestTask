import React, { useRef, useState, useEffect } from 'react';
import './App.css';
import Chart from './components/Chart';
import TimeframeButtons from './components/TimeframeButtons/TimeframeButtons';
import useFetchData from './hooks/useFetchData';

const App: React.FC = () => {
  const chartRef = useRef<HTMLDivElement>(null);
  const [interval, setInterval] = useState<string>('1h');
  const { data, btcPrice, fetchCandleData, fetchBtcPrice } = useFetchData(interval);

  useEffect(() => {
    fetchCandleData();
    fetchBtcPrice();

    //использовал window. потому-что ts ругается на два аргумента, хотя setInterval всегда принимает два аргумента
    const intervalId = window.setInterval(() => {
      fetchCandleData();
      fetchBtcPrice();
    }, 1000);

    return () => {
      clearInterval(intervalId as unknown as number);
    };
  }, [interval]);

  return (
    <div className='chart'>
      <TimeframeButtons onChange={setInterval} btcPrice={btcPrice} />
      <div ref={chartRef} className='container'>
        <Chart chartRef={chartRef} data={data} />
      </div>
    </div>
  );
};

export default App;
