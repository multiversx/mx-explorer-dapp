import BigNumber from 'bignumber.js';
import classNames from 'classnames';

import { WithClassnameType } from 'types';

export interface ResiliencyRowUIType extends WithClassnameType {
  coefficient: number;
  colSpan?: number;
}

export const ResiliencyRow = ({
  coefficient,
  colSpan = 7,
  className
}: ResiliencyRowUIType) => {
  if (!coefficient) {
    return;
  }

  return (
    <tr className={classNames('resiliency-row', className)}>
      <td colSpan={colSpan} className='px-0'>
        <div className='d-flex flex-row gap-5 align-items-center my-spacer'>
          <hr className='d-flex flex-fill text-neutral-800' />
          <div className='text-center'>
            <p className='mb-0 text-primary-300'>Resiliency Coefficient</p>
            <p className='mb-0 text-neutral-500'>
              The top {new BigNumber(coefficient).toFormat(0)} node operators
              above control more than 33% of the total stake.
            </p>
          </div>
          <hr className='d-flex flex-fill text-neutral-800' />
        </div>
      </td>
    </tr>
  );
};
