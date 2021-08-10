import * as React from 'react';
import { Anchorme, LinkComponentProps } from 'react-anchorme';
import { faExclamationTriangle } from '@fortawesome/pro-regular-svg-icons/faExclamationTriangle';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Modal } from 'react-bootstrap';
import { DetailItem } from 'sharedComponents';
import useScamDetect from './helpres/useScamDetect';

// http://localhost:3000/transactions/e6d98b3ed9cfbe50651ea355e11440e40b910df763edba3489392128d088c531

const ModalLink = (props: LinkComponentProps) => {
  const [show, setShow] = React.useState(false);

  const onClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setShow(true);
  };

  const handleClose = (e: React.MouseEvent) => {
    e.preventDefault();
    setShow(false);
  };

  return (
    <>
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
            <p className="h3">
              <FontAwesomeIcon icon={faExclamationTriangle} className="mr-2 text-warning" />
              Warning
            </p>
            <p className="lead mb-spacer">
              You are leaving the <b>elrond</b> domain
            </p>
            <div className="mx-auto mb-spacer">
              <p>
                By clicking <b>Access</b> button you may be redirected to a phishing site (
                {props.href}). <br />
                Make sure not to give away your secret phrase or upload your keystore file.
              </p>
            </div>
            <div className="d-flex align-items-center flex-column mt-spacer">
              <a href={props.href} target={`_blank`} className="btn btn-warning px-spacer">
                Access {props.href}
              </a>
              <a href="/#" className="mt-3" onClick={handleClose}>
                Close
              </a>
            </div>
          </div>
        </div>
      </Modal>
    </>
  );
};

const DataField = ({ data }: { data?: string }) => {
  const scamDetect = useScamDetect();
  const [showData, setShowData] = React.useState(false);

  const show = (e: React.MouseEvent) => {
    e.preventDefault();
    setShowData((existing) => !existing);
  };

  const dataString = data ? Buffer.from(data, 'base64').toString() : 'N/A';

  return (
    <DetailItem title="Input Data">
      {showData ? (
        <>
          <div className="textarea form-control col cursor-text mt-1">
            <Anchorme linkComponent={ModalLink} target="_blank" rel="noreferrer noopener">
              {scamDetect(dataString).stringWithLinks}
            </Anchorme>
          </div>
        </>
      ) : (
        <>
          <textarea
            readOnly
            className="form-control col cursor-text mt-1"
            rows={2}
            value={scamDetect(dataString).output}
          />
        </>
      )}
      <a href="/#" onClick={show}>
        {!showData ? 'Show' : 'Hide'} original message
      </a>
    </DetailItem>
  );
};

export default DataField;
