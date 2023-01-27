import React from 'react';
import { useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { UAParser } from 'ua-parser-js';

import { Search, NotificationsBar } from 'components';
import { multiversxApps } from 'config';
import {
  useFetchStats,
  useFetchEconomics,
  useNetworkRouter,
  useLoopManager,
  useActiveRoute,
  useIsMainnet,
  useCheckVersion
} from 'hooks';
import { activeNetworkSelector, defaultNetworkSelector } from 'redux/selectors';
import { wrappedRoutes, validatorsRoutes, searchRoutes } from 'routes';
import { Footer } from './Footer/index';
import { GlobalStatsCard } from './GlobalStatsCard';
import { Navbar } from './Navbar/index';
import { PageLayout } from './PageLayout';
import { TestnetGlobalStatsCard } from './TestnetGlobalStatsCard';
import { Unavailable } from './Unavailable';

export const Layout = ({ children }: { children: React.ReactNode }) => {
  const activeRoute = useActiveRoute();
  const isMainnet = useIsMainnet();
  const browser = UAParser();
  const { pathname } = useLocation();

  const { id: activeNetworkId } = useSelector(activeNetworkSelector);
  const { id: defaultNetworkId } = useSelector(defaultNetworkSelector);

  const showGlobalStats = () => {
    let show = true;
    const routeExists = wrappedRoutes.some(({ path }) => activeRoute(path));

    switch (true) {
      case !routeExists:
      case activeRoute('/'):
      case activeRoute(searchRoutes.index):
      case activeRoute(searchRoutes.query):
      case activeRoute(validatorsRoutes.identities):
      case activeRoute(validatorsRoutes.identityDetails):
      case activeRoute(validatorsRoutes.providers):
      case activeRoute(validatorsRoutes.providerDetails):
      case activeRoute(validatorsRoutes.providerTransactions):
      case activeRoute(validatorsRoutes.nodes):
      case activeRoute(validatorsRoutes.nodeDetails):
      case activeRoute(validatorsRoutes.statistics):
      case activeRoute(validatorsRoutes.queue):
        show = false;
        break;
    }

    return show;
  };

  useNetworkRouter();
  useLoopManager();
  useFetchEconomics();
  useFetchStats();
  useCheckVersion();

  const offline = !window.navigator.onLine;

  const isHome = activeRoute('/');

  const explorerApp = multiversxApps.find((app) => app.id === 'explorer');

  const userAgentInfo = [
    browser?.browser?.name ?? '',
    browser?.engine?.name ?? '',
    browser?.os?.name ?? ''
  ];
  const userAgentClasses = userAgentInfo
    .map((info) => info.replaceAll(' ', '-').toLowerCase())
    .join(' ');

  const pathArray = pathname.split('/');
  const pageClass =
    activeNetworkId === defaultNetworkId ? pathArray?.[1] : pathArray?.[2];

  return (
    <div
      className={`d-flex scrollbar-thin ${
        pageClass ? pageClass : 'home'
      } ${userAgentClasses}`}
    >
      <div className='flex-fill vh-100'>
        <main className='main-content d-flex flex-column flex-grow-1'>
          <Navbar />
          <NotificationsBar />
          <div className='main-content-container container-fluid p-0 d-flex flex-column'>
            {offline ? (
              <Unavailable />
            ) : (
              <>
                {!isHome && (
                  <div className='main-search-container py-spacer'>
                    <div className='container'>
                      <div className='row'>
                        <div className='col-12 col-lg-9 mx-auto'>
                          <Search className='input-group-black' />
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {showGlobalStats() && (
                  <div className='container mb-spacer'>
                    <>
                      {isMainnet ? (
                        <GlobalStatsCard />
                      ) : (
                        <TestnetGlobalStatsCard />
                      )}
                    </>
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
