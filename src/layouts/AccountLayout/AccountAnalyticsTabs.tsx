import { useSelector } from 'react-redux';

import { Tabs } from 'components/Tabs';
import { urlBuilder } from 'helpers';
import { accountSelector } from 'redux/selectors';
import { accountsRoutes } from 'routes';

export const AccountAnalyticsTabs = () => {
  const { account } = useSelector(accountSelector);
  const { address } = account;

  const tabs = [
    {
      tabLabel: 'Overview',
      tabTo: urlBuilder.accountDetailsAnalytics(address),
      activationRoutes: [accountsRoutes.accountAnalytics]
    },
    {
      tabLabel: 'Balance',
      tabTo: urlBuilder.accountDetailsAnalyticsBalance(address),
      activationRoutes: [accountsRoutes.accountAnalyticsBalance]
    },
    {
      tabLabel: 'Transactions',
      tabTo: urlBuilder.accountDetailsAnalyticsTransactions(address),
      activationRoutes: [accountsRoutes.accountAnalyticsTransactions]
    },
    {
      tabLabel: 'Txn Fees',
      tabTo: urlBuilder.accountDetailsAnalyticsFees(address),
      activationRoutes: [accountsRoutes.accountAnalyticsFees]
    }
  ];

  return <Tabs tabs={tabs} />;
};
