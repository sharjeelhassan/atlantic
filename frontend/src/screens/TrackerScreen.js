import socketIOClient from 'socket.io-client';
import React, { useEffect, useState } from 'react';

const ENDPOINT =
  window.location.host.indexOf('localhost') >= 0
    ? 'http://127.0.0.1:5000'
    : window.location.host;

const TrackerScreen = () => {
  const [socket, setSocket] = useState(null);
  const [data, setData] = useState();

  useEffect(() => {
    if (!socket) {
      const sk = socketIOClient(ENDPOINT);
      setSocket(sk);
      sk.on('gpsCoordsToAdmin', (userGPSInfo) => {
        setData(userGPSInfo);
      });
    }
  }, [socket]);

  return (
    <div>
      <h1>Live Location Tracking</h1>
      <h1>{JSON.stringify(data)}</h1>
    </div>
  );
};

export default TrackerScreen;
