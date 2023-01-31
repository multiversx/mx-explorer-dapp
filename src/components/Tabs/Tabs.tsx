import React from 'react';
import classNames from 'classnames';

import { useActiveRoute } from 'hooks';
import { NetworkLink } from 'components/NetworkLink';

import type { TabsPropsType, TabType } from './types';

import styles from './styles.module.scss';

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
    <div className={styles.tabs}>
      {filteredTabs.map((tab) => (
        <NetworkLink
          key={tab.tabTo}
          to={tab.tabTo}
          className={classNames(styles.tab, {
            [styles.active]: checkTabStatus(tab)
          })}
        >
          {tab.tabLabel}
        </NetworkLink>
      ))}
    </div>
  );
};
