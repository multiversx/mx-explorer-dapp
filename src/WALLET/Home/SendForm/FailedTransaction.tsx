import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import * as React from 'react';

const FailedTransaction = ({ setFailedTransaction }: { setFailedTransaction: Function }) => {
  const resetForm = () => {
    setFailedTransaction(false);
  };
  return (
    <div
      id="successTransaction"
      className="row h-100 justify-content-center align-items-center pb-5"
    >
      <div className="col-12 empty">
        <FontAwesomeIcon icon={faTimes} className="empty-icon text-danger" />
        <span className="h5 empty-heading text-danger">Failed</span>
        <span className="empty-details empty-small">
          The transaction has failed. Please try again.
          <br />
        </span>
        <button type="button" className="btn btn-outline-secondary" onClick={resetForm}>
          Try again
        </button>
      </div>
    </div>
  );
};

export default FailedTransaction;
