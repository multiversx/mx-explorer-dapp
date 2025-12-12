import { AccountTabs } from 'layouts/AccountLayout/AccountTabs';
import { AccountHeatmap, AccountHistoryChart } from './components';

export const AccountAnalytics = () => {
  return (
    <div className='card'>
      <div className='card-header'>
        <div className='card-header-item table-card-header d-flex justify-content-between align-items-center flex-wrap gap-3'>
          <AccountTabs />
        </div>
      </div>
      <AccountHistoryChart />
      <AccountHeatmap />
    </div>
  );
};
