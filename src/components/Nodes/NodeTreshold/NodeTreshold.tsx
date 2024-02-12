import BigNumber from 'bignumber.js';
import classNames from 'classnames';
import { useSelector } from 'react-redux';

import { Denominate } from 'components';
import { stakeSelector } from 'redux/selectors';
import { NodeType, WithClassnameType } from 'types';

export interface NodeTresholdUIType extends WithClassnameType {
  node: NodeType;
}

export const NodeTreshold = ({ node, className }: NodeTresholdUIType) => {
  const {
    isFetched: isStakeFetched,
    unprocessed: { minimumAuctionQualifiedTopUp }
  } = useSelector(stakeSelector);

  if (!isStakeFetched || minimumAuctionQualifiedTopUp === undefined) {
    return null;
  }
  const { topUp, auctionTopUp, isInDangerZone } = node;

  const bNTopup = new BigNumber(auctionTopUp ?? topUp);
  const bNMinimumAuctionTopup = new BigNumber(minimumAuctionQualifiedTopUp);
  const bNTreshold = bNTopup.minus(bNMinimumAuctionTopup);

  if (bNTreshold.isGreaterThanOrEqualTo(0)) {
    return (
      <span
        className={classNames(className, { 'text-success': !isInDangerZone })}
      >
        +<Denominate value={bNTreshold.toString(10)} showSymbol={false} />
      </span>
    );
  }

  return (
    <span className={classNames(className, 'text-red-400')}>
      -
      <Denominate
        value={bNTreshold.absoluteValue().toString(10)}
        showSymbol={false}
      />
    </span>
  );
};
