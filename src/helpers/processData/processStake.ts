import BigNumber from 'bignumber.js';

import { DECIMALS, DIGITS } from 'config';
import { denominate } from 'helpers';
import { StakeType } from 'types/stake.types';

export const processStake = (data: StakeType) => {
  return {
    totalValidators: new BigNumber(data.totalValidators).toFormat(0),
    activeValidators: new BigNumber(data.activeValidators).toFormat(0),
    queueSize: new BigNumber(data.queueSize).toFormat(0),
    totalStaked: denominate({
      input: data.totalStaked,
      denomination: DECIMALS,
      decimals: DIGITS,
      showLastNonZeroDecimal: false,
      addCommas: false
    }),

    // TODO - Temporary Hardcoded
    ...(data.nakamotoCoefficient
      ? {
          nakamotoCoefficient: new BigNumber(data.nakamotoCoefficient).toFormat(
            0
          )
        }
      : {}),
    ...(data.minimumAuctionTopup
      ? {
          minimumAuctionTopup: denominate({
            input: data.minimumAuctionTopup,
            denomination: DECIMALS,
            decimals: DIGITS,
            showLastNonZeroDecimal: false,
            addCommas: false
          })
        }
      : {}),
    ...(data.minimumAuctionStake
      ? {
          minimumAuctionStake: denominate({
            input: data.minimumAuctionStake,
            denomination: DECIMALS,
            decimals: DIGITS,
            showLastNonZeroDecimal: false,
            addCommas: false
          })
        }
      : {}),
    ...(data.dangerZoneValidators
      ? {
          dangerZoneValidators: new BigNumber(
            data.dangerZoneValidators
          ).toFormat(0)
        }
      : {}),
    ...(data.eligibleValidators
      ? {
          eligibleValidators: new BigNumber(data.eligibleValidators).toFormat(0)
        }
      : {}),
    ...(data.notEligibleValidators
      ? {
          notEligibleValidators: new BigNumber(
            data.notEligibleValidators
          ).toFormat(0)
        }
      : {})
  };
};
