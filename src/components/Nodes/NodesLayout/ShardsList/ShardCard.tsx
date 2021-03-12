import * as React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faServer } from '@fortawesome/pro-solid-svg-icons/faServer';
import { ShardSpan, Led } from 'sharedComponents';
import { ShardType } from 'context/state';
import computeShardStatus from './computeShardStatus';

interface ShardCardType {
  shard: ShardType;
  isOverall?: boolean;
}

const ShardCard = ({ shard, isOverall }: ShardCardType) => {
  const status = computeShardStatus(shard);

  return (
    <div className="shard-card py-3">
      <div className="mb-2">
        {!isOverall && (
          <FontAwesomeIcon icon={faServer} className="shard-icon text-secondary mr-2" />
        )}
        <span className="text-secondary">
          {isOverall ? 'Active Validators' : <ShardSpan shard={shard.shard} />}
        </span>
      </div>
      <div className="d-flex align-items-center">
        {!isOverall && <Led color={`led ml-1 mr-2 bg-${status}`} />}
        <h5 className="m-0">
          {shard.activeValidators}/{shard.validators}
        </h5>
      </div>
    </div>
  );
};

export default ShardCard;
