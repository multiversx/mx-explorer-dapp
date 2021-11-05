import * as React from 'react';
import { Anchorme, LinkComponentProps } from 'react-anchorme';
import { faExclamationTriangle } from '@fortawesome/pro-regular-svg-icons/faExclamationTriangle';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Modal } from 'react-bootstrap';
import { DetailItem } from 'sharedComponents';
import useScamFlag from './helpres/useScamFlag';
import { truncate } from 'helpers';
import { displayedDataLength } from 'appConfig';

const ModalLink = (props: LinkComponentProps) => {
  const [show, setShow] = React.useState(false);

  const onClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setShow(true);
  };

  const handleClose = (e: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
    }

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
              <a href="/#" className="btn btn-primary px-spacer" onClick={handleClose}>
                Back to safety
              </a>
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

const DataField = ({
  data,
  scamInfo,
}: {
  data?: string;
  scamInfo?: {
    type: string;
    info: string;
  };
}) => {
  const scamFlag = useScamFlag();
  const [showData, setShowData] = React.useState(false);

  const show = (e: React.MouseEvent) => {
    e.preventDefault();
    setShowData((existing) => !existing);
  };

  const dataString = data ? Buffer.from(data, 'base64').toString() : 'N/A';
  const { stringWithLinks, output, found } = scamFlag(dataString, scamInfo);

  return (
    <DetailItem title="Input Data" className="data-field">
      {showData ? (
        <>
          <div className="textarea form-control col cursor-text mt-1">
            <Anchorme linkComponent={ModalLink} target="_blank" rel="noreferrer noopener">
              {stringWithLinks}
            </Anchorme>
          </div>
        </>
      ) : (
        <>
          <textarea
            readOnly
            className="form-control col cursor-text mt-1"
            rows={2}
            value={truncate(output, displayedDataLength)}
          />
        </>
      )}
      {found && (
        <a href="/#" onClick={show} className="small-font text-muted">
          {!showData ? 'Show' : 'Hide'} original message
        </a>
      )}
    </DetailItem>
  );
};

export default DataField;
