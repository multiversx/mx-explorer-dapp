import { useEffect } from 'react';
import { useSelector } from 'react-redux';

import { initializeWebsocketConnection } from 'helpers/websocket/initializeWebsocketConnection';
import { useHasWebsocketUrl } from 'hooks/websocket';
import { activeNetworkSelector } from 'redux/selectors';

export const useInitWebsocket = () => {
  const { updatesWebsocketUrl } = useSelector(activeNetworkSelector);
  const hasWebsocketUrl = useHasWebsocketUrl();

  useEffect(() => {
    if (!hasWebsocketUrl || !updatesWebsocketUrl) {
      return;
    }

    initializeWebsocketConnection(updatesWebsocketUrl);
  }, [hasWebsocketUrl]);
};
