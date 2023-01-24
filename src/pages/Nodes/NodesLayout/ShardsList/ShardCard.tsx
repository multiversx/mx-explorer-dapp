import * as React from 'react';
import { faLayerGroup } from '@fortawesome/pro-solid-svg-icons/faLayerGroup';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { ShardSpan, Led } from 'components';
import { ShardType } from 'types';
import { computeShardStatus } from './computeShardStatus';

interface ShardCardType {
  shard: ShardType;
  isOverall?: boolean;
}

export const ShardCard = ({ shard, isOverall }: ShardCardType) => {
  const status = computeShardStatus(shard);

  return (
    <div className='shard-card py-3'>
      <div className='mb-2'>
        {!isOverall && (
          <FontAwesomeIcon
            icon={faLayerGroup}
            className='shard-icon text-primary me-2'
          />
        )}
        <span className='text-neutral-300'>
          {isOverall ? 'Active Validators' : <ShardSpan shard={shard.shard} />}
        </span>
      </div>
      <div className='d-flex align-items-center'>
        {!isOverall && <Led color={`led ms-1 me-2 bg-${status}`} />}
        <h5 className='m-0'>
          {shard.activeValidators}/{shard.validators}
        </h5>
      </div>
    </div>
  );
};
