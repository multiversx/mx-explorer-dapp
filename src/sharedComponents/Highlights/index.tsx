import * as React from 'react';
import { faCube } from '@fortawesome/pro-regular-svg-icons/faCube';
import { faExchangeAlt } from '@fortawesome/pro-regular-svg-icons/faExchangeAlt';
import { faLayerGroup } from '@fortawesome/pro-regular-svg-icons/faLayerGroup';
import { faStopwatch } from '@fortawesome/pro-regular-svg-icons/faStopwatch';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useGlobalState } from 'context';
import { adapter } from 'sharedComponents';
import Epoch from './Epoch';

export interface StateType {
  blockNumber: string;
  nrOfNodes: string;
  nrOfShards: string;
  roundNumber: string;
  liveTPS: string;
  peakTPS: string;
  totalProcessedTxCount: string;
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
  blockNumber: '...',
  nrOfNodes: '...',
  nrOfShards: '...',
  roundNumber: '...',
  liveTPS: '...',
  peakTPS: '...',
  totalProcessedTxCount: '...',
};

const Hightlights = () => {
  const {
    activeNetworkId,
    refresh: { timestamp },
  } = useGlobalState();

  const { getHighlights } = adapter();

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
      getHighlights().then(({ data, success }) => {
        const newState = success
          ? {
              blockNumber: data.blockCount
                ? parseInt(data.blockCount).toLocaleString('en')
                : parseInt(data.blockNumber).toLocaleString('en'),
              nrOfNodes: parseInt(data.nrOfNodes).toLocaleString('en'),
              nrOfShards: parseInt(data.nrOfShards).toLocaleString('en'),
              roundNumber: parseInt(data.roundNumber).toLocaleString('en'),
              liveTPS: parseInt(data.liveTPS).toLocaleString('en'),
              peakTPS: parseInt(data.peakTPS).toLocaleString('en'),
              totalProcessedTxCount: parseInt(data.totalProcessedTxCount).toLocaleString('en'),
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

  const { blockNumber, nrOfShards, peakTPS, totalProcessedTxCount } =
    activeNetworkId in state ? state[activeNetworkId] : initialState;

  return (
    <div ref={ref}>
      <div className="highligths bg-primary">
        <div className="container">
          <div className="row">
            <div className="col my-4">
              <ul className="list-unstyled d-flex flex-wrap justify-content-between m-0 p-0">
                <Epoch />
                <Item icon={faCube} title="Blocks" dataTestId="metaBlocks" value={blockNumber} />
                <Item
                  icon={faLayerGroup}
                  title="Shards"
                  dataTestId="metaShards"
                  value={nrOfShards}
                />
                <Item
                  icon={faStopwatch}
                  title="Peak Tps"
                  dataTestId="metaPeakTps"
                  value={peakTPS}
                />
                <Item
                  icon={faExchangeAlt}
                  title="Transactions"
                  dataTestId="metaTransactions"
                  value={totalProcessedTxCount}
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
