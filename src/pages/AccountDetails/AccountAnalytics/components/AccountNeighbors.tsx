import { useSearchParams } from 'react-router-dom';

import { Range } from 'components';
import { ChartResolutionRangeType } from 'types';

import { TransactionInteractionTable } from './TransactionInteractionTable';
import { useGetTransactionNeighbors } from '../hooks';

export const AccountNeighbors = () => {
  const prefix = 'neighbors';
  const [searchParams] = useSearchParams();
  const params = Object.fromEntries(searchParams);
  const { [`${prefix}Range`]: range } = params;

  const topNeighbors = useGetTransactionNeighbors({
    range: range as ChartResolutionRangeType
  });

  return (
    <TransactionInteractionTable
      title={
        <div className='d-flex align-items-center justify-content-between'>
          <span>Top Neighbors</span>
          <Range prefix={prefix} className='ms-auto' clearParams />
        </div>
      }
      interactions={topNeighbors}
    />
  );
};
