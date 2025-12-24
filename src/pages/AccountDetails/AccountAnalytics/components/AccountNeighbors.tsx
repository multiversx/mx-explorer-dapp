import { PageSize } from 'components';

import { TransactionInteractionTable } from './TransactionInteractionTable';
import { useGetTransactionNeighbors } from '../hooks';

export const AccountNeighbors = () => {
  const topNeighbors = useGetTransactionNeighbors();

  return (
    <TransactionInteractionTable
      title={
        <div className='d-flex align-items-center justify-content-between'>
          <span>Top Neighbors</span>
          <PageSize />
        </div>
      }
      interactions={topNeighbors}
    />
  );
};
