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

            <li className="my-3">
              <div className="highlight-item d-flex align-items-center">
                <FontAwesomeIcon className="fa-2x" icon={faCube} />
                <div className="d-flex flex-column ml-3">
                  <small className="mb-1">BLOCKS</small>
                  <span className="h5 mb-0 font-weight-normal">{blockNumber}</span>
                </div>
              </div>
            </li>

            <li className="my-3">
              <div className="highlight-item d-flex align-items-center">
                <FontAwesomeIcon className="fa-2x" icon={faLayerGroup} />
                <div className="d-flex flex-column ml-3">
                  <small className="mb-1">SHARDS</small>
                  <span className="h5 mb-0 font-weight-normal">{nrOfShards}</span>
                </div>
              </div>
            </li>

            <li className="my-3 d-none">
              <div className="highlight-item d-flex align-items-center">
                <FontAwesomeIcon className="fa-2x" icon={faChartBar} />
                <div className="d-flex flex-column ml-3">
                  <small className="mb-1">TPS</small>
                  <span className="h5 mb-0 font-weight-normal">{liveTPS}</span>
                </div>
              </div>
            </li>

            <li className="my-3">
              <div className="highlight-item d-flex align-items-center">
                <FontAwesomeIcon className="fa-2x" icon={faStopwatch} />
                <div className="d-flex flex-column ml-3">
                  <small className="mb-1">PEAK TPS</small>
                  <span className="h5 mb-0 font-weight-normal" data-testid="peak-tps">
                    {peakTPS}
                  </span>
                </div>
              </div>
            </li>

            <li className="my-3">
              <div className="highlight-item d-flex align-items-center">
                <FontAwesomeIcon className="fa-2x" icon={faExchangeAlt} />
                <div className="d-flex flex-column ml-3">
                  <small className="mb-1">TRANSACTIONS</small>
                  <span className="h5 mb-0 font-weight-normal">{totalProcessedTxCount}</span>
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
