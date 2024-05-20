import BigNumber from 'bignumber.js';

import { AuctionValidatorType } from 'types';

export const hasThresholdRow = (
  validator: AuctionValidatorType,
  minimumAuctionQualifiedStake?: string
) => {
  const bNqualifiedStake = new BigNumber(validator.qualifiedStake ?? 0);
  const bNMinimumAuctionStake = new BigNumber(
    minimumAuctionQualifiedStake ?? 0
  );

  return (
    bNqualifiedStake.isGreaterThanOrEqualTo(bNMinimumAuctionStake) &&
    validator.qualifiedAuctionValidators
  );
};
