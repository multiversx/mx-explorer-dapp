import { TitledRouteObject } from '../routes';

export const validatorsRoutes = {
  identities: '/validators',
  identityDetails: '/identities/:hash',
  statistics: '/statistics',
  queue: '/queue',
  auctionList: '/auction-list',
  nodes: '/nodes',
  nodeDetails: '/nodes/:hash',
  providers: '/providers',
  providerDetails: '/providers/:hash',
  providerTransactions: '/providers/:hash/transactions'
};

export const validatorLayout: TitledRouteObject[] = [
  {
    path: validatorsRoutes.identities,
    lazyComponent: () =>
      import('layouts/NodesLayout').then((module) => module.NodesLayout),
    preventScroll: true,
    children: [
      {
        path: validatorsRoutes.identities,
        title: 'Validators',
        preventScroll: true,
        lazyComponent: () =>
          import('pages/Identities').then((module) => module.Identities)
      }
    ]
  },
  {
    path: validatorsRoutes.identityDetails,
    lazyComponent: () =>
      import('layouts/NodesLayout').then((module) => module.NodesLayout),
    children: [
      {
        path: validatorsRoutes.identityDetails,
        title: 'Validator Details',
        lazyComponent: () =>
          import('pages/IdentityDetails').then(
            (module) => module.IdentityDetails
          )
      }
    ]
  },
  {
    path: validatorsRoutes.statistics,
    preventScroll: true,
    lazyComponent: () =>
      import('layouts/NodesLayout').then((module) => module.NodesLayout),
    children: [
      {
        path: validatorsRoutes.statistics,
        title: 'Nodes Statistics',
        preventScroll: true,
        lazyComponent: () =>
          import('pages/NodesStatistics').then(
            (module) => module.NodesStatistics
          )
      }
    ]
  },
  {
    path: validatorsRoutes.queue,
    preventScroll: true,
    lazyComponent: () =>
      import('layouts/NodesLayout').then((module) => module.NodesLayout),
    children: [
      {
        path: validatorsRoutes.queue,
        title: 'Nodes Queue',
        preventScroll: true,
        lazyComponent: () =>
          import('pages/NodesQueue').then((module) => module.NodesQueue)
      }
    ]
  },
  {
    path: validatorsRoutes.auctionList,
    preventScroll: true,
    lazyComponent: () =>
      import('layouts/NodesLayout').then((module) => module.NodesLayout),
    children: [
      {
        path: validatorsRoutes.auctionList,
        title: 'Auction List',
        preventScroll: true,
        lazyComponent: () =>
          import('pages/NodesAuctionList').then(
            (module) => module.NodesAuctionList
          )
      }
    ]
  },
  {
    path: validatorsRoutes.nodes,
    preventScroll: true,
    lazyComponent: () =>
      import('layouts/NodesLayout').then((module) => module.NodesLayout),
    children: [
      {
        path: validatorsRoutes.nodes,
        title: 'Nodes',
        preventScroll: true,
        lazyComponent: () =>
          import('pages/Nodes').then((module) => module.Nodes)
      }
    ]
  },
  {
    path: validatorsRoutes.nodeDetails,
    lazyComponent: () =>
      import('layouts/NodesLayout').then((module) => module.NodesLayout),
    children: [
      {
        path: validatorsRoutes.nodeDetails,
        title: 'Node Details',
        lazyComponent: () =>
          import('pages/NodeDetails').then((module) => module.NodeDetails)
      }
    ]
  },
  {
    path: validatorsRoutes.providers,
    preventScroll: true,
    lazyComponent: () =>
      import('layouts/NodesLayout').then((module) => module.NodesLayout),
    children: [
      {
        path: validatorsRoutes.providers,
        title: 'Providers',
        preventScroll: true,
        lazyComponent: () =>
          import('pages/Providers').then((module) => module.Providers)
      }
    ]
  },
  {
    path: validatorsRoutes.providerDetails,
    lazyComponent: () =>
      import('layouts/ProviderLayout').then((module) => module.ProviderLayout),
    children: [
      {
        path: validatorsRoutes.providerDetails,
        title: 'Provider Details',
        preventScroll: true,
        lazyComponent: () =>
          import('pages/ProviderDetails').then(
            (module) => module.ProviderDetails
          )
      },
      {
        path: validatorsRoutes.providerTransactions,
        title: 'Provider Transactions',
        preventScroll: true,
        lazyComponent: () =>
          import('pages/ProviderDetails/ProviderTransactions').then(
            (module) => module.ProviderTransactions
          )
      }
    ]
  }
];
