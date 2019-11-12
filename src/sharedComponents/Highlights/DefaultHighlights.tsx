import * as React from 'react';
import {
  faCube,
  faServer,
  faClock,
  faExchangeAlt,
  faChartBar,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useLocation } from 'react-router-dom';
import { useGlobalState } from '../../context';
import { StateType as DefaultHighlightsProps } from './index';

const DefaultHighlights: React.SFC<DefaultHighlightsProps> = ({
  blockNumber,
  roundNumber,
  nrOfShards,
  liveTPS,
  peakTPS,
  totalProcessedTxCount,
}) => {
  const { activeTestnetId } = useGlobalState();
  const { pathname } = useLocation();

  let locationArray = pathname.substr(1).split('/');

  const testnetId = locationArray[0];

  // #/cryptobubbles/ -> ['cryptobubbles', '']
  locationArray = testnetId !== '' ? locationArray.filter(Boolean) : locationArray;

  if (activeTestnetId === testnetId && locationArray.length === 1) {
    return null;
  }

  return (
    <div className="bg-blue">
      <div className="container pt-4 pb-4">
        <ul className="highlights row">
          <li className="col-lg-2 col-6 mt-4 mb-4">
            <span className="highlight-icon">
              <FontAwesomeIcon icon={faCube} />
            </span>
            <span className="highlight-label">CURRENT BLOCK</span>
            <span className="highlight-value">{blockNumber}</span>
          </li>
          <li className="col-lg-2 col-6 mt-4 mb-4">
            <span className="highlight-icon">
              <FontAwesomeIcon icon={faServer} />
            </span>
            <span className="highlight-label">NUMBER OF SHARDS</span>
            <span className="highlight-value">{nrOfShards}</span>
          </li>
          <li className="col-lg-2 col-6 mt-4 mb-4">
            <span className="highlight-icon">
              <FontAwesomeIcon icon={faClock} />
            </span>
            <span className="highlight-label">CURRENT ROUND</span>
            <span className="highlight-value">{roundNumber}</span>
          </li>
          <li className="col-lg-2 col-6 mt-4 mb-4">
            <span className="highlight-icon">
              <FontAwesomeIcon icon={faExchangeAlt} />
            </span>
            <span className="highlight-label">TPS</span>
            <span className="highlight-value">{liveTPS}</span>
          </li>
          <li className="col-lg-2 col-6 mt-4 mb-4">
            <span className="highlight-icon">
              <FontAwesomeIcon icon={faChartBar} />
            </span>
            <span className="highlight-label">PEAK TPS</span>
            <span className="highlight-value">{peakTPS}</span>
          </li>
          <li className="col-lg-2 col-6 mt-4 mb-4">
            <span className="highlight-icon">
              <FontAwesomeIcon icon={faServer} />
            </span>
            <span className="highlight-label">TOTAL TX</span>
            <span className="highlight-value">{totalProcessedTxCount}</span>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default DefaultHighlights;
