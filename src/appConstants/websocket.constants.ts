import { Socket } from 'socket.io-client';

export enum WebsocketConnectionStatusEnum {
  NOT_INITIALIZED = 'not_initialized',
  PENDING = 'pending',
  COMPLETED = 'completed'
}

export const websocketConnection: {
  instance: Socket | null;
  // Use the connection status to avoid multiple websocket connections
  status: WebsocketConnectionStatusEnum;
} = {
  instance: null,
  status: WebsocketConnectionStatusEnum.NOT_INITIALIZED
};

export const initialWebsocketClientConfigs = [
  {
    transactions: { from: 0, size: 5 },
    blocks: { from: 0, size: 5 },
    pool: { from: 0, size: 5 },
    stats: true,
    events: { shard: 0, from: 0, size: 3 }
  }
];
