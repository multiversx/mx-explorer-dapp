import React from 'react';
import moment from 'moment';
import { useGlobalState, useGlobalDispatch } from 'context';
import { REFRESH_RATE } from 'appConstants';

export const useLoopManager = () => {
  const {
    refresh: { timestamp },
  } = useGlobalState();
  const dispatch = useGlobalDispatch();

  const withinInterval = moment().subtract(REFRESH_RATE, 'ms').isAfter(moment(timestamp));

  const setRounds = () => {
    const intervalId = setInterval(() => {
      if (!withinInterval && !document.hidden) {
        dispatch({
          type: 'triggerTick',
        });
      }
    }, REFRESH_RATE);
    return () => {
      clearInterval(intervalId);
    };
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  React.useEffect(setRounds, []);
};
