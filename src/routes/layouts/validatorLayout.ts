import { NodesLayout } from 'layouts/NodesLayout';
import { ProviderLayout } from 'layouts/ProviderLayout';
import { Identities } from 'pages/Identities';
import { IdentityDetails } from 'pages/IdentityDetails';
import { NodeDetails } from 'pages/NodeDetails';
import { Nodes } from 'pages/Nodes';
import { NodesQueue } from 'pages/NodesQueue';
import { NodesStatistics } from 'pages/NodesStatistics';
import { ProviderDetails } from 'pages/ProviderDetails';
import { ProviderTransactions } from 'pages/ProviderDetails/ProviderTransactions';
import { Providers } from 'pages/Providers';

import { TitledRouteObject } from '../routes';

export const validatorsRoutes = {
  identities: '/validators',
  identityDetails: '/identities/:hash',
  statistics: '/statistics',
  queue: '/queue',
  nodes: '/nodes',
  nodeDetails: '/nodes/:hash',
  providers: '/providers',
  providerDetails: '/providers/:hash',
  providerTransactions: '/providers/:hash/transactions'
};

export const validatorLayout: TitledRouteObject[] = [
  {
    path: validatorsRoutes.identities,
    Component: NodesLayout,
    preventScroll: true,
    children: [
      {
        path: validatorsRoutes.identities,
        title: 'Validators',
        preventScroll: true,
        Component: Identities
      }
    ]
  },
  {
    path: validatorsRoutes.identityDetails,
    Component: NodesLayout,
    children: [
      {
        path: validatorsRoutes.identityDetails,
        title: 'Validator Details',
        Component: IdentityDetails
      }
    ]
  },
  {
    path: validatorsRoutes.statistics,
    preventScroll: true,
    Component: NodesLayout,
    children: [
      {
        path: validatorsRoutes.statistics,
        title: 'Nodes Statistics',
        preventScroll: true,
        Component: NodesStatistics
      }
    ]
  },
  {
    path: validatorsRoutes.queue,
    preventScroll: true,
    Component: NodesLayout,
    children: [
      {
        path: validatorsRoutes.queue,
        title: 'Nodes Queue',
        preventScroll: true,
        Component: NodesQueue
      }
    ]
  },
  {
    path: validatorsRoutes.nodes,
    preventScroll: true,
    Component: NodesLayout,
    children: [
      {
        path: validatorsRoutes.nodes,
        title: 'Nodes',
        preventScroll: true,
        Component: Nodes
      }
    ]
  },
  {
    path: validatorsRoutes.nodeDetails,
    Component: NodesLayout,
    children: [
      {
        path: validatorsRoutes.nodeDetails,
        title: 'Node Details',
        Component: NodeDetails
      }
    ]
  },
  {
    path: validatorsRoutes.providers,
    preventScroll: true,
    Component: NodesLayout,
    children: [
      {
        path: validatorsRoutes.providers,
        title: 'Providers',
        preventScroll: true,
        Component: Providers
      }
    ]
  },
  {
    path: validatorsRoutes.providerDetails,
    Component: ProviderLayout,
    children: [
      {
        path: validatorsRoutes.providerDetails,
        title: 'Provider Details',
        preventScroll: true,
        Component: ProviderDetails
      },
      {
        path: validatorsRoutes.providerTransactions,
        title: 'Provider Transactions',
        preventScroll: true,
        Component: ProviderTransactions
      }
    ]
  }
];
