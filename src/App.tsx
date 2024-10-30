import React, { useRef, useState, useEffect } from 'react';
import './App.css';
import Chart from './components/Chart';
import TimeframeButtons from './components/TimeframeButtons/TimeframeButtons';
import useApiData from './hooks/useApiData';

const App: React.FC = () => {
  const chartRef = useRef<HTMLDivElement>(null);
  const [interval, setInterval] = useState<string>('1h');
  const { data, btcPrice, fetchAndConnect, socketRef } = useApiData(interval);

  useEffect(() => {
    fetchAndConnect();

    return () => {
      if (socketRef.current) {
        socketRef.current.close();
      }
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
