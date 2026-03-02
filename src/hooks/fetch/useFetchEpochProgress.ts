import { useEffect, useMemo, useRef, useState } from 'react';
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

  const hasCallMadeRef = useRef<boolean>(false);

  const rawRefreshInterval =
    refreshRate || initialNetworkRefreshRate || REFRESH_RATE;

  const [epochRoundsLeft, setEpochRoundsLeft] = useState<number>(0);
  const [effectiveRefreshInterval, setEffectiveRefreshInterval] =
    useState(rawRefreshInterval);

  const refreshIntervalSec = useMemo(
    () => new BigNumber(effectiveRefreshInterval).dividedBy(1000),
    [effectiveRefreshInterval]
  );

  const stepInterval = useMemo(
    () => getProgressStepInterval(effectiveRefreshInterval),
    [effectiveRefreshInterval]
  );

  const stepProgressSec = useMemo(
    () => stepInterval.dividedBy(1000),
    [stepInterval]
  );

  const [roundTimeProgress, setRoundTimeProgress] = useState(
    new BigNumber(stepProgressSec)
  );

  const roundProgress = useMemo(
    () => roundTimeProgress.times(100).dividedBy(refreshIntervalSec),
    [roundTimeProgress, refreshIntervalSec]
  );

  const roundsLeft = useMemo(() => {
    if (epochRoundsLeft) {
      return epochRoundsLeft;
    }

    // add one in order to take into account the css animation and the api call sync on the first run
    return new BigNumber(roundsPerEpoch).minus(roundsPassed).plus(1).toNumber();
  }, [epochRoundsLeft, roundsPerEpoch, roundsPassed]);

  useEffect(() => {
    if (!rawRefreshInterval) {
      return;
    }
    setEffectiveRefreshInterval((prev) =>
      rawRefreshInterval < prev ? rawRefreshInterval : prev
    );
  }, [rawRefreshInterval]);

  // Reset on network change
  useEffect(() => {
    setEffectiveRefreshInterval(rawRefreshInterval);
    setRoundTimeProgress(new BigNumber(stepProgressSec));
    hasCallMadeRef.current = false;
    setEpochRoundsLeft(0);
  }, [activeNetworkId]);

  useEffect(() => {
    if (!effectiveRefreshInterval) {
      return;
    }

    const intervalRoundTime = setInterval(() => {
      if (!document.hidden) {
        setRoundTimeProgress((prev) =>
          prev.isGreaterThanOrEqualTo(refreshIntervalSec)
            ? new BigNumber(stepProgressSec)
            : prev.plus(stepProgressSec)
        );
      }
    }, stepInterval.toNumber());

    return () => clearInterval(intervalRoundTime);
  }, [effectiveRefreshInterval]);

  useEffect(() => {
    if (!effectiveRefreshInterval || !roundTimeProgress || !timestamp) {
      return;
    }

    if (
      roundTimeProgress.isGreaterThanOrEqualTo(refreshIntervalSec) &&
      !hasCallMadeRef.current
    ) {
      hasCallMadeRef.current = true;

      fetchStats().then(({ success }) => {
        if (!success) {
          hasCallMadeRef.current = false;
          return;
        }

        const roundsLeft =
          roundsPerEpoch >= roundsPassed ? roundsPerEpoch - roundsPassed : 0;

        if (!roundsLeft || typeof roundsLeft !== 'number') {
          return;
        }

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
    } else if (roundTimeProgress.isLessThan(refreshIntervalSec)) {
      hasCallMadeRef.current = false;
    }
  }, [timestamp, roundTimeProgress]);

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
