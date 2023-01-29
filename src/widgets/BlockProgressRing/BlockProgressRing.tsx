import React, { useEffect, useRef, useState } from 'react';

import { useSelector } from 'react-redux';
import { REFRESH_RATE } from 'appConstants';
import { ReactComponent as BigGear } from 'assets/img/network-health/big-gear.svg';
import { ReactComponent as CenterGear } from 'assets/img/network-health/center-gear.svg';
import { ReactComponent as Gear } from 'assets/img/network-health/gear.svg';
import { ReactComponent as LayoutGear } from 'assets/img/network-health/layout-gear.svg';
import { useAdapter } from 'components';
import { processStats, validDisplayValue, getExtraStats } from 'helpers';
import { activeNetworkSelector, refreshSelector } from 'redux/selectors';
import { getInitialStatsState } from 'redux/slices/stats';

import { StatsSliceType } from 'types/stats.types';
import { ProgressRing } from 'components';

export const BlockProgressRing = () => {
  const ref = useRef(null);

  const { timestamp } = useSelector(refreshSelector);
  const { id: activeNetworkId } = useSelector(activeNetworkSelector);

  const { getStats } = useAdapter();

  const pageHidden = document.hidden;
  const initialStats = getInitialStatsState();

  const [stateBuffer, setStateBuffer] = useState<StatsSliceType | undefined>();
  const [state, setState] = useState<StatsSliceType | undefined>(initialStats);
  const [oldTestnetId, setOldTestnetId] = useState(activeNetworkId);

  React.useEffect(() => {
    setOldTestnetId(activeNetworkId);
  }, [activeNetworkId]);

  const initStates = (stats: StatsSliceType) => {
    setState(stats);
    setStateBuffer(stats);
    blockTimeInterval();
  };

  const getData = () => {
    getStats().then(({ success, data }) => {
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

  React.useEffect(getData, [timestamp]);

  const [blockTimeProgress, setBlockTimeProgress] = useState(0);
  const intervalInSec = REFRESH_RATE / 1000;

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

  // eslint-disable-next-line react-hooks/exhaustive-deps
  React.useEffect(updateSate, [blockTimeProgress]);

  const play = !pageHidden;

  return (
    <div ref={ref} className='card network-health'>
      {/* <EpochGear showTime /> */}
      dfs
      {/* 
      <div className='gear-container bottom-right'>
        <div className={`animate ${play ? '' : 'paused'}`}></div>
        <div className={`gear-content current-block-time-${blockTimeProgress}`}>
          <ProgressRing
                progress={(blockTimeProgress * 100) / intervalInSec}
              /> 
          {stateBuffer !== undefined ? blockTimeProgress : '...'}
          <small>Block Time</small>
        </div>
      </div> */}
    </div>
  );
};
