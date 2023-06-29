import { CollectionLayout } from 'layouts/CollectionLayout';
import { TokenLayout } from 'layouts/TokenLayout';
import { CollectionAssets } from 'pages/CollectionDetails/CollectionAssets';
import { TokenDetailsAccounts } from 'pages/TokenDetails/TokenAccounts';
import { TokenDetailsLockedAccounts } from 'pages/TokenDetails/TokenLockedAccounts';
import { TokenDetailsRoles } from 'pages/TokenDetails/TokenRoles';
import { TokenTransactions } from 'pages/TokenDetails/TokenTransactions';
import { Tokens } from 'pages/Tokens';
import { TokensMeta } from 'pages/TokensMeta';

import { TitledRouteObject } from '../routes';

export const tokensRoutes = {
  tokens: '/tokens',
  tokensMeta: '/meta-tokens',
  tokensMetaEsdt: '/meta-esdt',
  tokensMetaEsdtDetails: '/meta-esdt/:hash',
  tokenDetails: '/tokens/:hash',
  tokenDetailsAccounts: '/tokens/:hash/accounts',
  tokenDetailsLockedAccounts: '/tokens/:hash/locked-accounts',
  tokenDetailsRoles: '/tokens/:hash/roles'
};

export const tokenLayout: TitledRouteObject[] = [
  {
    path: tokensRoutes.tokensMeta,
    title: 'Meta-ESDT Tokens',
    preventScroll: true,
    Component: TokensMeta
  },
  {
    path: tokensRoutes.tokensMetaEsdt,
    title: 'Meta-ESDT Tokens',
    preventScroll: true,
    Component: TokensMeta
  },
  {
    path: tokensRoutes.tokensMetaEsdtDetails,
    preventScroll: true,
    Component: CollectionLayout,
    children: [
      {
        path: tokensRoutes.tokensMetaEsdtDetails,
        title: 'Meta-ESDT Details',
        preventScroll: true,
        Component: CollectionAssets
      }
    ]
  },
  {
    path: tokensRoutes.tokens,
    title: 'Tokens',
    preventScroll: true,
    Component: Tokens
  },
  {
    path: tokensRoutes.tokenDetails,
    preventScroll: true,
    Component: TokenLayout,
    children: [
      {
        path: tokensRoutes.tokenDetails,
        title: 'Token Details',
        preventScroll: true,
        Component: TokenTransactions
      },
      {
        path: tokensRoutes.tokenDetailsAccounts,
        title: 'Token Holders',
        preventScroll: true,
        Component: TokenDetailsAccounts
      },
      {
        path: tokensRoutes.tokenDetailsLockedAccounts,
        title: 'Locked Token Accounts',
        preventScroll: true,
        Component: TokenDetailsLockedAccounts
      },
      {
        path: tokensRoutes.tokenDetailsRoles,
        title: 'Token Roles',
        preventScroll: true,
        Component: TokenDetailsRoles
      }
    ]
  }
];
