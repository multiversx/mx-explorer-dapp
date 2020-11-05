import * as React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faServer } from '@fortawesome/pro-regular-svg-icons/faServer';
import { ShardSpan } from 'sharedComponents';
import { ShardType } from 'context/state';
import computeShardStatus from './computeShardStatus';

interface ShardCardType {
  shard: ShardType;
  isOverall?: boolean;
}

const ShardCard = ({ shard, isOverall = false }: ShardCardType) => {
  const status = computeShardStatus(shard);
  return (
    <div className="flex-grow-1 mr-3 mb-3 pb-3">
      <div className={`card ${isOverall ? 'overall-card bg-blue' : ''}`}>
        <div className="card-body px-3">
          <span className="metric-label">
            {isOverall ? 'Active Validators' : <ShardSpan shardId={shard.shardId} />}
          </span>
          <span className="metric-value d-flex align-items-center">
            {!isOverall && (
              <>
                <span
                  className={`
                badge badge-pill badge-status
                ${status === 'success' && 'badge-success'}
                ${status === 'warning' && 'badge-warning'}
                ${status === 'danger' && 'badge-danger'}`}
                >
                  &nbsp;
                </span>
                &nbsp;
              </>
            )}
            <span>
              {shard.activeValidators}/{shard.validators}
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
};

export default ShardCard;
