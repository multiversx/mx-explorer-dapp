import {
  websocketConnection,
  WebsocketConnectionStatusEnum
} from 'appConstants';

export const isUpdatesWebsocketActive = () => {
  return (
    websocketConnection.instance?.active &&
    websocketConnection.status === WebsocketConnectionStatusEnum.COMPLETED
  );
};
