import React from 'react';
import { useGlobalState } from 'context';
import Navbar from './Navbar/index';
import Footer from './Footer/index';
import { Search } from 'sharedComponents';
import Unavailable from './Unavailable';
import PageLayout from './PageLayout';
import GlobalStatsCard from './GlobalStatsCard';
import TestnetGlobalStatsCard from './TestnetGlobalStatsCard';
import Routes, { validatorsRoutes, searchRoutes } from 'routes';
import {
  useFetchPrice,
  useNetworkRouter,
  useLoopManager,
  useActiveRoute,
  useIsMainnet,
} from 'helpers';

const Layout = ({ children }: { children: React.ReactNode }) => {
  const {
    theme,
    config: { elrondApps },
  } = useGlobalState();
  const activeRoute = useActiveRoute();
  const isMainnet = useIsMainnet();

  const showGlobalStats = () => {
    let show = true;
    const routeExists = Routes.some(({ path }) => activeRoute(path));

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
        show = false;
        break;
    }

    return show;
  };

  useNetworkRouter();
  useLoopManager();
  useFetchPrice();

  const offline = !window.navigator.onLine;

  React.useEffect(() => {
    const stylesheet = document.getElementById('stylesheet');

    if (stylesheet) {
      const href: string = (stylesheet as any).href;

      if (process.env.NODE_ENV === 'development') {
        (stylesheet as any).href = '';
        switch (theme) {
          case 'dark':
            require('assets/styles/dark.scss');
            break;
          case 'testnet':
            require('assets/styles/testnet.scss');
            break;
          default:
            require('assets/styles/light.scss');
            break;
        }
      } else {
        const secondHrefPart = href.slice(href.lastIndexOf('/') + 1);
        const currentTheme = secondHrefPart.slice(0, secondHrefPart.indexOf('.css'));
        (stylesheet as any).href = href.replace(currentTheme, theme);
      }
    }
  }, [theme]);

  const isHome = activeRoute('/');

  const explorerApp = elrondApps.find((app) => app.id === 'explorer');
  const explorerTitle = explorerApp ? explorerApp.name : 'Explorer';

  return (
    <div className="d-flex">
      <div className="flex-fill vh-100">
        <main className="main-content d-flex flex-column flex-grow-1">
          <Navbar />
          <div className="main-content-container container-fluid p-0 d-flex flex-column">
            {offline ? (
              <Unavailable />
            ) : (
              <>
                <div className="main-search-container py-spacer">
                  <div className={`container ${isHome ? 'py-3' : ''}`}>
                    {isHome && (
                      <div className="row">
                        <div className="col-12 text-center">
                          <h1 className="mb-4">The Elrond Blockchain {explorerTitle}</h1>
                        </div>
                      </div>
                    )}

                    <div className="row">
                      <div className="col-12 col-lg-9 mx-auto">
                        <Search />
                      </div>
                    </div>
                  </div>
                </div>

                {showGlobalStats() && (
                  <div className="container mb-spacer">
                    <>{isMainnet ? <GlobalStatsCard /> : <TestnetGlobalStatsCard />}</>
                  </div>
                )}

                <div className="page-container" data-testid="mainPageContent">
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

export default Layout;
