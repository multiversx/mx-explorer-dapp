import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

import { REFRESH_RATE } from 'appConstants';
import { useFetchStats } from 'hooks';
import {
  activeNetworkSelector,
  refreshSelector,
  statsSelector
} from 'redux/selectors';

export const useFetchEpochProgress = () => {
  const fetchStats = useFetchStats();

  const { timestamp } = useSelector(refreshSelector);
  const { isFetched, unprocessed, epochPercentage, epochTimeRemaining } =
    useSelector(statsSelector);
  const { epoch, refreshRate, roundsPerEpoch, roundsPassed } = unprocessed;
  const { id: activeNetworkId } = useSelector(activeNetworkSelector);

  const pageHidden = document.hidden;

  const refreshInterval = refreshRate ? refreshRate : REFRESH_RATE;
  const refreshIntervalSec = refreshInterval / 6000; // 6000ms interval

  const [oldTestnetId, setOldTestnetId] = useState(activeNetworkId);
  const [roundTimeProgress, setRoundTimeProgress] = useState(0.2);

  const [isNewState, setIsNewState] = useState<boolean>(true);
  const [hasCallMade, setHasCallMade] = useState<boolean>(false);
  const [epochRoundsLeft, setEpochRoundsLeft] = useState<number>(0);

  const updateStats = () => {
    setIsNewState(oldTestnetId !== activeNetworkId);
    if (isNewState) {
      startRoundTime();
    }
    if (roundTimeProgress >= 1 && !hasCallMade) {
      fetchStats().then(({ success }) => {
        if (success) {
          setHasCallMade(true);
          const roundsLeft =
            roundsPerEpoch >= roundsPassed ? roundsPerEpoch - roundsPassed : 0;
          setEpochRoundsLeft((existingEpochRoundsLeft) =>
            existingEpochRoundsLeft === roundsLeft &&
            existingEpochRoundsLeft > 1
              ? existingEpochRoundsLeft - 1
              : roundsLeft
          );
        }
      });
    } else {
      setHasCallMade(false);
    }
  };

  const startRoundTime = () => {
    const intervalRoundTime = setInterval(() => {
      if (!pageHidden) {
        setRoundTimeProgress((prevProgress) => {
          const newProgress = parseFloat((prevProgress + 0.2).toFixed(1)); // Ensure proper rounding
          return newProgress > 1 ? 0.2 : newProgress;
        });
      }
    }, 200); // 200ms interval for 5 steps in 1 second
    return () => clearInterval(intervalRoundTime);
  };

  useEffect(() => {
    setOldTestnetId(activeNetworkId);
  }, [activeNetworkId]);

  useEffect(updateStats, [timestamp, roundTimeProgress]);

  const roundProgress = (roundTimeProgress * 100) / refreshIntervalSec;
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
