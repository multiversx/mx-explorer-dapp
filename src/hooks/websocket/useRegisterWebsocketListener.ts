import { useEffect } from 'react';

import {
  websocketConnection,
  websocketActiveSubscriptions,
  websocketPendingSubscriptions,
  websocketSubscriptions,
  WebsocketConnectionStatusEnum
} from 'appConstants';
import { useInitWebsocket } from 'hooks/layout';
import { WebsocketEventsEnum, WebsocketSubcriptionsEnum } from 'types';
import { useHasWebsocketUrl } from './useHasWebsocketUrl';

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

  useInitWebsocket();

  useEffect(() => {
    const websocketConfig = config ?? true;
    if (!subscriptionName || !event) {
      return;
    }

    const subscription = `${subscriptionName}${uuid}`;

    const websocket = websocketConnection.instance;

    const hasSubscription = websocketSubscriptions.has(subscription);
    const hasPendingSubscription =
      websocketPendingSubscriptions.has(subscription);
    const hasActiveSubscription =
      websocketActiveSubscriptions.has(subscription);

    if (
      !websocket ||
      !websocket?.active ||
      isPaused ||
      websocketConnection.status !== WebsocketConnectionStatusEnum.COMPLETED
    ) {
      return;
    }

    websocketSubscriptions.add(subscription);

    if (!hasActiveSubscription) {
      websocketPendingSubscriptions.add(subscription);
    }

    if (!hasSubscription) {
      websocket.emit(subscriptionName, websocketConfig, (response: any) => {
        console.info(`New Websocket Subscription ${subscriptionName}`);
        if (response?.status !== 'success') {
          websocketSubscriptions.delete(subscription);
          websocketPendingSubscriptions.delete(subscription);
        }
      });
    }

    if (hasActiveSubscription || hasPendingSubscription) {
      return;
    }

    websocket.on(event, (response: any) => {
      if (document.hidden) {
        return;
      }

      if (websocketPendingSubscriptions.has(subscription)) {
        websocketPendingSubscriptions.delete(subscription);
        websocketActiveSubscriptions.add(subscription);
      }
      console.info(`Client ${event}:`, response);
      onWebsocketEvent(response);
    });

    return () => {
      websocket?.off(event);
      if (uuid) {
        websocket.emit(
          `un${subscriptionName}`,
          websocketConfig,
          (response: any) => {
            console.info(
              `Unsubscribe Subscription ${subscriptionName}`,
              response
            );
          }
        );
        websocketPendingSubscriptions.delete(subscription);
        websocketSubscriptions.delete(subscription);
      }
      websocketActiveSubscriptions.delete(subscription);
    };
  }, [
    websocketConnection,
    websocketSubscriptions,
    websocketActiveSubscriptions,
    websocketPendingSubscriptions,
    websocketConnection.status,
    hasWebsocketUrl,
    event,
    subscriptionName,
    isPaused
  ]);
}
