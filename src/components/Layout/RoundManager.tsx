import React from 'react';
import moment from 'moment';
import { useGlobalState, useGlobalDispatch } from 'context';
import { refreshRate } from 'appConfig';

export default function RoundManager() {
  const {
    refresh: { timestamp },
  } = useGlobalState();
  const dispatch = useGlobalDispatch();

  const withinInterval = moment().subtract(refreshRate, 'ms').isAfter(moment(timestamp));

  const setRounds = () => {
    const intervalId = setInterval(() => {
      if (!withinInterval) {
        dispatch({
          type: 'triggerNewRound',
        });
      }
    }, refreshRate);
    return () => {
      clearInterval(intervalId);
    };
  };

  React.useEffect(setRounds, []);

  return <></>;
}
