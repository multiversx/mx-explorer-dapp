import { initializeWebsocketConnection } from './initializeWebsocketConnection';

/**
 * Manages the WebSocket connection lifecycle.
 *
 * Holds a reference to the current WebSocket connection's `closeConnection` method,
 * allowing other parts of the application to close the connection on demand (e.g., on logout).
 *
 * This pattern avoids exporting mutable bindings directly by encapsulating
 * the reference within a stable object.
 *
 * @example
 * ```ts
 * await registerWebsocketListener();
 * websocketManager.closeConnectionRef?.();
 * ```
 */
export const websocketManager = {
  closeConnectionRef: undefined as (() => void) | undefined,
  connectedUrl: undefined as string | undefined
};

export async function registerWebsocketListener(websocketUrl: string) {
  if (
    websocketManager.connectedUrl &&
    websocketManager.connectedUrl !== websocketUrl
  ) {
    websocketManager.closeConnectionRef?.();
    websocketManager.closeConnectionRef = undefined;
    websocketManager.connectedUrl = undefined;
  }

  const { closeConnection } = await initializeWebsocketConnection(websocketUrl);

  websocketManager.closeConnectionRef = closeConnection;
  websocketManager.connectedUrl = websocketUrl;
}
