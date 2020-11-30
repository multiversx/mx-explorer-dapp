import * as React from 'react';
import { useGlobalState } from 'context';
import ShardCard from './ShardCard';
import { ShardType } from 'context/state';
import { PageState } from 'sharedComponents';
import { faLayerGroup } from '@fortawesome/pro-regular-svg-icons/faLayerGroup';

const StakingQueueCard = ({ stakingQueue }: { stakingQueue: number | undefined }) => {
  return (
    <div className="flex-grow-1 mr-3 mb-3 pb-3">
      <div className="card">
        <div className="card-body px-3">
          <small className="text-light">Queue</small>
          <span className="metric-value d-flex align-items-center">
            {stakingQueue !== undefined ? stakingQueue : 'N/A'}
          </span>
        </div>
      </div>
    </div>
  );
};

const ShardsList = ({
  shardsFetched,
  stakingQueue,
}: {
  shardsFetched: boolean;
  stakingQueue: number | undefined;
}) => {
  const { shards } = useGlobalState();

  const overallCard: ShardType = {
    shard: -1,
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

  shards.sort((a, b) => (a.shard > b.shard ? 1 : -1));

  return (
    <>
      {shardsFetched === false ? (
        <div className="row">
          <div className="col mb-spacer">
            <div className="card py-4">
              <PageState
                icon={faLayerGroup}
                title="Unable to load shards"
                titleClassName="mt-0"
                className="page-state-sm"
                dataTestId="errorScreen"
              />
            </div>
          </div>
        </div>
      ) : (
        <div className="row d-flex pl-3">
          <ShardCard shard={overallCard} isOverall />
          {shards.map((shard, i) => (
            <React.Fragment key={shard.shard + i}>
              {i === shards.length - 3 && (
                <div className="d-none d-lg-block d-xl-none" style={{ flexBasis: '100%' }} />
              )}
              <ShardCard shard={shard} />
            </React.Fragment>
          ))}
          <StakingQueueCard stakingQueue={stakingQueue} />
        </div>
      )}
    </>
  );
};

export default ShardsList;
