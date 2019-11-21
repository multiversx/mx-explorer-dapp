import * as React from 'react';
import { withRouter } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCopy, faCheck } from '@fortawesome/free-solid-svg-icons';
import { useWalletState, useWalletDispatch } from './../../context';
import { useGlobalState } from './../../../context';

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
  const copyLastTxHash = (e: React.SyntheticEvent) => {
    e.preventDefault();
    navigator.clipboard.writeText(lastTxHash);
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
          <a href="/#" onClick={copyLastTxHash} title="Copy to clipboard">
            <FontAwesomeIcon icon={faCopy} />
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
