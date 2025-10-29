import { Socket } from 'socket.io-client';

export enum WebsocketConnectionStatusEnum {
  NOT_INITIALIZED = 'not_initialized',
  PENDING = 'pending',
  COMPLETED = 'completed'
}

export const WEBSOCKET_TIMEOUT = 6000;
export const WEBSOCKET_RECONNECTION_ATTEMPTS = 3;
export const WEBSOCKET_RETRY_INTERVAL = 500;
export const WEBSOCKET_MESSAGE_DELAY = 1000;

export const websocketConnection: {
  instance: Socket | null;
  // Use the connection status to avoid multiple websocket connections
  status: WebsocketConnectionStatusEnum;
} = {
  instance: null,
  status: WebsocketConnectionStatusEnum.NOT_INITIALIZED
};

export const websocketSubscriptions = new Set();
export const websocketPendingSubscriptions = new Set();
export const websocketActiveSubscriptions = new Set();
