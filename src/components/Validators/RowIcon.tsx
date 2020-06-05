import {
  faClock,
  faEye,
  faExclamationTriangle,
  faLeaf,
  faLock,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { OverlayTrigger, Popover } from 'react-bootstrap';
import * as React from 'react';
import { useGlobalState } from 'context';
import { ValidatorType } from './';

const Overlay = ({ message, children }: { message: string; children: React.ReactNode }) => (
  <OverlayTrigger
    key="popover"
    placement="top"
    rootClose
    overlay={
      <Popover id="popover-positioned-bottom">
        <Popover.Content>{message}</Popover.Content>
      </Popover>
    }
  >
    {children}
  </OverlayTrigger>
);

const RowIcon = ({ validator }: { validator: ValidatorType }) => {
  const {
    activeTestnet: { versionNumber },
  } = useGlobalState();
  switch (true) {
    case validator.peerType === 'jailed':
      return (
        <Overlay message="Jailed">
          <FontAwesomeIcon icon={faLock} className="text-danger w300 mr-1" />;
        </Overlay>
      );
    case validator.peerType === 'observer':
      return (
        <Overlay message="Observer">
          <FontAwesomeIcon icon={faEye} className="w300 mr-1" />;
        </Overlay>
      );
    case validator.peerType === 'new':
      return (
        <Overlay message="New">
          <FontAwesomeIcon icon={faLeaf} className="w300 mr-1" />;
        </Overlay>
      );

    case validator.star:
      return (
        <Overlay message="Outdated client configuration">
          <FontAwesomeIcon icon={faExclamationTriangle} className="text-warning w300 mr-1" />
        </Overlay>
      );
    case versionNumber !== validator.versionNumber.split('-')[0]:
      return (
        <Overlay message="Outdated client version">
          <FontAwesomeIcon icon={faExclamationTriangle} className="text-warning w300 mr-1" />
        </Overlay>
      );

    default:
      return (
        <>
          {validator.peerType === 'waiting' && (
            <Overlay message="Waiting">
              <FontAwesomeIcon icon={faClock} className="w300 mr-1" />
            </Overlay>
          )}
        </>
      );
  }
};

export default RowIcon;
