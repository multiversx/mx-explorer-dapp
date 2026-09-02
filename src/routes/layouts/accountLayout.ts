import { TitledRouteObject } from '../routes';

export const accountsRoutes = {
  accounts: '/accounts',
  accountDetails: '/accounts/:hash',
  accountTokens: '/accounts/:hash/tokens',
  accountNfts: '/accounts/:hash/nfts',
  accountContracts: '/accounts/:hash/contracts',
  accountStaking: '/accounts/:hash/staking',
  accountAnalytics: '/accounts/:hash/analytics',
  accountUpgrades: '/accounts/:hash/upgrades',
  accountCode: '/accounts/:hash/code/*',
  accountCodeConstructor: '/accounts/:hash/code/contract-constructor',
  accountCodeDetails: '/accounts/:hash/code/details',
  accountCodeEndpoints: '/accounts/:hash/code/endpoints',
  accountCodeEndpointsRead: '/accounts/:hash/code/endpoints-read',
  accountCodeEndpointsWrite: '/accounts/:hash/code/endpoints-write',
  accountCodeEvents: '/accounts/:hash/code/events',
  accountCodeSource: '/accounts/:hash/code/source',
  accountCodeTypes: '/accounts/:hash/code/types',
  accountRolesTokens: '/accounts/:hash/roles/tokens',
  accountRolesCollections: '/accounts/:hash/roles/collections',
  accountNodes: '/accounts/:hash/nodes',
  oldAccountDetails: '/address/:hash'
};

export const applicationsRoutes = {
  applications: '/applications'
};

export const accountLayout: TitledRouteObject[] = [
  {
    path: accountsRoutes.oldAccountDetails,
    title: 'Account Details',
    lazyComponent: () =>
      import('pages/AccountDetails/OldRouteRedirect').then(
        (module) => module.OldRouteRedirect
      )
  },
  {
    path: accountsRoutes.accounts,
    title: 'Accounts',
    lazyComponent: () =>
      import('pages/Accounts').then((module) => module.Accounts)
  },
  {
    path: applicationsRoutes.applications,
    title: 'Applications',
    lazyComponent: () =>
      import('pages/Applications').then((module) => module.Applications)
  },
  {
    path: accountsRoutes.accountDetails,
    preventScroll: true,
    lazyComponent: () =>
      import('layouts/AccountLayout').then((module) => module.AccountLayout),
    children: [
      {
        path: accountsRoutes.accountDetails,
        title: 'Account Details',
        preventScroll: true,
        lazyComponent: () =>
          import('pages/AccountDetails/AccountTransactions').then(
            (module) => module.AccountTransactions
          )
      },
      {
        path: accountsRoutes.accountCode,
        title: 'Smart Contract Code',
        preventScroll: true,
        lazyComponent: () =>
          import('pages/AccountDetails/AccountContractCode').then(
            (module) => module.AccountContractCode
          )
      },
      {
        path: accountsRoutes.accountUpgrades,
        title: 'Smart Contract Upgrades',
        preventScroll: true,
        lazyComponent: () =>
          import('pages/AccountDetails/AccountUpgrades').then(
            (module) => module.AccountUpgrades
          )
      },
      {
        path: accountsRoutes.accountTokens,
        title: 'Account Tokens',
        preventScroll: true,
        lazyComponent: () =>
          import('pages/AccountDetails/AccountTokensTable').then(
            (module) => module.AccountTokensTable
          )
      },
      {
        path: accountsRoutes.accountNfts,
        title: 'Account NFTs',
        preventScroll: true,
        lazyComponent: () =>
          import('pages/AccountDetails/AccountNfts').then(
            (module) => module.AccountNfts
          )
      },
      {
        path: accountsRoutes.accountStaking,
        title: 'Account Staking Details',
        preventScroll: true,
        lazyComponent: () =>
          import('pages/AccountDetails/AccountStaking').then(
            (module) => module.AccountStaking
          )
      },
      {
        path: accountsRoutes.accountAnalytics,
        title: 'Account Analytics',
        preventScroll: true,
        lazyComponent: () =>
          import('pages/AccountDetails/AccountAnalytics').then(
            (module) => module.AccountAnalytics
          )
      },
      {
        path: accountsRoutes.accountContracts,
        title: 'Smart Contracts',
        preventScroll: true,
        lazyComponent: () =>
          import('pages/AccountDetails/AccountContracts').then(
            (module) => module.AccountContracts
          )
      },
      {
        path: accountsRoutes.accountNodes,
        title: 'Nodes',
        preventScroll: true,
        lazyComponent: () =>
          import('pages/AccountDetails/AccountNodes').then(
            (module) => module.AccountNodes
          )
      },
      {
        path: accountsRoutes.accountRolesTokens,
        title: 'Token Roles',
        preventScroll: true,
        lazyComponent: () =>
          import('pages/AccountDetails/AccountRoles/AccountTokenRoles').then(
            (module) => module.AccountTokenRoles
          )
      },
      {
        path: accountsRoutes.accountRolesCollections,
        title: 'Collection Roles',
        preventScroll: true,
        lazyComponent: () =>
          import(
            'pages/AccountDetails/AccountRoles/AccountCollectionRoles'
          ).then((module) => module.AccountCollectionRoles)
      }
    ]
  }
];
