import * as React from 'react';
import { faLayerGroup } from '@fortawesome/pro-solid-svg-icons/faLayerGroup';

import { metaChainShardId } from 'appConfig';
import { useGlobalState } from 'context';
import { GlobalStakeType } from 'context/state';
import { ShardType } from 'types';
import { PageState } from 'components';

import { ShardCard } from './ShardCard';

const StakingQueueCard = ({ globalStake }: { globalStake: GlobalStakeType | undefined }) => {
  return (
    <div className="shard-card py-3">
      <div className="mb-2">
        <span className="text-secondary">Queue</span>
      </div>
      <div className="d-flex align-items-center">
        <h5>{globalStake !== undefined ? globalStake.queueSize : 'N/A'}</h5>
      </div>
    </div>
  );
};

const sortShards = ({
  shards,
  metaChainShardId,
}: {
  shards: ShardType[];
  metaChainShardId: number;
}) => {
  const sorted = [...shards];
  sorted.sort((a, b) => (a.shard > b.shard ? 1 : -1));

  const metaShard = sorted.find((shard) => shard.shard === metaChainShardId);
  if (metaShard && sorted[0].shard !== metaShard.shard) {
    sorted.splice(sorted.indexOf(metaShard));
    sorted.unshift(metaShard);
  }

  return sorted;
};

export const ShardsList = ({ shardsFetched }: { shardsFetched: boolean }) => {
  const { shards, globalStake } = useGlobalState();

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

  const sortedShards = sortShards({ shards, metaChainShardId });

  const failed = shardsFetched === false || (shardsFetched === true && sortedShards.length === 0);

  return (
    <>
      {failed ? (
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
        <div className="row shards-list">
          <div className="col mb-spacer">
            <div className="card">
              <div className="card-body px-lg-spacer py-lg-4">
                <div className="shards-container">
                  <ShardCard shard={overallCard} isOverall />
                  {sortedShards.map((shard, i) => (
                    <React.Fragment key={shard.shard + i}>
                      <ShardCard shard={shard} />
                    </React.Fragment>
                  ))}
                  <StakingQueueCard globalStake={globalStake} />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
