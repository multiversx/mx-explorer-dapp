import * as React from 'react';
import { processStats } from 'helpers';
import { useGlobalDispatch } from 'context';
import { useAdapter } from 'components';

export const useFetchStats = () => {
  const dispatch = useGlobalDispatch();

  const { getStats } = useAdapter();

  const fetchStats = () => {
    getStats().then((stats) => {
      const newStats = processStats(stats);
      dispatch({
        type: 'setStats',
        stats: newStats,
      });
    });
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  React.useEffect(fetchStats, []);
};
