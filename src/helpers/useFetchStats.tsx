import * as React from 'react';
import { processStats } from 'helpers';
import { useGlobalDispatch } from 'context';
import { adapter } from 'sharedComponents';

export default function useFetchStats() {
  const dispatch = useGlobalDispatch();

  const { getStats } = adapter();

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
}
