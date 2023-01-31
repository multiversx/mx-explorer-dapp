import React, { useState, ReactNode, useEffect } from 'react';
import classNames from 'classnames';
import { useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { UAParser } from 'ua-parser-js';

import { Search, NotificationsBar } from 'components';
import {
  useFetchStats,
  useFetchEconomics,
  useNetworkRouter,
  useLoopManager,
  useActiveRoute,
  useIsMainnet,
  useCheckVersion
} from 'hooks';
import { ChartContractsTransactions } from 'pages/Home/ChartContractsTransactions';
import { activeNetworkSelector, defaultNetworkSelector } from 'redux/selectors';
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
import {
  AccountsStatsCard,
  BlockHeightStatsCard,
  TransactionsStatsCard,
  ValidatorsStatusCard,
  HeroPills,
  StatsCard
} from 'widgets';

import { Footer } from './Footer/index';
import { Header } from './Header/index';
import { PageLayout } from './PageLayout';
import { Unavailable } from './Unavailable';
import { usePageStats } from '../../hooks/pageStats/usePageStats';

const getCustomPageName = ({
  pathname,
  basePage
}: {
  pathname: string;
  basePage: string;
}) => {
  const fullPageName = pathname.substring(1).replaceAll('/', '-');
  if (fullPageName === 'collections-sft') {
    return 'SFT Collections';
  }
  if (fullPageName === 'collections-nft') {
    return 'NFT Collections';
  }

  switch (basePage) {
    case 'nft-collections':
    case 'collections-nft':
      return 'NFT Collections';
    case 'sft-collections':
    case 'collections-sft':
      return 'SFT Collections';
    case 'meta-tokens':
    case 'meta-esdt':
      return 'Meta-ESDT';
    case 'nfts':
      return 'NFTs';
    case 'sfts':
      return 'SFTs';
    default:
      return basePage.replaceAll('-', ' ').toLowerCase();
  }
};

const formatClassName = (className: string) => {
  return className.replaceAll(' ', '-').toLowerCase();
};

export const Layout = ({ children }: { children: ReactNode }) => {
  const [freeze, setFreeze] = useState(false);
  const [stats, setStats] = useState<{ title: string; data: any }>();

  const activeRoute = useActiveRoute();
  const isMainnet = useIsMainnet();
  const browser = UAParser();
  const { pathname } = useLocation();

  const { id: activeNetworkId } = useSelector(activeNetworkSelector);
  const { id: defaultNetworkId } = useSelector(defaultNetworkSelector);

  const { pageStats } = usePageStats();

  const showGlobalStats = () => {
    let show = true;
    const routeExists = wrappedRoutes.some(({ path }) => activeRoute(path));

    switch (true) {
      case !routeExists:
      case activeRoute('/'):
      case activeRoute(searchRoutes.index):
      case activeRoute(searchRoutes.query):
      case activeRoute(transactionsRoutes.transactions) && isMainnet:
      case activeRoute(transactionsRoutes.transactionDetails) && isMainnet:
      case activeRoute(transactionsRoutes.transactionDetailsLogs) && isMainnet:
      case activeRoute(validatorsRoutes.identities) && isMainnet:
      case activeRoute(validatorsRoutes.identityDetails) && isMainnet:
      case activeRoute(validatorsRoutes.providers) && isMainnet:
      case activeRoute(validatorsRoutes.providerDetails) && isMainnet:
      case activeRoute(validatorsRoutes.providerTransactions) && isMainnet:
      case activeRoute(validatorsRoutes.nodes) && isMainnet:
      case activeRoute(validatorsRoutes.nodeDetails) && isMainnet:
      case activeRoute(validatorsRoutes.statistics) && isMainnet:
      case activeRoute(validatorsRoutes.queue) && isMainnet:
        show = false;
        break;
    }

    return show;
  };

  const showCustomStats = () => {
    switch (true) {
      case activeRoute(blocksRoutes.blocks):
      case activeRoute(blocksRoutes.miniBlockDetails):
      case activeRoute(accountsRoutes.accounts):
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

  useNetworkRouter();
  useLoopManager();
  useFetchEconomics();
  useFetchStats();
  useCheckVersion();

  const offline = !window.navigator.onLine;

  const isHome = activeRoute('/');
  const isTransactions =
    activeRoute(transactionsRoutes.transactions) ||
    activeRoute(transactionsRoutes.transactionDetails) ||
    activeRoute(transactionsRoutes.transactionDetailsLogs);

  const pathArray = pathname.split('/');
  const pageClass =
    activeNetworkId === defaultNetworkId ? pathArray?.[1] : pathArray?.[2];

  const pageName = getCustomPageName({ pathname, basePage: pageClass });

  useEffect(() => {
    if (browser?.browser?.name) {
      document.body.classList.add(formatClassName(browser.browser.name));
    }
    if (browser?.engine?.name) {
      document.body.classList.add(formatClassName(browser.engine.name));
    }
    if (browser?.os?.name) {
      document.body.classList.add(formatClassName(browser.os.name));
    }
  }, []);

  return (
    <div
      className={`d-flex scrollbar-thin ${
        pageName ? pageName : 'home'
      } ${pageClass}`}
    >
      <div className='flex-fill vh-100'>
        <main
          className={classNames(
            'main-content',
            'd-flex',
            'flex-column',
            'flex-grow-1',
            { 'overflow-hidden vh-100': freeze }
          )}
        >
          <Header onExpand={setFreeze} />

          <NotificationsBar />
          <div className='main-content-container container-fluid p-0 d-flex flex-column'>
            {offline ? (
              <Unavailable />
            ) : (
              <>
                {!isHome && (
                  <div className='main-search-container mt-3'>
                    <div className='container'>
                      <div className='row'>
                        <div className='col-12 col-lg-5 col-xl-6'>
                          <Search className='input-group-black' />
                        </div>
                        <div className='col-12 col-lg-7 col-xl-6'>
                          <HeroPills />
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {showGlobalStats() && (
                  <div className='container mb-3'>
                    <div className='card card-lg card-black'>
                      <div className='card-header'>
                        <h2 className='title mb-0 text-capitalize'>
                          {pageName !== 'analytics'
                            ? pageName
                            : `MultiversX Blockchain ${pageName}`}
                          {pageName === 'analytics' && (
                            <span className='text-neutral-500'> (Beta)</span>
                          )}
                        </h2>
                      </div>
                      <div className='card-body d-flex flex-row flex-wrap gap-3'>
                        {showCustomStats() ? (
                          <>
                            {' '}
                            {pageStats?.data.map((item) => (
                              <StatsCard
                                key={item.title}
                                title={item.title}
                                subTitle={item.subTitle}
                                icon={item.icon}
                                value={item.value ? item.value.toString() : ''}
                                className='card-solitary'
                              />
                            ))}
                          </>
                        ) : (
                          <>
                            <TransactionsStatsCard />
                            <AccountsStatsCard />
                            <BlockHeightStatsCard neutralColors />
                            {isMainnet && <ValidatorsStatusCard isSmall />}
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {isTransactions && isMainnet && (
                  <div className='container mb-3'>
                    <div className='card card-lg card-black'>
                      <div className='card-header pb-0'>
                        <h2 className='title mb-0'>Transactions</h2>
                      </div>
                      <div className='card-body p-0'>
                        <ChartContractsTransactions />
                      </div>
                    </div>
                  </div>
                )}

                <div className='page-container' data-testid='mainPageContent'>
                  <PageLayout>{children}</PageLayout>
                </div>
              </>
            )}
          </div>
          <Footer />
        </main>
      </div>
    </div>
  );
};
