import React from 'react';

import { useActiveRoute, useIsMainnet } from 'hooks';
import {
  wrappedRoutes,
  validatorsRoutes,
  searchRoutes,
  transactionsRoutes,
  blocksRoutes,
  accountsRoutes,
  tokensRoutes,
  collectionRoutes
} from 'routes';

export const useShowGlobalStats = () => {
  const activeRoute = useActiveRoute();
  const isMainnet = useIsMainnet();

  const routeExists = wrappedRoutes.some(({ path }) => activeRoute(path));

  switch (true) {
    case !routeExists:
    case activeRoute('/'):
    case activeRoute(searchRoutes.index):
    case activeRoute(searchRoutes.query):
    case activeRoute(validatorsRoutes.identities) && isMainnet:
    case activeRoute(validatorsRoutes.identityDetails) && isMainnet:
    case activeRoute(validatorsRoutes.providers) && isMainnet:
    case activeRoute(validatorsRoutes.providerDetails) && isMainnet:
    case activeRoute(validatorsRoutes.providerTransactions) && isMainnet:
    case activeRoute(validatorsRoutes.nodes) && isMainnet:
    case activeRoute(validatorsRoutes.nodeDetails) && isMainnet:
    case activeRoute(validatorsRoutes.statistics) && isMainnet:
    case activeRoute(validatorsRoutes.queue) && isMainnet:
      return false;
  }

  return true;
};

export const useShowCustomStats = () => {
  const activeRoute = useActiveRoute();

  switch (true) {
    case activeRoute(blocksRoutes.blocks):
    case activeRoute(blocksRoutes.blocksDetails):
    case activeRoute(blocksRoutes.miniBlockDetails):
    case activeRoute(accountsRoutes.accounts):
    case activeRoute(accountsRoutes.accountDetails):
    case activeRoute(accountsRoutes.oldAccountDetails):
    case activeRoute(accountsRoutes.accountTokens):
    case activeRoute(accountsRoutes.accountNfts):
    case activeRoute(accountsRoutes.accountContracts):
    case activeRoute(accountsRoutes.accountStaking):
    case activeRoute(accountsRoutes.accountAnalytics):
    case activeRoute(accountsRoutes.accountCode):
    case activeRoute(accountsRoutes.accountCodeEndpoints):
    case activeRoute(accountsRoutes.accountCodeTypes):
    case activeRoute(accountsRoutes.accountCodeConstructor):
    case activeRoute(accountsRoutes.accountCodeEvents):
    case activeRoute(tokensRoutes.tokens):
    case activeRoute(tokensRoutes.tokenDetails):
    case activeRoute(tokensRoutes.tokenDetailsAccounts):
    case activeRoute(tokensRoutes.tokenDetailsLockedAccounts):
    case activeRoute(tokensRoutes.tokenDetailsRoles):
    case activeRoute(collectionRoutes.collections):
    case activeRoute(collectionRoutes.collectionDetails):
    case activeRoute(collectionRoutes.collectionDetailsRoles):
    case activeRoute(collectionRoutes.collectionsNft):
    case activeRoute(collectionRoutes.collectionsSft):
    case activeRoute(collectionRoutes.collectionDetailsRoles):
      return true;

    default:
      return false;
  }
};

export const useShowTransactionStats = () => {
  const activeRoute = useActiveRoute();

  switch (true) {
    case activeRoute(transactionsRoutes.transactions):
    case activeRoute(transactionsRoutes.transactionDetails):
    case activeRoute(transactionsRoutes.transactionDetailsLogs):
      return true;

    default:
      return false;
  }
};
