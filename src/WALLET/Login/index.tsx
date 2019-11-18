import React, { useMemo } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faWallet, faBan } from '@fortawesome/free-solid-svg-icons';
import { useGlobalState } from './../../context';
import CreateWallet from './Create';
import AccessWallet from './Access';

const Login = () => {
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
              {/* <div className="card">
                <div className="card-body">
                  <h4 className="card-title">Access My Wallet</h4>
                  <p className="lead">Check balance, view public address or send ERD tokens.</p>
                  <form ng-controller="mainWalletCtrl" ng-submit="accessNewWallet()">
                    <div className="form-group">
                      <label htmlFor="walletFile">Private Key</label>
                      <fieldset>
                        <div className="custom-file w-100">
                          <input
                            type="file"
                            className="custom-file-input"
                            // onchange="angular.element(this).scope().loadWalletFile(this.files)"
                            id="walletFile"
                            accept="application/json,.json"
                            ng-disabled="walletDisabled"
                          />
                          <label
                            className="custom-file-label"
                            htmlFor="walletFile"
                            id="walletFileLabel"
                          >
                            Choose file...
                          </label>
                        </div>
                      </fieldset>
                      <div className="invalid-feedback d-block">
                        {'{'}
                        {'{'}privateKeyError{'}'}
                        {'}'}
                      </div>
                    </div>
                    <div className="form-group">
                      <label htmlFor="accessPassInput">Password</label>
                      <input
                        type="password"
                        className="form-control"
                        id="accessPassInput"
                        autoComplete="off"
                        ng-change="accessPassChange(accessPassVal)"
                        ng-model="accessPassVal"
                        ng-disabled="walletDisabled"
                      />
                      <div className="invalid-feedback">
                        {'{'}
                        {'{'}accessPassError{'}'}
                        {'}'}
                      </div>
                    </div>
                    <button type="submit" className="btn btn-primary" id="accessWalletBtn">
                      Unlock Wallet
                    </button>
                  </form>
                </div>
              </div> */}
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
};

export default Login;
