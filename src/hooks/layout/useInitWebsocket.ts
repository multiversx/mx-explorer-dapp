import { useEffect } from 'react';
import { initializeWebsocketConnection } from 'helpers/websocket/initializeWebsocketConnection';
import { useHasWebsocketUrl } from 'hooks/websocket';

export const useInitWebsocket = () => {
  const hasWebsocketUrl = useHasWebsocketUrl();

  useEffect(() => {
    if (!hasWebsocketUrl) {
      return;
    }

    initializeWebsocketConnection();
  }, [hasWebsocketUrl]);
};
