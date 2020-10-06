import React from 'react';
import { useLocation } from 'react-router-dom';
import { faBan } from '@fortawesome/pro-solid-svg-icons/faBan';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Navbar from './Navbar/index';
import Footer from './Footer';
import NetworkRouter from './NetworkRouter';
import { useGlobalState } from 'context';
import RoundManager from './RoundManager';
import { Highlights } from 'sharedComponents';

function addStylesheet(secondary: boolean) {
  const stylesheet = document.getElementById('stylesheet');
  if (stylesheet) {
    const href: string = (stylesheet as any).href.replace(
      '__stylesheet__.css',
      secondary ? 'secondary.css' : 'primary.css'
    );
    (stylesheet as any).href = href;
  }
}

const Layout = ({ children, navbar }: { children: React.ReactNode; navbar?: React.ReactNode }) => {
  const { activeNetwork } = useGlobalState();
  const { pathname } = useLocation();
  const validators = pathname.includes('/validators');

  React.useEffect(() => {
    require('assets/styles/default.scss');
  }, []);

  const offline = process.env.NODE_ENV !== 'test' && !window.navigator.onLine;

  return (
    <>
      <NetworkRouter />
      <RoundManager />
      {navbar ? navbar : <Navbar />}
      <main role="main">
        {offline ? (
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
