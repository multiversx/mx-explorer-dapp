import { useEffect, useState } from 'react';
import BigNumber from 'bignumber.js';
import { useSelector } from 'react-redux';

import { REFRESH_RATE } from 'appConstants';
import { useFetchStats } from 'hooks';
import {
  activeNetworkSelector,
  refreshSelector,
  statsSelector
} from 'redux/selectors';

const getStepInterval = (refreshInterval: number) => {
  switch (refreshInterval) {
    case 6000:
      return new BigNumber(1000);
    case 3000:
      return new BigNumber(500);
    case 2000:
      return new BigNumber(500);
    case 1000:
      return new BigNumber(200);
    case 600:
      return new BigNumber(100);

    default:
      return new BigNumber(
        new BigNumber(refreshInterval).isGreaterThan(1000)
          ? new BigNumber(refreshInterval).minus(1000)
          : refreshInterval
      ).dividedBy(5);
  }
};

export const useFetchEpochProgress = () => {
  const fetchStats = useFetchStats();

  const { timestamp } = useSelector(refreshSelector);
  const { isFetched, unprocessed, epochPercentage, epochTimeRemaining } =
    useSelector(statsSelector);
  const { epoch, refreshRate, roundsPerEpoch, roundsPassed } = unprocessed;
  const { id: activeNetworkId } = useSelector(activeNetworkSelector);

  const pageHidden = document.hidden;

  const refreshInterval = refreshRate ? refreshRate : REFRESH_RATE;
  const refreshIntervalSec = new BigNumber(refreshInterval).dividedBy(1000);

  const stepInterval = getStepInterval(refreshInterval);

  const stepProgressSec = stepInterval.dividedBy(1000);

  const [oldTestnetId, setOldTestnetId] = useState(activeNetworkId);
  const [roundTimeProgress, setRoundTimeProgress] = useState(
    new BigNumber(stepProgressSec)
  );

  const [isNewState, setIsNewState] = useState<boolean>(true);
  const [hasCallMade, setHasCallMade] = useState<boolean>(false);
  const [epochRoundsLeft, setEpochRoundsLeft] = useState<number>(0);

  const updateStats = () => {
    if (!refreshRate) {
      return;
    }
    setIsNewState(oldTestnetId !== activeNetworkId);
    if (isNewState) {
      startRoundTime();
    }
    if (roundTimeProgress.isEqualTo(refreshIntervalSec) && !hasCallMade) {
      fetchStats().then(({ success }) => {
        if (success) {
          setHasCallMade(true);
          const roundsLeft =
            roundsPerEpoch >= roundsPassed ? roundsPerEpoch - roundsPassed : 0;
          setEpochRoundsLeft((existingRound) => {
            if (roundsLeft && typeof roundsLeft === 'number') {
              if (!existingRound) {
                return roundsLeft;
              }
              if (existingRound) {
                if (existingRound === roundsLeft && roundsLeft > 0) {
                  return roundsLeft - 1;
                }
                if (roundsLeft < existingRound) {
                  return roundsLeft;
                }
                if (existingRound - roundsLeft < -6) {
                  return roundsLeft;
                }
              }
            }

            return existingRound;
          });
        }
      });
    } else {
      setHasCallMade(false);
    }
  };

  const startRoundTime = () => {
    if (!refreshRate) {
      return;
    }
    const intervalRoundTime = setInterval(() => {
      if (!pageHidden) {
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
    if (refreshRate && roundTimeProgress && timestamp) {
      updateStats();
    }
  }, [timestamp, roundTimeProgress, refreshRate]);

  const roundProgress = roundTimeProgress
    .times(100)
    .dividedBy(refreshIntervalSec);

  const roundsLeft = epochRoundsLeft
    ? epochRoundsLeft
    : roundsPerEpoch - roundsPassed + 1; // add one in order to take into account the css animation and the api call sync on the first run

  return {
    isReady: isFetched,
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
