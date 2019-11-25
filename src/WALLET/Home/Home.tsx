import { faWallet } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import { useGlobalState } from './../../context';
import { useWalletDispatch, useWalletState } from './../context';
import { getWalletDetails } from './helpers/asyncRequests';
import LatestTransactions from './LatestTransactions';
import SendForm from './SendForm';
import WalletHeader from './WalletHeader';

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
  const ref = React.useRef(null);
  const dispatch = useWalletDispatch();

  const {
    timeout,
    activeTestnet: { nodeUrl },
  } = useGlobalState();
  const { publicKey, balance } = useWalletState();
  const [detailsFetched, setDetaislFetched] = React.useState(false);

  const populateDetails = () => {
    if (publicKey) {
      getWalletDetails({
        publicKey,
        nodeUrl,
        timeout,
      }).then(({ balance, nonce, detailsFetched }) => {
        if (ref.current !== null) {
          setDetaislFetched(detailsFetched);
          dispatch({ type: 'setBalance', balance });
          dispatch({ type: 'setNonce', nonce });
        }
      });
    }
  };

  React.useEffect(populateDetails, []);

  return (
    <div ref={ref}>
      <div className="bg-blue">
        <WalletHeader populateDetails={populateDetails} />
      </div>
      {!detailsFetched && balance === '' ? (
        <WaleltUnavailable />
      ) : (
        <div className="container pt-3 pb-3">
          <div className="row">
            <div className="col-lg-6 mt-4 mb-4">
              <SendForm populateDetails={populateDetails} />
            </div>
            <div className="col-lg-6 mt-4 mb-4">
              <LatestTransactions />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WalletHome;
