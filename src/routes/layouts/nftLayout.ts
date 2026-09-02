import { TitledRouteObject } from '../routes';

export const nftRoutes = {
  nfts: '/nfts',
  nftDetails: '/nfts/:hash',
  nftDetailsTransactions: '/nfts/:hash/transactions',
  nftDetailsAccounts: '/nfts/:hash/accounts'
};

export const nftLayout: TitledRouteObject[] = [
  {
    path: nftRoutes.nfts,
    title: 'NFTs',
    lazyComponent: () => import('pages/Nfts').then((module) => module.Nfts)
  },
  {
    path: nftRoutes.nftDetails,
    preventScroll: true,
    lazyComponent: () =>
      import('layouts/NftLayout').then((module) => module.NftLayout),
    children: [
      {
        path: nftRoutes.nftDetails,
        title: 'NFT Details',
        preventScroll: true,
        lazyComponent: () =>
          import('pages/NftDetails').then((module) => module.NftDetails)
      },
      {
        path: nftRoutes.nftDetailsTransactions,
        title: 'NFT Transactions',
        preventScroll: true,
        lazyComponent: () =>
          import('pages/NftDetails/NftTransactions').then(
            (module) => module.NftTransactions
          )
      },
      {
        path: nftRoutes.nftDetailsAccounts,
        title: 'NFT Holders',
        preventScroll: true,
        lazyComponent: () =>
          import('pages/NftDetails/NftAccounts').then(
            (module) => module.NftAccounts
          )
      }
    ]
  }
];
