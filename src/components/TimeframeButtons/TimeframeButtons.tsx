import React from 'react';
import './TimeframeButtons.css';

interface TimeframeButtonsProps {
  onChange: (interval: string) => void;
  btcPrice: number | null;
}

const TimeframeButtons: React.FC<TimeframeButtonsProps> = ({ onChange, btcPrice }) => {
  return (
    <div className='btns'>
      <button onClick={() => onChange('1h')}>1 Hour</button>
      <button onClick={() => onChange('1d')}>1 Day</button>
      <button onClick={() => onChange('1w')}>1 Week</button>
      {btcPrice !== null && <span className='price'>BTC/USDT: ${btcPrice.toFixed(2)}</span>}
    </div>
  );
};

export default TimeframeButtons;
