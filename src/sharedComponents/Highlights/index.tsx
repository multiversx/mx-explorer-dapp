import React from 'react';
import {
  faCube,
  faServer,
  faClock,
  faExchangeAlt,
  faChartBar,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useGlobalState } from '../../context';
import { getStats } from './helpers/asyncRequests';

type StateType = {
  blockNumber: string;
  nrOfNodes: string;
  nrOfShards: string;
  roundNumber: string;
  liveTPS: string;
  peakTPS: string;
  totalProcessedTxCount: string;
};

const initialState = {
  blockNumber: '...',
  nrOfNodes: '...',
  nrOfShards: '...',
  roundNumber: '...',
  liveTPS: '...',
  peakTPS: '...',
  totalProcessedTxCount: '...',
};

const Hightlights: React.FC = () => {
  const {
    activeTestnet: { elasticUrl },
  } = useGlobalState();
  const [state, setState] = React.useState<StateType>(initialState);
  let ref = React.useRef(null);

  React.useEffect(() => {
    getStats(elasticUrl).then(({ data, success }) => {
      const newState = success
        ? {
            blockNumber: parseInt(data.blockNumber).toLocaleString('en'),
            nrOfNodes: parseInt(data.nrOfNodes).toLocaleString('en'),
            nrOfShards: parseInt(data.nrOfShards).toLocaleString('en'),
            roundNumber: parseInt(data.roundNumber).toLocaleString('en'),
            liveTPS: parseInt(data.liveTPS).toLocaleString('en'),
            peakTPS: parseInt(data.peakTPS).toLocaleString('en'),
            totalProcessedTxCount: parseInt(data.totalProcessedTxCount).toLocaleString('en'),
          }
        : initialState;
      if (ref.current !== null) {
        setState(newState);
      }
    });
  }, [elasticUrl]); // run the operation only once since the parameter does not change

  return (
    <div ref={ref}>
      <div className="bg-blue">
        <div className="container pt-4 pb-4">
          <ul className="highlights row">
            <li className="col-lg-2 col-6 mt-4 mb-4">
              <span className="highlight-icon">
                <FontAwesomeIcon icon={faCube} />
              </span>
              <span className="highlight-label">CURRENT BLOCK</span>
              <span className="highlight-value">{state.blockNumber}</span>
            </li>
            <li className="col-lg-2 col-6 mt-4 mb-4">
              <span className="highlight-icon">
                <FontAwesomeIcon icon={faServer} />
              </span>
              <span className="highlight-label">NUMBER OF SHARDS</span>
              <span className="highlight-value">{state.nrOfShards}</span>
            </li>
            <li className="col-lg-2 col-6 mt-4 mb-4">
              <span className="highlight-icon">
                <FontAwesomeIcon icon={faClock} />
              </span>
              <span className="highlight-label">CURRENT ROUND</span>
              <span className="highlight-value">{state.roundNumber}</span>
            </li>
            <li className="col-lg-2 col-6 mt-4 mb-4">
              <span className="highlight-icon">
                <FontAwesomeIcon icon={faExchangeAlt} />
              </span>
              <span className="highlight-label">TPS</span>
              <span className="highlight-value">{state.liveTPS}</span>
            </li>
            <li className="col-lg-2 col-6 mt-4 mb-4">
              <span className="highlight-icon">
                <FontAwesomeIcon icon={faChartBar} />
              </span>
              <span className="highlight-label">PEAK TPS</span>
              <span className="highlight-value">{state.peakTPS}</span>
            </li>
            <li className="col-lg-2 col-6 mt-4 mb-4">
              <span className="highlight-icon">
                <FontAwesomeIcon icon={faServer} />
              </span>
              <span className="highlight-label">TOTAL TX</span>
              <span className="highlight-value">{state.totalProcessedTxCount}</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Hightlights;
