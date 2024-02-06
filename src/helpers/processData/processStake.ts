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
    })
  };
};
