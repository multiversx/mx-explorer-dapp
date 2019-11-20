import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faWallet, faBan } from '@fortawesome/free-solid-svg-icons';
import { useGlobalState } from './../../context';
import UnlockPemForm from './UnlockPemForm';

const UnlockPem = () => {
  const {
    activeTestnet: { wallet, name: testnetName },
  } = useGlobalState();

  return (
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
        <UnlockPemForm />
      )}
    </div>
  );
};

export default UnlockPem;
