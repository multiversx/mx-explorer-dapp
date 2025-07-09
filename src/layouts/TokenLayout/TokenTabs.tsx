import { useSelector } from 'react-redux';

import { Tabs } from 'components/Tabs';
import { urlBuilder } from 'helpers';
import { useHasExchangeData } from 'hooks';
import { tokenSelector } from 'redux/selectors';
import { tokensRoutes } from 'routes';

export const TokenTabs = () => {
  const { token } = useSelector(tokenSelector);
  const { identifier, assets, roles } = token;

  const hasExchangeData = useHasExchangeData();
  const showLockedAccounts = Boolean(assets?.lockedAccounts);
  const showRoles = Boolean(roles);

  const tabs = [
    {
      tabLabel: 'Transactions',
      tabTo: urlBuilder.tokenDetails(identifier),
      activationRoutes: [tokensRoutes.tokenDetails]
    },
    {
      tabLabel: 'Holders',
      tabTo: urlBuilder.tokenDetailsAccounts(identifier),
      activationRoutes: [tokensRoutes.tokenDetailsAccounts]
    },
    {
      tabLabel: 'Analytics',
      tabTo: urlBuilder.tokenDetailsAnalytics(identifier),
      activationRoutes: [tokensRoutes.tokenDetailsAnalytics],
      show: hasExchangeData
    },
    {
      tabLabel: 'Locked Accounts',
      tabTo: urlBuilder.tokenDetailsLockedAccounts(identifier),
      activationRoutes: [tokensRoutes.tokenDetailsLockedAccounts],
      show: showLockedAccounts
    },
    {
      tabLabel: 'Roles',
      tabTo: urlBuilder.tokenDetailsRoles(identifier),
      activationRoutes: [tokensRoutes.tokenDetailsRoles],
      show: showRoles
    }
  ];

  return <Tabs tabs={tabs} />;
};
