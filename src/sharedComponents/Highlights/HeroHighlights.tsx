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
import { StateType as HeroHighlightsProps } from './index';

const HeroHighlights: React.SFC<HeroHighlightsProps> = ({
  blockNumber,
  roundNumber,
  nrOfShards,
  liveTPS,
  peakTPS,
  totalProcessedTxCount,
}) => {
  return (
    <ul className="highlights row">
      <li className="col-6 mt-4 mb-4">
        <span className="highlight-icon">
          <FontAwesomeIcon icon={faCube} />
        </span>
        <span className="highlight-label">BLOCKS</span>
        <span className="highlight-value">{blockNumber}</span>
      </li>
      <li className="col-6 mt-4 mb-4">
        <span className="highlight-icon">
          <FontAwesomeIcon icon={faLayerGroup} />
        </span>
        <span className="highlight-label">SHARDS</span>
        <span className="highlight-value">{nrOfShards}</span>
      </li>
      <li className="col-6 mt-4 mb-4">
        <span className="highlight-icon">
          <FontAwesomeIcon icon={faClock} />
        </span>
        <span className="highlight-label">ROUNDS</span>
        <span className="highlight-value">{roundNumber}</span>
      </li>
      <li className="col-6 mt-4 mb-4">
        <span className="highlight-icon">
          <FontAwesomeIcon icon={faChartBar} />
        </span>
        <span className="highlight-label">LIVE TPS</span>
        <span className="highlight-value">{liveTPS}</span>
      </li>
      <li className="col-6 mt-4 mb-4">
        <span className="highlight-icon">
          <FontAwesomeIcon icon={faStopwatch} />
        </span>
        <span className="highlight-label">PEAK TPS</span>
        <span className="highlight-value">{peakTPS}</span>
      </li>
      <li className="col-6 mt-4 mb-4">
        <span className="highlight-icon">
          <FontAwesomeIcon icon={faExchangeAlt} />
        </span>
        <span className="highlight-label">TRANSACTIONS</span>
        <span className="highlight-value">{totalProcessedTxCount}</span>
      </li>
    </ul>
  );
};

export default HeroHighlights;
