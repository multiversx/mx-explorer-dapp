import React from 'react';
import { Denominate } from './../../sharedComponents';

interface WalletHeaderType {
  publicKey: string;
  balance: string;
}

const WalletHeader = ({ publicKey: myAddress, balance }: WalletHeaderType) => {
  return (
    <div className="bg-blue">
      <div className="container pt-4 pb-4">
        <div className="row">
          <div className="col-12 mt-4 mb-4">
            <div className="highlights">
              <span className="highlight-icon">
                <i className="fa fa-wallet" />
              </span>
              <span className="highlight-label">ADDRESS</span>
              <span className="highlight-value highlight-address">{myAddress}</span>
              <a href="#" className="highlight-link" ng-click="copyAddress()">
                <i className="fa fa-copy" />
              </a>
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-12 mt-2 mb-4">
            <div className="highlights">
              <span className="highlight-icon">
                <i className="fa fa-coins" />
              </span>
              <span className="highlight-label">BALANCE</span>
              <span className="highlight-value">
                <Denominate value={balance} showAllDecimals />
              </span>
              <a href="#" className="highlight-link" ng-click="refreshBalance()">
                <i className="fa fa-sync" />
              </a>
              <button
                ng-show="myBalance == 0 && requestTokensActive"
                type="button"
                className="btn btn-outline-light btn-request"
                data-toggle="modal"
                data-target="#requestModal"
                id="requestInvoke"
              >
                Request Tokens
              </button>
            </div>
            <div className="log_out">
              <a href="#" className="highlight-link" ng-click="logOut()">
                LOG OUT <i className="fa fa-sign-out-alt" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WalletHeader;
