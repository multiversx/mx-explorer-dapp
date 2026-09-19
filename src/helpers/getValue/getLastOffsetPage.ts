import BigNumber from 'bignumber.js';
import { MAX_RESULTS, PAGE_SIZE } from 'appConstants';

// last page reachable through offset pagination
export const getLastOffsetPage = (size = PAGE_SIZE) => {
  const processedSize = new BigNumber(size);

  if (processedSize.isLessThanOrEqualTo(0)) {
    return 1;
  }

  return new BigNumber(MAX_RESULTS)
    .dividedBy(processedSize)
    .integerValue(BigNumber.ROUND_FLOOR)
    .toNumber();
};
