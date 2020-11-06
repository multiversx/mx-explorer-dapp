import { faClock } from '@fortawesome/pro-regular-svg-icons/faClock';
import { faEye } from '@fortawesome/pro-regular-svg-icons/faEye';
import { faLeaf } from '@fortawesome/pro-regular-svg-icons/faLeaf';
import { faLock } from '@fortawesome/pro-regular-svg-icons/faLock';
import { faSync } from '@fortawesome/pro-regular-svg-icons/faSync';
import { faExclamationTriangle } from '@fortawesome/pro-regular-svg-icons/faExclamationTriangle';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import * as React from 'react';
import { ValidatorType } from 'context/validators';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';

const Overlay = ({ children, title }: { children: React.ReactNode; title: string }) => (
  <OverlayTrigger
    placement="top"
    delay={{ show: 250, hide: 400 }}
    overlay={(props) => (
      <Tooltip id="button-tooltip" {...props}>
        {title}
      </Tooltip>
    )}
  >
    {children}
  </OverlayTrigger>
);

const RowIcon = ({ node }: { node: ValidatorType }) => {
  switch (true) {
    case node.peerType === 'jailed':
      return (
        <Overlay title="Jailed">
          <FontAwesomeIcon icon={faLock} className="text-danger w300 mr-1" />
        </Overlay>
      );

    case node.nodeType === 'observer':
      return (
        <Overlay title="Observer">
          <FontAwesomeIcon icon={faEye} className="text-muted w300 mr-1" />
        </Overlay>
      );

    case node.peerType === 'new':
      return (
        <Overlay title="New">
          <FontAwesomeIcon icon={faLeaf} className="text-muted w300 mr-1" />
        </Overlay>
      );

    case node.issues.length > 0: {
      let issue = '';
      switch (true) {
        case node.issues.includes('outdatedVersion'):
          issue = 'Outdated client version';
          break;
        case node.issues.includes('offlineSinceGenesis'):
          issue = 'Offline since genesis';
          break;
        case node.issues.includes('shuffledOut'):
          issue = 'Shuffle out restart failed';
          break;
      }
      return (
        <Overlay title={issue}>
          <FontAwesomeIcon icon={faExclamationTriangle} className="w300 mr-1 text-warning" />
        </Overlay>
      );
    }

    case node.receivedShardID !== node.computedShardID:
      return (
        <Overlay title="Changing shard">
          <FontAwesomeIcon icon={faSync} className="text-muted w300 mr-1" />
        </Overlay>
      );

    case node.peerType === 'waiting':
      return (
        <Overlay title="Waiting">
          <FontAwesomeIcon icon={faClock} className="text-muted w300 mr-1" />
        </Overlay>
      );

    default:
      return null;
  }
};

export default RowIcon;
