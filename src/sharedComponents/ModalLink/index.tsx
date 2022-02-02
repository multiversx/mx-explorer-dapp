import * as React from 'react';
import { LinkComponentProps } from 'react-anchorme';
import { faExclamationTriangle } from '@fortawesome/pro-regular-svg-icons/faExclamationTriangle';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Modal } from 'react-bootstrap';

const ModalLink = (props: LinkComponentProps) => {
  const [show, setShow] = React.useState(false);

  const onClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setShow(true);
  };

  const handleClose = () => {
    setShow(false);
  };

  const link = props.href.replace('https://', '').replace('http://', '');

  return (
    <>
      {/* eslint-disable-next-line jsx-a11y/anchor-has-content */}
      <a {...props} onClick={onClick} />
      <Modal
        show={show}
        onHide={handleClose}
        animation={false}
        centered
        className="modal-container"
      >
        <div className="card card-small">
          <div className="card-body text-center p-spacer">
            <p className="h3 pt-1">
              <FontAwesomeIcon icon={faExclamationTriangle} className="mr-2 text-warning" />
              Caution!
            </p>
            <p className="lead">You are about to navigate to an external website.</p>
            <div className="mx-auto mb-spacer ">
              <p>
                This link is not part of Elrond. Do not enter your private words, your keystore file
                or any of your Elrond account information.
              </p>
            </div>
            <div className="d-flex align-items-center flex-column mt-spacer">
              <button type="button" className="btn btn-primary px-spacer" onClick={handleClose}>
                Back to safety
              </button>
              <a href={props.href} target={`_blank`} className="mt-3" rel="noreferrer noopener">
                Continue to {link}
              </a>
            </div>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default ModalLink;
