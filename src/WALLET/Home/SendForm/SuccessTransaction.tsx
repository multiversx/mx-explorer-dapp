import { faCheck, faSearch } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import * as React from 'react';
import { withRouter } from 'react-router-dom';
import { useGlobalState } from './../../../context';
import { useWalletDispatch, useWalletState } from './../../context';

const SuccessTransaction = withRouter(props => {
  const { lastTxHash } = useWalletState();
  const dispatch = useWalletDispatch();
  const { activeTestnetId } = useGlobalState();

  const resetForm = () => {
    dispatch({ type: 'setLastTxHash', lastTxHash: '' });
    if (activeTestnetId) {
      props.history.push(`/${activeTestnetId}`);
    } else {
      props.history.push(`/`);
    }
  };
  return (
    <div id="successTransaction" className="row h-100 justify-content-center align-items-center">
      <div className="col-12 empty">
        <FontAwesomeIcon icon={faCheck} className="empty-icon text-success" />
        <span className="h5 empty-heading text-success">Succeed</span>
        <span className="empty-details empty-small">
          Txn Hash
          <br />
          {lastTxHash}&nbsp;
          <a
            href={`https://explorer.elrond.com/${
              activeTestnetId ? activeTestnetId + '/' : ''
            }transactions/${lastTxHash}`}
            target="_blank"
            rel="noopener noreferrer"
            title="Copy to clipboard"
          >
            <FontAwesomeIcon icon={faSearch} />
          </a>
        </span>
        <button type="button" className="btn btn-outline-secondary" onClick={resetForm}>
          Close
        </button>
      </div>
    </div>
  );
});

export default SuccessTransaction;
