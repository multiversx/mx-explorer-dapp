import { Fragment } from 'react';
import { useSelector } from 'react-redux';
import { useFetchShards } from 'hooks';
import { shardsSelector, stakeSelector } from 'redux/selectors';
import { WithClassnameType } from 'types';

import { ShardCard } from './components/ShardCard';

export const ShardList = ({ className }: WithClassnameType) => {
  const shards = useSelector(shardsSelector);
  const { queueSize, auctionValidators } = useSelector(stakeSelector);
  useFetchShards();

  return (
    <div className={`shard-list ${className ?? ''}`}>
      {shards.map((shard, i) => (
        <Fragment key={shard.shard + i}>
          <ShardCard shard={shard} />
        </Fragment>
      ))}
      {queueSize !== undefined && (
        <ShardCard customTitle='Queue' customValue={queueSize} />
      )}
      {auctionValidators !== undefined && (
        <ShardCard
          customTitle='Auction Validators'
          customValue={auctionValidators}
        />
      )}
    </div>
  );
};
