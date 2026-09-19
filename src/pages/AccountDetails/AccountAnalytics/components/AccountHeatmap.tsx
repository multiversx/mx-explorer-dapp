import { useMemo } from 'react';
import { useSelector } from 'react-redux';

import { MAX_RESULTS } from 'appConstants';
import { Year } from 'components';
import { Heatmap } from 'components/Heatmap';
import { useGetYearParams } from 'hooks';
import { accountSelector } from 'redux/selectors';
import { useGetTransactionHeatmap } from '../hooks';

export const AccountHeatmap = () => {
  const { account } = useSelector(accountSelector);
  const { txCount } = account;
  const heatmap = useGetTransactionHeatmap();
  const { after } = useGetYearParams({});

  const years = useMemo(() => {
    const yearsSet = new Set();

    for (const day of heatmap) {
      const year = new Date(day.timestamp).getFullYear();
      yearsSet.add(year);
    }

    return Array.from(yearsSet).sort(
      (a, b) => Number(a) - Number(b)
    ) as number[];
  }, [heatmap]);

  if (!heatmap?.[0]?.timestamp) {
    return null;
  }

  if (txCount > MAX_RESULTS) {
    return null;
  }

  const latestTxStartYear = Date.UTC(
    new Date(heatmap[heatmap.length - 1].timestamp).getFullYear(),
    0,
    1
  ).valueOf();
  const currentYearStart = Date.UTC(new Date().getFullYear(), 0, 1).valueOf();
  const heatmapStartDate = after
    ? Number(after)
    : Math.max(latestTxStartYear, currentYearStart);

  return (
    <div className='card border'>
      <div className='card-header'>
        <div className='card-header-item table-card-header d-flex justify-content-between align-items-center flex-wrap gap-3'>
          <h5 className='table-title d-flex align-items-center'>
            Transaction Heatmap
          </h5>
          <Year years={years} />
        </div>
      </div>
      <div className='card-body py-lg-4'>
        <Heatmap startDate={heatmapStartDate} values={heatmap} />
      </div>
    </div>
  );
};
