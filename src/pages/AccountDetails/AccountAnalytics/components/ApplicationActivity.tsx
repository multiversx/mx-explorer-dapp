import { useSearchParams } from 'react-router-dom';

import { Range } from 'components';
import { ChartResolutionRangeType } from 'types';

import { TransactionInteractionTable } from './TransactionInteractionTable';
import { useGetApplicationActivity } from '../hooks';

export const ApplicationActivity = () => {
  const prefix = 'app';
  const [searchParams] = useSearchParams();
  const params = Object.fromEntries(searchParams);
  const { [`${prefix}Range`]: range } = params;

  const topNeighbors = useGetApplicationActivity({
    range: range as ChartResolutionRangeType
  });

  return (
    <TransactionInteractionTable
      title={
        <div className='d-flex align-items-center justify-content-between'>
          <span>App Activity</span>
          <Range
            prefix={prefix}
            defaultRange='all'
            className='ms-auto'
            clearParams
          />
        </div>
      }
      showSentAndReceived={false}
      interactions={topNeighbors}
    />
  );
};
