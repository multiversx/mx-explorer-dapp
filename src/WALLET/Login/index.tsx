import React, { useMemo } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faWallet, faBan } from '@fortawesome/free-solid-svg-icons';
import { withRouter } from 'react-router-dom';
import { useGlobalState } from './../../context';
import CreateWallet from './Create';
import AccessWallet from './Access';

const Login = withRouter(props => {
  const {
    activeTestnet: { wallet, name: testnetName },
  } = useGlobalState();

  return useMemo(
    () => (
      <div className="container pt-3 pb-3">
        {wallet === false ? (
          <div className="card">
            <div className="card-body card-details" data-testid="errorScreen">
              <div className="empty">
                <div className="row pt-5">
                  <div className="col">
                    <span className="fa-layer fa-fw">
                      <FontAwesomeIcon icon={faWallet} size="2x" className="fa-stack-1x" />
                      <FontAwesomeIcon icon={faBan} size="2x" className="fa-stack-2x empty-icon" />
                    </span>
                  </div>
                </div>
                <div className="row pt-5">
                  <div className="col">
                    <span className="h4 empty-heading">
                      The wallet functionality is currently disabled for the {testnetName} testnet
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="row row-eq-height">
            <div className="col-xl-5 offset-xl-1 col-lg-6 mt-4 mb-4">
              <CreateWallet />
            </div>
            <div className="col-xl-5 col-lg-6 mt-4 mb-4">
              <AccessWallet />
            </div>
            <div className="row">
              <div className="col-12 text-center">
                <a href="#/unlock-pem">Access using PEM</a>
              </div>
            </div>
          </div>
        )}
      </div>
    ),
    [wallet, testnetName]
  );
});

export default Login;
