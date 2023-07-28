import BigNumber from 'bignumber.js';

import { DECIMALS, DIGITS } from 'config';
import { denominate } from 'helpers';
import { GlobalStakeType } from 'types/globalStake.types';

export const processGlobalStake = (data: GlobalStakeType) => {
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
    })
  };
};
