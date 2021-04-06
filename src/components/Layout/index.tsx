import React from 'react';
import { useGlobalState } from 'context';
import Navbar from './Navbar/index';
import Footer from './Footer/index';
import { Search } from 'sharedComponents';
import Unavailable from './Unavailable';
import PageLayout from './PageLayout';
import { useLocation } from 'react-router-dom';
import GlobalStatsCard from './GlobalStatsCard';
import { validatorsRoutes } from 'routes';
import {
  useFetchPrice,
  useMatchPath,
  useNetworkRoute,
  useNetworkRouter,
  useLoopManager,
} from 'helpers';

const Layout = ({ children }: { children: React.ReactNode }) => {
  const networkRoute = useNetworkRoute();
  const matchPath = useMatchPath();
  const {
    theme,
    config: { elrondApps },
  } = useGlobalState();
  const activePath = useLocation().pathname;

  const showGlobalStats = () => {
    let show = true;

    switch (true) {
      case matchPath(networkRoute('/')) !== null:
      case activePath.includes('/identities'):
      case activePath.includes(validatorsRoutes.index):
      case activePath.includes(validatorsRoutes.nodes):
      case activePath.includes(validatorsRoutes.providers):
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

  const isHome = matchPath(networkRoute('/')) !== null;

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

                {showGlobalStats() && <GlobalStatsCard />}

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
