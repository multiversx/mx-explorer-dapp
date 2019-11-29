import { faCheck, faTimes } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { ReactComponent as ErdsSvg } from 'assets/img/erds.svg';
import React from 'react';
import { Modal } from 'react-bootstrap';
import ReCAPTCHA from 'react-google-recaptcha';
import { useGlobalState } from './../../context';
import { useWalletState } from './../context';
import { getTokens } from './helpers/asyncRequests';

interface WalletHeaderType {
  populateDetails: () => void;
}

const RequestTokens = (props: WalletHeaderType) => {
  const {
    timeout,
    activeTestnet: { nodeUrl },
  } = useGlobalState();
  const { publicKey, balance } = useWalletState();

  const ref = React.useRef(null);

  const [showModal, setShowModal] = React.useState(false);
  const [currentBalance, setCurrentBalance] = React.useState(balance);
  const [erdsClass, setErdsClass] = React.useState<'d-none' | 'show' | 'hide'>('d-none');
  const [fundsRecieved, setFundsRecieved] = React.useState(false);
  const [requestFailed, setRequestFailed] = React.useState(false);
  const [requestDisabled, setRequestDisabled] = React.useState(true);
  const [requestSent, setRequestSent] = React.useState(false);

  const handleClose = () => setShowModal(false);
  const handleShow = () => setShowModal(true);

  const onRecaptchaChange = (value: any) => {
    if (value) {
      setRequestDisabled(false);
    } else {
      setRequestDisabled(true);
    }
  };

  React.useEffect(() => {
    setCurrentBalance(balance);
  }, [balance]);

  const onRequestClick = () => {
    let intervalId: any = null;
    function getNewBalance() {
      props.populateDetails();
      if (balance !== currentBalance) {
        clearInterval(intervalId);
      }
    }

    getTokens({ nodeUrl, timeout, publicKey }).then(success => {
      if (success) {
        intervalId = setInterval(getNewBalance, 2000);
        setErdsClass('show');
        setFundsRecieved(true);
        setRequestSent(true);
        setTimeout(() => {
          setErdsClass('hide');
          setTimeout(() => {
            setErdsClass('d-none');
            setShowModal(false);
          }, 300);
        }, 2000);
      } else {
        setRequestFailed(true);
      }
    });
  };

  const RequestSuccess = () => (
    <div id="requestSuccess">
      <div className="empty mt-4 mb-3">
        <FontAwesomeIcon icon={faCheck} className="empty-icon text-success" />
        <span className="h5 empty-heading text-success">Request Succeed</span>
        <div className="empty-details empty-small">
          <p className="mt-3 mb-3">
            Please allow a few seconds for the transaction to be processed.
          </p>
        </div>
        <button type="button" className="btn btn-outline-secondary" onClick={handleClose}>
          Close
        </button>
      </div>
    </div>
  );

  const RequestFailed = () => (
    <div id="requestFailed">
      <div className="empty mt-4 mb-3">
        <FontAwesomeIcon icon={faTimes} className="empty-icon text-warning" />
        <span className="h5 empty-heading text-warning">Request Failed</span>
        <div className="empty-details empty-small">
          <p className="mt-3 mb-3">The request has failed. Please try again later.</p>
        </div>
        <button type="button" className="btn btn-outline-secondary" onClick={handleClose}>
          Close
        </button>
      </div>
    </div>
  );

  return (
    <>
      {!requestSent && (
        <button
          type="button"
          className="btn btn-outline-light btn-request"
          onClick={handleShow}
          id="requestInvoke"
        >
          Request Tokens
        </button>
      )}

      <div id="erds" className={erdsClass}>
        <ErdsSvg />
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
          {!requestFailed ? (
            <>
              {!fundsRecieved ? (
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
              ) : (
                <RequestSuccess />
              )}
            </>
          ) : (
            <RequestFailed />
          )}
        </Modal.Body>
      </Modal>
    </>
  );
};

export default RequestTokens;
