import React from 'react';
import moment from 'moment';
import { useGlobalState, useGlobalDispatch } from 'context';
import { refreshRate } from 'appConfig';

export default function useLoopManager() {
  const {
    refresh: { timestamp },
  } = useGlobalState();
  const dispatch = useGlobalDispatch();

  const withinInterval = moment().subtract(refreshRate, 'ms').isAfter(moment(timestamp));

  const setRounds = () => {
    const intervalId = setInterval(() => {
      if (!withinInterval && !document.hidden) {
        dispatch({
          type: 'triggerTick',
        });
      }
    }, refreshRate);
    return () => {
      clearInterval(intervalId);
    };
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  React.useEffect(setRounds, []);
}
