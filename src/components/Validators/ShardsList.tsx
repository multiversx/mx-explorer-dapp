import * as React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faServer } from '@fortawesome/free-solid-svg-icons';

interface ShardType {
  shardID: string;
  status: string;
  allValidators: number;
  allActiveValidators: number;
}

function generateCard(shardEntry: ShardType, isOverall?: boolean) {
  return (
    <div className="flex-grow-1 mr-3 mb-3 pb-3" key={shardEntry.shardID}>
      <div className={`card ${isOverall ? 'overall-card bg-blue' : ''}`}>
        <div className="card-body">
          <span className="metric-label">
            {shardEntry.shardID === 'Metachain' || isOverall
              ? shardEntry.shardID
              : 'Shard ' + shardEntry.shardID}
          </span>
          <span className="metric-value d-flex align-items-center">
            {!isOverall && (
              <>
                <span
                  className={`
                badge badge-pill badge-status
                ${shardEntry.status === 'success' && 'badge-success'}
                ${shardEntry.status === 'warning' && 'badge-warning'}
                ${shardEntry.status === 'danger' && 'badge-danger'}`}
                >
                  &nbsp;
                </span>
                &nbsp;
              </>
            )}
            <span>
              {shardEntry.allActiveValidators}/{shardEntry.allValidators}
            </span>
            {!isOverall && (
              <span className="shard-icon-container d-flex align-items-center justify-content-center ml-2">
                <FontAwesomeIcon icon={faServer} className="shard-icon" />
              </span>
            )}
          </span>
        </div>
      </div>
    </div>
  );
}

const ShardsList = ({ shardData }: { shardData: ShardType[] }) => {
  const blockchainStatus: ShardType = {
    shardID: 'Active Validators',
    status: '',
    allValidators: shardData.reduce(
      (totalValidators, shardEntry) => totalValidators + shardEntry.allValidators,
      0
    ),
    allActiveValidators: shardData.reduce(
      (totalAllActiveValidators, shardEntry) =>
        totalAllActiveValidators + shardEntry.allActiveValidators,
      0
    ),
  };

  return (
    <div className="row d-flex flex-row pl-3">
      {generateCard(blockchainStatus, true)}
      {shardData.map(shardEntry => generateCard(shardEntry))}
    </div>
  );
};

export default ShardsList;
