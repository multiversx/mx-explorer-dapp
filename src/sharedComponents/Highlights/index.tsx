import React from 'react';
import moment from 'moment';
import { faCube } from '@fortawesome/pro-regular-svg-icons/faCube';
import { faClock } from '@fortawesome/pro-regular-svg-icons/faClock';
import { faExchangeAlt } from '@fortawesome/pro-regular-svg-icons/faExchangeAlt';
import { faLayerGroup } from '@fortawesome/pro-regular-svg-icons/faLayerGroup';
import { faStopwatch } from '@fortawesome/pro-regular-svg-icons/faStopwatch';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useGlobalState } from 'context';
import { adapter } from 'sharedComponents';
import { refreshRate } from 'appConfig';

export interface StateType {
  blockNumber: string;
  nrOfNodes: string;
  nrOfShards: string;
  roundNumber: string;
  liveTPS: string;
  peakTPS: string;
  totalProcessedTxCount: string;
  epochPercentage: number;
  epochTotalTime: string;
  epochTimeElapsed: string;
  epochTimeRemaining: string;
  epoch: string;
}

interface ItemType {
  title: string;
  value: string;
  icon: typeof faCube;
}

const Item = ({ title, value, icon }: ItemType) => (
  <li className="my-3">
    <div className="highlight-item d-flex align-items-center">
      <FontAwesomeIcon className="fa-2x" icon={icon} />
      <div className="d-flex flex-column ml-3">
        <small className="mb-1 text-capitalize">{title}</small>
        <span className="h5 mb-0 font-weight-normal">{value}</span>
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
  epochPercentage: 0,
  epoch: '...',
  epochTotalTime: '...',
  epochTimeElapsed: '...',
  epochTimeRemaining: '',
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
  const [oldTestnetId, setOldTestnetId] = React.useState<string>('');
  const ref = React.useRef(null);

  React.useEffect(() => {
    setOldTestnetId(activeNetworkId);
  }, [activeNetworkId]);

  const getData = () => {
    if (ref.current !== null) {
      getHighlights().then(({ data, success }) => {
        const check = data.roundsPerEpoch >= data.roundsPassed;
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
              epoch: data.epoch.toLocaleString('en'),
              epochPercentage: check ? (100 * data.roundsPassed) / data.roundsPerEpoch : 0,
              epochTotalTime: check
                ? moment.utc(refreshRate * data.roundsPerEpoch).format('HH:mm')
                : '...',
              epochTimeElapsed: check
                ? moment.utc(refreshRate * data.roundsPassed).format('HH:mm')
                : '...',
              epochTimeRemaining: check
                ? moment
                    .utc(refreshRate * (data.roundsPerEpoch - data.roundsPassed))
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

  const {
    blockNumber,
    epochTimeRemaining,
    epochPercentage,
    nrOfShards,
    peakTPS,
    totalProcessedTxCount,
    epoch,
  } = activeNetworkId in state ? state[activeNetworkId] : initialState;

  return (
    <div ref={ref}>
      <div className="highligths bg-primary">
        <div className="container">
          <div className="row">
            <div className="col my-4">
              <ul className="list-unstyled d-flex flex-wrap justify-content-between m-0 p-0">
                <li className="my-3">
                  <div className="highlight-item d-flex align-items-center">
                    <FontAwesomeIcon className="fa-2x" icon={faClock} />
                    <div className="d-flex flex-column ml-3">
                      <small className="mb-1 epoch-label">EPOCH</small>
                      <span className="d-flex">
                        <span className="h5 mb-0 current-epoch">{epoch}</span>
                        {epochTimeRemaining !== '...' && (
                          <div className="px-2">
                            <div className="epoch-time d-flex flex-column">
                              <div className="epoch-progress">
                                <div className="fill" style={{ width: `${epochPercentage}%` }}>
                                  &nbsp;
                                </div>
                              </div>
                              <small>{epochTimeRemaining} remaining</small>
                            </div>
                          </div>
                        )}
                      </span>
                    </div>
                  </div>
                </li>

                <Item icon={faCube} title="Blocks" value={blockNumber} />
                <Item icon={faLayerGroup} title="Shards" value={nrOfShards} />
                <Item icon={faStopwatch} title="Peak Tps" value={peakTPS} />
                <Item icon={faExchangeAlt} title="Transactions" value={totalProcessedTxCount} />
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hightlights;
