import {
  websocketConnection,
  WebsocketConnectionStatusEnum
} from 'appConstants';

type ListenerType = () => void;

const listeners = new Set<ListenerType>();

export const websocketStatusStore = {
  subscribe: (listener: ListenerType) => {
    listeners.add(listener);

    return () => {
      listeners.delete(listener);
    };
  },

  getSnapshot: () => websocketConnection.status,

  setStatus: (status: WebsocketConnectionStatusEnum) => {
    if (websocketConnection.status === status) {
      return;
    }

    websocketConnection.status = status;
    listeners.forEach((listener) => listener());
  }
};
