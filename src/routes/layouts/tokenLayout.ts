import { NonIndexRouteObject } from 'react-router-dom';

import { TokenLayout } from 'layouts/TokenLayout';
import { CollectionAssets } from 'pages/CollectionDetails/CollectionAssets';
import { TokenDetailsAccounts } from 'pages/TokenDetails/TokenAccounts';
import { TokenDetailsLockedAccounts } from 'pages/TokenDetails/TokenLockedAccounts';
import { TokenDetailsRoles } from 'pages/TokenDetails/TokenRoles';
import { TokenTransactions } from 'pages/TokenDetails/TokenTransactions';
import { Tokens } from 'pages/Tokens';
import { TokensMeta } from 'pages/TokensMeta';

export const tokensRoutes = {
  tokens: '/tokens',
  tokensMeta: '/meta-tokens',
  tokensMetaEsdt: '/meta-esdt',
  tokenDetails: '/tokens/:hash',
  tokensMetaEsdtDetails: '/meta-esdt/:hash',
  tokenDetailsAccounts: '/tokens/:hash/accounts',
  tokenDetailsLockedAccounts: '/tokens/:hash/locked-accounts',
  tokenDetailsRoles: '/tokens/:hash/roles'
};

export const tokenLayout: NonIndexRouteObject[] = [
  {
    path: tokensRoutes.tokensMeta,
    //title: 'Meta-ESDT Tokens',
    Component: TokensMeta
  },
  {
    path: tokensRoutes.tokensMetaEsdt,
    //title: 'Meta-ESDT Tokens',
    Component: TokensMeta
  },
  {
    path: tokensRoutes.tokensMetaEsdtDetails,
    //title: 'Meta-ESDT Details',
    Component: CollectionAssets
  },
  {
    path: tokensRoutes.tokens,
    //title: 'Tokens',
    Component: Tokens
  },
  {
    path: tokensRoutes.tokenDetails,
    //title: 'Token Details',
    Component: TokenLayout,
    children: [
      {
        path: tokensRoutes.tokenDetails,
        //title: 'Token Holders',
        Component: TokenTransactions
      },
      {
        path: tokensRoutes.tokenDetailsAccounts,
        //title: 'Token Holders',
        Component: TokenDetailsAccounts
      },
      {
        path: tokensRoutes.tokenDetailsLockedAccounts,
        //title: 'Locked Token Accounts',
        Component: TokenDetailsLockedAccounts
      },
      {
        path: tokensRoutes.tokenDetailsRoles,
        //title: 'Token Roles',
        Component: TokenDetailsRoles
      }
    ]
  }
];
