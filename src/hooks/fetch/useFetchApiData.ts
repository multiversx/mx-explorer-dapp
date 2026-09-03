import { useCallback, useEffect, useRef, useState } from 'react';

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
  uuid?: string;
  isRefreshPaused?: boolean;
  isCustomUpdate?: boolean;
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
  uuid = '',
  isCustomUpdate,
  isRefreshPaused = false
}: FetchApiDataProps) => {
  const { page, size, searchAfter } = useGetPage();
  const [dataChanged, setDataChanged] = useState(false);

  const isFetchingRef = useRef(false);
  const abortControllerRef = useRef<AbortController | undefined>(undefined);

  useEffect(() => {
    return () => {
      abortControllerRef.current?.abort();
    };
  }, []);

  const hasUrlParams =
    Object.keys(urlParams).length > 0 ||
    page !== 1 ||
    size !== PAGE_SIZE ||
    searchAfter !== undefined;

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
    uuid,
    config: {
      ...(isCustomUpdate ? {} : { from: 0, size: PAGE_SIZE }),
      ...websocketConfig
    },
    onWebsocketEvent,
    isPaused
  });

  const fetchData = useCallback(
    (paramsChange = false) => {
      if (isFetchingRef.current) {
        return;
      }

      if (subscription && websocketActiveSubscriptions.has(subscription)) {
        if (Boolean(hasUrlParams || isRefreshPaused)) {
          websocketActiveSubscriptions.delete(subscription);
        }
        return;
      }

      if (isRefreshPaused) {
        return;
      }

      isFetchingRef.current = true;

      if (hasUrlParams && paramsChange) {
        setDataChanged(true);
      }

      const controller = new AbortController();
      abortControllerRef.current = controller;
      const { signal } = controller;

      const promises = [
        dataPromise({
          ...filters,
          signal
        }),
        ...(dataCountPromise ? [dataCountPromise({ ...filters, signal })] : [])
      ];

      Promise.all(promises)
        .then((response) => {
          if (signal.aborted) {
            return;
          }

          onApiData(response);
        })
        .finally(() => {
          isFetchingRef.current = false;

          if (signal.aborted) {
            return;
          }

          if (paramsChange) {
            setDataChanged(false);
          }
        });
    },
    [
      websocketConnection,
      websocketActiveSubscriptions,
      subscription,
      hasUrlParams,
      isRefreshPaused,
      onApiData
    ]
  );

  return {
    fetchData,
    dataChanged
  };
};
