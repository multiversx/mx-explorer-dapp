import React, { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';

import { REFRESH_RATE } from 'appConstants';
import { ProgressRing } from 'components';
import { processStats, getExtraStats } from 'helpers';
import { useFetchStats } from 'hooks';
import { activeNetworkSelector, refreshSelector } from 'redux/selectors';
import { StatsSliceType, WithClassnameType } from 'types';

export const BlockProgressRing = ({ className }: WithClassnameType) => {
  const ref = useRef(null);
  const fetchStats = useFetchStats();
  const { timestamp } = useSelector(refreshSelector);
  const { id: activeNetworkId } = useSelector(activeNetworkSelector);

  const pageHidden = document.hidden;

  const [stateBuffer, setStateBuffer] = useState<StatsSliceType | undefined>();
  const [oldTestnetId, setOldTestnetId] = useState(activeNetworkId);

  const [blockTimeProgress, setBlockTimeProgress] = useState(1);
  const intervalInSec = REFRESH_RATE / 1000;

  const initStates = (stats: StatsSliceType) => {
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
          blockTimeProgress === intervalInSec ? 1 : blockTimeProgress + 1
        );
      }
    }, 1000);
    return () => clearInterval(intervalBlockTime);
  };

  useEffect(getData, [timestamp]);

  const progress = (blockTimeProgress * 100) / intervalInSec;

  return (
    <div ref={ref} className={`block-progress-ring ${className ?? ''}`}>
      <ProgressRing progress={Number(progress.toFixed(2))} size={100} hasBg>
        <div className='label' data-testid='currentEpoch'>
          {stateBuffer !== undefined ? `${blockTimeProgress}s` : '...'}
        </div>
        <div className='description'>Block Time</div>
      </ProgressRing>
    </div>
  );
};
