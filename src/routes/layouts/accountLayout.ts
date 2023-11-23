import { AccountLayout } from 'layouts/AccountLayout';
import { AccountAnalytics } from 'pages/AccountDetails/AccountAnalytics';
import { AccountContractCode } from 'pages/AccountDetails/AccountContractCode';
import { AccountContracts } from 'pages/AccountDetails/AccountContracts';
import { AccountNfts } from 'pages/AccountDetails/AccountNfts';
import { AccountCollectionRoles } from 'pages/AccountDetails/AccountRoles/AccountCollectionRoles';
import { AccountTokenRoles } from 'pages/AccountDetails/AccountRoles/AccountTokenRoles';
import { AccountStaking } from 'pages/AccountDetails/AccountStaking';
import { AccountTokens } from 'pages/AccountDetails/AccountTokens';
import { AccountTransactions } from 'pages/AccountDetails/AccountTransactions';
import { AccountUpgrades } from 'pages/AccountDetails/AccountUpgrades';
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
        title: 'Smart Contract Code',
        preventScroll: true,
        Component: AccountContractCode
      },
      {
        path: accountsRoutes.accountUpgrades,
        title: 'Smart Contract Upgrades',
        preventScroll: true,
        Component: AccountUpgrades
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
        title: 'Smart Contracts',
        preventScroll: true,
        Component: AccountContracts
      },
      {
        path: accountsRoutes.accountRolesTokens,
        title: 'Token Roles',
        preventScroll: true,
        Component: AccountTokenRoles
      },
      {
        path: accountsRoutes.accountRolesCollections,
        title: 'Collection Roles',
        preventScroll: true,
        Component: AccountCollectionRoles
      }
    ]
  }
];
