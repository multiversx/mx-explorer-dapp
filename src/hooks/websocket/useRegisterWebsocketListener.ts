import { useEffect } from 'react';

import { websocketConnection } from 'appConstants';
import { useInitWebsocket } from 'hooks/layout';
import { WebsocketEventsEnum, WebsocketSubcriptionsEnum } from 'types';
import { useHasWebsocketUrl } from './useHasWebsocketUrl';

export interface RegisterWebsocketListenerType {
  onEvent: (response: any) => void;
  subscription?: WebsocketSubcriptionsEnum;
  event?: WebsocketEventsEnum;
  config?: Record<string, any>;
}

const addToSubscriptions = (
  arr: WebsocketSubcriptionsEnum[],
  subscription: WebsocketSubcriptionsEnum
) => {
  const subscriptionIndex = arr.indexOf(subscription);
  if (subscriptionIndex === -1) {
    arr.push(subscription);
  }
};

const removeSubscription = (
  arr: WebsocketSubcriptionsEnum[],
  subscription: WebsocketSubcriptionsEnum
) => {
  const subscriptionIndex = arr.indexOf(subscription);
  if (subscriptionIndex !== -1) {
    arr.splice(subscriptionIndex, 1);
  }
};

export function useRegisterWebsocketListener({
  subscription,
  event,
  config,
  onEvent
}: RegisterWebsocketListenerType) {
  const hasWebsocketUrl = useHasWebsocketUrl();

  useInitWebsocket();

  useEffect(() => {
    const websocketConfig = config ?? true;
    if (!subscription || !event) {
      return;
    }

    const websocket = websocketConnection.instance;

    const subscriptionIndex =
      websocketConnection.subscriptions.indexOf(subscription);
    const activeSubscriptionIndex =
      websocketConnection.activeSubscriptions.indexOf(subscription);
    const hasSubscription = subscriptionIndex !== -1;
    const hasActiveSubscription = activeSubscriptionIndex !== -1;

    addToSubscriptions(websocketConnection.subscriptions, subscription);
    addToSubscriptions(websocketConnection.activeSubscriptions, subscription);

    if (!websocket || !websocket?.active) {
      return;
    }

    if (!hasSubscription) {
      websocket.emit(subscription, websocketConfig, (response: any) => {
        console.info(
          `Websocket New Subscription ${subscription} with options`,
          websocketConfig,
          response
        );
        if (response?.status !== 'success') {
          removeSubscription(websocketConnection.subscriptions, subscription);
          removeSubscription(
            websocketConnection.activeSubscriptions,
            subscription
          );
        }
      });
    }

    if (hasActiveSubscription) {
      return;
    }

    websocket.on(event, (response: any) => {
      console.info(`Client ${event}:`, response);
      onEvent(response);
    });

    return () => {
      websocket?.off(event);
      removeSubscription(websocketConnection.activeSubscriptions, subscription);
    };
  }, [websocketConnection, hasWebsocketUrl, event, subscription]);
}
