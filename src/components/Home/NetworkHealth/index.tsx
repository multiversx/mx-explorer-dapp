import * as React from 'react';
import { useGlobalState } from 'context';
import { ReactComponent as Gear } from 'assets/images/network-health/gear.svg';
import { ReactComponent as BigGear } from 'assets/images/network-health/big-gear.svg';
import { ReactComponent as CenterGear } from 'assets/images/network-health/center-gear.svg';
import { ReactComponent as LayoutGear } from 'assets/images/network-health/layout-gear.svg';
import ProgressRing from './ProgressRing';
import { refreshRate } from 'appConfig';

const NetworkHealth = () => {
  const { globalStats } = useGlobalState();

  const ref = React.useRef(null);
  const pageHidden = document.hidden;

  const [stateBuffer, setStateBuffer] = React.useState(globalStats);
  const [state, setState] = React.useState(globalStats);

  React.useEffect(() => {
    setStateBuffer(globalStats);

    // for initial page load
    if (state.epoch === '...' && globalStats.epoch !== '...') {
      setState(globalStats);
    }
  }, [globalStats, state]);

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

  React.useEffect(blockTimeInterval, []);

  const { blocks, accounts, transactions, epoch, epochPercentage, epochTimeRemaining } = state;
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
              <span data-testid="epochTimeRemaining">{epochTimeRemaining}</span>
              <small>Epoch {epoch}</small>
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
            <div className="gear-content">
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
