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
import { TransactionDetails } from 'pages/TransactionDetails';
import { Transactions } from 'pages/Transactions';

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
  nftLayout,
  nftRoutes,
  tokenLayout,
  tokensRoutes,
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

export const transactionsRoutes = {
  transactions: '/transactions',
  transactionDetails: '/transactions/:hash/*',
  transactionDetailsLogs: '/transactions/:hash/logs'
};

export const routes = {
  ...accountsRoutes,
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
        path: transactionsRoutes.transactions,
        title: 'Transactions',
        Component: Transactions
      },
      {
        path: transactionsRoutes.transactionDetails,
        title: 'Transaction Details',
        Component: TransactionDetails
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
      ...validatorLayout
    ]
  }
];

const layoutRoutes = [...mainRoutes];
networks.forEach((network) =>
  layoutRoutes.push(...generateNetworkRoutes(cloneDeep(mainRoutes), network))
);

export const wrappedRoutes = wrapRoutes(layoutRoutes);
