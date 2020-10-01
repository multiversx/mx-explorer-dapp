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
import './highlights.scss';

const DefaultHighlights: React.SFC<DefaultHighlightsProps> = ({
  blockNumber,
  epochTimeRemaining,
  epochPercentage,
  nrOfShards,
  liveTPS,
  peakTPS,
  totalProcessedTxCount,
  epoch,
}) => (
  <div className="bg-blue">
    <div className="container pt-4 pb-4">
      <ul className="highlights row d-flex justify-content-between">
        <li className="mt-4 mb-4">
          <div className="media">
            <span className="highlight-icon">
              <FontAwesomeIcon icon={faClock} />
            </span>
            <div className="media-body">
              <span className="highlight-label epoch-label">
                <span className="fade">EPOCH</span>
              </span>
              <span className="highlight-value d-flex">
                <span>{epoch}</span>
                {epochTimeRemaining !== '...' && (
                  <div className="px-2">
                    <div className="highlight-label epoch-time d-flex flex-column">
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
        <li className="mt-4 mb-4 pr-1 mr-sm-0 d-none">
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
              <span className="highlight-value" data-testid="peak-tps">
                {peakTPS}
              </span>
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
