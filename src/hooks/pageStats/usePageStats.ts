import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { headersPropertiesMapper } from './constants/headersPropertiesMapper';
import { useHeaderAccountsStats } from './useHeaderAccountsStats';
import { useHeadersBlocksStats } from './useHeadersBlocksStats';
import { useHeadersCollectionsStats } from './useHeadersCollectionsStats';
import { useHeadersTokensStats } from './useHeadersTokensStats';
import { pageHeadersAccountsStatsSelector } from '../../redux/selectors/pageHeadersAccountsStats';
import { pageHeadersBlocksStatsSelector } from '../../redux/selectors/pageHeadersBlocksStats';
import { pageHeadersCollectionsStatsSelector } from '../../redux/selectors/pageHeadersCollectionsStats';
import { pageHeaderTokensStatsSelector } from '../../redux/selectors/pageHeadersTokensStats';
import {
  accountsRoutes,
  blocksRoutes,
  collectionRoutes,
  nftRoutes,
  tokensRoutes
} from '../../routes';
import { useActiveRoute } from '../useActiveRoute';

type PageStatsDataType = {
  id: string;
  title: string;
  value: string | number;
  subTitle?: string;
  icon?: React.ReactNode;
  currency?: string;
  order: number;
};

export const usePageStats = () => {
  const activeRoute = useActiveRoute();
  const pageHeadersBlocks = useSelector(pageHeadersBlocksStatsSelector);
  const pageHeadersAccounts = useSelector(pageHeadersAccountsStatsSelector);
  const pageHeadersCollections = useSelector(
    pageHeadersCollectionsStatsSelector
  );
  const pageHeadersTokens = useSelector(pageHeaderTokensStatsSelector);

  const { title: headersBlocksTitle } = useHeadersBlocksStats();
  const { title: headerCollectionsTitle } = useHeadersCollectionsStats();
  const { title: headersTokensTitle } = useHeadersTokensStats();
  const { title: headersAccountsTitle } = useHeaderAccountsStats();

  const getData = (
    category: string,
    obj: Record<string, string | number> = {}
  ): PageStatsDataType[] => {
    const getCurrency = (id: string) => {
      if (
        category === 'blocks' &&
        (id === 'totalDeveloperRewards' || id === 'totalNetworkFees')
      ) {
        return 'EGLD';
      }

      if (category === 'tokens' && id === 'ecosystemMarketCap') {
        return '$';
      }

      return undefined;
    };

    const data = Object.entries(obj)
      .map(([key, value]) => {
        const currency = getCurrency(key);

        let val = value;
        if (!currency) {
          val = value;
        } else if (currency === '$') {
          val = `$${value}`;
        } else {
          val = `${value} ${currency}`;
        }

        let pageStatsDataObject: PageStatsDataType | null = null;

        try {
          pageStatsDataObject = {
            id: key,
            title: headersPropertiesMapper[category][key].name,
            order: headersPropertiesMapper[category][key].order,
            value: val
          };
        } catch (e) {
          console.warn('property not found', category, key);
        }

        return pageStatsDataObject;
      })
      .filter((x) => x != null) as PageStatsDataType[];

    return data;
  };

  const headersBlocksData = useMemo(() => {
    return getData('blocks', pageHeadersBlocks).sort(
      (a, b) => a.order - b.order
    );
  }, [pageHeadersBlocks]);

  const headersCollectionsData = useMemo(() => {
    return getData('collections', pageHeadersCollections).sort(
      (a, b) => a.order - b.order
    );
  }, [pageHeadersCollections]);

  const headersTokensData = useMemo(() => {
    return getData('tokens', pageHeadersTokens).sort(
      (a, b) => a.order - b.order
    );
  }, [pageHeadersTokens]);

  const headersAccountsData = useMemo(() => {
    return getData('accounts', pageHeadersAccounts).sort(
      (a, b) => a.order - b.order
    );
  }, [pageHeadersAccounts]);

  const pageStats = useMemo(() => {
    switch (true) {
      case activeRoute(blocksRoutes.miniBlockDetails):
      case activeRoute(blocksRoutes.blocks):
      case activeRoute(blocksRoutes.blocksDetails):
        return {
          title: headersBlocksTitle,
          data: headersBlocksData
        };

      case activeRoute(accountsRoutes.accounts):
      case activeRoute(accountsRoutes.accountDetails):
      case activeRoute(accountsRoutes.oldAccountDetails):
      case activeRoute(accountsRoutes.accountTokens):
      case activeRoute(accountsRoutes.accountNfts):
      case activeRoute(accountsRoutes.accountContracts):
      case activeRoute(accountsRoutes.accountStaking):
      case activeRoute(accountsRoutes.accountAnalytics):
      case activeRoute(accountsRoutes.accountCode):
      case activeRoute(accountsRoutes.accountCodeConstructor):
      case activeRoute(accountsRoutes.accountCodeEndpoints):
      case activeRoute(accountsRoutes.accountCodeEvents):
      case activeRoute(accountsRoutes.accountCodeTypes):
        return {
          title: headersAccountsTitle,
          data: headersAccountsData
        };

      case activeRoute(tokensRoutes.tokens):
      case activeRoute(tokensRoutes.tokenDetails):
      case activeRoute(tokensRoutes.tokenDetailsAccounts):
      case activeRoute(tokensRoutes.tokenDetailsLockedAccounts):
      case activeRoute(tokensRoutes.tokenDetailsRoles):
        return {
          title: headersTokensTitle,
          data: headersTokensData
        };

      case activeRoute(collectionRoutes.collections):
      case activeRoute(collectionRoutes.collectionsNft):
      case activeRoute(collectionRoutes.collectionsSft):
      case activeRoute(collectionRoutes.collectionDetails):
      case activeRoute(collectionRoutes.collectionDetailsRoles):
      case activeRoute(nftRoutes.nftDetails):
        return {
          title: headerCollectionsTitle,
          data: headersCollectionsData
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
