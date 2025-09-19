import BigNumber from 'bignumber.js';
import { useSelector } from 'react-redux';

import { stakeSelector } from 'redux/selectors';
import { NodeType } from 'types';

export const useIsAuctionNodeDropped = (node?: NodeType) => {
  const {
    isDataReady: isStakeFetched,
    unprocessed: { minimumAuctionQualifiedStake }
  } = useSelector(stakeSelector);

  if (node === undefined) {
    return false;
  }

  const bNAuctionTopup = new BigNumber(node.auctionTopUp ?? 0);
  const bNqualifiedStake =
    node.qualifiedStake !== undefined
      ? new BigNumber(node.qualifiedStake)
      : new BigNumber(node.stake).plus(
          node.auctionQualified ? bNAuctionTopup : 0
        );

  const isDropped =
    isStakeFetched &&
    node.auctioned &&
    !node.auctionQualified &&
    bNqualifiedStake.isGreaterThan(minimumAuctionQualifiedStake ?? 0) &&
    bNAuctionTopup.isGreaterThan(0);

  return isDropped;
};
