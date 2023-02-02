import React from 'react';

import { NetworkLink } from 'components';
import { useActiveRoute } from 'hooks';

import { TabsPropsType, TabType } from './types';

export const Tabs = (props: TabsPropsType) => {
  const { tabs } = props;

  const activeRoute = useActiveRoute();
  const filteredTabs = tabs.filter((tab) => tab.show !== false);

  const checkTabStatus = (tab: TabType) => {
    if (tab.activationRoutes && tab.activationRoutes.length > 0) {
      return tab.activationRoutes.some((route) => activeRoute(route));
    }

    return activeRoute(tab.tabTo);
  };

  return (
    <div className='tabs'>
      {filteredTabs.map((tab) => (
        <NetworkLink
          key={tab.tabTo}
          to={tab.tabTo}
          className={`tab ${checkTabStatus(tab) ? 'active' : ''}`}
        >
          {tab.tabLabel}
        </NetworkLink>
      ))}
    </div>
  );
};
