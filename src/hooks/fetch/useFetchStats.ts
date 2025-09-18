import { useDispatch, useSelector } from 'react-redux';

import { useAdapter, useRegisterWebsocketListener } from 'hooks';
import { statsSelector } from 'redux/selectors';
import { setStats } from 'redux/slices/stats';
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
        if (isWebsocket) {
          resolve(stats);
          return;
        }

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
    dispatch(setStats({ stats: event, isWebsocket: true, isFetched: true }));
  };

  useRegisterWebsocketListener({
    subscription: WebsocketSubcriptionsEnum.subscribeStats,
    event: WebsocketEventsEnum.statsUpdate,
    onEvent: onWebsocketEvent
  });

  const fetchStats = async () => {
    const { data, success } = await getStatsOnce();
    if (data && success) {
      dispatch(
        setStats({
          stats: data,
          isWebsocket: false,
          isFetched: true
        })
      );
    }

    return { data, success };
  };

  return { stats, fetchStats };
};
