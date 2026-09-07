import { useMemo } from 'react';
import BigNumber from 'bignumber.js';
import { useSelector } from 'react-redux';

import {
  epochRoundsLeftSelector,
  statsEpochPercentageSelector,
  statsEpochSelector,
  statsEpochTimeRemainingSelector,
  statsIsDataReadySelector,
  statsRoundsPassedSelector,
  statsRoundsPerEpochSelector
} from 'redux/selectors';

export const useEpochProgress = () => {
  const isReady = useSelector(statsIsDataReadySelector);
  const epoch = useSelector(statsEpochSelector);
  const roundsPerEpoch = useSelector(statsRoundsPerEpochSelector);
  const roundsPassed = useSelector(statsRoundsPassedSelector);
  const epochPercentage = useSelector(statsEpochPercentageSelector);
  const epochTimeRemaining = useSelector(statsEpochTimeRemainingSelector);
  const trackedRoundsLeft = useSelector(epochRoundsLeftSelector);

  const roundsLeft = useMemo(() => {
    if (trackedRoundsLeft) {
      return trackedRoundsLeft;
    }

    // add one in order to take into account the css animation and the api call sync on the first run
    return new BigNumber(roundsPerEpoch).minus(roundsPassed).plus(1).toNumber();
  }, [trackedRoundsLeft, roundsPerEpoch, roundsPassed]);

  return {
    isReady,
    epoch,
    epochPercentage,
    epochTimeRemaining,
    roundsPerEpoch,
    roundsPassed,
    roundsLeft
  };
};
