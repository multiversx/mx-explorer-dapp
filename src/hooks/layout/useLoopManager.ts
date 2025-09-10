import { useEffect, useRef, useState } from 'react';
import moment from 'moment';
import { useSelector, useDispatch } from 'react-redux';
import { REFRESH_RATE } from 'appConstants';

import { refreshSelector, statsSelector } from 'redux/selectors';
import { triggerRefresh } from 'redux/slices/refresh';

export const useLoopManager = () => {
  const intervalRef = useRef<any>(null);
  const { timestamp } = useSelector(refreshSelector);
  const { unprocessed } = useSelector(statsSelector);
  const { refreshRate: settingsRefreshRate } = unprocessed;

  const [refreshRate, setRefreshRate] = useState(REFRESH_RATE);

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
    if (settingsRefreshRate && settingsRefreshRate !== refreshRate) {
      setRefreshRate(settingsRefreshRate);
    }
  }, [settingsRefreshRate, refreshRate]);

  useEffect(setLoopInterval, [refreshRate]);
};
