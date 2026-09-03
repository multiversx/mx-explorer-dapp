import { useSelector } from 'react-redux';
import { useSearchParams } from 'react-router';

import { MAX_RESULTS } from 'appConstants';
import { Range } from 'components';
import { accountSelector } from 'redux/selectors';
import { ChartResolutionRangeType } from 'types';

import { TransactionInteractionTable } from './TransactionInteractionTable';
import { useGetTransactionNeighbors } from '../hooks';

export const AccountNeighbors = () => {
  const prefix = 'neighbors';
  const { account } = useSelector(accountSelector);
  const { address, txCount } = account;
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
          {txCount <= MAX_RESULTS && (
            <Range prefix={prefix} className='ms-auto' clearParams />
          )}
        </div>
      }
      interactions={topNeighbors}
      address={address}
    />
  );
};
