import React from 'react';
import { useGlobalState, useGlobalDispatch } from 'context';
import { defaultTestnet } from 'context/config';

export default function RoundManager() {
  const globalState = useGlobalState();
  const dispatch = useGlobalDispatch();

  function setRoundsForCurrentTestnet() {
    const {
      activeTestnet: { refreshRate, name, fetchedFromNetworkConfig },
      activeTestnetId,
      refresh: { testnetId, intervalId: oldIntervalId },
    } = globalState;

    if (name === defaultTestnet.name || !fetchedFromNetworkConfig) {
      clearInterval(oldIntervalId);
      dispatch({ type: 'cancelAllRequests' });
    } else {
      if (testnetId !== activeTestnetId) {
        clearInterval(oldIntervalId);
        const intervalId = setInterval(() => {
          dispatch({ type: 'triggerNewRound' });
        }, refreshRate);
        dispatch({ type: 'setNewRoundIntervalId', intervalId, testnetId });
      }
    }
  }

  React.useEffect(setRoundsForCurrentTestnet, [globalState.activeTestnetId]);

  return <></>;
}
