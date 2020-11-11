import * as React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faServer } from '@fortawesome/pro-regular-svg-icons/faServer';
import { ShardSpan, Led } from 'sharedComponents';
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
      <div className="card">
        <div className={`card-body px-3 ${isOverall ? 'overall-card bg-primary text-white' : ''}`}>
          <small className={isOverall ? 'text-white' : 'text-light'}>
            {isOverall ? 'Active Validators' : <ShardSpan shard={shard.shardId} />}
          </small>
          <span className="metric-value d-flex align-items-center">
            {!isOverall && <Led color={`mr-2 bg-${status}`} />}
            <span>
              {shard.activeValidators}/{shard.validators}
            </span>
            {!isOverall && (
              <span className="text-muted d-flex align-items-center justify-content-center ml-2">
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
