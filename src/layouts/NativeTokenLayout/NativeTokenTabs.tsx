import { useSelector } from 'react-redux';

import { Tabs } from 'components/Tabs';
import { urlBuilder } from 'helpers';
import { activeNetworkSelector } from 'redux/selectors';

export const NativeTokenTabs = () => {
  const { egldLabel = 'egld' } = useSelector(activeNetworkSelector);

  const tabs = [
    {
      tabLabel: 'Transactions',
      tabTo: urlBuilder.nativeTokenDetails(egldLabel),
      activationRoutes: [urlBuilder.nativeTokenDetails(egldLabel)]
    },
    {
      tabLabel: 'Holders',
      tabTo: urlBuilder.nativeTokenDetailsAccounts(egldLabel),
      activationRoutes: [urlBuilder.nativeTokenDetailsAccounts(egldLabel)]
    }
  ];

  return <Tabs tabs={tabs} />;
};
