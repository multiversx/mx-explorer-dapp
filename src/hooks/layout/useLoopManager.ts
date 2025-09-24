import { useEffect, useMemo, useRef, useState } from 'react';
import moment from 'moment';
import { useSelector, useDispatch } from 'react-redux';

import { REFRESH_RATE } from 'appConstants';
import {
  activeNetworkSelector,
  refreshSelector,
  statsSelector
} from 'redux/selectors';
import { triggerRefresh } from 'redux/slices/refresh';

export const useLoopManager = () => {
  const intervalRef = useRef<any>(null);

  const { timestamp } = useSelector(refreshSelector);
  const { unprocessed } = useSelector(statsSelector);
  const { refreshRate: statsRefreshRate } = unprocessed;

  const { refreshRate: initialNetworkRefreshRate } = useSelector(
    activeNetworkSelector
  );

  const initialRefreshRate = useMemo(() => {
    if (statsRefreshRate) {
      return statsRefreshRate;
    }

    if (initialNetworkRefreshRate) {
      return initialNetworkRefreshRate;
    }

    return REFRESH_RATE;
  }, [initialNetworkRefreshRate, statsRefreshRate]);

  const [refreshRate, setRefreshRate] = useState(initialRefreshRate);

  const dispatch = useDispatch();

  const setLoopInterval = () => {
    intervalRef.current = setInterval(() => {
      const withinInterval = moment()
        .subtract(refreshRate, 'ms')
        .isBefore(timestamp);

      if (!document.hidden && !withinInterval) {
        dispatch(triggerRefresh());
      }
    }, refreshRate);
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  };

  useEffect(() => {
    if (statsRefreshRate && statsRefreshRate !== refreshRate) {
      setRefreshRate(statsRefreshRate);
    }
  }, [statsRefreshRate, refreshRate]);

  useEffect(setLoopInterval, [refreshRate]);
};
