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

  const { auctionTopUp, isInDangerZone } = node;
  if (
    !isStakeFetched ||
    minimumAuctionQualifiedTopUp === undefined ||
    auctionTopUp === undefined
  ) {
    return null;
  }

  const bNTopup = new BigNumber(auctionTopUp);
  const bNMinimumAuctionTopup = new BigNumber(minimumAuctionQualifiedTopUp);
  const bNTreshold = bNTopup.minus(bNMinimumAuctionTopup);

  if (bNTreshold.isGreaterThanOrEqualTo(0)) {
    return (
      <span
        className={classNames(className, {
          'text-success': !isInDangerZone && bNTreshold.isGreaterThan(0)
        })}
      >
        {bNTreshold.isGreaterThan(0) && <>+</>}
        <Denominate value={bNTreshold.toString(10)} showSymbol={false} />
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
