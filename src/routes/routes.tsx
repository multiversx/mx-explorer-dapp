import React from 'react';
import { RouteObject, NonIndexRouteObject } from 'react-router-dom';

import { Layout } from 'layouts/Layout';
import { Analytics } from 'pages/Analytics';
import { AnalyticsCompare } from 'pages/AnalyticsCompare';
import { EmptySearch } from 'pages/EmptySearch';
import { HashSearch } from 'pages/HashSearch';
import { Home } from 'pages/Home';
import { TransactionDetails } from 'pages/TransactionDetails';
import { Transactions } from 'pages/Transactions';

import {
  accountLayout,
  accountsRoutes,
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

import { withPageTitle, withNetworkReady } from '../components';

export {
  accountsRoutes,
  blocksRoutes,
  collectionRoutes,
  nftRoutes,
  tokensRoutes,
  validatorsRoutes
};

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

const mainRoutes: NonIndexRouteObject[] = [
  {
    path: '/',
    // title: '',
    Component: Layout,
    children: [
      {
        path: '/',
        // title: '',
        Component: Home
      },
      {
        path: analyticsRoutes.analytics,
        // title: 'Analytics',
        Component: Analytics
      },
      {
        path: analyticsRoutes.compare,
        // title: 'Analytics',
        Component: AnalyticsCompare
      },
      {
        path: transactionsRoutes.transactions,
        //title: 'Transactions',
        Component: Transactions
      },
      {
        path: transactionsRoutes.transactionDetails,
        //title: 'Transaction Details',
        Component: TransactionDetails
      },
      {
        path: searchRoutes.index,
        // title: 'Search',
        Component: EmptySearch
      },
      {
        path: searchRoutes.query,
        // title: 'Search',
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

// export const routes = (): RouteObject[] =>
//   mainRoutes.map((route) => {
//     const title = route.title
//       ? `${route.title} • MultiversX Explorer`
//       : 'MultiversX Explorer';

//     return {
//       path: route.path,
//       Component: withPageTitle(title, withNetworkReady(route.Component))
//     };
//   });

export const wrappedRoutes = mainRoutes;
