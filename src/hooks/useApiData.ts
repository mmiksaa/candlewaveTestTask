import { useRef, useState } from 'react';
import axios from 'axios';
import { CandlestickData, Time } from 'lightweight-charts';

type bncData = [number, string, string, string, string];

const useApiData = (interval: string) => {
  const [data, setData] = useState<CandlestickData[]>([]);
  const [btcPrice, setBtcPrice] = useState<number | null>(null);
  const socketRef = useRef<WebSocket | null>(null); // Хранение WebSocket подключения

  const createCandle = (candle: bncData): CandlestickData => {
    return {
      time: (candle[0] / 1000) as Time,
      open: parseFloat(candle[1]),
      high: parseFloat(candle[2]),
      low: parseFloat(candle[3]),
      close: parseFloat(candle[4]),
    };
  };

  const fetchCandleData = async () => {
    try {
      const response = await axios.get('https://api.binance.com/api/v3/klines', {
        params: {
          symbol: 'BTCUSDT',
          interval: interval,
          limit: 100,
        },
      });

      const candles = response.data.map((candle: bncData) =>
        createCandle([candle[0], candle[1], candle[2], candle[3], candle[4]]),
      );

      setData(candles);
    } catch (error) {
      console.error('error: ', error);
    }
  };

  const connectToSocket = () => {
    socketRef.current = new WebSocket(`wss://stream.binance.com:9443/ws/btcusdt@kline_${interval}`);

    socketRef.current.onmessage = (event) => {
      const message = JSON.parse(event.data);
      const candle = message.k;

      const newCandle = createCandle([candle.t, candle.o, candle.h, candle.l, candle.c]);

      //обновляем последнюю свечу с помощью web sockets
      setData((prevData) => {
        const lastCandle = prevData[prevData.length - 1];
        if (lastCandle) {
          return [
            ...prevData.slice(0, prevData.length - 1),
            {
              ...lastCandle,
              high: Math.max(lastCandle.high, newCandle.high),
              low: Math.min(lastCandle.low, newCandle.low),
              close: newCandle.close,
            },
          ];
        } else {
          return prevData;
        }
      });

      setBtcPrice(parseFloat(candle.c));
    };

    socketRef.current.onclose = () => {
      setTimeout(connectToSocket, 1000);
    };

    socketRef.current.onerror = (error) => {
      console.error('error: ', error);
    };
  };

  const fetchAndConnect = async () => {
    await fetchCandleData();
    connectToSocket();
  };

  return { data, btcPrice, fetchAndConnect, socketRef };
};

export default useApiData;
