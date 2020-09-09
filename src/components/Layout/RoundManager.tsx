import React from 'react';
import moment from 'moment';
import { useGlobalState, useGlobalDispatch } from 'context';

export default function RoundManager() {
  const {
    activeNetwork: { refreshRate },
    refresh: { timestamp },
  } = useGlobalState();
  const dispatch = useGlobalDispatch();
  const [int, setInt] = React.useState<any>(-1);

  const withinInterval = moment().subtract(refreshRate, 'ms').isAfter(moment(timestamp));

  const setRounds = () => {
    clearInterval(int);
    const intervalId = setInterval(() => {
      if (!withinInterval) {
        dispatch({
          type: 'triggerNewRound',
        });
      }
    }, refreshRate);
    setInt(intervalId);
  };

  // TODO: add refreshRate as parameter
  React.useEffect(setRounds, []);

  return <></>;
}
