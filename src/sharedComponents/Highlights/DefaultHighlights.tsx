import * as React from 'react';
import { faCube } from '@fortawesome/pro-regular-svg-icons/faCube';
import { faClock } from '@fortawesome/pro-regular-svg-icons/faClock';
import { faExchangeAlt } from '@fortawesome/pro-regular-svg-icons/faExchangeAlt';
import { faChartBar } from '@fortawesome/pro-regular-svg-icons/faChartBar';
import { faLayerGroup } from '@fortawesome/pro-regular-svg-icons/faLayerGroup';
import { faStopwatch } from '@fortawesome/pro-regular-svg-icons/faStopwatch';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { StateType as DefaultHighlightsProps } from './index';

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
  <div className="bg-primary">
    <div className="container">
      <div className="row">
        <div className="col my-4">
          <ul className="highlights d-flex flex-wrap justify-content-between m-0 p-0">
            <li className="my-3">
              <div className="media">
                <span className="highlight-icon">
                  <FontAwesomeIcon className="fa-2x" icon={faClock} />
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

            <li className="my-3">
              <div className="media">
                <span className="highlight-icon">
                  <FontAwesomeIcon className="fa-2x" icon={faCube} />
                </span>
                <div className="media-body">
                  <span className="highlight-label">BLOCKS</span>
                  <span className="highlight-value">{blockNumber}</span>
                </div>
              </div>
            </li>
            <li className="my-3">
              <div className="media">
                <span className="highlight-icon">
                  <FontAwesomeIcon className="fa-2x" icon={faLayerGroup} />
                </span>
                <div className="media-body">
                  <span className="highlight-label">SHARDS</span>
                  <span className="highlight-value">{nrOfShards}</span>
                </div>
              </div>
            </li>
            <li className="my-3 pr-1 mr-sm-0 d-none">
              <div className="media">
                <span className="highlight-icon">
                  <FontAwesomeIcon className="fa-2x" icon={faChartBar} />
                </span>
                <div className="media-body">
                  <span className="highlight-label">TPS</span>
                  <span className="highlight-value">{liveTPS}</span>
                </div>
              </div>
            </li>
            <li className="my-3">
              <div className="media">
                <span className="highlight-icon">
                  <FontAwesomeIcon className="fa-2x" icon={faStopwatch} />
                </span>
                <div className="media-body">
                  <span className="highlight-label">PEAK TPS</span>
                  <span className="highlight-value" data-testid="peak-tps">
                    {peakTPS}
                  </span>
                </div>
              </div>
            </li>
            <li className="my-3">
              <div className="media">
                <span className="highlight-icon">
                  <FontAwesomeIcon className="fa-2x" icon={faExchangeAlt} />
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
    </div>
  </div>
);

export default DefaultHighlights;
