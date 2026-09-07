import { useSyncExternalStore } from 'react';

import { websocketStatusStore } from 'helpers/websocket/websocketStatusStore';

export const useWebsocketStatus = () =>
  useSyncExternalStore(
    websocketStatusStore.subscribe,
    websocketStatusStore.getSnapshot,
    websocketStatusStore.getSnapshot
  );
