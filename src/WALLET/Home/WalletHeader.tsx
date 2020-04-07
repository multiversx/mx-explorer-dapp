import { faCoins, faCopy, faSignOutAlt, faSync, faWallet } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import { Denominate, TestnetLink } from 'sharedComponents';
import { useGlobalDispatch, useGlobalState } from './../../context';
import { copyToClipboard } from './../../helpers';
import { useWalletDispatch, useWalletState } from './../context';
import RequestTokens from './RequestTokens';
import { showFaucet } from './SendForm/validatorFunctions';

export interface PopulateDetailsType {
  populateDetails: (intervalId: number) => () => void;
}

const WalletHeader = (props: PopulateDetailsType) => {
  const dispatch = useWalletDispatch();
  const globalDispatch = useGlobalDispatch();

  const {
    activeTestnet: { faucet, gasLimit, gasPrice },
  } = useGlobalState();
  const { publicKey, balance } = useWalletState();

  const logout = () => {
    dispatch({ type: 'logout' });
  };
  const publicKeyRef = React.useRef(null);

  const copyAddress = (e: React.SyntheticEvent) => {
    e.preventDefault();
    copyToClipboard(publicKey);
  };

  const refreshBalance = (e: React.SyntheticEvent) => {
    e.preventDefault();
    props.populateDetails(0)();
    globalDispatch({ type: 'triggerNewRound' });
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
              <span className="highlight-label" data-testid="addressLabel">
                ADDRESS
              </span>
              <span className="highlight-value highlight-address" ref={publicKeyRef}>
                {publicKey}
              </span>
              <a
                href="/#"
                className="highlight-link"
                title="Copy to clipboard"
                onClick={copyAddress}
              >
                <FontAwesomeIcon icon={faCopy} />
              </a>
            </div>
            <div className="log_out">
              <TestnetLink to="/" className="highlight-link">
                <span onClick={logout}>
                  LOG OUT <FontAwesomeIcon icon={faSignOutAlt} />
                </span>
              </TestnetLink>
            </div>
          </div>
        </div>
        {balance !== '' && (
          <div className="row">
            <div className="col-12 mt-2 mb-4">
              <div className="highlights">
                <span className="highlight-icon">
                  <FontAwesomeIcon icon={faCoins} />
                </span>
                <span className="highlight-label">BALANCE</span>
                <span className="highlight-value" data-testid="balance">
                  <Denominate value={balance} showLastNonZeroDecimal />
                </span>
                <a href="/#" className="highlight-link" onClick={refreshBalance}>
                  <FontAwesomeIcon icon={faSync} />
                </a>
                {faucet && showFaucet({ balance, gasLimit, gasPrice }) && (
                  <RequestTokens {...props} />
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default WalletHeader;
