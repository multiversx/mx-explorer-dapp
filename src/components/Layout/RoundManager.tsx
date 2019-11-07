import React from 'react';
import { useGlobalState, useGlobalDispatch } from '../../context';

export default function RoundManager() {
  const globalState = useGlobalState();
  const dispatch = useGlobalDispatch();

  function setRoundsForCurrentTestnet() {
    const {
      activeTestnet: { refreshRate },
      activeTestnetId,
      refresh: { testnetId, intervalId: oldIntervalId },
    } = globalState;

    if (testnetId !== activeTestnetId) {
      clearInterval(oldIntervalId);
      console.warn(refreshRate);

      const intervalId = setInterval(() => {
        dispatch({ type: 'triggerNewRound' });
      }, refreshRate);
      dispatch({ type: 'setNewRoundIntervalId', intervalId, testnetId });
    }
  }

  React.useEffect(setRoundsForCurrentTestnet, [globalState.activeTestnetId]);

  return <></>;
}
