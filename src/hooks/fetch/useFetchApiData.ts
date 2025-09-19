import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';

import { PAGE_SIZE } from 'appConstants';
import { useRegisterWebsocketListener } from 'hooks';
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
  isWebsocketUpdate?: boolean;
  filters?: Record<string, any>;
  subscription?: WebsocketSubcriptionsEnum;
  event?: WebsocketEventsEnum;
  config?: Record<string, any>;
}

export const useFetchApiData = ({
  dataPromise,
  dataCountPromise,
  onWebsocketData,
  onApiData,
  isWebsocketUpdate,
  filters = {},
  subscription,
  event,
  config = {}
}: FetchApiDataProps) => {
  const [searchParams] = useSearchParams();
  const [dataChanged, setDataChanged] = useState<boolean>(false);
  let isCalled = false;

  const onWebsocketEvent = (event: any[]) => {
    if (Boolean(searchParams.toString()) || !onWebsocketData) {
      return;
    }

    onWebsocketData(event);
  };

  useRegisterWebsocketListener({
    subscription,
    event,
    config: { from: 0, size: PAGE_SIZE, ...config },
    onEvent: onWebsocketEvent
  });

  const fetchData = (paramsChange = false) => {
    if ((isWebsocketUpdate && !paramsChange) || isCalled) {
      return;
    }

    isCalled = true;
    if (searchParams.toString() && paramsChange) {
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
  };

  return {
    fetchData,
    dataChanged
  };
};
