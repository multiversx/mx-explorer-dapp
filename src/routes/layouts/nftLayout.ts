import { NonIndexRouteObject } from 'react-router-dom';

import { NftLayout } from 'layouts/NftLayout';
import { NftTransactions } from 'pages/NftDetails';
import { NftAccounts } from 'pages/NftDetails/NftAccounts';
import { Nfts } from 'pages/Nfts';

export const nftRoutes = {
  nfts: '/nfts',
  nftDetails: '/nfts/:hash',
  nftDetailsAccounts: '/nfts/:hash/accounts'
};

export const nftLayout: NonIndexRouteObject[] = [
  {
    path: nftRoutes.nfts,
    //title: 'NFTs',
    Component: Nfts
  },
  {
    path: nftRoutes.nftDetails,
    //title: 'NFT Details',
    Component: NftLayout,
    children: [
      {
        path: nftRoutes.nftDetails,
        //title: 'NFT Owners',
        Component: NftTransactions
      },
      {
        path: nftRoutes.nftDetailsAccounts,
        //title: 'NFT Owners',
        Component: NftAccounts
      }
    ]
  }
];
