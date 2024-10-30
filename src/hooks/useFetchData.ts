import { useState } from 'react';
import axios from 'axios';
import { CandlestickData } from 'lightweight-charts';

const useFetchData = (interval: string) => {
  const [data, setData] = useState<CandlestickData[]>([]);
  const [btcPrice, setBtcPrice] = useState<number | null>(null);

  const fetchCandleData = async () => {
    try {
      const response = await axios.get('https://api.binance.com/api/v3/klines', {
        params: {
          symbol: 'BTCUSDT',
          interval: interval,
          limit: 100,
        },
      });

      //any потому-что приходит огромный массив данных, который нужно типизировать в отдельном файле.
      const candles = response.data.map((candle: any) => ({
        time: candle[0] / 1000,
        open: parseFloat(candle[1]),
        high: parseFloat(candle[2]),
        low: parseFloat(candle[3]),
        close: parseFloat(candle[4]),
      }));

      setData(candles);
    } catch (error) {
      console.error('Error fetching candle data:', error);
    }
  };

  const fetchBtcPrice = async () => {
    try {
      const response = await axios.get('https://api.binance.com/api/v3/ticker/price', {
        params: {
          symbol: 'BTCUSDT',
        },
      });
      setBtcPrice(parseFloat(response.data.price));
    } catch (error) {
      console.error('Error fetching BTC price:', error);
    }
  };

  return { data, btcPrice, fetchCandleData, fetchBtcPrice };
};

export default useFetchData;
