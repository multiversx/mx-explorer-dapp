import React from 'react';
import { useLocation } from 'react-router-dom';
import { faBan } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Navbar from './Navbar/index';
import Footer from './Footer';
import NetworkRouter from './NetworkRouter';
import { useGlobalState } from 'context';
import RoundManager from './RoundManager';
import { Highlights } from 'sharedComponents';

const removeStylesheet = (stylesheetId: string) => {
  const stylesheet = document.querySelector(stylesheetId);
  if (stylesheet) {
    (stylesheet as any).parentNode.removeChild(stylesheet);
  }
};

const Layout = ({ children, navbar }: { children: React.ReactNode; navbar?: React.ReactNode }) => {
  const {
    activeNetwork,
    config: { secondary },
  } = useGlobalState();
  const { pathname } = useLocation();
  const validators = pathname.includes('/validators');

  React.useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      removeStylesheet('#primary-stylesheet');
      removeStylesheet('#scondary-stylesheet');
      if (secondary) {
        require('assets/sass/secondary.scss');
      } else {
        require('assets/sass/primary.scss');
      }
    } else if (secondary) {
      removeStylesheet('#primary-stylesheet');
    }
  }, [secondary]);

  return (
    <>
      <NetworkRouter />
      <RoundManager />
      {navbar ? navbar : <Navbar />}
      <main role="main">
        {activeNetwork.fetchedFromNetworkConfig === false && !validators ? (
          <div className="container pt-3 pb-3">
            <div className="row">
              <div className="offset-lg-3 col-lg-6 mt-4 mb-4">
                <div className="card">
                  <div className="card-body card-details" data-testid="errorScreen">
                    <div className="empty">
                      <FontAwesomeIcon icon={faBan} className="empty-icon" />
                      <span className="h4 empty-heading">
                        There was an internal website error. Please try again later.
                        {!activeNetwork.default && (
                          <>
                            <br />
                            {`${activeNetwork.name} network`}
                          </>
                        )}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <>
            <Highlights />
            {children}
          </>
        )}
      </main>
      <Footer />
    </>
  );
};

export default Layout;
