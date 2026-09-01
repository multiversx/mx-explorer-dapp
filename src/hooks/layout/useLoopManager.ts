import { useEffect, useMemo, useRef, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import {
  POOLING_REFRESH_RATE_LIMIT,
  REFRESH_RATE,
  POOLING_REFRESH_RATE
} from 'appConstants';
import {
  activeNetworkSelector,
  refreshTimestampSelector,
  statsRefreshRateSelector
} from 'redux/selectors';
import { triggerRefresh, triggerPoolingRefresh } from 'redux/slices';

export const useLoopManager = () => {
  const intervalRef = useRef<any>(null);

  const timestamp = useSelector(refreshTimestampSelector);
  const statsRefreshRate = useSelector(statsRefreshRateSelector);

  const { refreshRate: initialNetworkRefreshRate, updatesWebsocketUrl } =
    useSelector(activeNetworkSelector);

  const initialRefreshRate = useMemo(() => {
    // if there is a websocket option, and a sub-second refreshrate, keep the POOLING_REFRESH_RATE
    if (updatesWebsocketUrl && statsRefreshRate < POOLING_REFRESH_RATE_LIMIT) {
      return POOLING_REFRESH_RATE;
    }

    if (statsRefreshRate) {
      return statsRefreshRate;
    }

    if (initialNetworkRefreshRate) {
      return initialNetworkRefreshRate;
    }

    return REFRESH_RATE;
  }, [initialNetworkRefreshRate, statsRefreshRate, updatesWebsocketUrl]);

  const [refreshRate, setRefreshRate] = useState(initialRefreshRate);

  const dispatch = useDispatch();

  const timestampRef = useRef(timestamp);
  timestampRef.current = timestamp;

  const setLoopInterval = () => {
    intervalRef.current = setInterval(() => {
      const withinInterval = Date.now() - refreshRate < timestampRef.current;

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
      if (
        updatesWebsocketUrl &&
        statsRefreshRate < POOLING_REFRESH_RATE_LIMIT
      ) {
        return;
      }

      setRefreshRate(statsRefreshRate);
    }
  }, [statsRefreshRate, refreshRate, updatesWebsocketUrl]);

  useEffect(setLoopInterval, [refreshRate]);

  const poolingRefreshRate = Math.max(POOLING_REFRESH_RATE, refreshRate);

  useEffect(() => {
    const poolingIntervalId = setInterval(() => {
      if (!document.hidden) {
        dispatch(triggerPoolingRefresh());
      }
    }, poolingRefreshRate);

    return () => clearInterval(poolingIntervalId);
  }, [poolingRefreshRate, dispatch]);
};
