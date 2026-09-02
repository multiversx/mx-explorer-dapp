import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import {
  websocketActiveSubscriptions,
  websocketConnection
} from 'appConstants';
import { useAdapter, useRegisterWebsocketListener } from 'hooks';
import { statsSelector } from 'redux/selectors';
import { setStats } from 'redux/slices';
import {
  StatsType,
  WebsocketEventsEnum,
  WebsocketSubcriptionsEnum
} from 'types';

let currentRequest: any = null;

interface FetchStatsType {
  skipBrowserCache?: boolean;
}

interface UseFetchStatsOptionsType {
  registerWebsocketListener?: boolean;
}

export const useFetchStats = ({
  registerWebsocketListener = false
}: UseFetchStatsOptionsType = {}) => {
  const dispatch = useDispatch();
  const { getStats } = useAdapter();
  const { stats, isWebsocket } = useSelector(statsSelector);

  const getStatsOnce = ({ skipBrowserCache }: FetchStatsType = {}) => {
    if (currentRequest) {
      return currentRequest;
    }

    const requestPromise = new Promise(async (resolve, reject) => {
      try {
        const response = await getStats(
          skipBrowserCache ? { headers: { 'Cache-Control': 'no-cache' } } : {}
        );
        resolve(response);
      } catch (error) {
        reject(error);
      } finally {
        currentRequest = null;
      }
    });

    currentRequest = requestPromise;
    return requestPromise;
  };

  // Default Stats Updater, subscribe to websocket events on default flow
  const onWebsocketEvent = (event: StatsType) => {
    dispatch(setStats({ stats: event, isWebsocket: true, isDataReady: true }));
  };

  useRegisterWebsocketListener({
    ...(registerWebsocketListener
      ? {
          subscription: WebsocketSubcriptionsEnum.subscribeStats,
          event: WebsocketEventsEnum.statsUpdate
        }
      : {}),
    onWebsocketEvent
  });

  const fetchApiStats = async ({ skipBrowserCache }: FetchStatsType = {}) => {
    const { data, success } = await getStatsOnce({ skipBrowserCache });
    if (data && success) {
      dispatch(
        setStats({
          stats: data,
          isWebsocket: false,
          isDataReady: true
        })
      );
    }

    return { data, success };
  };

  const fetchStats = useCallback(
    async ({ skipBrowserCache }: FetchStatsType = {}) => {
      if (
        isWebsocket &&
        websocketActiveSubscriptions.has(
          WebsocketSubcriptionsEnum.subscribeStats
        )
      ) {
        return { data: stats, success: true };
      }

      return await fetchApiStats({ skipBrowserCache });
    },
    [isWebsocket, websocketActiveSubscriptions, websocketConnection]
  );

  return { stats, fetchStats };
};
