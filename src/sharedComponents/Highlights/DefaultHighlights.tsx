import * as React from 'react';
import {
  faCube,
  faClock,
  faExchangeAlt,
  faChartBar,
  faLayerGroup,
  faStopwatch,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { StateType as DefaultHighlightsProps } from './index';

const DefaultHighlights: React.SFC<DefaultHighlightsProps> = ({
  blockNumber,
  roundNumber,
  nrOfShards,
  liveTPS,
  peakTPS,
  totalProcessedTxCount,
}) => (
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
              <FontAwesomeIcon icon={faLayerGroup} />
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

export default DefaultHighlights;
