import * as React from 'react';
import { useDispatch } from 'react-redux';
import { useAdapter } from 'components';
import { processStats } from 'helpers';

import { setStats } from 'redux/slices/stats';

export const useFetchStats = () => {
  const dispatch = useDispatch();
  const { getStats } = useAdapter();

  const fetchStats = () => {
    getStats().then((stats) => {
      if (stats?.data && stats.success) {
        const processedStats = processStats(stats.data);
        dispatch(
          setStats({
            ...processedStats
          })
        );
      }
    });
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  React.useEffect(fetchStats, []);
};
