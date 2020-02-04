import {
  faChartBar,
  faClock,
  faCube,
  faExchangeAlt,
  faLayerGroup,
  faStopwatch,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import * as React from 'react';
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
        <span className="highlight-value" data-testid="blockNumber">
          {blockNumber}
        </span>
      </li>
      <li className="col-6 mt-4 mb-4">
        <span className="highlight-icon">
          <FontAwesomeIcon icon={faLayerGroup} />
        </span>
        <span className="highlight-label">SHARDS</span>
        <span className="highlight-value" data-testid="nrOfShards">
          {nrOfShards}
        </span>
      </li>
      <li className="col-6 mt-4 mb-4">
        <span className="highlight-icon">
          <FontAwesomeIcon icon={faClock} />
        </span>
        <span className="highlight-label">ROUNDS</span>
        <span className="highlight-value" data-testid="roundNumber">
          {roundNumber}
        </span>
      </li>
      <li className="col-6 mt-4 mb-4">
        <span className="highlight-icon">
          <FontAwesomeIcon icon={faChartBar} />
        </span>
        <span className="highlight-label">LIVE TPS</span>
        <span className="highlight-value" data-testid="liveTPS">
          {liveTPS}
        </span>
      </li>
      <li className="col-6 mt-4 mb-4">
        <span className="highlight-icon">
          <FontAwesomeIcon icon={faStopwatch} />
        </span>
        <span className="highlight-label">PEAK TPS</span>
        <span className="highlight-value" data-testid="peakTPS">
          {peakTPS}
        </span>
      </li>
      <li className="col-6 mt-4 mb-4">
        <span className="highlight-icon">
          <FontAwesomeIcon icon={faExchangeAlt} />
        </span>
        <span className="highlight-label">TRANSACTIONS</span>
        <span className="highlight-value" data-testid="totalProcessedTxCount">
          {totalProcessedTxCount}
        </span>
      </li>
    </ul>
  );
};

export default HeroHighlights;
