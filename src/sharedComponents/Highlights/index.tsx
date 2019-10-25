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
  const { elasticUrl } = useGlobalState();
  const [state, setState] = React.useState<StateType>(initialState);

  React.useEffect(() => {
    getStats(elasticUrl).then(setState);
  }, [elasticUrl]); // run the operation only once since the parameter does not change

  //   $scope.currentBlockNumber = statistics.blockNumber.toLocaleString('en');
  //   $scope.nrOfNodes = statistics.nrOfNodes.toLocaleString('en');
  //   $scope.nrOfShards = statistics.nrOfShards.toLocaleString('en');
  //   $scope.roundNumber = statistics.roundNumber.toLocaleString('en');
  //   $scope.liveTPS = statistics.liveTPS.toLocaleString('en');
  //   $scope.peakTPS = statistics.peakTPS.toLocaleString('en');
  //   $scope.totalProcessedTxCount = statistics.totalProcessedTxCount.toLocaleString('en');
  return (
    <div>
      <div className="bg-blue">
        <div className="container pt-4 pb-4">
          <ul className="highlights row">
            <li className="col-lg-2 col-6 mt-4 mb-4">
              <span className="highlight-icon">
                <FontAwesomeIcon icon={faCube} />
              </span>
              <span className="highlight-label">CURRENT BLOCK</span>
              <span className="highlight-value">
                {parseInt(state.blockNumber).toLocaleString('en')}
              </span>
            </li>
            <li className="col-lg-2 col-6 mt-4 mb-4">
              <span className="highlight-icon">
                <FontAwesomeIcon icon={faServer} />
              </span>
              <span className="highlight-label">NUMBER OF SHARDS</span>
              <span className="highlight-value">
                {parseInt(state.nrOfShards).toLocaleString('en')}
              </span>
            </li>
            <li className="col-lg-2 col-6 mt-4 mb-4">
              <span className="highlight-icon">
                <FontAwesomeIcon icon={faClock} />
              </span>
              <span className="highlight-label">CURRENT ROUND</span>
              <span className="highlight-value">
                {parseInt(state.roundNumber).toLocaleString('en')}
              </span>
            </li>
            <li className="col-lg-2 col-6 mt-4 mb-4">
              <span className="highlight-icon">
                <FontAwesomeIcon icon={faExchangeAlt} />
              </span>
              <span className="highlight-label">TPS</span>
              <span className="highlight-value">
                {parseInt(state.liveTPS).toLocaleString('en')}
              </span>
            </li>
            <li className="col-lg-2 col-6 mt-4 mb-4">
              <span className="highlight-icon">
                <FontAwesomeIcon icon={faChartBar} />
              </span>
              <span className="highlight-label">PEAK TPS</span>
              <span className="highlight-value">
                {parseInt(state.peakTPS).toLocaleString('en')}
              </span>
            </li>
            <li className="col-lg-2 col-6 mt-4 mb-4">
              <span className="highlight-icon">
                <FontAwesomeIcon icon={faServer} />
              </span>
              <span className="highlight-label">TOTAL TX</span>
              <span className="highlight-value">
                {parseInt(state.totalProcessedTxCount).toLocaleString('en')}
              </span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Hightlights;
