import { Heatmap } from 'components/Heatmap';
import { useGetTransactionHeatmap } from '../hooks';

export const AccountHeatmap = () => {
  const heatmap = useGetTransactionHeatmap();

  if (!heatmap?.[0]?.timestamp) {
    return null;
  }

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
          startDate={new Date(new Date().getFullYear(), 0, 1).valueOf()} // current year
          values={heatmap}
        />
      </div>
    </div>
  );
};
