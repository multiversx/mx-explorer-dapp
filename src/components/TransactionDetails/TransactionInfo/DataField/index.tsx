import * as React from 'react';
import { Anchorme, LinkComponentProps } from 'react-anchorme';
import { Modal } from 'react-bootstrap';
import { DetailItem } from 'sharedComponents';
import useScamDetect from './helpres/useScamDetect';

// http://localhost:3000/transactions/e6d98b3ed9cfbe50651ea355e11440e40b910df763edba3489392128d088c531

const ModalLink = (props: LinkComponentProps) => {
  const [show, setShow] = React.useState(false);

  const onClick = (e: React.MouseEvent) => {
    e.preventDefault();
    console.log(props);

    setShow(true);
  };

  const handleClose = () => {
    setShow(false);
  };

  return (
    <>
      <a {...props} onClick={onClick} />
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Modal heading</Modal.Title>
        </Modal.Header>
        <Modal.Body>Woohoo, you're reading this text in a modal!</Modal.Body>
        <Modal.Footer>
          <button className="btn btn-default" onClick={handleClose}>
            Close
          </button>
          <a href="/#" className="btn">
            Leave site
          </a>
        </Modal.Footer>
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
              {dataString}
            </Anchorme>
          </div>
        </>
      ) : (
        <>
          <textarea
            readOnly
            className="form-control col cursor-text mt-1"
            rows={2}
            value={scamDetect(dataString)}
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
