import * as React from 'react';
import {
  faCube,
  faClock,
  faExchangeAlt,
  faChartBar,
  faNetworkWired,
  faStopwatch,
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
        <ul className="highlights row d-flex justify-content-between">
          <li className="mt-4 mb-4">
            <div className="media">
              <span className="highlight-icon">
                <FontAwesomeIcon icon={faCube} />
              </span>
              <div className="media-body">
                <span className="highlight-label">BLOCKS</span>
                <span className="highlight-value">{blockNumber}</span>
              </div>
            </div>
          </li>
          <li className="mt-4 mb-4">
            <div className="media">
              <span className="highlight-icon">
                <FontAwesomeIcon icon={faNetworkWired} />
              </span>
              <div className="media-body">
                <span className="highlight-label">SHARDS</span>
                <span className="highlight-value">{nrOfShards}</span>
              </div>
            </div>
          </li>
          <li className="mt-4 mb-4">
            <div className="media">
              <span className="highlight-icon">
                <FontAwesomeIcon icon={faClock} />
              </span>
              <div className="media-body">
                <span className="highlight-label">ROUNDS</span>
                <span className="highlight-value">{roundNumber}</span>
              </div>
            </div>
          </li>
          <li className="mt-4 mb-4">
            <div className="media">
              <span className="highlight-icon">
                <FontAwesomeIcon icon={faChartBar} />
              </span>
              <div className="media-body">
                <span className="highlight-label">TPS</span>
                <span className="highlight-value">{liveTPS}</span>
              </div>
            </div>
          </li>
          <li className="mt-4 mb-4">
            <div className="media">
              <span className="highlight-icon">
                <FontAwesomeIcon icon={faStopwatch} />
              </span>
              <div className="media-body">
                <span className="highlight-label">PEAK TPS</span>
                <span className="highlight-value">{peakTPS}</span>
              </div>
            </div>
          </li>
          <li className="mt-4 mb-4">
            <div className="media">
              <span className="highlight-icon">
                <FontAwesomeIcon icon={faExchangeAlt} />
              </span>
              <div className="media-body">
                <span className="highlight-label">TRANSACTIONS</span>
                <span className="highlight-value">{totalProcessedTxCount}</span>
              </div>
            </div>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default DefaultHighlights;
