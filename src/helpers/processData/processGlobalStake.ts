import BigNumber from 'bignumber.js';

import { denominate } from 'components/Denominate/denominate';
import { DECIMALS, DIGITS } from 'config';
import { GlobalStakeType } from 'types/globalStake.types';

export const processGlobalStake = (data: GlobalStakeType) => {
  const { totalValidators, activeValidators, queueSize, totalStaked, ...rest } =
    data;

  return {
    totalValidators: new BigNumber(totalValidators).toFormat(0),
    activeValidators: new BigNumber(activeValidators).toFormat(0),
    queueSize: new BigNumber(queueSize).toFormat(0),
    totalStaked: denominate({
      input: totalStaked,
      denomination: DECIMALS,
      decimals: DIGITS,
      showLastNonZeroDecimal: false,
      addCommas: false
    }),
    rest
  };
};
