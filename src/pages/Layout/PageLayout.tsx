import React from 'react';

import { useActiveRoute } from 'hooks';
import { AccountLayout } from 'pages/AccountDetails/AccountLayout';
import { CollectionLayout } from 'pages/CollectionDetails/CollectionLayout';
import { MiniBlockLayout } from 'pages/MiniBlockDetails/MiniBlockLayout';
import { NodesLayout } from 'pages/Nodes/NodesLayout';
import { ProviderLayout } from 'pages/ProviderDetails/ProviderLayout';
import { TokenLayout } from 'pages/TokenDetails/TokenLayout';
import {
  accountsRoutes,
  blocksRoutes,
  collectionRoutes,
  tokensRoutes,
  validatorsRoutes
} from 'routes';

export const PageLayout = ({ children }: { children: React.ReactNode }) => {
  const activeRoute = useActiveRoute();

  switch (true) {
    case activeRoute(validatorsRoutes.identities):
    case activeRoute(validatorsRoutes.nodes):
    case activeRoute(validatorsRoutes.providers):
    case activeRoute(validatorsRoutes.statistics):
    case activeRoute(validatorsRoutes.queue):
      return <NodesLayout>{children}</NodesLayout>;

    case activeRoute(accountsRoutes.accountDetails):
    case activeRoute(accountsRoutes.accountTokens):
    case activeRoute(accountsRoutes.accountNfts):
    case activeRoute(accountsRoutes.accountContracts):
    case activeRoute(accountsRoutes.accountStaking):
    case activeRoute(accountsRoutes.accountAnalytics):
    case activeRoute(accountsRoutes.accountCode):
    case activeRoute(accountsRoutes.accountCodeEndpoints):
    case activeRoute(accountsRoutes.accountCodeViews):
    case activeRoute(accountsRoutes.accountCodeTypes):
      return <AccountLayout>{children}</AccountLayout>;

    case activeRoute(tokensRoutes.tokenDetails):
    case activeRoute(tokensRoutes.tokenDetailsAccounts):
    case activeRoute(tokensRoutes.tokenDetailsLockedAccounts):
    case activeRoute(tokensRoutes.tokenDetailsRoles):
      return <TokenLayout>{children}</TokenLayout>;

    case activeRoute(tokensRoutes.tokensMetaEsdtDetails):
    case activeRoute(collectionRoutes.collectionDetails):
    case activeRoute(collectionRoutes.collectionDetailsRoles):
      return <CollectionLayout>{children}</CollectionLayout>;

    case activeRoute(validatorsRoutes.providerDetails):
    case activeRoute(validatorsRoutes.providerTransactions):
      return <ProviderLayout>{children}</ProviderLayout>;

    case activeRoute(blocksRoutes.miniBlockDetails):
      return <MiniBlockLayout>{children}</MiniBlockLayout>;

    default:
      return <>{children}</>;
  }
};
