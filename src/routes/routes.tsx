import cloneDeep from 'lodash.clonedeep';
import { NonIndexRouteObject } from 'react-router-dom';

import { networks } from 'config';
import { Layout } from 'layouts/Layout';
import { Analytics } from 'pages/Analytics';
import { AnalyticsCompare } from 'pages/AnalyticsCompare';
import { EmptySearch } from 'pages/EmptySearch';
import { HashSearch } from 'pages/HashSearch';
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
  utilitiesLayout,
  utilitiesRoutes,
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
  utilitiesRoutes,
  validatorsRoutes
};
export interface TitledRouteObject extends NonIndexRouteObject {
  title?: string;
  preventScroll?: boolean;
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
  home: '/',
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
  ...utilitiesRoutes,
  ...validatorsRoutes
};

const mainRoutes: TitledRouteObject[] = [
  {
    path: routes.home,
    title: '',
    Component: Layout,
    children: [
      { path: '*', title: 'Not Found', Component: PageNotFound },
      {
        path: routes.home,
        title: '',
        Component: Home
      },
      {
        path: analyticsRoutes.analytics,
        title: 'Analytics',
        Component: Analytics
      },
      {
        path: analyticsRoutes.compare,
        title: 'Analytics',
        Component: AnalyticsCompare
      },
      {
        path: searchRoutes.index,
        title: 'Search',
        Component: EmptySearch
      },
      {
        path: searchRoutes.query,
        title: 'Search',
        Component: HashSearch
      },
      ...accountLayout,
      ...blockLayout,
      ...collectionLayout,
      ...eventsLayout,
      ...nftLayout,
      ...tokenLayout,
      ...transactionsLayout,
      ...utilitiesLayout,
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
