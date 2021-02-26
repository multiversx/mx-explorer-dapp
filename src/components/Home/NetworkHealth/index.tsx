import * as React from 'react';
import moment from 'moment';
import { useGlobalState } from 'context';
import { adapter } from 'sharedComponents';
import { ReactComponent as Gear } from 'assets/images/network-health/gear.svg';
import { ReactComponent as BigGear } from 'assets/images/network-health/big-gear.svg';
import { ReactComponent as CenterGear } from 'assets/images/network-health/center-gear.svg';
import { ReactComponent as LayoutGear } from 'assets/images/network-health/layout-gear.svg';
import ProgressRing from './ProgressRing';
import { refreshRate } from 'appConfig';

export interface StateType {
  shards: string;
  blocks: string;
  accounts: string;
  transactions: string;
}

const initialState = {
  shards: '...',
  blocks: '...',
  accounts: '...',
  transactions: '...',
  epoch: '...',
  epochPercentage: 0,
  epochTotalTime: '...',
  epochTimeElapsed: '...',
  epochTimeRemaining: '...',
};

const processStats = (statsData: any) => {
  const { data, success } = statsData;
  const check = success ? data.roundsPerEpoch >= data.roundsPassed : false;
  const newState = success
    ? {
        shards: parseInt(data.shards).toLocaleString('en'),
        blocks: parseInt(data.blocks).toLocaleString('en'),
        accounts: parseInt(data.accounts).toLocaleString('en'),
        transactions: parseInt(data.transactions).toLocaleString('en'),
        epoch: data.epoch.toLocaleString('en'),
        epochPercentage: check ? (100 * data.roundsPassed) / data.roundsPerEpoch : 0,
        epochTotalTime: check
          ? moment.utc(data.refreshRate * data.roundsPerEpoch).format('HH:mm')
          : '...',
        epochTimeElapsed: check
          ? moment.utc(data.refreshRate * data.roundsPassed).format('HH:mm')
          : '...',
        epochTimeRemaining: check
          ? moment.utc(data.refreshRate * (data.roundsPerEpoch - data.roundsPassed)).format('HH:mm')
          : '...',
      }
    : initialState;

  return newState;
};

const NetworkHealth = () => {
  const {
    activeNetworkId,
    refresh: { timestamp },
  } = useGlobalState();
  const { getStats } = adapter();

  const ref = React.useRef(null);
  const [stateBuffer, setStateBuffer] = React.useState<typeof initialState | undefined>();
  const [state, setState] = React.useState(initialState);

  const [oldTestnetId, setOldTestnetId] = React.useState(activeNetworkId);
  React.useEffect(() => {
    setOldTestnetId(activeNetworkId);
  }, [activeNetworkId]);

  const initStates = (stats: typeof initialState) => {
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
      if (ref.current !== null && !document.hidden) {
        setBlockTimeProgress((blockTimeProgress) =>
          blockTimeProgress === intervalInSec ? 0 : blockTimeProgress + 1
        );
      }
    }, 1000);
    return () => clearInterval(intervalBlockTime);
  };

  const updateSate = () => {
    if (blockTimeProgress === intervalInSec && stateBuffer !== undefined) {
      setState(stateBuffer);
    }
  };
  React.useEffect(updateSate, [blockTimeProgress]);

  const { blocks, accounts, transactions, epoch, epochPercentage, epochTimeRemaining } = state;

  return (
    <div ref={ref} className="card network-health">
      <div className="card-header">
        <div className="card-header-item d-flex justify-content-between align-items-center">
          <h6 className="m-0">Network Health</h6>
        </div>
      </div>
      <div className="card-body d-flex justify-content-center align-items-center">
        <div className="gears-layout-container position-relative flex-fill">
          <LayoutGear className={`layout-gear blink-${blockTimeProgress}`} />
          <BigGear className="big-gear" />

          <div className="gear-container top-left">
            <Gear className="gear" />
            <div className="gear-content">
              {accounts}
              <small>Accounts</small>
            </div>
          </div>

          <div className="gear-container top-right">
            <Gear className="gear" />
            <div className="gear-content">
              {transactions}
              <small>Transactions</small>
            </div>
          </div>

          <div className="gear-container center">
            <CenterGear className="gear" />
            <div className="gear-content">
              <ProgressRing progress={epochPercentage} />
              {epochTimeRemaining}
              <small>Epoch {epoch}</small>
            </div>
          </div>

          <div className="gear-container bottom-left">
            <Gear className="gear" />
            <div className="gear-content">
              {blocks}
              <small>Block Height</small>
            </div>
          </div>

          <div className="gear-container bottom-right">
            <Gear className="gear" />
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
