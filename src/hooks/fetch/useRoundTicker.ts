import { useEffect, useRef, useSyncExternalStore } from 'react';
import { useSelector } from 'react-redux';

import { REFRESH_RATE } from 'appConstants';
import {
  activeNetworkSelector,
  statsRefreshRateSelector
} from 'redux/selectors';

import { roundTickerStore } from './roundTickerStore';

export const useRoundDuration = () => {
  const statsRefreshRate = useSelector(statsRefreshRateSelector);
  const { refreshRate: networkRefreshRate } = useSelector(
    activeNetworkSelector
  );

  return statsRefreshRate || networkRefreshRate || REFRESH_RATE;
};

export const useRoundTicker = () => {
  const snapshot = useSyncExternalStore(
    roundTickerStore.subscribe,
    roundTickerStore.getSnapshot,
    roundTickerStore.getSnapshot
  );

  return snapshot;
};

export const useSyncRoundDuration = () => {
  const roundDuration = useRoundDuration();
  const { id: activeNetworkId } = useSelector(activeNetworkSelector);

  const effectiveRoundRef = useRef<number>(roundDuration);

  useEffect(() => {
    if (!roundDuration) {
      return;
    }
    if (roundDuration < effectiveRoundRef.current) {
      effectiveRoundRef.current = roundDuration;
    }
    roundTickerStore.setRoundMs(effectiveRoundRef.current);
  }, [roundDuration]);

  useEffect(() => {
    effectiveRoundRef.current = roundDuration;
    roundTickerStore.setRoundMs(roundDuration);
    roundTickerStore.reset();
  }, [activeNetworkId]);
};
