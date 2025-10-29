import {
  websocketConnection,
  WebsocketConnectionStatusEnum
} from 'appConstants';

export const isUpdatesWebsocketInactive = () => {
  return (
    websocketConnection.status ===
      WebsocketConnectionStatusEnum.NOT_INITIALIZED &&
    !websocketConnection.instance?.active
  );
};
