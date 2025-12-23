import { useSelector } from 'react-redux';

import { MAX_RESULTS } from 'appConstants';
import { Heatmap } from 'components/Heatmap';
import { accountSelector } from 'redux/selectors';
import { useGetTransactionHeatmap } from '../hooks';

export const AccountHeatmap = () => {
  const { account } = useSelector(accountSelector);
  const { txCount } = account;
  const heatmap = useGetTransactionHeatmap();

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

  return (
    <div className='card border'>
      <div className='card-header'>
        <div className='card-header-item table-card-header d-flex justify-content-between align-items-center flex-wrap gap-3'>
          <h5 className='table-title d-flex align-items-center'>
            Transaction Heatmap
          </h5>
        </div>
      </div>
      <div className='card-body py-lg-4'>
        <Heatmap
          startDate={Math.max(latestTxStartYear, currentYearStart)}
          values={heatmap}
        />
      </div>
    </div>
  );
};
