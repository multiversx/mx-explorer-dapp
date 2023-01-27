import React, { useRef } from 'react';
import moment from 'moment';
import { useSelector, useDispatch } from 'react-redux';
import { REFRESH_RATE } from 'appConstants';

import { refreshSelector } from 'redux/selectors';
import { triggerRefresh } from 'redux/slices/refresh';

export const useLoopManager = () => {
  const intervalRef = useRef<any>(null);
  const { timestamp } = useSelector(refreshSelector);

  const dispatch = useDispatch();

  const setLoopInterval = () => {
    intervalRef.current = setInterval(() => {
      const withinInterval = moment()
        .subtract(REFRESH_RATE, 'ms')
        .isBefore(timestamp);

      if (!document.hidden && !withinInterval) {
        dispatch(triggerRefresh());
      }
    }, REFRESH_RATE);
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  };

  React.useEffect(setLoopInterval, []);
};
