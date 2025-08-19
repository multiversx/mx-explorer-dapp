import { CollectionLayout } from 'layouts/CollectionLayout';
import { TokenLayout } from 'layouts/TokenLayout';
import { CollectionRoles } from 'pages/CollectionDetails/CollectionRoles';
import { CollectionTransactions } from 'pages/CollectionDetails/CollectionTransactions';
import { TokenDetailsAccounts } from 'pages/TokenDetails/TokenAccounts';
import { TokenDetailsAnalytics } from 'pages/TokenDetails/TokenDetailsAnalytics';
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
  tokensMetaEsdtDetailsRoles: '/meta-esdt/:hash/roles',
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
        title: 'Meta-ESDT Transactions',
        preventScroll: true,
        Component: CollectionTransactions
      },
      {
        path: tokensRoutes.tokensMetaEsdtDetailsRoles,
        title: 'Meta-ESDT Roles',
        preventScroll: true,
        Component: CollectionRoles
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
      },
      {
        path: tokensRoutes.tokenDetailsAnalytics,
        title: 'Token Analytics',
        preventScroll: true,
        Component: TokenDetailsAnalytics
      }
    ]
  }
];
