import { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import {
  activeNetworkSelector,
  refreshTimestampSelector,
  statsRoundsPassedSelector,
  statsRoundsPerEpochSelector
} from 'redux/selectors';
import { resetEpochRoundsLeft, setEpochRoundsLeft } from 'redux/slices';

import { useFetchStats } from './useFetchStats';
import { useRoundDuration, useSyncRoundDuration } from './useRoundTicker';

export const useRoundManager = () => {
  const dispatch = useDispatch();
  const { fetchStats } = useFetchStats();
  const timestamp = useSelector(refreshTimestampSelector);
  const { id: activeNetworkId } = useSelector(activeNetworkSelector);
  const roundsPerEpoch = useSelector(statsRoundsPerEpochSelector);
  const roundsPassed = useSelector(statsRoundsPassedSelector);
  const roundDuration = useRoundDuration();

  useSyncRoundDuration();

  const hasCallMadeRef = useRef(false);
  const statsRef = useRef({ roundsPerEpoch, roundsPassed });
  statsRef.current = { roundsPerEpoch, roundsPassed };

  const roundsLeftRef = useRef(0);

  useEffect(() => {
    hasCallMadeRef.current = false;
    roundsLeftRef.current = 0;
    dispatch(resetEpochRoundsLeft());
  }, [activeNetworkId, dispatch]);

  useEffect(() => {
    if (!roundDuration) {
      return;
    }

    const intervalId = setInterval(() => {
      if (document.hidden || hasCallMadeRef.current) {
        return;
      }
      hasCallMadeRef.current = true;

      fetchStats().then(({ success }) => {
        hasCallMadeRef.current = false;

        if (!success) {
          return;
        }

        const { roundsPerEpoch: total, roundsPassed: passed } =
          statsRef.current;
        const roundsLeft = total >= passed ? total - passed : 0;

        if (!roundsLeft || typeof roundsLeft !== 'number') {
          return;
        }

        const existingRound = roundsLeftRef.current;
        let nextRoundsLeft = existingRound;

        if (!existingRound) {
          nextRoundsLeft = roundsLeft;
        } else if (existingRound === roundsLeft && roundsLeft > 0) {
          nextRoundsLeft = roundsLeft - 1;
        } else if (
          roundsLeft < existingRound ||
          existingRound - roundsLeft < -6
        ) {
          nextRoundsLeft = roundsLeft;
        }

        if (nextRoundsLeft !== existingRound) {
          roundsLeftRef.current = nextRoundsLeft;
          dispatch(setEpochRoundsLeft(nextRoundsLeft));
        }
      });
    }, roundDuration);

    return () => clearInterval(intervalId);
  }, [dispatch, fetchStats, timestamp, roundDuration]);
};
