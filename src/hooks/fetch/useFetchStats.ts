import React from 'react';
import { useDispatch } from 'react-redux';

import { processStats, getExtraStats } from 'helpers';
import { useAdapter } from 'hooks';
import { setStats } from 'redux/slices/stats';

let currentRequest: any = null;

export const useFetchStats = () => {
  const dispatch = useDispatch();
  const { getStats } = useAdapter();

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

  const fetchStats = async () => {
    const { data, success } = await getStatsOnce();

    if (data && success) {
      const {
        epochPercentage,
        epochTotalTime,
        epochTimeElapsed,
        epochTimeRemaining
      } = getExtraStats(data);

      const processedStats = processStats(data);
      dispatch(
        setStats({
          ...processedStats,

          unprocessed: {
            ...data,
            epochPercentage,
            epochTotalTime,
            epochTimeElapsed,
            epochTimeRemaining
          },
          isFetched: true
        })
      );
    }

    return { data, success };
  };

  return fetchStats;
};
