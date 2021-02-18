import React from 'react';
import Navbar from './Navbar/index';
import Footer from './Footer/index';
import NetworkRouter from './NetworkRouter';
import { useGlobalState } from 'context';
import LoopManager from './LoopManager';
import { Search } from 'sharedComponents';
import Unavailable from './Unavailable';

const Layout = ({ children }: { children: React.ReactNode }) => {
  const { theme } = useGlobalState();

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

  const offline = !window.navigator.onLine;

  return (
    <div className="d-flex">
      <div className="flex-fill vh-100">
        <main className="main-content d-flex flex-column flex-grow-1">
          <NetworkRouter />
          <LoopManager />
          <Navbar />
          <div className="main-content-container container-fluid p-0 d-flex flex-column">
            {offline ? (
              <Unavailable />
            ) : (
              <>
                <div className="container">
                  <div className="row">
                    <div className="col-12 col-lg-10 pt-spacer mx-auto">
                      <Search />
                    </div>
                  </div>
                </div>

                <div className="page-container" data-testid="mainPageContent">
                  {children}
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
