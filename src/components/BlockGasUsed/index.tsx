import * as React from 'react';
import BigNumber from 'bignumber.js';
import { PercentageBar } from 'components';
import { BlockType } from 'types';

export const BlockGasUsed = ({ block }: { block: BlockType }) => {
  const gasUsedBn = new BigNumber(block.gasConsumed)
    .minus(block.gasRefunded)
    .minus(block.gasPenalized);

  return (
    <>
      {gasUsedBn.isGreaterThan(0) &&
      new BigNumber(block.maxGasLimit).isGreaterThan(0) ? (
        <>
          <div className='text-end mb-1'>
            {gasUsedBn.toFormat()}{' '}
            <span className='text-neutral-300'>
              ({gasUsedBn.dividedBy(block.maxGasLimit).times(100).toFormat(2)}%)
            </span>
          </div>
          <PercentageBar
            overallPercent={0}
            fillPercent={gasUsedBn
              .dividedBy(block.maxGasLimit)
              .times(100)
              .toNumber()}
            fillPercentLabel={`${gasUsedBn
              .dividedBy(block.maxGasLimit)
              .times(100)
              .toFormat(2)}%`}
            type='small'
          />
        </>
      ) : (
        <>
          <div className='text-end mb-1'>
            <span className='text-neutral-300'>0%</span>
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
};
