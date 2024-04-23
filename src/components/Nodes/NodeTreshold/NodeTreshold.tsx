import BigNumber from 'bignumber.js';
import classNames from 'classnames';
import { useSelector } from 'react-redux';

import { ELLIPSIS } from 'appConstants';
import { FormatAmount, FormatNumber } from 'components';
import { stakeSelector } from 'redux/selectors';
import { WithClassnameType } from 'types';

export interface NodeTresholdUIType extends WithClassnameType {
  qualifiedStake?: string;
  showPercentage?: boolean;
}

export const NodeTreshold = ({
  qualifiedStake,
  showPercentage,
  className
}: NodeTresholdUIType) => {
  const {
    isFetched: isStakeFetched,
    unprocessed: { minimumAuctionQualifiedStake, notQualifiedAuctionValidators }
  } = useSelector(stakeSelector);

  if (
    !isStakeFetched ||
    minimumAuctionQualifiedStake === undefined ||
    qualifiedStake === undefined
  ) {
    return ELLIPSIS;
  }

  const bNQualifiedStake = new BigNumber(qualifiedStake);
  const bNMinimumQualifiedStake = new BigNumber(minimumAuctionQualifiedStake);
  const bNTreshold = bNQualifiedStake.minus(bNMinimumQualifiedStake);

  // num*amount/100
  const tresholdPercentage = new BigNumber(bNTreshold.absoluteValue())
    .times(100)
    .dividedBy(bNMinimumQualifiedStake);

  const sign = bNTreshold.isGreaterThan(0)
    ? '+'
    : bNTreshold.isLessThan(0)
    ? '-'
    : '';

  return (
    <span
      className={classNames(className, {
        'text-success': bNTreshold.isGreaterThan(0),
        'text-red-400':
          notQualifiedAuctionValidators && bNTreshold.isLessThan(0)
      })}
    >
      {sign}
      <FormatAmount
        value={bNTreshold.absoluteValue().toString(10)}
        showSymbol={false}
      />
      {showPercentage && tresholdPercentage && !bNTreshold.isZero() && (
        <span className='opacity-50 ms-1'>
          ({sign}
          <FormatNumber value={tresholdPercentage} label='%' />)
        </span>
      )}
    </span>
  );
};
