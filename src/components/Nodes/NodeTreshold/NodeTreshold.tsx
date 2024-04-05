import BigNumber from 'bignumber.js';
import classNames from 'classnames';
import { useSelector } from 'react-redux';

import { ELLIPSIS } from 'appConstants';
import { FormatAmount } from 'components';
import { stakeSelector } from 'redux/selectors';
import { NodeType, WithClassnameType } from 'types';

export interface NodeTresholdUIType extends WithClassnameType {
  node: NodeType;
}

export const NodeTreshold = ({ node, className }: NodeTresholdUIType) => {
  const {
    isFetched: isStakeFetched,
    unprocessed: { minimumAuctionQualifiedStake }
  } = useSelector(stakeSelector);

  const { locked, stake, auctionTopUp, isInDangerZone, auctionQualified } =
    node;
  if (
    !isStakeFetched ||
    minimumAuctionQualifiedStake === undefined ||
    locked === undefined
  ) {
    return ELLIPSIS;
  }

  const bNLocked = new BigNumber(stake).plus(
    auctionQualified ? auctionTopUp ?? 0 : 0
  );
  const bNMinimumQualifiedStake = new BigNumber(minimumAuctionQualifiedStake);
  const bNTreshold = bNLocked.minus(bNMinimumQualifiedStake);

  return (
    <span
      className={classNames(className, {
        'text-success':
          auctionQualified && !isInDangerZone && bNTreshold.isGreaterThan(0),
        'text-red-400': !auctionQualified && bNTreshold.isLessThan(0)
      })}
    >
      {bNTreshold.isGreaterThan(0) && <>+</>}
      {bNTreshold.isLessThan(0) && <>-</>}
      <FormatAmount
        value={bNTreshold.absoluteValue().toString(10)}
        showSymbol={false}
      />
    </span>
  );
};
