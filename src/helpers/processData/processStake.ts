import BigNumber from 'bignumber.js';

import { formatAmount } from 'helpers';
import { StakeType } from 'types/stake.types';

export const processStake = (data: StakeType) => {
  return {
    totalValidators: new BigNumber(data.totalValidators).toFormat(0),
    activeValidators: new BigNumber(data.activeValidators).toFormat(0),
    totalStaked: formatAmount({
      input: data.totalStaked
    }),
    ...(data.nakamotoCoefficient !== undefined
      ? {
          nakamotoCoefficient: new BigNumber(data.nakamotoCoefficient).toFormat(
            0
          )
        }
      : {}),
    ...(data.queueSize !== undefined
      ? {
          queueSize: new BigNumber(data.queueSize).toFormat(0)
        }
      : {}),

    ...(data.minimumAuctionQualifiedTopUp !== undefined
      ? {
          minimumAuctionQualifiedTopUp: formatAmount({
            input: data.minimumAuctionQualifiedTopUp
          })
        }
      : {}),
    ...(data.minimumAuctionQualifiedStake !== undefined
      ? {
          minimumAuctionQualifiedStake: formatAmount({
            input: data.minimumAuctionQualifiedStake
          })
        }
      : {}),
    ...(data.auctionValidators !== undefined
      ? {
          auctionValidators: new BigNumber(data.auctionValidators).toFormat(0)
        }
      : {}),
    ...(data.qualifiedAuctionValidators !== undefined
      ? {
          qualifiedAuctionValidators: new BigNumber(
            data.qualifiedAuctionValidators
          ).toFormat(0)
        }
      : {}),
    ...(data.notQualifiedAuctionValidators !== undefined
      ? {
          notQualifiedAuctionValidators: new BigNumber(
            data.notQualifiedAuctionValidators
          ).toFormat(0)
        }
      : {}),
    ...(data.dangerZoneValidators !== undefined
      ? {
          dangerZoneValidators: new BigNumber(
            data.dangerZoneValidators
          ).toFormat(0)
        }
      : {}),
    ...(data.eligibleValidators !== undefined
      ? {
          eligibleValidators: new BigNumber(data.eligibleValidators).toFormat(0)
        }
      : {}),
    ...(data.waitingValidators !== undefined
      ? {
          waitingValidators: new BigNumber(data.waitingValidators).toFormat(0)
        }
      : {}),
    ...(data.allStakedNodes !== undefined
      ? {
          allStakedNodes: new BigNumber(data.allStakedNodes).toFormat(0)
        }
      : {})
  };
};
