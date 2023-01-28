import BigNumber from 'bignumber.js';

import { denominate } from 'components/Denominate/denominate';
import { DECIMALS, DIGITS } from 'config';
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
