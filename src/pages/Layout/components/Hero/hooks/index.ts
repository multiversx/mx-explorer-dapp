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
  collectionRoutes,
  nftRoutes,
  analyticsRoutes
} from 'routes';

export const useShowGlobalStats = () => {
  const activeRoute = useActiveRoute();
  const routeExists = wrappedRoutes.some(({ path }) => activeRoute(path));

  switch (true) {
    case !routeExists:
    case activeRoute('/'):
    case activeRoute(searchRoutes.index):
    case activeRoute(searchRoutes.query):

    case activeRoute(analyticsRoutes.compare):
    case activeRoute(blocksRoutes.blocksDetails):
    case activeRoute(blocksRoutes.miniBlockDetails):
    case activeRoute(accountsRoutes.accountDetails):
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
    case activeRoute(collectionRoutes.collectionDetails):
    case activeRoute(collectionRoutes.collectionDetailsRoles):
    case activeRoute(nftRoutes.nftDetails):
    case activeRoute(tokensRoutes.tokenDetails):
    case activeRoute(tokensRoutes.tokenDetailsAccounts):
    case activeRoute(tokensRoutes.tokenDetailsLockedAccounts):
    case activeRoute(tokensRoutes.tokenDetailsRoles):
    case activeRoute(tokensRoutes.tokensMetaEsdtDetails):
    case activeRoute(transactionsRoutes.transactionDetails):
    case activeRoute(transactionsRoutes.transactionDetailsLogs):
      return false;
  }

  return true;
};

export const useShowCustomStats = () => {
  const activeRoute = useActiveRoute();

  switch (true) {
    case activeRoute(blocksRoutes.blocks):
    case activeRoute(accountsRoutes.accounts):
    case activeRoute(tokensRoutes.tokens):
    case activeRoute(tokensRoutes.tokensMeta):
    case activeRoute(tokensRoutes.tokensMetaEsdt):
    case activeRoute(collectionRoutes.collections):
    case activeRoute(collectionRoutes.collectionsNft):
    case activeRoute(collectionRoutes.collectionsSft):
      return true;

    default:
      return false;
  }
};

export const useShowTransactionStats = () => {
  const activeRoute = useActiveRoute();

  switch (true) {
    case activeRoute(transactionsRoutes.transactions):
      return true;

    default:
      return false;
  }
};

export const useShowNodesStats = () => {
  const activeRoute = useActiveRoute();

  switch (true) {
    case activeRoute(validatorsRoutes.identities):
    case activeRoute(validatorsRoutes.identityDetails):
    case activeRoute(validatorsRoutes.providers):
    case activeRoute(validatorsRoutes.providerDetails):
    case activeRoute(validatorsRoutes.providerTransactions):
    case activeRoute(validatorsRoutes.nodes):
    case activeRoute(validatorsRoutes.nodeDetails):
    case activeRoute(validatorsRoutes.statistics):
    case activeRoute(validatorsRoutes.queue):
      return true;
  }

  return false;
};
