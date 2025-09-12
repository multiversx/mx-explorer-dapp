import {
  websocketConnection,
  WebsocketConnectionStatusEnum
} from 'appConstants';

export const isUpdatesWebsocketConnected = () => {
  return (
    websocketConnection.status ===
      WebsocketConnectionStatusEnum.NOT_INITIALIZED &&
    !websocketConnection.instance?.active
  );
};
