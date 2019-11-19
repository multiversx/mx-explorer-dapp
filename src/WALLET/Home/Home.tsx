import React from 'react';
import { getWalletDetails } from './helpers/asyncRequests';
import WalletHeader from './WalletHeader';
import SendForm from './SendForm';
import LatestTransactions from './LatestTransactions';
import { useWalletDispatch } from './../context';

export interface WalletHomeType {
  publicKey: string;
  nodeUrl: string;
  timeout: number;
  faucet: boolean;
  economics: boolean | undefined;
}

const WalletHome = (props: WalletHomeType) => {
  let ref = React.useRef(null);
  const { publicKey, nodeUrl, timeout } = props;
  const dispatch = useWalletDispatch();

  const logout = () => {
    dispatch({ type: 'logout' });
  };

  const populateDetails = () => {
    getWalletDetails({
      publicKey,
      nodeUrl,
      timeout,
    }).then(({ balance, nonce, detailsFetched }) => {
      if (detailsFetched && ref.current !== null) {
        dispatch({ type: 'setBalance', balance });
        dispatch({ type: 'setNonce', nonce });
      }
    });
  };

  React.useEffect(() => {
    if (ref.current !== null) populateDetails();
  }, []);

  return (
    <div ref={ref}>
      <div className="bg-blue">
        <WalletHeader {...props} populateDetails={populateDetails} logout={logout} />
      </div>
      <div className="container pt-3 pb-3">
        <div className="row">
          <div className="col-lg-6 mt-4 mb-4">
            <div className="card">
              <div className="card-body">
                <div id="sendTransaction">
                  <h4 className="card-title">Send Transaction</h4>
                  <SendForm economicsEnabled={Boolean(props.economics)} />
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
            <LatestTransactions />
          </div>
        </div>
      </div>
    </div>
  );
};

export default WalletHome;
