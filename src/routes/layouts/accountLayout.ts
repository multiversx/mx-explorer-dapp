import { AccountLayout } from 'layouts/AccountLayout';
import { AccountAnalytics } from 'pages/AccountDetails/AccountAnalytics';
import { AccountContractCode } from 'pages/AccountDetails/AccountContractCode';
import { AccountContracts } from 'pages/AccountDetails/AccountContracts';
import { AccountNfts } from 'pages/AccountDetails/AccountNfts';
import { AccountStaking } from 'pages/AccountDetails/AccountStaking';
import { AccountTokens } from 'pages/AccountDetails/AccountTokens';
import { AccountTransactions } from 'pages/AccountDetails/AccountTransactions';
import { OldRouteRedirect } from 'pages/AccountDetails/OldRouteRedirect';
import { Accounts } from 'pages/Accounts';

import { TitledRouteObject } from '../routes';

export const accountsRoutes = {
  accounts: '/accounts',
  accountDetails: '/accounts/:hash',
  accountTokens: '/accounts/:hash/tokens',
  accountNfts: '/accounts/:hash/nfts',
  accountContracts: '/accounts/:hash/contracts',
  accountStaking: '/accounts/:hash/staking',
  accountAnalytics: '/accounts/:hash/analytics',
  accountCode: '/accounts/:hash/code/*',
  accountCodeConstructor: '/accounts/:hash/code/contract-constructor',
  accountCodeEndpoints: '/accounts/:hash/code/endpoints',
  accountCodeEvents: '/accounts/:hash/code/events',
  accountCodeTypes: '/accounts/:hash/code/types',
  oldAccountDetails: '/address/:hash'
};

export const accountLayout: TitledRouteObject[] = [
  {
    path: accountsRoutes.oldAccountDetails,
    title: 'Account Details',
    Component: OldRouteRedirect
  },
  {
    path: accountsRoutes.accounts,
    title: 'Accounts',
    Component: Accounts
  },
  {
    path: accountsRoutes.accountDetails,
    preventScroll: true,
    Component: AccountLayout,
    children: [
      {
        path: accountsRoutes.accountDetails,
        title: 'Account Details',
        preventScroll: true,
        Component: AccountTransactions
      },
      {
        path: accountsRoutes.accountCode,
        title: 'Account Contract Code',
        preventScroll: true,
        Component: AccountContractCode
      },
      {
        path: accountsRoutes.accountTokens,
        title: 'Account Tokens',
        preventScroll: true,
        Component: AccountTokens
      },
      {
        path: accountsRoutes.accountNfts,
        title: 'Account NFTs',
        preventScroll: true,
        Component: AccountNfts
      },
      {
        path: accountsRoutes.accountStaking,
        title: 'Account Staking Details',
        preventScroll: true,
        Component: AccountStaking
      },
      {
        path: accountsRoutes.accountAnalytics,
        title: 'Account Analytics',
        preventScroll: true,
        Component: AccountAnalytics
      },
      {
        path: accountsRoutes.accountContracts,
        title: 'Account Smart Contracts',
        preventScroll: true,
        Component: AccountContracts
      }
    ]
  }
];