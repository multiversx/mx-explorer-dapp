import * as React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClock } from '@fortawesome/pro-regular-svg-icons/faClock';

interface EpochType {
  epoch: string;
  epochTimeRemaining: string;
  epochPercentage: number;
}

const Epoch = ({ epoch, epochTimeRemaining, epochPercentage }: EpochType) => {
  return (
    <li className="my-3 px-2">
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
                  <small data-testid="metaEpochTimeRemaining">{epochTimeRemaining} remaining</small>
                </div>
              </div>
            )}
          </span>
        </div>
      </div>
    </li>
  );
};

export default Epoch;
