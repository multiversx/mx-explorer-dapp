import { faClock, faEye, faExclamationTriangle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { OverlayTrigger, Popover } from 'react-bootstrap';
import * as React from 'react';
import { useGlobalState } from 'context';
import { ValidatorType } from './../index';

const RowIcon = ({ validator }: { validator: ValidatorType }) => {
  const {
    activeTestnet: { versionNumber },
  } = useGlobalState();
  switch (true) {
    case validator.star:
    case versionNumber !== validator.versionNumber.split('-')[0]:
      return (
        <OverlayTrigger
          key="popover"
          placement="top"
          rootClose
          overlay={
            <Popover id="popover-positioned-bottom">
              <Popover.Content>Missed configuration</Popover.Content>
            </Popover>
          }
        >
          <FontAwesomeIcon icon={faExclamationTriangle} className="text-warning w300 mr-1" />
        </OverlayTrigger>
      );
    default:
      return (
        <>
          {validator.peerType === 'observer' && (
            <FontAwesomeIcon title="observer" icon={faEye} className="w300 mr-1" />
          )}
          {validator.peerType === 'waiting' && (
            <FontAwesomeIcon icon={faClock} className="w300 mr-1" />
          )}
        </>
      );
  }
};

export default RowIcon;
