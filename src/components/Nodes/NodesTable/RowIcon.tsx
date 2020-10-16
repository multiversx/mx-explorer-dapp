import {
  faClock,
  faEye,
  faLeaf,
  faLock,
  faSync,
  faExclamationTriangle,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import * as React from 'react';
import { ValidatorType } from 'context/validators';

const RowIcon = ({ node }: { node: ValidatorType }) => {
  switch (true) {
    case node.peerType === 'jailed':
      return <FontAwesomeIcon title="Jailed" icon={faLock} className="text-danger w300 mr-1" />;

    case node.nodeType === 'observer':
      return <FontAwesomeIcon title="Observer" icon={faEye} className="w300 mr-1" />;

    case node.peerType === 'new':
      return <FontAwesomeIcon title="New" icon={faLeaf} className="w300 mr-1" />;

    case node.issue !== '':
      return (
        <FontAwesomeIcon
          title={node.issue}
          icon={faExclamationTriangle}
          className="w300 mr-1 text-warning"
        />
      );

    case node.receivedShardID !== node.computedShardID:
      return <FontAwesomeIcon title="Changing shard" icon={faSync} className="w300 mr-1" />;

    case node.peerType === 'waiting':
      return <FontAwesomeIcon title="Waiting" icon={faClock} className="w300 mr-1" />;

    default:
      return null;
  }
};

export default RowIcon;
