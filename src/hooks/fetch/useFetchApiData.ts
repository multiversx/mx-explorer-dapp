import { useCallback, useState } from 'react';

import {
  PAGE_SIZE,
  websocketActiveSubscriptions,
  websocketConnection
} from 'appConstants';
import { useGetPage, useRegisterWebsocketListener } from 'hooks';
import {
  ApiAdapterResponseType,
  WebsocketEventsEnum,
  WebsocketSubcriptionsEnum
} from 'types';

export interface FetchApiDataProps {
  onApiData: (response: any) => void;
  dataPromise: (params?: any) => Promise<ApiAdapterResponseType>;
  dataCountPromise?: (params?: any) => Promise<ApiAdapterResponseType>;
  onWebsocketData?: (response: any) => void;
  filters?: Record<string, any>;
  subscription?: WebsocketSubcriptionsEnum;
  event?: WebsocketEventsEnum;
  websocketConfig?: Record<string, any>;
  urlParams?: Record<string, any>;
  isRefreshPaused?: boolean;
}

export const useFetchApiData = ({
  dataPromise,
  dataCountPromise,
  onWebsocketData,
  onApiData,
  filters = {},
  subscription,
  event,
  websocketConfig = {},
  urlParams = {},
  isRefreshPaused = false
}: FetchApiDataProps) => {
  const { page, size } = useGetPage();
  const [dataChanged, setDataChanged] = useState(false);

  let isCalled = false;

  const hasUrlParams =
    Object.keys(urlParams).length > 0 || page !== 1 || size !== PAGE_SIZE;

  const isPaused = Boolean(hasUrlParams || isRefreshPaused);

  const onWebsocketEvent = useCallback(
    (event: any[]) => {
      if (isPaused || !onWebsocketData) {
        return;
      }

      onWebsocketData(event);
    },
    [isPaused, onWebsocketData]
  );

  useRegisterWebsocketListener({
    subscription,
    event,
    config: { from: 0, size: PAGE_SIZE, ...websocketConfig },
    onWebsocketEvent,
    isPaused
  });

  const fetchData = useCallback(
    (paramsChange = false) => {
      if (isCalled) {
        return;
      }

      if (subscription && websocketActiveSubscriptions.has(subscription)) {
        if (Boolean(hasUrlParams || isRefreshPaused)) {
          websocketConnection?.instance?.off(event);
          websocketActiveSubscriptions.delete(subscription);
        }
        return;
      }

      if (isRefreshPaused) {
        return;
      }

      isCalled = true;

      if (hasUrlParams && paramsChange) {
        setDataChanged(true);
      }

      const promises = [
        dataPromise({
          ...filters
        }),
        ...(dataCountPromise ? [dataCountPromise({ ...filters })] : [])
      ];

      Promise.all(promises)
        .then(onApiData)
        .finally(() => {
          if (paramsChange) {
            isCalled = false;
            setDataChanged(false);
          }
        });
    },
    [
      websocketConnection,
      websocketActiveSubscriptions,
      subscription,
      hasUrlParams,
      isCalled,
      isRefreshPaused,
      onApiData
    ]
  );

  return {
    fetchData,
    dataChanged
  };
};
