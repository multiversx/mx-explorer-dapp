import { io } from 'socket.io-client';

import {
  WEBSOCKET_RECONNECTION_ATTEMPTS,
  WEBSOCKET_RETRY_INTERVAL,
  WEBSOCKET_TIMEOUT,
  WebsocketConnectionStatusEnum,
  websocketActiveSubscriptions,
  websocketConnection,
  websocketEventListeners,
  websocketPendingSubscriptions,
  websocketSubscriptions
} from 'appConstants';
import { isUpdatesWebsocketInactive } from 'helpers';
import { WebsocketEventsEnum } from 'types';

import { websocketStatusStore } from './websocketStatusStore';

export async function initializeWebsocketConnection(websocketUrl: string) {
  const isWebsocketInactive = isUpdatesWebsocketInactive();

  // Update socket status in store for status subscription
  const updateSocketStatus = (status: WebsocketConnectionStatusEnum) => {
    websocketStatusStore.setStatus(status);
    console.info('Websocket Status:', status);
  };

  const resetSubscriptions = () => {
    websocketSubscriptions.clear();
    websocketPendingSubscriptions.clear();
    websocketActiveSubscriptions.clear();

    websocketEventListeners.forEach(({ event, handler }) => {
      websocketConnection.instance?.off(event, handler);
    });
    websocketEventListeners.clear();
  };

  const closeConnection = () => {
    const instance = websocketConnection.instance;
    if (instance) {
      instance.off(WebsocketEventsEnum.connect);
      instance.off(WebsocketEventsEnum.connect_error);
      instance.off(WebsocketEventsEnum.disconnect);
      resetSubscriptions();
      instance.close();
      console.info('Websocket Disconnected.');
    }

    updateSocketStatus(WebsocketConnectionStatusEnum.NOT_INITIALIZED);
    websocketConnection.instance = null;
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
        resetSubscriptions();
        updateSocketStatus(WebsocketConnectionStatusEnum.PENDING);
      }
    );

    websocketConnection.instance.on(
      WebsocketEventsEnum.disconnect,
      (reason) => {
        console.info('Websocket Disconnected:', reason);
        resetSubscriptions();
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
