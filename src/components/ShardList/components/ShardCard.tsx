import { ShardSpan } from 'components';
import { ProgressRing } from 'components/ProgressRing';
import { ShardType } from 'types';
import { computeShardStatus } from '../helpers/computeShardStatus';

interface ShardCardType {
  shard?: ShardType;
  customTitle?: string;
  customValue?: string | number;
}

const dummyShard: ShardType = {
  shard: -1,
  validators: -1,
  activeValidators: -1
};

export const ShardCard = ({
  shard,
  customTitle,
  customValue
}: ShardCardType) => {
  const displayShard = shard ?? dummyShard;
  const status = computeShardStatus(displayShard);

  const percentage = shard
    ? (shard.activeValidators / shard.validators) * 100
    : 0;

  return (
    <div className='shard-card'>
      <div className='shard'>
        <div className='progress-holder me-2'>
          <ProgressRing
            progress={Math.floor(percentage)}
            trackWidth={2}
            indicatorWidth={2}
            size={20}
            className={customValue !== undefined ? 'disabled' : status}
          />
        </div>
        <span className='text-neutral-400'>
          {customTitle ? customTitle : <ShardSpan shard={displayShard.shard} />}
        </span>
      </div>

      <h6 className='m-0'>
        {customValue !== undefined ? (
          <span className='text-neutral-400'>{customValue}</span>
        ) : (
          <>
            <span className='text-primary-200'>{shard?.activeValidators}</span>
            <span className='text-neutral-600'>/</span>
            <span className='text-neutral-400'>{shard?.validators}</span>
          </>
        )}
      </h6>
    </div>
  );
};
