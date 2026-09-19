import { useEffect } from 'react';
import { useSelector } from 'react-redux';

import { isUpdatesWebsocketActive } from 'helpers';
import { registerWebsocketListener } from 'helpers/websocket/registerWebsocket';
import { useFetchWebsocketConfig } from 'hooks/fetch';
import { activeNetworkSelector } from 'redux/selectors';

export const useInitWebsocket = () => {
  const { updatesWebsocketUrl, hasWebsocket } = useSelector(
    activeNetworkSelector
  );
  const fetchWebsocketConfig = useFetchWebsocketConfig();
  const isWebsocketActive = isUpdatesWebsocketActive();

  const configWebsocket = async () => {
    if (updatesWebsocketUrl) {
      await registerWebsocketListener(updatesWebsocketUrl);
      return;
    }

    await fetchWebsocketConfig();
  };

  useEffect(() => {
    if (isWebsocketActive || hasWebsocket === false) {
      return;
    }

    configWebsocket();
  }, [updatesWebsocketUrl, hasWebsocket, isWebsocketActive]);
};
