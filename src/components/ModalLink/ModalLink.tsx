import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { LinkComponentProps } from 'react-anchorme';
import { Modal } from 'react-bootstrap';
import { faExclamationTriangle } from 'icons/regular';

export const ModalLink = (props: LinkComponentProps) => {
  const [show, setShow] = useState(false);

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
      <a {...props} onClick={onClick} />
      <Modal
        show={show}
        onHide={handleClose}
        animation={false}
        centered
        className='modal-container'
      >
        <div className='card card-small'>
          <div className='card-body text-center p-spacer'>
            <p className='h3 pt-1'>
              <FontAwesomeIcon
                icon={faExclamationTriangle}
                className='me-2 text-warning'
              />
              Caution!
            </p>
            <p className='lead'>
              You are about to navigate to an external website.
            </p>
            <div className='mx-auto mb-spacer '>
              <p>
                This link is not part of MultiversX. Do not enter your private
                words, your keystore file or any of your MultiversX account
                information.
              </p>
            </div>
            <div className='d-flex align-items-center flex-column mt-spacer'>
              <button
                type='button'
                className='btn btn-primary px-spacer'
                onClick={handleClose}
              >
                Back to safety
              </button>
              <a
                href={props.href}
                target={'_blank'}
                className='mt-3'
                rel='noreferrer nofollow noopener'
              >
                Continue to {link}
              </a>
            </div>
          </div>
        </div>
      </Modal>
    </>
  );
};
