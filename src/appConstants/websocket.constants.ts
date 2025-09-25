import { Socket } from 'socket.io-client';
import { WebsocketSubcriptionsEnum } from 'types';

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
  subscriptions: WebsocketSubcriptionsEnum[];
  activeSubscriptions: WebsocketSubcriptionsEnum[];
  // Use the connection status to avoid multiple websocket connections
  status: WebsocketConnectionStatusEnum;
} = {
  instance: null,
  subscriptions: [],
  activeSubscriptions: [],
  status: WebsocketConnectionStatusEnum.NOT_INITIALIZED
};
