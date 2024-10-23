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
  nativeTokenLayout,
  nftLayout,
  nftRoutes,
  tokenLayout,
  tokensRoutes,
  transactionsLayout,
  transactionsRoutes,
  validatorLayout,
  validatorsRoutes
} from './layouts';

export {
  accountsRoutes,
  applicationsRoutes,
  blocksRoutes,
  collectionRoutes,
  nftRoutes,
  tokensRoutes,
  transactionsRoutes,
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
  ...accountsRoutes,
  ...applicationsRoutes,
  ...analyticsRoutes,
  ...blocksRoutes,
  ...collectionRoutes,
  ...nftRoutes,
  ...searchRoutes,
  ...transactionsRoutes,
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
