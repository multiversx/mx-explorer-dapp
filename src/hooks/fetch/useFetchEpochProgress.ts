import { useEffect, useMemo, useState } from 'react';
import BigNumber from 'bignumber.js';
import { useSelector } from 'react-redux';

import { REFRESH_RATE } from 'appConstants';
import { getProgressStepInterval } from 'helpers';
import { useFetchStats } from 'hooks';
import {
  activeNetworkSelector,
  refreshSelector,
  statsSelector
} from 'redux/selectors';

export const useFetchEpochProgress = () => {
  const { fetchStats } = useFetchStats();
  const { timestamp } = useSelector(refreshSelector);
  const { id: activeNetworkId, refreshRate: initialNetworkRefreshRate } =
    useSelector(activeNetworkSelector);

  const { isDataReady, unprocessed, stats } = useSelector(statsSelector);
  const { epochPercentage, epochTimeRemaining } = stats;
  const { epoch, refreshRate, roundsPerEpoch, roundsPassed } = unprocessed;

  const [oldTestnetId, setOldTestnetId] = useState(activeNetworkId);
  const [isNewState, setIsNewState] = useState<boolean>(true);
  const [hasCallMade, setHasCallMade] = useState<boolean>(false);
  const [epochRoundsLeft, setEpochRoundsLeft] = useState<number>(0);

  const refreshInterval =
    refreshRate || initialNetworkRefreshRate || REFRESH_RATE;
  const refreshIntervalSec = new BigNumber(refreshInterval).dividedBy(1000);

  const stepInterval = getProgressStepInterval(refreshInterval);
  const stepProgressSec = stepInterval.dividedBy(1000);

  const [roundTimeProgress, setRoundTimeProgress] = useState(
    new BigNumber(stepProgressSec)
  );

  const updateStats = () => {
    if (!refreshInterval) {
      return;
    }
    setIsNewState(oldTestnetId !== activeNetworkId);
    if (isNewState) {
      startRoundTime();
    }

    if (roundTimeProgress.isEqualTo(refreshIntervalSec) && !hasCallMade) {
      fetchStats().then(({ success }) => {
        if (!success) {
          return;
        }

        const roundsLeft =
          roundsPerEpoch >= roundsPassed ? roundsPerEpoch - roundsPassed : 0;

        if (!roundsLeft || typeof roundsLeft !== 'number') {
          return;
        }

        setHasCallMade(true);
        setEpochRoundsLeft((existingRound) => {
          if (!existingRound) {
            return roundsLeft;
          }

          if (existingRound === roundsLeft && roundsLeft > 0) {
            return roundsLeft - 1;
          }
          if (roundsLeft < existingRound || existingRound - roundsLeft < -6) {
            return roundsLeft;
          }

          return existingRound;
        });
      });
    } else {
      setHasCallMade(false);
    }
  };

  const startRoundTime = () => {
    if (!refreshInterval) {
      return;
    }
    const intervalRoundTime = setInterval(() => {
      if (!document.hidden) {
        setRoundTimeProgress((roundTimeProgress) =>
          roundTimeProgress.isEqualTo(refreshIntervalSec)
            ? new BigNumber(stepProgressSec)
            : roundTimeProgress.plus(stepProgressSec)
        );
      }
    }, stepInterval.toNumber());
    return () => clearInterval(intervalRoundTime);
  };

  useEffect(() => {
    setOldTestnetId(activeNetworkId);
  }, [activeNetworkId]);

  useEffect(() => {
    if (refreshInterval && roundTimeProgress && timestamp) {
      updateStats();
    }
  }, [timestamp, roundTimeProgress, refreshInterval]);

  const roundProgress = roundTimeProgress
    .times(100)
    .dividedBy(refreshIntervalSec ?? 1);

  const roundsLeft = useMemo(() => {
    if (epochRoundsLeft) {
      return epochRoundsLeft;
    }

    // add one in order to take into account the css animation and the api call sync on the first run
    return new BigNumber(roundsPerEpoch).minus(roundsPassed).plus(1).toNumber();
  }, [epochRoundsLeft, roundsPerEpoch, roundsPassed]);

  return {
    isReady: isDataReady,
    roundProgress,
    roundTimeProgress,
    roundsPerEpoch,
    roundsPassed,
    roundsLeft,
    epoch,
    epochPercentage,
    epochTimeRemaining,
    epochRoundsLeft
  };
};
