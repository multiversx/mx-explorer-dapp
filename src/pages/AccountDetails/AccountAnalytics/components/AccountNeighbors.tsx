import { TransactionInteractionTable } from './TransactionInteractionTable';
import { useGetTransactionNeighbors } from '../hooks';

export const AccountNeighbors = () => {
  const topNeighbors = useGetTransactionNeighbors();

  return (
    <TransactionInteractionTable
      title='Top Neighbors'
      interactions={topNeighbors}
    />
  );
};
