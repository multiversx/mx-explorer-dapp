import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faWallet } from '@fortawesome/free-solid-svg-icons';
import { getWalletDetails } from './helpers/asyncRequests';
import WalletHeader from './WalletHeader';
import SendForm from './SendForm';
import LatestTransactions from './LatestTransactions';
import { useWalletDispatch, useWalletState } from './../context';
import { useGlobalState } from './../../context';

const WaleltUnavailable = () => (
  <div className="container pt-3 pb-3">
    <div className="row">
      <div className="col-12">
        <div className="card">
          <div className="card-body card-details">
            <div className="empty">
              <FontAwesomeIcon icon={faWallet} className="empty-icon" />
              <span className="h4 empty-heading">Wallet unavailable</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

const WalletHome = () => {
  let ref = React.useRef(null);
  const dispatch = useWalletDispatch();

  const {
    timeout,
    activeTestnet: { nodeUrl },
    refresh: { timestamp },
  } = useGlobalState();
  const { publicKey, balance } = useWalletState();

  const populateDetails = () => {
    if (ref.current !== null) {
      getWalletDetails({
        publicKey,
        nodeUrl,
        timeout,
      }).then(({ balance, nonce }) => {
        if (ref.current !== null) {
          dispatch({ type: 'setBalance', balance });
          dispatch({ type: 'setNonce', nonce });
        }
      });
    }
  };

  React.useEffect(populateDetails, [timestamp]);

  return (
    <div ref={ref}>
      <div className="bg-blue">
        <WalletHeader populateDetails={populateDetails} />
      </div>
      {balance !== '' ? (
        <div className="container pt-3 pb-3">
          <div className="row">
            <div className="col-lg-6 mt-4 mb-4">
              <SendForm />
            </div>
            <div className="col-lg-6 mt-4 mb-4">
              <LatestTransactions />
            </div>
          </div>
        </div>
      ) : (
        <WaleltUnavailable />
      )}
    </div>
  );
};

export default WalletHome;
