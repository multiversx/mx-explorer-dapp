import { Heatmap } from 'components/Heatmap';
import { useGetTransactionHeatmap } from '../hooks';

export const AccountHeatmap = () => {
  const heatmap = useGetTransactionHeatmap();

  if (!heatmap?.[0]?.date) {
    return null;
  }

  return (
    <div className='card'>
      <div className='card-body px-lg-spacer py-lg-4'>
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
