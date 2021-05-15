import * as React from 'react';
import { useGlobalState } from 'context';
import { adapter } from 'sharedComponents';
import { ReactComponent as Gear } from 'assets/images/network-health/gear.svg';
import { ReactComponent as BigGear } from 'assets/images/network-health/big-gear.svg';
import { ReactComponent as CenterGear } from 'assets/images/network-health/center-gear.svg';
import { ReactComponent as LayoutGear } from 'assets/images/network-health/layout-gear.svg';
import ProgressRing from './ProgressRing';
import { refreshRate } from 'appConfig';
import { processStats } from 'helpers';
import { initialStats } from 'helpers/processStats';

export interface StateType {
  shards: string;
  blocks: string;
  accounts: string;
  transactions: string;
}

const NetworkHealth = () => {
  const {
    activeNetworkId,
    refresh: { timestamp },
  } = useGlobalState();
  const { getStats } = adapter();

  const ref = React.useRef(null);
  const pageHidden = document.hidden;

  const [stateBuffer, setStateBuffer] = React.useState<typeof initialStats | undefined>();
  const [state, setState] = React.useState(initialStats);

  const [oldTestnetId, setOldTestnetId] = React.useState(activeNetworkId);
  React.useEffect(() => {
    setOldTestnetId(activeNetworkId);
  }, [activeNetworkId]);

  const initStates = (stats: typeof initialStats) => {
    setState(stats);
    setStateBuffer(stats);
    blockTimeInterval();
  };

  const getData = () => {
    getStats().then((statsData) => {
      const { success } = statsData;
      const newStats = processStats(statsData);
      const sameTestnet = oldTestnetId === activeNetworkId;

      if (ref.current !== null && success) {
        if (stateBuffer === undefined || !sameTestnet) {
          // fresh page load or active testnet changed
          initStates(newStats);
        } else if (sameTestnet) {
          setStateBuffer(newStats);
        }
      }
    });
  };
  React.useEffect(getData, [timestamp, activeNetworkId]);

  const [blockTimeProgress, setBlockTimeProgress] = React.useState(0);
  const intervalInSec = refreshRate / 1000;

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
  React.useEffect(updateSate, [blockTimeProgress]);

  const {
    blocks,
    accounts,
    transactions,
    epoch,
    epochPercentage,
    roundsPerEpoch,
    roundsPassed,
  } = state;

  const play = !pageHidden;

  return (
    <div ref={ref} className="card network-health">
      <div className="card-header">
        <div className="card-header-item d-flex justify-content-between align-items-center">
          <h6 className="m-0">Network Health</h6>
        </div>
      </div>
      <div className="card-body d-flex justify-content-center align-items-center">
        <div className="gears-layout-container position-relative flex-fill">
          <LayoutGear className={`layout-gear blink-${play ? blockTimeProgress : 0}`} />

          <div className="big-gear-container">
            <div className={`animate ${play ? '' : 'paused'}`}>
              <BigGear className="w-100 h-100" />
            </div>
          </div>

          <div className="gear-container top-left">
            <div className={`animate ${play ? '' : 'paused'}`}>
              <Gear className="w-100 h-100" />
            </div>
            <div className="gear-content">
              <span data-testid="accounts">{accounts}</span>
              <small>Accounts</small>
            </div>
          </div>

          <div className="gear-container top-right">
            <div className={`animate ${play ? '' : 'paused'}`}>
              <Gear className="w-100 h-100" />
            </div>
            <div className="gear-content">
              <span data-testid="transactions">{transactions}</span>
              <small>Transactions</small>
            </div>
          </div>

          <div className="gear-container center">
            <div className={`animate ${play ? '' : 'paused'}`}>
              <CenterGear className="w-100 h-100" />
            </div>
            <div className="gear-content">
              <ProgressRing progress={epochPercentage} />
              <span className="mt-1">Epoch {epoch}</span>
              {epoch !== '...' && (
                <small>
                  {(roundsPerEpoch - roundsPassed).toLocaleString('en')} Rounds <br />
                  Left
                </small>
              )}
            </div>
          </div>

          <div className="gear-container bottom-left">
            <div className={`animate ${play ? '' : 'paused'}`}>
              <Gear className="w-100 h-100" />
            </div>
            <div className="gear-content">
              <span data-testid="blocks">{blocks}</span>
              <small>Block Height</small>
            </div>
          </div>

          <div className="gear-container bottom-right">
            <div className={`animate ${play ? '' : 'paused'}`}>
              <Gear className="w-100 h-100" />
            </div>
            <div className={`gear-content current-block-time-${blockTimeProgress}`}>
              <ProgressRing progress={(blockTimeProgress * 100) / intervalInSec} />
              {stateBuffer !== undefined ? blockTimeProgress : '...'}
              <small>Block Time</small>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NetworkHealth;
