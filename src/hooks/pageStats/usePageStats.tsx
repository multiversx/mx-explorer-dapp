import React, { useMemo } from 'react';
import { useHeaderAccountsStats } from './useHeaderAccountsStats';
import { useHeadersBlocksStats } from './useHeadersBlocksStats';
import { useHeadersCollectionsStats } from './useHeadersCollectionsStats';
import { useHeadersTokensStats } from './useHeadersTokensStats';
import { capitalize } from '../../helpers';
import {
  accountsRoutes,
  blocksRoutes,
  collectionRoutes,
  tokensRoutes,
  validatorsRoutes
} from '../../routes';
import { useActiveRoute } from '../useActiveRoute';

export const usePageStats = () => {
  const activeRoute = useActiveRoute();

  const headersBlocksStats = useHeadersBlocksStats();
  const headersCollections = useHeadersCollectionsStats();
  const headersTokens = useHeadersTokensStats();
  const headersAccounts = useHeaderAccountsStats();

  const getData = (obj: Record<string, number> = {}) => {
    return Object.entries(obj).map(([key, value]) => ({
      title: capitalize(key),
      value
    }));
  };

  const headersBlocksData = useMemo(() => {
    return getData(headersBlocksStats.headersBlocks);
  }, [headersBlocksStats.headersBlocks]);

  const headersCollectionsData = useMemo(() => {
    return getData(headersCollections.headersCollections);
  }, [headersCollections.headersCollections]);

  const headersTokensData = useMemo(() => {
    return getData(headersTokens.headersTokens);
  }, [headersTokens.headersTokens]);

  const headersAccountsData = useMemo(() => {
    return getData(headersAccounts.headersAccounts);
  }, [headersAccounts.headersAccounts]);

  // console.log(headersAccounts.headersAccounts);
  // console.log(
  //   Object.entries(headersBlocksStats.headersBlocks ?? {}).map(
  //     ([key, value]) => ({
  //       title: capitalize(key),
  //       value
  //     })
  //   )
  // );

  const pageStats = useMemo(() => {
    switch (true) {
      case activeRoute(validatorsRoutes.identities):
      case activeRoute(validatorsRoutes.nodes):
      case activeRoute(validatorsRoutes.providers):
      case activeRoute(validatorsRoutes.statistics):
      case activeRoute(validatorsRoutes.queue):
        return {
          title: headersBlocksStats.title,
          data: headersBlocksData
        };

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
        return {
          title: headersAccounts.title,
          data: headersAccountsData
        };

      case activeRoute(tokensRoutes.tokenDetails):
      case activeRoute(tokensRoutes.tokenDetailsAccounts):
      case activeRoute(tokensRoutes.tokenDetailsLockedAccounts):
      case activeRoute(tokensRoutes.tokenDetailsRoles):
        return {
          title: headersTokens.title,
          data: headersTokensData
        };

      case activeRoute(tokensRoutes.tokensMetaEsdtDetails):
      case activeRoute(collectionRoutes.collectionDetails):
      case activeRoute(collectionRoutes.collectionDetailsRoles):
        return {
          title: headersCollections.title,
          data: headersCollectionsData
        };

      case activeRoute(blocksRoutes.blocks):
        return {
          title: headersBlocksStats.title,
          data: headersBlocksData
        };

      // case activeRoute(validatorsRoutes.providerDetails):
      // case activeRoute(validatorsRoutes.providerTransactions):
      //   return <ProviderLayout>{children}</ProviderLayout>;
      //
      // case activeRoute(blocksRoutes.miniBlockDetails):
      //   return <MiniBlockLayout>{children}</MiniBlockLayout>;

      default:
        return {
          title: headersAccounts.title,
          data: headersAccountsData
        };
    }
  }, [
    activeRoute,
    headersBlocksStats,
    headersCollections,
    headersTokens,
    headersAccounts
  ]);

  return {
    pageStats
  };
};
