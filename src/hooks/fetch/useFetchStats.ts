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

export const useFetchStats = () => {
  const dispatch = useDispatch();
  const { getStats } = useAdapter();
  const { stats, isWebsocket } = useSelector(statsSelector);

  const getStatsOnce = () => {
    if (currentRequest) {
      return currentRequest;
    }

    const requestPromise = new Promise(async (resolve, reject) => {
      try {
        const response = await getStats();
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
    subscription: WebsocketSubcriptionsEnum.subscribeStats,
    event: WebsocketEventsEnum.statsUpdate,
    onWebsocketEvent
  });

  const fetchApiStats = async () => {
    const { data, success } = await getStatsOnce();
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

  const fetchStats = useCallback(async () => {
    if (
      isWebsocket &&
      websocketActiveSubscriptions.has(WebsocketSubcriptionsEnum.subscribeStats)
    ) {
      return { data: stats, success: true };
    }

    return await fetchApiStats();
  }, [isWebsocket, websocketActiveSubscriptions, websocketConnection]);

  return { stats, fetchStats };
};
