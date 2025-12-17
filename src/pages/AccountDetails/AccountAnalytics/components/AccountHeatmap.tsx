import { Heatmap } from 'components/Heatmap';
import { useGetTransactionHeatmap } from '../hooks';

export const AccountHeatmap = () => {
  const heatmap = useGetTransactionHeatmap();

  if (!heatmap?.[0]?.date) {
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
          startDate={
            new Date(
              'Mon Jan 01 2025 02:00:00 GMT+0200 (Eastern European Standard Time)'
            )
          }
          values={heatmap}
        />
      </div>
    </div>
  );
};
