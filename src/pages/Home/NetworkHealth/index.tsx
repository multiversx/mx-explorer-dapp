import * as React from 'react';

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

export const NetworkHealth = () => {
  const { timestamp } = useSelector(refreshSelector);
  const { id: activeNetworkId } = useSelector(activeNetworkSelector);

  const { getStats } = useAdapter();

  const ref = React.useRef(null);
  const pageHidden = document.hidden;
  const initialStats = getInitialStatsState();

  const [stateBuffer, setStateBuffer] = React.useState<
    StatsSliceType | undefined
  >();
  const [state, setState] = React.useState(initialStats);

  const [oldTestnetId, setOldTestnetId] = React.useState(activeNetworkId);
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
        const {
          epochPercentage,
          epochTotalTime,
          epochTimeElapsed,
          epochTimeRemaining
        } = getExtraStats(data);
        const processedStats = processStats(data);

        const sameTestnet = oldTestnetId === activeNetworkId;

        if (ref.current !== null) {
          if (stateBuffer === undefined || !sameTestnet) {
            // fresh page load or active testnet changed
            initStates({
              ...processedStats,

              unprocessed: {
                ...data,
                epochPercentage,
                epochTotalTime,
                epochTimeElapsed,
                epochTimeRemaining
              },
              isFetched: true
            });
          } else if (sameTestnet) {
            setStateBuffer({
              ...processedStats,

              unprocessed: {
                ...data,
                epochPercentage,
                epochTotalTime,
                epochTimeElapsed,
                epochTimeRemaining
              },
              isFetched: true
            });
          }
        }
      }
    });
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  React.useEffect(getData, [timestamp, activeNetworkId]);

  const [blockTimeProgress, setBlockTimeProgress] = React.useState(0);
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

  const {
    blocks,
    accounts,
    transactions,
    unprocessed: { roundsPerEpoch, roundsPassed, epoch, epochPercentage }
  } = state;

  const play = !pageHidden;

  return (
    <div ref={ref} className='card network-health'>
      <div className='card-header'>
        <div className='card-header-item table-card-header d-flex justify-content-between align-items-center flex-wrap'>
          <h5 className='m-0'>Network Health</h5>
        </div>
      </div>
      <div className='card-body d-flex justify-content-center align-items-center'>
        <div className='gears-layout-container position-relative flex-fill'>
          <LayoutGear
            className={`layout-gear blink-${play ? blockTimeProgress : 0}`}
          />

          <div className='big-gear-container'>
            <div className={`animate ${play ? '' : 'paused'}`}>
              <BigGear className='w-100 h-100' />
            </div>
          </div>

          <div className='gear-container top-left'>
            <div className={`animate ${play ? '' : 'paused'}`}>
              <Gear className='w-100 h-100' />
            </div>
            <div className='gear-content'>
              <span data-testid='accounts'>{accounts}</span>
              <small>Accounts</small>
            </div>
          </div>

          <div className='gear-container top-right'>
            <div className={`animate ${play ? '' : 'paused'}`}>
              <Gear className='w-100 h-100' />
            </div>
            <div className='gear-content'>
              <span data-testid='transactions'>{transactions}</span>
              <small>Transactions</small>
            </div>
          </div>

          <div className='gear-container center'>
            <div className={`animate ${play ? '' : 'paused'}`}>
              <CenterGear className='w-100 h-100' />
            </div>
            <div className='gear-content'>
              {/* <ProgressRing progress={epochPercentage} /> */}
              <span className='mt-1'>Epoch {epoch}</span>
              {epoch && (
                <small>
                  {(roundsPerEpoch - roundsPassed).toLocaleString('en')} Rounds{' '}
                  <br />
                  Left
                </small>
              )}
            </div>
          </div>

          <div className='gear-container bottom-left'>
            <div className={`animate ${play ? '' : 'paused'}`}>
              <Gear className='w-100 h-100' />
            </div>
            <div className='gear-content'>
              <span data-testid='blocks'>{blocks}</span>
              <small>Block Height</small>
            </div>
          </div>

          <div className='gear-container bottom-right'>
            <div className={`animate ${play ? '' : 'paused'}`}>
              <Gear className='w-100 h-100' />
            </div>
            <div
              className={`gear-content current-block-time-${blockTimeProgress}`}
            >
              {/* <ProgressRing
                progress={(blockTimeProgress * 100) / intervalInSec}
              /> */}
              {stateBuffer !== undefined ? blockTimeProgress : '...'}
              <small>Block Time</small>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
