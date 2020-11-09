import * as React from 'react';
import { useGlobalState } from 'context';
import ShardCard from './ShardCard';
import { ShardType } from 'context/state';

const ShardsList = () => {
  const { shards } = useGlobalState();

  const blockchainStatus: ShardType = {
    shardId: -1,
    validators: shards.reduce(
      (totalValidators, shardEntry) => totalValidators + shardEntry.validators,
      0
    ),
    activeValidators: shards.reduce(
      (totalAllActiveValidators, shardEntry) =>
        totalAllActiveValidators + shardEntry.activeValidators,
      0
    ),
  };

  shards.sort((a, b) => (a.shardId > b.shardId ? 1 : -1));

  return (
    <div className="row d-flex pl-3">
      <ShardCard shard={blockchainStatus} isOverall />
      {shards.map((shard, i) => (
        <React.Fragment key={shard.shardId + i}>
          {i === shards.length - 3 && (
            <div className="d-none d-lg-block d-xl-none" style={{ flexBasis: '100%' }} />
          )}
          <ShardCard shard={shard} />
        </React.Fragment>
      ))}
    </div>
  );
};

export default ShardsList;
