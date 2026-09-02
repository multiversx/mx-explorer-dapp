import { useEffect, useRef } from 'react';

import {
  websocketConnection,
  websocketActiveSubscriptions,
  websocketEventListeners,
  websocketPendingSubscriptions,
  websocketSubscriptions,
  WebsocketConnectionStatusEnum
} from 'appConstants';
import { useInitWebsocket } from 'hooks/layout';
import { WebsocketEventsEnum, WebsocketSubcriptionsEnum } from 'types';
import { useHasWebsocketUrl } from './useHasWebsocketUrl';
import { useWebsocketStatus } from './useWebsocketStatus';

export interface RegisterWebsocketListenerType {
  onWebsocketEvent: (response: any) => void;
  subscription?: WebsocketSubcriptionsEnum;
  event?: WebsocketEventsEnum;
  config?: Record<string, any>;
  isPaused?: boolean;
  uuid?: string;
}

export function useRegisterWebsocketListener({
  onWebsocketEvent,
  subscription: subscriptionName,
  event,
  config,
  isPaused,
  uuid = ''
}: RegisterWebsocketListenerType) {
  const hasWebsocketUrl = useHasWebsocketUrl();
  const status = useWebsocketStatus();

  useInitWebsocket();

  const onWebsocketEventRef = useRef(onWebsocketEvent);
  onWebsocketEventRef.current = onWebsocketEvent;

  const configRef = useRef(config);
  configRef.current = config;

  useEffect(() => {
    if (!subscriptionName || !event) {
      return;
    }

    const websocket = websocketConnection.instance;

    if (
      !websocket ||
      !websocket?.active ||
      isPaused ||
      status !== WebsocketConnectionStatusEnum.COMPLETED
    ) {
      return;
    }

    const subscription = `${subscriptionName}${uuid}`;
    const websocketConfig = configRef.current ?? true;

    const isStatsEvent = event === WebsocketEventsEnum.statsUpdate;
    const isCustomEvent = [
      WebsocketEventsEnum.customTransactionUpdate,
      WebsocketEventsEnum.customTransferUpdate,
      WebsocketEventsEnum.customEventUpdate
    ].includes(event);

    const hasSubscription = websocketSubscriptions.has(subscription);

    if (!websocketActiveSubscriptions.has(subscription)) {
      websocketPendingSubscriptions.add(subscription);
    }
    websocketSubscriptions.add(subscription);

    if (!hasSubscription) {
      websocket.emit(subscriptionName, websocketConfig, (response: any) => {
        if (import.meta.env.DEV) {
          console.info(
            `New Websocket Subscription ${subscriptionName}`,
            response
          );
        }
        if (response?.status !== 'success') {
          websocketSubscriptions.delete(subscription);
          websocketPendingSubscriptions.delete(subscription);
        }
      });
    }

    let entry = websocketEventListeners.get(subscription);

    if (!entry) {
      const listeners = new Set<{ current: (response: any) => void }>();

      const handler = (response: any) => {
        if (
          typeof document !== 'undefined' &&
          document.hidden &&
          !(isStatsEvent || isCustomEvent)
        ) {
          return;
        }

        if (websocketPendingSubscriptions.has(subscription)) {
          websocketPendingSubscriptions.delete(subscription);
          websocketActiveSubscriptions.add(subscription);
        }

        listeners.forEach((listener) => listener.current(response));
      };

      entry = { event, handler, listeners };
      websocketEventListeners.set(subscription, entry);

      websocket.on(event, handler);
    }

    entry.listeners.add(onWebsocketEventRef);
    const currentEntry = entry;

    return () => {
      currentEntry.listeners.delete(onWebsocketEventRef);

      if (currentEntry.listeners.size > 0) {
        return;
      }

      websocket.off(currentEntry.event, currentEntry.handler);
      websocketEventListeners.delete(subscription);

      websocketActiveSubscriptions.delete(subscription);

      if (isStatsEvent) {
        return;
      }

      websocket.emit(
        `un${subscriptionName}`,
        websocketConfig,
        (response: any) => {
          if (import.meta.env.DEV) {
            console.info(
              `Unsubscribe Subscription ${subscriptionName}`,
              response
            );
          }
        }
      );

      websocketPendingSubscriptions.delete(subscription);
      websocketSubscriptions.delete(subscription);
    };
  }, [status, hasWebsocketUrl, event, subscriptionName, isPaused, uuid]);
}
