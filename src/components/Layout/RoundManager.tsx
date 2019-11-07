import React from 'react';
import { useGlobalState, useGlobalDispatch } from '../../context';

export default function RoundManager() {
  const globalState = useGlobalState();
  const dispatch = useGlobalDispatch();

  React.useEffect(() => {
    const {
      activeTestnet: { roundTime },
      activeTestnetId,
      rounds: { testnetId, intervalId: oldIntervalId },
    } = globalState;

    if (testnetId !== activeTestnetId) {
      clearInterval(oldIntervalId);
      const intervalId = setInterval(() => dispatch({ type: 'triggerNewRound' }), roundTime);
      dispatch({ type: 'setNewRoundIntervalId', intervalId, testnetId });
    }
  }, [globalState.activeTestnetId]);

  return <></>;
}
