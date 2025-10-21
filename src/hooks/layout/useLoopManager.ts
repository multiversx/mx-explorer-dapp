import { useEffect, useMemo, useRef, useState } from 'react';
import moment from 'moment';
import { useSelector, useDispatch } from 'react-redux';

import {
  POOLING_REFRESH_RATE,
  POOLING_REFRESH_RATE_LIMIT,
  REFRESH_RATE
} from 'appConstants';
import {
  activeNetworkSelector,
  refreshSelector,
  statsSelector
} from 'redux/selectors';
import { triggerRefresh } from 'redux/slices';

export const useLoopManager = () => {
  const intervalRef = useRef<any>(null);

  const { timestamp } = useSelector(refreshSelector);
  const { unprocessed } = useSelector(statsSelector);
  const { refreshRate: statsRefreshRate } = unprocessed;

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
