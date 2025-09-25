import { io } from 'socket.io-client';

import {
  WEBSOCKET_MESSAGE_DELAY,
  WEBSOCKET_RECONNECTION_ATTEMPTS,
  WEBSOCKET_RETRY_INTERVAL,
  WEBSOCKET_TIMEOUT,
  WebsocketConnectionStatusEnum,
  websocketConnection
} from 'appConstants';
import { isUpdatesWebsocketInactive } from 'helpers';
import { WebsocketEventsEnum } from 'types';

type TimeoutType = ReturnType<typeof setTimeout> | null;

export async function initializeWebsocketConnection(websocketUrl: string) {
  let messageTimeout: TimeoutType = null;
  const isWebsocketInactive = isUpdatesWebsocketInactive();

  // Update socket status in store for status subscription
  const updateSocketStatus = (status: WebsocketConnectionStatusEnum) => {
    websocketConnection.status = status;
    console.info('Websocket Status:', status);
  };

  const handleMessageReceived = (message: string) => {
    if (messageTimeout) {
      clearTimeout(messageTimeout);
    }
    messageTimeout = setTimeout(() => {
      console.info('Websocket Message:', message);
    }, WEBSOCKET_MESSAGE_DELAY);
  };

  const closeConnection = () => {
    const instance = websocketConnection.instance;
    if (instance) {
      instance.off(WebsocketEventsEnum.connect);
      instance.off(WebsocketEventsEnum.connect_error);
      instance.off(WebsocketEventsEnum.disconnect);
      instance.close();
      console.info('Websocket Disconnected.');
    }

    updateSocketStatus(WebsocketConnectionStatusEnum.NOT_INITIALIZED);
    websocketConnection.instance = null;

    if (messageTimeout) {
      clearTimeout(messageTimeout);
    }
  };

  const initializeConnection = async () => {
    updateSocketStatus(WebsocketConnectionStatusEnum.PENDING);

    if (!websocketUrl) {
      updateSocketStatus(WebsocketConnectionStatusEnum.NOT_INITIALIZED);
      return;
    }

    websocketConnection.instance = io(websocketUrl, {
      forceNew: true,
      reconnection: true,
      reconnectionAttempts: WEBSOCKET_RECONNECTION_ATTEMPTS,
      reconnectionDelay: WEBSOCKET_RETRY_INTERVAL,
      timeout: WEBSOCKET_TIMEOUT,
      path: '/ws/subscription',
      transports: ['websocket']
    });

    // websocketConnection.instance.onAny(handleMessageReceived);

    websocketConnection.instance.on(WebsocketEventsEnum.connect, () => {
      console.info('Websocket Connected.');
      updateSocketStatus(WebsocketConnectionStatusEnum.COMPLETED);
    });

    websocketConnection.instance.on(
      WebsocketEventsEnum.connect_error,
      (error) => {
        console.warn('Websocket Connect Error:', error.message);
      }
    );

    websocketConnection.instance.on(
      WebsocketEventsEnum.disconnect,
      (reason) => {
        console.info('Websocket Disconnected:', reason);
        updateSocketStatus(WebsocketConnectionStatusEnum.PENDING);
      }
    );
  };

  if (isWebsocketInactive) {
    await initializeConnection();
  }

  return {
    closeConnection
  };
}
