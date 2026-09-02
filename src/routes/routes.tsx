import { ComponentType } from 'react';
import cloneDeep from 'lodash.clonedeep';
import { NonIndexRouteObject } from 'react-router-dom';

import { networks } from 'config';
import { Layout } from 'layouts/Layout';
import { Home } from 'pages/Home';
import { PageNotFound } from 'pages/PageNotFound';

import { generateNetworkRoutes } from './helpers/generateNetworkRoutes';
import { wrapRoutes } from './helpers/wrapRoutes';
import {
  accountLayout,
  accountsRoutes,
  applicationsRoutes,
  blockLayout,
  blocksRoutes,
  collectionLayout,
  collectionRoutes,
  eventsLayout,
  eventsRoutes,
  nativeTokenLayout,
  nftLayout,
  nftRoutes,
  tokenLayout,
  tokensRoutes,
  transactionsLayout,
  transactionsRoutes,
  transactionsInPoolRoutes,
  validatorLayout,
  validatorsRoutes
} from './layouts';

export {
  accountsRoutes,
  applicationsRoutes,
  blocksRoutes,
  collectionRoutes,
  eventsRoutes,
  nftRoutes,
  tokensRoutes,
  transactionsRoutes,
  transactionsInPoolRoutes,
  validatorsRoutes
};
export interface TitledRouteObject extends NonIndexRouteObject {
  title?: string;
  preventScroll?: boolean;
  /**
   * Code-split page component. Declared instead of `Component` so the page's
   * chunk is only fetched when the route is matched; `wrapRoutes` converts it
   * into react-router's `lazy` field.
   */
  lazyComponent?: () => Promise<ComponentType>;
  children?: TitledRouteObject[];
}

export const analyticsRoutes = {
  analytics: '/analytics',
  compare: '/analytics/compare'
};

export const searchRoutes = {
  index: '/search/',
  query: '/search/:hash'
};

export const routes = {
  ...accountsRoutes,
  ...applicationsRoutes,
  ...analyticsRoutes,
  ...blocksRoutes,
  ...collectionRoutes,
  ...eventsRoutes,
  ...nftRoutes,
  ...searchRoutes,
  ...transactionsRoutes,
  ...transactionsInPoolRoutes,
  ...tokensRoutes,
  ...validatorsRoutes
};

const mainRoutes: TitledRouteObject[] = [
  {
    path: '/',
    title: '',
    Component: Layout,
    children: [
      { path: '*', title: 'Not Found', Component: PageNotFound },
      {
        path: '/',
        title: '',
        Component: Home
      },
      {
        path: analyticsRoutes.analytics,
        title: 'Analytics',
        lazyComponent: () =>
          import('pages/Analytics').then((module) => module.Analytics)
      },
      {
        path: analyticsRoutes.compare,
        title: 'Analytics',
        lazyComponent: () =>
          import('pages/AnalyticsCompare').then(
            (module) => module.AnalyticsCompare
          )
      },
      {
        path: searchRoutes.index,
        title: 'Search',
        lazyComponent: () =>
          import('pages/EmptySearch').then((module) => module.EmptySearch)
      },
      {
        path: searchRoutes.query,
        title: 'Search',
        lazyComponent: () =>
          import('pages/HashSearch').then((module) => module.HashSearch)
      },
      ...accountLayout,
      ...blockLayout,
      ...collectionLayout,
      ...eventsLayout,
      ...nftLayout,
      ...tokenLayout,
      ...transactionsLayout,
      ...validatorLayout,
      ...nativeTokenLayout
    ]
  }
];

const layoutRoutes = [...mainRoutes];
networks.forEach((network) =>
  layoutRoutes.push(...generateNetworkRoutes(cloneDeep(mainRoutes), network))
);

export const wrappedRoutes = wrapRoutes(layoutRoutes);
