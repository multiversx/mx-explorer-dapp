import { Outlet } from 'react-router-dom';

import { useFetchAccountTransactions } from 'hooks';

import { AccountAnalyticsTabs } from './AccountAnalyticsTabs';
import { AccountTabs } from './AccountTabs';

export const AccountAnalyticsLayout = () => {
  useFetchAccountTransactions();

  return (
    <div className='card'>
      <div className='card-header'>
        <div className='card-header-item table-card-header d-flex justify-content-between align-items-center flex-wrap gap-3'>
          <AccountTabs />
        </div>
        <div className='card-header-item table-card-header d-flex justify-content-between align-items-center flex-wrap gap-3 mt-4'>
          <AccountAnalyticsTabs />
        </div>
      </div>
      <div className='card-body'>
        <Outlet />
      </div>
    </div>
  );
};
