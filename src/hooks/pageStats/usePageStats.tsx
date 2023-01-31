import React, { useMemo } from 'react';
import { faCircleBolt } from '@fortawesome/pro-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useSelector } from 'react-redux';
import { useHeaderAccountsStats } from './useHeaderAccountsStats';
import { useHeadersBlocksStats } from './useHeadersBlocksStats';
import { useHeadersCollectionsStats } from './useHeadersCollectionsStats';
import { useHeadersTokensStats } from './useHeadersTokensStats';
import { capitalize } from '../../helpers';
import { splitCamelCase } from '../../helpers/splitCamelCase';
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

type PageStatsDataType = {
  id: string;
  title: string;
  value: string | number;
  subTitle?: string;
  icon?: React.ReactNode;
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
    obj: Record<string, string | number> = {}
  ): PageStatsDataType[] => {
    return Object.entries(obj).map(([key, value]) => ({
      id: key,
      title: splitCamelCase(capitalize(key)),
      value
    }));
  };

  const headersBlocksData = getData(pageHeadersBlocks);
  const headersCollectionsData = getData(pageHeadersCollections);
  const headersTokensData = getData(pageHeadersTokens);
  const headersAccountsData = useMemo(() => {
    const data = getData(pageHeadersAccounts);

    const todayActiveAccounts = data.find((x) =>
      x.id.toLowerCase().includes('ActiveAccountsToday'.toLowerCase())
    );

    data.forEach((x) => {
      if (x.id.toLowerCase().includes('totalAccount'.toLowerCase())) {
        x.subTitle = `${todayActiveAccounts?.value} active today`;
        x.icon = <FontAwesomeIcon icon={faCircleBolt} color={teal} />;
      }
    });

    return data.filter((x) => x.title !== todayActiveAccounts?.title);
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
