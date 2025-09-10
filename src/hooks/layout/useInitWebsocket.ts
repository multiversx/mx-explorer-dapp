import { useEffect } from 'react';
import { registerWebsocketListener } from 'helpers/websocket/registerWebsocket';

export const useInitWebsocket = () => {
  useEffect(() => {
    registerWebsocketListener();
  }, []);
};
