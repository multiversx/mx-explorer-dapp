import React from 'react';
import moment from 'moment';
import { useSelector, useDispatch } from 'react-redux';
import { REFRESH_RATE } from 'appConstants';

import { interfaceSelector } from 'redux/selectors';
import { triggerRefresh } from 'redux/slices/interface';

export const useLoopManager = () => {
  const {
    refresh: { timestamp }
  } = useSelector(interfaceSelector);

  const dispatch = useDispatch();

  const withinInterval = moment()
    .subtract(REFRESH_RATE, 'ms')
    .isAfter(moment(timestamp));

  const setRounds = () => {
    const intervalId = setInterval(() => {
      if (!withinInterval && !document.hidden) {
        dispatch(triggerRefresh());
      }
    }, REFRESH_RATE);
    return () => {
      clearInterval(intervalId);
    };
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  React.useEffect(setRounds, []);
};
