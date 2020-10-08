import React from 'react';
import { faBan } from '@fortawesome/pro-solid-svg-icons/faBan';
import Navbar from './Navbar/index';
import Footer from './Footer/index';
import NetworkRouter from './NetworkRouter';
import { useGlobalState } from 'context';
import RoundManager from './RoundManager';
import { PageState } from 'sharedComponents';
import { Highlights } from 'sharedComponents';

const Layout = ({ children }: { children: React.ReactNode }) => {
  const { activeNetwork, theme } = useGlobalState();

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
            require('assets/styles/default.scss');
            break;
        }
      } else {
        const secondHrefPart = href.slice(href.lastIndexOf('/') + 1);
        const currentTheme = secondHrefPart.slice(0, secondHrefPart.indexOf('.css'));
        (stylesheet as any).href = href.replace(currentTheme, theme);
      }
    }
  }, [theme]);

  const offline = process.env.NODE_ENV !== 'test' && !window.navigator.onLine;

  return (
    <div className="d-flex">
      <div className="flex-fill vh-100">
        <main className="main-content d-flex flex-column flex-grow-1">
          <NetworkRouter />
          <RoundManager />
          <Navbar />
          <div className="main-content-container container-fluid p-0 d-flex flex-column">
            {offline ? (
              <div className="d-flex flex-fill align-items-center justify-content-center">
                <PageState
                  icon={faBan}
                  title={'There was an internal website error. Please try again later.'}
                  description={
                    !activeNetwork.default && (
                      <>
                        <br />
                        {`${activeNetwork.name} network`}
                      </>
                    )
                  }
                  className="py-spacer"
                  data-testid="errorScreen"
                />
              </div>
            ) : (
              <>
                <Highlights />
                {children}
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
