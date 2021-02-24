import * as React from 'react';
import { useGlobalState } from 'context';
import { adapter } from 'sharedComponents';
import { ReactComponent as Gear } from 'assets/images/network-health/gear.svg';
import { ReactComponent as CenterGear } from 'assets/images/network-health/center-gear.svg';
import { ReactComponent as LayoutGear } from 'assets/images/network-health/layout-gear.svg';
import ProgressRing from './ProgressRing';
import moment from 'moment';

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

const NetworkHealth = () => {
  const {
    activeNetworkId,
    refresh: { timestamp },
  } = useGlobalState();

  const { getStats } = adapter();

  const [state, setState] = React.useState({
    [activeNetworkId]: initialState,
  });
  const [oldTestnetId, setOldTestnetId] = React.useState('');
  const ref = React.useRef(null);

  React.useEffect(() => {
    setOldTestnetId(activeNetworkId);
  }, [activeNetworkId]);

  const getData = () => {
    if (ref.current !== null) {
      getStats().then((statsData) => {
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
                ? moment
                    .utc(data.refreshRate * (data.roundsPerEpoch - data.roundsPassed))
                    .format('HH:mm')
                : '...',
            }
          : initialState;

        if (ref.current !== null) {
          const sameTestnet = oldTestnetId === activeNetworkId;
          if (success || (!success && !sameTestnet)) {
            setState((state) => ({
              ...state,
              [activeNetworkId]: newState,
            }));
          }
        }
      });
    }
  };

  React.useEffect(getData, [timestamp, activeNetworkId]);

  const { shards, blocks, accounts, transactions, epoch, epochPercentage, epochTimeRemaining } =
    activeNetworkId in state ? state[activeNetworkId] : initialState;

  const [blockTimeProgress, setBlockTimeProgress] = React.useState(0);
  const progressStep = 10;

  React.useEffect(() => {
    const intervalBlockTime = setInterval(() => {
      setBlockTimeProgress((blockTimeProgress) => {
        if (blockTimeProgress >= 100) {
          setBlockTimeProgress(0);
        }
        return blockTimeProgress + progressStep;
      });
    }, 2000);
    return () => clearInterval(intervalBlockTime);
  }, []);

  return (
    <div ref={ref} className="card network-health">
      <div className="card-header">
        <div className="card-header-item d-flex justify-content-between align-items-center">
          <h6 className="m-0">Network Health</h6>
        </div>
      </div>
      <div className="card-body d-flex justify-content-center align-items-center">
        <div className="position-relative flex-fill">
          <LayoutGear className="layout-gear" />

          <div className="gear-container top-left">
            <Gear className="gear rotate" />
            <div className="gear-content">
              {accounts}
              <small className="text-secondary">Accounts</small>
            </div>
          </div>

          <div className="gear-container top-right">
            <Gear className="gear rotate" />
            <div className="gear-content">
              {transactions}
              <small className="text-secondary">Transactions</small>
            </div>
          </div>

          <div className="gear-container center">
            <CenterGear className="gear" />
            <div className="gear-content">
              <ProgressRing radius={60} stroke={3} progress={epochPercentage} />
              {epochTimeRemaining}
              <small className="text-secondary">Epoch {epoch}</small>
            </div>
          </div>

          <div className="gear-container bottom-left">
            <Gear className="gear rotate" />
            <div className="gear-content">
              {blocks}
              <small className="text-secondary">Block Height</small>
            </div>
          </div>

          <div className="gear-container bottom-right">
            <Gear className="gear rotate" />
            <div className="gear-content">
              <ProgressRing
                radius={60}
                stroke={3}
                progress={blockTimeProgress}
                dotted={progressStep}
              />
              <small className="text-secondary">Block Time</small>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NetworkHealth;
