import { TitledRouteObject } from '../routes';

export const tokensRoutes = {
  tokens: '/tokens',
  tokensMeta: '/meta-tokens',
  tokensMetaEsdt: '/meta-esdt',
  tokensMetaEsdtDetails: '/meta-esdt/:hash',
  tokensMetaEsdtDetailsRoles: '/meta-esdt/:hash/roles',
  tokensProofDetails: '/proofs/:hash',
  tokensProofDetailsAccounts: '/proofs/:hash/accounts',
  tokenDetails: '/tokens/:hash',
  tokenDetailsAccounts: '/tokens/:hash/accounts',
  tokenDetailsLockedAccounts: '/tokens/:hash/locked-accounts',
  tokenDetailsRoles: '/tokens/:hash/roles',
  tokenDetailsAnalytics: '/tokens/:hash/analytics'
};

export const tokenLayout: TitledRouteObject[] = [
  {
    path: tokensRoutes.tokensMeta,
    title: 'Meta-ESDT Tokens',
    preventScroll: true,
    lazyComponent: () =>
      import('pages/TokensMeta').then((module) => module.TokensMeta)
  },
  {
    path: tokensRoutes.tokensMetaEsdt,
    title: 'Meta-ESDT Tokens',
    preventScroll: true,
    lazyComponent: () =>
      import('pages/TokensMeta').then((module) => module.TokensMeta)
  },
  {
    path: tokensRoutes.tokensMetaEsdtDetails,
    preventScroll: true,
    lazyComponent: () =>
      import('layouts/CollectionLayout').then(
        (module) => module.CollectionLayout
      ),
    children: [
      {
        path: tokensRoutes.tokensMetaEsdtDetails,
        title: 'Meta-ESDT Transactions',
        preventScroll: true,
        lazyComponent: () =>
          import('pages/CollectionDetails/CollectionTransactions').then(
            (module) => module.CollectionTransactions
          )
      },
      {
        path: tokensRoutes.tokensMetaEsdtDetailsRoles,
        title: 'Meta-ESDT Roles',
        preventScroll: true,
        lazyComponent: () =>
          import('pages/CollectionDetails/CollectionRoles').then(
            (module) => module.CollectionRoles
          )
      }
    ]
  },
  {
    path: tokensRoutes.tokensProofDetails,
    preventScroll: true,
    lazyComponent: () =>
      import('layouts/NftLayout').then((module) => module.NftLayout),
    children: [
      {
        path: tokensRoutes.tokensProofDetails,
        title: 'Proof Transactions',
        preventScroll: true,
        lazyComponent: () =>
          import('pages/NftDetails/NftTransactions').then(
            (module) => module.NftTransactions
          )
      },
      {
        path: tokensRoutes.tokensProofDetailsAccounts,
        title: 'Proof Holders',
        preventScroll: true,
        lazyComponent: () =>
          import('pages/NftDetails/NftAccounts').then(
            (module) => module.NftAccounts
          )
      }
    ]
  },
  {
    path: tokensRoutes.tokens,
    title: 'Tokens',
    preventScroll: true,
    lazyComponent: () => import('pages/Tokens').then((module) => module.Tokens)
  },
  {
    path: tokensRoutes.tokenDetails,
    preventScroll: true,
    lazyComponent: () =>
      import('layouts/TokenLayout').then((module) => module.TokenLayout),
    children: [
      {
        path: tokensRoutes.tokenDetails,
        title: 'Token Details',
        preventScroll: true,
        lazyComponent: () =>
          import('pages/TokenDetails/TokenTransactions').then(
            (module) => module.TokenTransactions
          )
      },
      {
        path: tokensRoutes.tokenDetailsAccounts,
        title: 'Token Holders',
        preventScroll: true,
        lazyComponent: () =>
          import('pages/TokenDetails/TokenAccounts').then(
            (module) => module.TokenDetailsAccounts
          )
      },
      {
        path: tokensRoutes.tokenDetailsLockedAccounts,
        title: 'Locked Token Accounts',
        preventScroll: true,
        lazyComponent: () =>
          import('pages/TokenDetails/TokenLockedAccounts').then(
            (module) => module.TokenDetailsLockedAccounts
          )
      },
      {
        path: tokensRoutes.tokenDetailsRoles,
        title: 'Token Roles',
        preventScroll: true,
        lazyComponent: () =>
          import('pages/TokenDetails/TokenRoles').then(
            (module) => module.TokenDetailsRoles
          )
      },
      {
        path: tokensRoutes.tokenDetailsAnalytics,
        title: 'Token Analytics',
        preventScroll: true,
        lazyComponent: () =>
          import('pages/TokenDetails/TokenDetailsAnalytics').then(
            (module) => module.TokenDetailsAnalytics
          )
      }
    ]
  }
];
