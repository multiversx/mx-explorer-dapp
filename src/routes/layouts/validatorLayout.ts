import { NonIndexRouteObject } from 'react-router-dom';

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

export const validatorLayout: NonIndexRouteObject[] = [
  {
    path: validatorsRoutes.identities,
    //title: 'Validators',
    Component: NodesLayout,
    children: [
      {
        path: validatorsRoutes.identities,
        //title: 'Validators',
        Component: Identities
      }
    ]
  },
  {
    path: validatorsRoutes.identityDetails,
    //title: 'Validator Details',
    Component: NodesLayout,
    children: [
      {
        path: validatorsRoutes.identityDetails,
        //title: 'Validator Details',
        Component: IdentityDetails
      }
    ]
  },
  {
    path: validatorsRoutes.statistics,
    //title: 'Nodes Statistics',
    Component: NodesLayout,
    children: [
      {
        path: validatorsRoutes.statistics,
        //title: 'Nodes Statistics',
        Component: NodesStatistics
      }
    ]
  },
  {
    path: validatorsRoutes.queue,
    //title: 'Nodes Queue',
    Component: NodesLayout,
    children: [
      {
        path: validatorsRoutes.queue,
        //title: 'Nodes Queue',
        Component: NodesQueue
      }
    ]
  },
  {
    path: validatorsRoutes.nodes,
    //title: 'Nodes',
    Component: NodesLayout,
    children: [
      {
        path: validatorsRoutes.nodes,
        //title: 'Nodes',
        Component: Nodes
      }
    ]
  },
  {
    path: validatorsRoutes.nodeDetails,
    //title: 'Node Details',
    Component: NodesLayout,
    children: [
      {
        path: validatorsRoutes.nodeDetails,
        //title: 'Node Details',
        Component: NodeDetails
      }
    ]
  },
  {
    path: validatorsRoutes.providers,
    //title: 'Providers',
    Component: NodesLayout,
    children: [
      {
        path: validatorsRoutes.providers,
        //title: 'Providers',
        Component: Providers
      }
    ]
  },
  {
    path: validatorsRoutes.providerDetails,
    //title: 'Provider Details',
    Component: ProviderLayout,
    children: [
      {
        path: validatorsRoutes.providerDetails,
        //title: 'Provider Details',
        Component: ProviderDetails
      },
      {
        path: validatorsRoutes.providerTransactions,
        //title: 'Provider Details',
        Component: ProviderTransactions
      }
    ]
  }
];
