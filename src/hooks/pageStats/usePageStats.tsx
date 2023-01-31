import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { useHeaderAccountsStats } from './useHeaderAccountsStats';
import { useHeadersBlocksStats } from './useHeadersBlocksStats';
import { useHeadersCollectionsStats } from './useHeadersCollectionsStats';
import { useHeadersTokensStats } from './useHeadersTokensStats';
import { capitalize } from '../../helpers';
import { pageHeadersAccountsStatsSelector } from '../../redux/selectors/pageHeadersAccountsStats';
import { pageHeadersBlocksStatsSelector } from '../../redux/selectors/pageHeadersBlocksStats';
import { pageHeadersCollectionsStatsSelector } from '../../redux/selectors/pageHeadersCollectionsStats';
import { pageHeaderTokensStatsSelector } from '../../redux/selectors/pageHeadersTokensStats';
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
  const pageHeadersBlocks = useSelector(pageHeadersBlocksStatsSelector);
  const pageHeadersAccounts = useSelector(pageHeadersAccountsStatsSelector);
  const pageHeadersCollections = useSelector(
    pageHeadersCollectionsStatsSelector
  );
  const pageHeadersTokens = useSelector(pageHeaderTokensStatsSelector);

  useHeadersBlocksStats();
  useHeadersCollectionsStats();
  useHeadersTokensStats();
  useHeaderAccountsStats();

  const getData = (obj: Record<string, number> = {}) => {
    console.log(obj);
    return Object.entries(obj).map(([key, value]) => ({
      title: capitalize(key),
      value
    }));
  };

  const headersBlocksData = useMemo(() => {
    return getData(pageHeadersBlocks);
  }, [pageHeadersBlocks]);

  const headersCollectionsData = useMemo(() => {
    return getData(pageHeadersCollections);
  }, [pageHeadersCollections]);

  const headersTokensData = useMemo(() => {
    return getData(pageHeadersTokens);
  }, [pageHeadersTokens]);

  const headersAccountsData = useMemo(() => {
    return getData(pageHeadersAccounts);
  }, [pageHeadersAccounts]);

  const pageStats = useMemo(() => {
    switch (true) {
      case activeRoute(blocksRoutes.blocks):
      case activeRoute(validatorsRoutes.identities):
      case activeRoute(validatorsRoutes.nodes):
      case activeRoute(validatorsRoutes.providers):
      case activeRoute(validatorsRoutes.statistics):
      case activeRoute(validatorsRoutes.queue):
        return {
          title: 'Blocks',
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
          title: 'Accounts',
          data: headersAccountsData
        };

      case activeRoute(tokensRoutes.tokens):
      case activeRoute(tokensRoutes.tokenDetails):
      case activeRoute(tokensRoutes.tokenDetailsAccounts):
      case activeRoute(tokensRoutes.tokenDetailsLockedAccounts):
      case activeRoute(tokensRoutes.tokenDetailsRoles):
        return {
          title: 'Tokens',
          data: headersTokensData
        };

      case activeRoute(collectionRoutes.collections):
      case activeRoute(tokensRoutes.tokensMetaEsdtDetails):
      case activeRoute(collectionRoutes.collectionDetails):
      case activeRoute(collectionRoutes.collectionDetailsRoles):
        return {
          title: 'Collections',
          data: headersCollectionsData
        };

      // case activeRoute(validatorsRoutes.providerDetails):
      // case activeRoute(validatorsRoutes.providerTransactions):
      //   return <ProviderLayout>{children}</ProviderLayout>;
      //
      // case activeRoute(blocksRoutes.miniBlockDetails):
      //   return <MiniBlockLayout>{children}</MiniBlockLayout>;

      default:
        return {
          title: 'Accounts',
          data: headersAccountsData
        };
    }
  }, [
    activeRoute,
    headersBlocksData,
    headersCollectionsData,
    headersTokensData,
    headersAccountsData
  ]);

  return {
    pageStats
  };
};
