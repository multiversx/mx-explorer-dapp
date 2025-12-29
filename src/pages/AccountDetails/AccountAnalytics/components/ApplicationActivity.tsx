import { useSelector } from 'react-redux';
import { useSearchParams } from 'react-router-dom';

import { Range } from 'components';
import { accountSelector } from 'redux/selectors';
import { ChartResolutionRangeType } from 'types';

import { TransactionInteractionTable } from './TransactionInteractionTable';
import { useGetApplicationActivity } from '../hooks';

export const ApplicationActivity = () => {
  const prefix = 'app';
  const { account } = useSelector(accountSelector);
  const { address } = account;
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
          <Range prefix={prefix} className='ms-auto' clearParams />
        </div>
      }
      showSentAndReceived={false}
      interactions={topNeighbors}
      address={address}
    />
  );
};
