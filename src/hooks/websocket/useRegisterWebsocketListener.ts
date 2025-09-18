import { useEffect } from 'react';

import { websocketConnection } from 'appConstants';
import { useInitWebsocket } from 'hooks/layout';
import { WebsocketEventsEnum, WebsocketSubcriptionsEnum } from 'types';

export interface RegisterWebsocketListenerType {
  onEvent: (response: any) => void;
  subscription?: WebsocketSubcriptionsEnum;
  event?: WebsocketEventsEnum;
  config?: Record<string, any>;
}

export function useRegisterWebsocketListener({
  subscription,
  event,
  config,
  onEvent
}: RegisterWebsocketListenerType) {
  useInitWebsocket();

  useEffect(() => {
    if (!subscription || !event || !config) {
      return;
    }

    const websocket = websocketConnection.instance;
    if (!websocket || !websocket?.active) {
      return;
    }

    websocket.emit(subscription, config, (response: any) => {
      console.log(
        `Emit subscription ${subscription} with options`,
        config,
        response
      );
    });

    websocket.on(event, (response: any) => {
      console.log(`Client ${event}:`, response);
      onEvent(response);
    });

    return () => {
      websocket?.off(event);
    };
  }, [websocketConnection]);
}
