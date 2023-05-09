import { RouteObject } from 'react-router-dom';

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

export const accountLayout: RouteObject[] = [
  {
    path: accountsRoutes.oldAccountDetails,
    // title: 'Account Details',
    Component: OldRouteRedirect
  },
  {
    path: accountsRoutes.accounts,
    // title: '',
    Component: Accounts
  },
  {
    path: accountsRoutes.accountDetails,
    // title: 'Accounts',
    Component: AccountLayout,
    children: [
      // {
      //   path: accountsRoutes.accountDetails,
      //   // title: 'Account Details',
      //   Component: AccountDetails
      // },
      // {
      //   path: accountsRoutes.oldAccountDetails,
      //   // title: 'Account Details',
      //   Component: () => <div>OldRouteRedirect</div>
      // },
      {
        path: accountsRoutes.accountDetails,
        // title: 'Account Contract Code',
        Component: AccountTransactions
      },
      {
        path: accountsRoutes.accountCode,
        // title: 'Account Contract Code',
        Component: AccountContractCode
      },
      {
        path: accountsRoutes.accountTokens,
        // title: 'Account Tokens',
        Component: AccountTokens
      },
      {
        path: accountsRoutes.accountNfts,
        // title: 'Account NFTs',
        Component: AccountNfts
      },
      {
        path: accountsRoutes.accountStaking,
        // title: 'Account Staking Details',
        Component: AccountStaking
      },
      {
        path: accountsRoutes.accountAnalytics,
        // title: 'Account Analytics',
        Component: AccountAnalytics
      },
      {
        path: accountsRoutes.accountContracts,
        // title: 'Account Smart Contracts',
        Component: AccountContracts
      }
    ]
  }
];
