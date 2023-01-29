import * as React from 'react';
import { useDispatch } from 'react-redux';
import { useAdapter } from 'components';
import { processStats, getExtraStats } from 'helpers';

import { setStats } from 'redux/slices/stats';

export const useFetchStats = (timestamp?: number) => {
  const dispatch = useDispatch();
  const { getStats } = useAdapter();

  const fetchStats = () => {
    getStats().then(({ data, success }) => {
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
    });
  };

  React.useEffect(fetchStats, [timestamp]);
};
