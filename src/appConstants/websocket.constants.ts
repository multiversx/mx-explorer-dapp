import { Socket } from 'socket.io-client';
import { WebsocketSubcriptionsEnum } from 'types';

export enum WebsocketConnectionStatusEnum {
  NOT_INITIALIZED = 'not_initialized',
  PENDING = 'pending',
  COMPLETED = 'completed'
}

export const websocketConnection: {
  instance: Socket | null;
  subscriptions: WebsocketSubcriptionsEnum[];
  // Use the connection status to avoid multiple websocket connections
  status: WebsocketConnectionStatusEnum;
} = {
  instance: null,
  subscriptions: [],
  status: WebsocketConnectionStatusEnum.NOT_INITIALIZED
};
