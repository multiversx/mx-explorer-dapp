import React from 'react';
import { useLocation } from 'react-router-dom';
import { faBan } from '@fortawesome/pro-solid-svg-icons/faBan';
import Navbar from './Navbar/index';
import Footer from './Footer/index';
import NetworkRouter from './NetworkRouter';
import { useGlobalState } from 'context';
import RoundManager from './RoundManager';
import { PageState } from 'sharedComponents';
import { Highlights } from 'sharedComponents';

const Layout = ({ children, navbar }: { children: React.ReactNode; navbar?: React.ReactNode }) => {
  const { activeNetwork, theme } = useGlobalState();
  const { pathname } = useLocation();
  const validators = pathname.includes('/validators');

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
    <div className="container-fluid d-flex">
      <div className="row flex-fill vh-100">
        <main className="main-content d-flex flex-column flex-grow-1">
          <NetworkRouter />
          <RoundManager />
          {navbar ? navbar : <Navbar />}
          <div className="main-content-container container-fluid d-flex flex-column">
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

  // return (
  //   <>
  //     <NetworkRouter />
  //     <RoundManager />
  //     {navbar ? navbar : <Navbar />}
  //     <main role="main">
  //       {offline ? (
  //         <div className="container pt-3 pb-3">
  //           <div className="row">
  //             <div className="offset-lg-3 col-lg-6 mt-4 mb-4">
  //               <div className="card">
  //                 <div className="card-body card-details" data-testid="errorScreen">
  //                   <div className="empty">
  //                     <FontAwesomeIcon icon={faBan} className="empty-icon" />
  //                     <span className="h4 empty-heading">
  //                       There was an internal website error. Please try again later.
  //                       {!activeNetwork.default && (
  //                         <>
  //                           <br />
  //                           {`${activeNetwork.name} network`}
  //                         </>
  //                       )}
  //                     </span>
  //                   </div>
  //                 </div>
  //               </div>
  //             </div>
  //           </div>
  //         </div>
  //       ) : (
  //         <>
  //           <Highlights />
  //           {children}
  //         </>
  //       )}
  //     </main>
  //     <Footer />
  //   </>
  // );
};

export default Layout;
