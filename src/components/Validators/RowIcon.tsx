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

const RowIcon = ({ validator }: { validator: ValidatorType }) => {
  const {
    activeTestnet: { versionNumber },
  } = useGlobalState();
  switch (true) {
    case validator.peerType === 'jailed':
      return <FontAwesomeIcon title="jailed" icon={faLock} className="text-danger w300 mr-1" />;
    case validator.peerType === 'observer':
      return <FontAwesomeIcon title="observer" icon={faEye} className="w300 mr-1" />;
    case validator.peerType === 'new':
      return <FontAwesomeIcon title="new" icon={faLeaf} className="w300 mr-1" />;
    case validator.star:
      return (
        <OverlayTrigger
          key="popover"
          placement="top"
          rootClose
          overlay={
            <Popover id="popover-positioned-bottom">
              <Popover.Content>Outdated client configuration</Popover.Content>
            </Popover>
          }
        >
          <FontAwesomeIcon icon={faExclamationTriangle} className="text-warning w300 mr-1" />
        </OverlayTrigger>
      );
    case versionNumber !== validator.versionNumber.split('-')[0]:
      return (
        <OverlayTrigger
          key="popover"
          placement="top"
          rootClose
          overlay={
            <Popover id="popover-positioned-bottom">
              <Popover.Content>Outdated client version</Popover.Content>
            </Popover>
          }
        >
          <FontAwesomeIcon icon={faExclamationTriangle} className="text-warning w300 mr-1" />
        </OverlayTrigger>
      );

    default:
      return (
        <>
          {validator.peerType === 'waiting' && (
            <FontAwesomeIcon icon={faClock} className="w300 mr-1" />
          )}
        </>
      );
  }
};

export default RowIcon;
