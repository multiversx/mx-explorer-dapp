import * as React from 'react';
import { processStats } from 'helpers';
import { useAdapter } from 'components';

import { useDispatch } from 'react-redux';
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
            ...processedStats,
          })
        );
      }
    });
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  React.useEffect(fetchStats, []);
};
