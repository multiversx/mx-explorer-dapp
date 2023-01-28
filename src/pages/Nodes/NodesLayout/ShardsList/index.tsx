import * as React from 'react';
import { faLayerGroup } from '@fortawesome/pro-solid-svg-icons/faLayerGroup';

import { useSelector } from 'react-redux';
import { METACHAIN_SHARD_ID } from 'appConstants';

import { PageState } from 'components';
import { shardsSelector, globalStakeSelector } from 'redux/selectors';
import { GlobalStakeType } from 'types';
import { ShardType } from 'types';

import { ShardCard } from './ShardCard';

const StakingQueueCard = ({
  globalStake
}: {
  globalStake: GlobalStakeType | undefined;
}) => {
  return (
    <div className='shard-card py-3'>
      <div className='mb-2'>
        <span className='text-neutral-400'>Queue</span>
      </div>
      <div className='d-flex align-items-center'>
        <h5>{globalStake !== undefined ? globalStake.queueSize : 'N/A'}</h5>
      </div>
    </div>
  );
};

const sortShards = ({
  shards,
  METACHAIN_SHARD_ID
}: {
  shards: ShardType[];
  METACHAIN_SHARD_ID: number;
}) => {
  const sorted = [...shards];
  sorted.sort((a, b) => (a.shard > b.shard ? 1 : -1));

  const metaShard = sorted.find((shard) => shard.shard === METACHAIN_SHARD_ID);
  if (metaShard && sorted[0].shard !== metaShard.shard) {
    sorted.splice(sorted.indexOf(metaShard));
    sorted.unshift(metaShard);
  }

  return sorted;
};

export const ShardsList = ({ shardsFetched }: { shardsFetched: boolean }) => {
  const shards = useSelector(shardsSelector);
  const globalStake = useSelector(globalStakeSelector);

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
    )
  };

  const sortedShards = sortShards({ shards, METACHAIN_SHARD_ID });

  const failed =
    shardsFetched === false ||
    (shardsFetched === true && sortedShards.length === 0);

  return (
    <>
      {failed ? (
        <div className='row'>
          <div className='col mb-spacer'>
            <div className='card py-4'>
              <PageState
                icon={faLayerGroup}
                title='Unable to load shards'
                titleClassName='mt-0'
                className='page-state-sm'
                dataTestId='errorScreen'
              />
            </div>
          </div>
        </div>
      ) : (
        <div className='row shards-list'>
          <div className='col mb-spacer'>
            <div className='card'>
              <div className='card-body px-lg-spacer py-lg-4'>
                <div className='shards-container'>
                  <ShardCard shard={overallCard} isOverall />
                  {sortedShards.map((shard, i) => (
                    <React.Fragment key={shard.shard + i}>
                      <ShardCard shard={shard} />
                    </React.Fragment>
                  ))}
                  {/* <StakingQueueCard globalStake={globalStake} /> */}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
