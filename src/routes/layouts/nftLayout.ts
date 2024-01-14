import { NftLayout } from 'layouts/NftLayout';
import { NftDetails } from 'pages/NftDetails';
import { NftAccounts } from 'pages/NftDetails/NftAccounts';
import { NftTransactions } from 'pages/NftDetails/NftTransactions';
import { Nfts } from 'pages/Nfts';

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
    Component: Nfts
  },
  {
    path: nftRoutes.nftDetails,
    preventScroll: true,
    Component: NftLayout,
    children: [
      {
        path: nftRoutes.nftDetails,
        title: 'NFT Details',
        preventScroll: true,
        Component: NftDetails
      },
      {
        path: nftRoutes.nftDetailsTransactions,
        title: 'NFT Transactions',
        preventScroll: true,
        Component: NftTransactions
      },
      {
        path: nftRoutes.nftDetailsAccounts,
        title: 'NFT Owners',
        preventScroll: true,
        Component: NftAccounts
      }
    ]
  }
];
