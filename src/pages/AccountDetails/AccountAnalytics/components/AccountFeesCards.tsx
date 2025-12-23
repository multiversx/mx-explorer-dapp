import { useMemo } from 'react';
import BigNumber from 'bignumber.js';

import { FormatEGLD, FormatUSD } from 'components';
import { capitalize, getRangeText } from 'helpers';
import { useGetRangeEntries } from 'hooks';
import { StatsCard } from 'widgets';

import { useGetTransactionFees } from '../hooks';

export const AccountFeesCards = () => {
  const processedFeesEntries = useGetTransactionFees();
  const { values: rangeFees, range } = useGetRangeEntries(processedFeesEntries);

  const totalFees = useMemo(() => {
    return processedFeesEntries.reduce(
      (a, b) => new BigNumber(a).plus(b.value).toNumber(),
      0
    );
  }, [processedFeesEntries]);

  const totalRangeFees = useMemo(() => {
    return rangeFees.reduce(
      (a, b) => new BigNumber(a).plus(b.value).toNumber(),
      0
    );
  }, [rangeFees]);

  return (
    <div className='stats-cards equal-width d-flex flex-row flex-wrap gap-3 mb-spacer'>
      <StatsCard
        className='border'
        title='Total Fees Paid'
        value={<FormatEGLD value={totalFees} />}
        subTitle={<FormatUSD value={totalFees} />}
      />
      <StatsCard
        className='border'
        title={`Fees Paid ${capitalize(getRangeText(range))}`}
        value={<FormatEGLD value={totalRangeFees} />}
        subTitle={<FormatUSD value={totalRangeFees} />}
      />
    </div>
  );
};
