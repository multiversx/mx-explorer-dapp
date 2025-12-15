import { Outlet } from 'react-router-dom';

import { AccountAnalyticsTabs } from './AccountAnalyticsTabs';
import { AccountTabs } from './AccountTabs';

export const AccountAnalyticsLayout = () => {
  return (
    <div className='card'>
      <div className='card-header'>
        <div className='card-header-item table-card-header d-flex justify-content-between align-items-center flex-wrap gap-3'>
          <AccountTabs />
        </div>
        <div className='card-header-item table-card-header d-flex justify-content-between align-items-center flex-wrap gap-3 mt-spacer'>
          <AccountAnalyticsTabs />
        </div>
      </div>
      <Outlet />
    </div>
  );
};
