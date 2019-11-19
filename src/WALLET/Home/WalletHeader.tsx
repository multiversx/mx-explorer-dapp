import React from 'react';
import { faCopy, faCoins, faWallet, faSignOutAlt, faSync } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Denominate } from 'sharedComponents';
import { useWalletState } from './../context';
import { WalletHomeType } from './Home';
import RequestTokens from './RequestTokens';

interface WalletHeaderType {
  populateDetails: Function;
  logout: Function;
}

const WalletHeader = (props: WalletHeaderType & WalletHomeType) => {
  const { publicKey, logout, populateDetails, faucet } = props;
  const { balance } = useWalletState();
  let publicKeyRef = React.useRef(null);

  const copyAddress = (e: React.SyntheticEvent) => {
    e.preventDefault();
    navigator.clipboard.writeText(publicKey);
  };

  const refreshBalance = (e: React.SyntheticEvent) => {
    e.preventDefault();
    populateDetails();
  };

  return (
    <div className="bg-blue">
      <div className="container pt-4 pb-4">
        <div className="row">
          <div className="col-12 mt-4 mb-4">
            <div className="highlights">
              <span className="highlight-icon">
                <FontAwesomeIcon icon={faWallet} />
              </span>
              <span className="highlight-label">ADDRESS</span>
              <span className="highlight-value highlight-address" ref={publicKeyRef}>
                {publicKey}
              </span>
              <a
                href="#"
                className="highlight-link"
                title="Copy to clipboard"
                onClick={copyAddress}
              >
                <FontAwesomeIcon icon={faCopy} />
              </a>
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-12 mt-2 mb-4">
            <div className="highlights">
              <span className="highlight-icon">
                <FontAwesomeIcon icon={faCoins} />
              </span>
              <span className="highlight-label">BALANCE</span>
              <span className="highlight-value">
                <Denominate value={balance} showAllDecimals />
              </span>
              <a href="#" className="highlight-link" onClick={refreshBalance}>
                <FontAwesomeIcon icon={faSync} />
              </a>
              {faucet && balance === '0' && <RequestTokens {...props} />}
            </div>
            <div className="log_out">
              <a href="#" className="highlight-link" onClick={e => logout()}>
                LOG OUT <FontAwesomeIcon icon={faSignOutAlt} />
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WalletHeader;
