import React, { useMemo } from 'react';
import { faCircleBolt } from '@fortawesome/pro-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useSelector } from 'react-redux';
import { headersPropertiesNamesMapper } from './constants/headersPropertiesNamesMapper';
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
};

export const usePageStats = () => {
  const activeRoute = useActiveRoute();
  const pageHeadersBlocks = useSelector(pageHeadersBlocksStatsSelector);
  const pageHeadersAccounts = useSelector(pageHeadersAccountsStatsSelector);
  const pageHeadersCollections = useSelector(
    pageHeadersCollectionsStatsSelector
  );
  const pageHeadersTokens = useSelector(pageHeaderTokensStatsSelector);

  const teal = getComputedStyle(document.documentElement)
    .getPropertyValue('--teal')
    .trim();

  const { title: headersBlocksTitle } = useHeadersBlocksStats();
  const { title: headerCollectionsTitle } = useHeadersCollectionsStats();
  const { title: headersTokensTitle } = useHeadersTokensStats();
  const { title: headersAccountsTitle } = useHeaderAccountsStats();

  const getData = (
    category: string,
    obj: Record<string, string | number> = {}
  ): PageStatsDataType[] => {
    const currency = null;

    const getCurrency = (id: string) => {
      if (category === 'blocks' && id === 'totalDeveloperRewards') {
        return 'EGLD';
      }

      if (category === 'tokens' && id === 'ecosystemMarketCap') {
        return '$';
      }

      return undefined;
    };

    return Object.entries(obj).map(([key, value]) => {
      const currency = getCurrency(key);

      let val = value;
      if (!currency) {
        val = value;
      } else if (currency === '$') {
        val = `$${value}`;
      } else {
        val = `${value} ${currency}`;
      }

      return {
        id: key,
        title: headersPropertiesNamesMapper[category][key],
        value: val
      };
    });
  };

  const headersBlocksData = getData('blocks', pageHeadersBlocks);
  const headersCollectionsData = getData('collections', pageHeadersCollections);
  const headersTokensData = getData('tokens', pageHeadersTokens);
  const headersAccountsData = useMemo(() => {
    const data = getData('accounts', pageHeadersAccounts);

    const todayActiveAccounts = data.find((x) =>
      x.id.toLowerCase().includes('ActiveAccountsToday'.toLowerCase())
    );

    data.forEach((x) => {
      if (x.id.toLowerCase().includes('totalAccount'.toLowerCase())) {
        x.subTitle = `${todayActiveAccounts?.value} active today`;
        x.icon = <FontAwesomeIcon icon={faCircleBolt} color={teal} />;
      }
    });

    return data.filter((x) => Boolean(x.title));
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
