import { PageSize } from 'components';

import { TransactionInteractionTable } from './TransactionInteractionTable';
import { useGetApplicationActivity } from '../hooks';

export const ApplicationActivity = () => {
  const topNeighbors = useGetApplicationActivity();

  return (
    <TransactionInteractionTable
      title={
        <div className='d-flex align-items-center justify-content-between'>
          <span>App Activity</span>
          <PageSize />
        </div>
      }
      showSentAndReceived={false}
      interactions={topNeighbors}
    />
  );
};
