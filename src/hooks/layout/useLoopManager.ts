import { useEffect, useMemo, useRef, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import {
  POOLING_REFRESH_RATE,
  POOLING_REFRESH_RATE_LIMIT,
  REFRESH_RATE
} from 'appConstants';
import {
  activeNetworkSelector,
  refreshSelector,
  statsRefreshRateSelector
} from 'redux/selectors';
import { triggerRefresh } from 'redux/slices';

export const useLoopManager = () => {
  const intervalRef = useRef<any>(null);

  const { timestamp } = useSelector(refreshSelector);
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

  // The interval is only re-created when `refreshRate` changes, so `timestamp`
  // has to be read through a ref — captured directly it goes stale on the first
  // tick, which made the `withinInterval` skip below dead code and fired a
  // global refresh on every tick regardless of what the websocket had delivered.
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
};
