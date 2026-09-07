import { memo } from 'react';
import BigNumber from 'bignumber.js';

import { PercentageBar } from 'components';
import { BlockType } from 'types';

export const BlockGasUsed = memo(({ block }: { block: BlockType }) => {
  const gasUsedBn = new BigNumber(block.gasConsumed)
    .minus(block.gasRefunded)
    .minus(block.gasPenalized);

  const hasGasUsed =
    gasUsedBn.isGreaterThan(0) &&
    new BigNumber(block.maxGasLimit).isGreaterThan(0);

  const percentBn = hasGasUsed
    ? gasUsedBn.dividedBy(block.maxGasLimit).times(100)
    : undefined;
  const percentLabel = percentBn ? `${percentBn.toFormat(2)}%` : '0%';

  return (
    <>
      {percentBn ? (
        <>
          <div className='text-end mb-1'>
            {gasUsedBn.toFormat()}{' '}
            <span className='text-neutral-400'>({percentLabel})</span>
          </div>
          <PercentageBar
            overallPercent={0}
            fillPercent={percentBn.toNumber()}
            fillPercentLabel={percentLabel}
            type='small'
          />
        </>
      ) : (
        <>
          <div className='text-end mb-1'>
            <span className='text-neutral-400'>0%</span>
          </div>
          <PercentageBar
            overallPercent={0}
            fillPercent={0}
            fillPercentLabel='0%'
            type='small'
          />
        </>
      )}
    </>
  );
});
