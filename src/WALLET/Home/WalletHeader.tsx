import React from 'react';
import { Modal } from 'react-bootstrap';
import ReCAPTCHA from 'react-google-recaptcha';
import { faCopy, faCoins, faWallet, faSignOutAlt } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Denominate } from 'sharedComponents';
import { ReactComponent as ErdsSvg } from 'assets/img/erds.svg';
import { useWalletState } from './../context';
import { getTokens } from './helpers/asyncRequests';
import { WalletHomeType } from './Home';

interface WalletHeaderType {
  populateDetails: Function;
  logout: Function;
}

const WalletHeader = (props: WalletHeaderType & WalletHomeType) => {
  const { publicKey, faucet, timeout, nodeUrl, logout, populateDetails } = props;
  const { balance } = useWalletState();
  let ref = React.useRef(null);
  let publicKeyRef = React.useRef(null);
  const [showModal, setShowModal] = React.useState(false);
  const [currentBalance, setCurrentBalance] = React.useState(balance);
  const [erdsClass, setErdsClass] = React.useState<'d-none' | 'show' | 'hide'>('d-none');
  const [requestDisabled, setRequestDisabled] = React.useState(true);

  const handleClose = () => setShowModal(false);
  const handleShow = () => setShowModal(true);

  const onRecaptchaChange = (value: any) => {
    if (value) setRequestDisabled(false);
  };

  React.useEffect(() => {
    setCurrentBalance(balance);
  }, [balance]);

  const onRequestClick = () => {
    let intervalId: any = null;
    function getNewBalance() {
      populateDetails(props);
      if (balance !== currentBalance) {
        clearInterval(intervalId);
      }
    }

    getTokens({ nodeUrl, timeout, publicKey }).then(success => {
      if (success) {
        intervalId = setInterval(getNewBalance, 2000);
        setErdsClass('show');
        setTimeout(() => {
          setErdsClass('hide');
          setTimeout(() => {
            setErdsClass('d-none');
            setShowModal(false);
          }, 300);
        }, 2000);
      }
    });
  };

  const copyAddress = (e: React.SyntheticEvent) => {
    e.preventDefault();
    navigator.clipboard.writeText(publicKey);
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
              <a href="#" className="highlight-link" ng-click="refreshBalance()">
                <i className="fa fa-sync" />
              </a>
              {faucet && balance === '0' && (
                <button
                  type="button"
                  className="btn btn-outline-light btn-request"
                  onClick={handleShow}
                  id="requestInvoke"
                >
                  Request Tokens
                </button>
              )}
            </div>
            <div className="log_out">
              <a href="#" className="highlight-link" onClick={e => logout()}>
                LOG OUT <FontAwesomeIcon icon={faSignOutAlt} />
              </a>
            </div>
          </div>
        </div>
      </div>
      <Modal show={showModal} onHide={handleClose}>
        <div className="modal-header">
          <h5 className="modal-title" id="requestTokens">
            ERD Faucet
          </h5>
          <button type="button" className="close" onClick={handleClose}>
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
        <Modal.Body>
          <div id="requestBox">
            <div className="empty mt-4 mb-3">
              <i className="fa fa-coins empty-icon" />
              <span className="h4 empty-heading">Request Tokens</span>
              <div className="empty-details">
                <p>Here you can request testnet ERD tokens.</p>
                <div className="d-flex justify-content-center">
                  <ReCAPTCHA
                    ref={ref}
                    sitekey="***REMOVED***"
                    onChange={onRecaptchaChange}
                    theme="light"
                  />
                </div>

                <button
                  id="requestButton"
                  type="submit"
                  className="btn btn-primary mt-4"
                  disabled={requestDisabled}
                  onClick={onRequestClick}
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
        </Modal.Body>
      </Modal>
      <div id="erds" className={erdsClass}>
        <ErdsSvg />
      </div>
    </div>
  );
};

export default WalletHeader;
