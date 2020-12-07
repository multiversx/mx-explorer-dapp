import * as React from 'react';
import moment from 'moment';
import { faCube } from '@fortawesome/pro-regular-svg-icons/faCube';
import { faExchangeAlt } from '@fortawesome/pro-regular-svg-icons/faExchangeAlt';
import { faLayerGroup } from '@fortawesome/pro-regular-svg-icons/faLayerGroup';
import { faUser } from '@fortawesome/pro-regular-svg-icons/faUser';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useGlobalState } from 'context';
import { adapter } from 'sharedComponents';
import Epoch from './Epoch';

export interface StateType {
  shards: string;
  blocks: string;
  accounts: string;
  transactions: string;
}

interface ItemType {
  title: string;
  value: string;
  dataTestId?: string;
  icon: typeof faCube;
}

const Item = ({ title, value, icon, dataTestId = '' }: ItemType) => (
  <li className="my-3 px-2">
    <div className="highlight-item d-flex align-items-center">
      <FontAwesomeIcon className="fa-2x" icon={icon} />
      <div className="d-flex flex-column ml-3">
        <small className="mb-1 text-uppercase">{title}</small>
        <span className="h5 mb-0 font-weight-normal" data-testid={dataTestId}>
          {value}
        </span>
      </div>
    </div>
  </li>
);

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

const Hightlights = () => {
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

  return (
    <div ref={ref}>
      <div className="highligths bg-primary">
        <div className="container">
          <div className="row">
            <div className="col my-4">
              <ul className="list-unstyled d-flex flex-wrap justify-content-between m-0 p-0">
                <Epoch
                  epoch={epoch}
                  epochPercentage={epochPercentage}
                  epochTimeRemaining={epochTimeRemaining}
                />
                <Item icon={faLayerGroup} title="Shards" dataTestId="shards" value={shards} />
                <Item icon={faCube} title="Blocks" dataTestId="blocks" value={blocks} />
                <Item icon={faUser} title="Accounts" dataTestId="accounts" value={accounts} />
                <Item
                  icon={faExchangeAlt}
                  title="Transactions"
                  dataTestId="transactions"
                  value={transactions}
                />
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hightlights;
