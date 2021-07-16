import React, { useEffect, useState } from 'react';
import socketIOClient from 'socket.io-client';
import Chart from 'react-google-charts';

const ENDPOINT =
  window.location.host.indexOf('localhost') >= 0
    ? 'http://127.0.0.1:5000'
    : window.location.host;

const KPIScreen = () => {
  const [data, setData] = useState([]);
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    if (!socket) {
      const sk = socketIOClient(ENDPOINT);
      setSocket(sk);
      sk.on('cpu', (cpuPercent) => {
        setData(cpuPercent);
      });
    }
  }, [socket]);

  return (
    <div>
      <h1>Key Performance Indicator</h1>
      <h1>{data}</h1>
      <Chart
        width={1200}
        height={720}
        chartType='Gauge'
        loader={<div>Loading Chart</div>}
        data={[
            ['Label', 'Value'],
            ['Memory', data*70],
            ['CPU', data*120],
            ['Network', data*200],
          ]}
        options={{
          redFrom: 90,
          redTo: 100,
          yellowFrom: 75,
          yellowTo: 90,
          minorTicks: 5,
        }}
        rootProps={{ 'data-testid': '1' }}
      />
    </div>
  );
};

export default KPIScreen;
