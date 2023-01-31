import React, { useEffect, useRef, useState } from 'react';

import { useSelector } from 'react-redux';
import { REFRESH_RATE } from 'appConstants';

import { useAdapter, ProgressRing } from 'components';
import { processStats, validDisplayValue, getExtraStats } from 'helpers';
import { useFetchStats } from 'hooks';
import { activeNetworkSelector, refreshSelector } from 'redux/selectors';
import { getInitialStatsState } from 'redux/slices/stats';
import { StatsSliceType, WithClassnameType } from 'types';

export const BlockProgressRing = ({ className }: WithClassnameType) => {
  const ref = useRef(null);
  const fetchStats = useFetchStats();
  const { timestamp } = useSelector(refreshSelector);
  const { id: activeNetworkId } = useSelector(activeNetworkSelector);

  const { getStats } = useAdapter();

  const pageHidden = document.hidden;
  const initialStats = getInitialStatsState();

  const [stateBuffer, setStateBuffer] = useState<StatsSliceType | undefined>();
  const [state, setState] = useState<StatsSliceType | undefined>(initialStats);
  const [oldTestnetId, setOldTestnetId] = useState(activeNetworkId);

  const [blockTimeProgress, setBlockTimeProgress] = useState(0);
  const intervalInSec = REFRESH_RATE / 1000;

  const initStates = (stats: StatsSliceType) => {
    setState(stats);
    setStateBuffer(stats);
    blockTimeInterval();
  };

  const getData = () => {
    fetchStats().then(({ success, data }) => {
      if (success && data) {
        const newStats = {
          ...processStats(data),
          unprocessed: {
            ...data,
            ...getExtraStats(data)
          },
          isFetched: true
        };
        const sameTestnet = oldTestnetId === activeNetworkId;

        if (ref.current !== null) {
          if (stateBuffer === undefined || !sameTestnet) {
            // fresh page load or active testnet changed
            initStates(newStats);
          } else if (sameTestnet) {
            setStateBuffer(newStats);
          }
        }
      }
    });
  };

  useEffect(() => {
    setOldTestnetId(activeNetworkId);
  }, [activeNetworkId]);

  const blockTimeInterval = () => {
    const intervalBlockTime = setInterval(() => {
      if (ref.current !== null && !pageHidden) {
        setBlockTimeProgress((blockTimeProgress) =>
          blockTimeProgress === intervalInSec ? 0 : blockTimeProgress + 1
        );
      }
    }, 1000);
    return () => clearInterval(intervalBlockTime);
  };

  const updateSate = () => {
    if (ref.current !== null) {
      if (blockTimeProgress === intervalInSec && stateBuffer !== undefined) {
        setState(stateBuffer);
      }
    }
  };

  useEffect(getData, [timestamp]);
  useEffect(updateSate, [blockTimeProgress]);

  const play = !pageHidden;
  const progress = (blockTimeProgress * 100) / intervalInSec;

  return (
    <div ref={ref} className={`block-progress-ring ${className ?? ''}`}>
      <ProgressRing progress={progress} size={100} hasBg>
        <div className='label' data-testid='currentEpoch'>
          {stateBuffer !== undefined ? `${blockTimeProgress}s` : '...'}
        </div>
        <div className='description'>Block Time</div>
      </ProgressRing>
    </div>
  );
};
