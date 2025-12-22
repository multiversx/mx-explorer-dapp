import { TransactionInteractionTable } from './TransactionInteractionTable';
import { useGetApplicationActivity } from '../hooks';

export const ApplicationActivity = () => {
  const topNeighbors = useGetApplicationActivity();

  return (
    <TransactionInteractionTable
      title='App Activity'
      showSentAndReceived={false}
      interactions={topNeighbors}
    />
  );
};
