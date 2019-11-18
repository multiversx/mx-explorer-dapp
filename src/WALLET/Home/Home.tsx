import React from 'react';
import { getWalletDetails } from './helpers/asyncRequests';
import WalletHeader from './WalletHeader';
import { WalletProvider } from 'WALLET/context';

interface WalletHomeType {
  publicKey: string;
  nodeUrl: string;
  timeout: number;
}

const WalletHome = ({ publicKey, nodeUrl, timeout }: WalletHomeType) => {
  let ref = React.useRef(null);
  const [balance, setBalance] = React.useState<string>('...');
  React.useEffect(() => {
    if (ref.current !== null) {
      getWalletDetails({
        publicKey,
        nodeUrl,
        timeout,
      }).then(({ balance, nonce, detailsFetched }) => {
        if (detailsFetched && ref.current !== null) {
          setBalance(balance);
        }
      });
    }
  }, []);
  return (
    <div ref={ref}>
      <div className="bg-blue">
        <WalletHeader publicKey={publicKey} balance={balance} />
      </div>
      <div className="container pt-3 pb-3">
        <div className="row">
          <div className="col-lg-6 mt-4 mb-4">
            <div className="card">
              <div className="card-body">
                <div id="sendTransaction">
                  <h4 className="card-title">Send Transaction</h4>
                  <form ng-submit="sendTransaction()">
                    <div className="form-group">
                      <a href="#" className="float-right" ng-click="copyDstAddress()">
                        <small>Copy</small>
                      </a>
                      <label htmlFor="dstAddress">To</label>
                      <input
                        type="text"
                        className="form-control"
                        id="dstAddress"
                        placeholder="Address"
                        required
                        ng-model="dstAddress"
                        ng-change="dstAddressChange(dstAddress)"
                        autoComplete="off"
                      />
                      <div className="invalid-feedback">
                        {'{'}
                        {'{'} dstAddressError {'}'}
                        {'}'}
                      </div>
                    </div>
                    <div className="form-group">
                      <a href="#" className="float-right" ng-click="entireBalance()">
                        <small>Entire balance</small>
                      </a>
                      <label htmlFor="amount">Amount (ERD)</label>
                      <input
                        type="text"
                        className="form-control"
                        id="amount"
                        placeholder="Amount"
                        required
                        ng-model="amount"
                        ng-change="amountChange(amount)"
                      />
                      <div className="invalid-feedback">
                        {'{'}
                        {'{'} amountError {'}'}
                        {'}'}
                      </div>
                    </div>
                    <div className="form-group" ng-show="economicsEnabled">
                      <label htmlFor="gasPrice">
                        Gas Price (10{' '}
                        <sup>
                          -{'{'}
                          {'{'} denominationValue {'}'}
                          {'}'}
                        </sup>{' '}
                        ERD)
                      </label>
                      <input
                        disabled
                        type="text"
                        name="gasPrice"
                        className="form-control"
                        id="gasPrice"
                        placeholder="GasPrice"
                        ng-required="economicsEnabled"
                        ng-model="gasPrice"
                        ng-change="gasPriceChange(gasPrice)"
                      />
                      <div className="invalid-feedback">
                        {'{'}
                        {'{'} gasPriceError {'}'}
                        {'}'}
                      </div>
                    </div>
                    <div className="form-group" ng-show="economicsEnabled">
                      <label htmlFor="gasLimit">Gas Limit</label>
                      <input
                        ng-disabled="gasLimitDisabled"
                        type="text"
                        name="gasLimit"
                        className="form-control"
                        id="gasLimit"
                        placeholder="GasLimit"
                        ng-required="economicsEnabled"
                        ng-model="gasLimit"
                        ng-change="gasLimitChange(gasLimit)"
                      />
                      <div className="invalid-feedback">
                        {'{'}
                        {'{'} gasLimitError {'}'}
                        {'}'}
                      </div>
                    </div>
                    <div className="form-group" ng-show="dataEnabled">
                      <label htmlFor="amount">Data</label>
                      <textarea
                        className="form-control"
                        id="data"
                        placeholder="data"
                        ng-model="data"
                        ng-change="dataChange(data)"
                        defaultValue={''}
                      />
                      <div className="invalid-feedback">
                        {'{'}
                        {'{'} dataError {'}'}
                        {'}'}
                      </div>
                    </div>
                    <button type="submit" className="btn btn-primary" disabled id="sendTrxBtn">
                      Send
                    </button>
                  </form>
                </div>
                <div
                  id="successTransaction"
                  className="row h-100 justify-content-center align-items-center d-none"
                >
                  <div className="col-12 empty">
                    <i className="fa fa-check empty-icon text-success" />
                    <span className="h5 empty-heading text-success">Succeed</span>
                    <span className="empty-details empty-small">
                      Txn Hash
                      <br />
                      {'{'}
                      {'{'} lastTxHash {'}'}
                      {'}'}
                      <a href="#" ng-click="copyTrx()">
                        <i className="fa fa-copy" />
                      </a>
                    </span>
                    <button
                      type="button"
                      className="btn btn-outline-secondary"
                      ng-click="closeTranaction()"
                    >
                      Close
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="col-lg-6 mt-4 mb-4">
            <div className="card">
              <div className="card-body" style={{ height: '512px' }}>
                <div className="d-flex align-items-center flex-row mb-3">
                  <h4 className="card-title mb-0 mr-auto">Latest Transactions</h4>
                  <a
                    ng-show="transactions && transactions.length > 0"
                    href="/#/address/{{ myAddress }}"
                  >
                    View Address Transactions
                  </a>
                </div>
                <div
                  style={{ height: 'calc(100% - 50px)' }}
                  className="d-flex justify-content-center"
                  ng-show="transactions && transactions.length == 0"
                >
                  <div className="align-self-center mb-5">
                    <div className="empty align-self-center">
                      <i className="fa fa fa-exchange-alt empty-icon" />
                      <span className="h5 empty-heading">No Transactions</span>
                      <span className="empty-details">No transactions found for this wallet.</span>
                    </div>
                  </div>
                </div>
                <div
                  className="card-scroll"
                  style={{ height: 'calc(100% - 50px)' }}
                  ng-show="transactions && transactions.length > 0"
                >
                  <div
                    ng-repeat="tx in transactions track by $index-async"
                    className="animated fadeIn"
                  >
                    <div className="row">
                      <div className="col-6">
                        <span className="icon-container-round">
                          <i className="fa fa-exchange-alt" />
                        </span>
                        <a href="/#/tx/{{ tx.hash }}">
                          {'{'}
                          {'{'} tx.hash | truncate: 20 {'}'}
                          {'}'}
                        </a>
                        <br />
                        <span
                          className="text-secondary"
                          title="{{ tx.timestamp * 1000 | date: 'medium' }}"
                        >
                          {'{'}
                          {'{'} tx.timestamp * 1000 | timestampAge {'}'}
                          {'}'}
                        </span>
                      </div>
                      <div className="col-6">
                        From
                        <a href="/#/address/{{ tx.sender }}">
                          {'{'}
                          {'{'}
                          tx.sender | truncate: 20
                          {'}'}
                          {'}'}
                        </a>
                        <br />
                        To
                        <a href="/#/address/{{ tx.receiver }}">
                          {'{'}
                          {'{'}
                          tx.receiver | truncate: 20
                          {'}'}
                          {'}'}
                        </a>
                      </div>
                    </div>
                    <div ng-if="$last == false">
                      <hr className="hr-space" style={{}} />
                    </div>
                  </div>
                  <div
                    ng-show="!transactions"
                    className="row h-100 justify-content-center align-items-center"
                  >
                    <div className="col-12 text-center">
                      <div className="lds-ellipsis mx-auto">
                        <div />
                        <div />
                        <div />
                        <div />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div
        className="modal fade"
        id="requestModal"
        tabIndex={-1}
        role="dialog"
        aria-labelledby="requestTokens"
      >
        <div className="modal-dialog" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="requestTokens">
                ERD Faucet
              </h5>
              <button type="button" className="close" data-dismiss="modal">
                <span aria-hidden="true">×</span>
              </button>
            </div>
            <div className="modal-body">
              <div id="requestBox">
                <div className="empty mt-4 mb-3">
                  <i className="fa fa-coins empty-icon" />
                  <span className="h4 empty-heading">Request Tokens</span>
                  <div className="empty-details">
                    <p>Here you can request testnet ERD tokens.</p>
                    <div id="recaptcha" />
                    <button
                      id="requestButton"
                      type="submit"
                      className="btn btn-primary mt-4"
                      disabled
                      ng-click="requestTokens()"
                    >
                      Request Tokens
                    </button>
                  </div>
                </div>
              </div>
              <div id="requestSuccess" className="d-none">
                <div className="empty mt-4 mb-3">
                  <i className="fa fa-check empty-icon text-success" aria-hidden="true" />
                  <span className="h5 empty-heading text-success">Request Succeed</span>
                  <div className="empty-details empty-small">
                    <p className="mt-3 mb-3">
                      Please allow a few seconds for the transaction to be processed.
                    </p>
                  </div>
                  <button type="button" className="btn btn-outline-secondary" data-dismiss="modal">
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div id="erds" ng-show="myBalance == 0" style={{ display: 'none' }} />
    </div>
  );
};

export default WalletHome;
