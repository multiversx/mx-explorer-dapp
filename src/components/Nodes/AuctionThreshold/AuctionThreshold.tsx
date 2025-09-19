import BigNumber from 'bignumber.js';
import classNames from 'classnames';
import { useSelector } from 'react-redux';

import { ELLIPSIS } from 'appConstants';
import { FormatAmount, FormatNumber } from 'components';
import { stakeSelector } from 'redux/selectors';
import { WithClassnameType } from 'types';

export interface AuctionThresholdUIType extends WithClassnameType {
  qualifiedStake?: string;
  showPercentage?: boolean;
}

export const AuctionThreshold = ({
  qualifiedStake,
  showPercentage,
  className
}: AuctionThresholdUIType) => {
  const {
    isDataReady: isStakeFetched,
    unprocessed: { minimumAuctionQualifiedStake }
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
  const bNThreshold = bNQualifiedStake.minus(bNMinimumQualifiedStake);

  // num*amount/100
  const thresholdPercentage = new BigNumber(bNThreshold.absoluteValue())
    .times(100)
    .dividedBy(bNMinimumQualifiedStake);

  const sign = bNThreshold.isGreaterThan(0)
    ? '+'
    : bNThreshold.isLessThan(0)
    ? '-'
    : '';

  return (
    <span
      className={classNames(className, {
        'text-success': bNThreshold.isGreaterThan(0),
        'text-red-400': bNThreshold.isLessThan(0)
      })}
    >
      {sign}
      <FormatAmount
        value={bNThreshold.absoluteValue().toString(10)}
        showSymbol={false}
      />
      {showPercentage && thresholdPercentage && !bNThreshold.isZero() && (
        <span className='opacity-50 ms-1'>
          ({sign}
          <FormatNumber value={thresholdPercentage} label='%' />)
        </span>
      )}
    </span>
  );
};
