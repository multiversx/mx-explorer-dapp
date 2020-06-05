import {
  faClock,
  faEye,
  faExclamationTriangle,
  faLeaf,
  faLock,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import * as React from 'react';
import { useGlobalState } from 'context';
import { ValidatorType } from './';

const RowIcon = ({ validator }: { validator: ValidatorType }) => {
  const {
    activeTestnet: { versionNumber },
  } = useGlobalState();
  switch (true) {
    case validator.peerType === 'jailed':
      return <FontAwesomeIcon title="Jailed" icon={faLock} className="text-danger w300 mr-1" />;
    case validator.peerType === 'observer':
      return <FontAwesomeIcon title="Observer" icon={faEye} className="w300 mr-1" />;
    case validator.peerType === 'new':
      return <FontAwesomeIcon title="New" icon={faLeaf} className="w300 mr-1" />;

    case validator.star:
      return (
        <FontAwesomeIcon
          title="Outdated client configuration"
          icon={faExclamationTriangle}
          className="text-warning w300 mr-1"
        />
      );
    case versionNumber !== validator.versionNumber.split('-')[0]:
      return (
        <FontAwesomeIcon
          title="Outdated client version"
          icon={faExclamationTriangle}
          className="text-warning w300 mr-1"
        />
      );

    default:
      return (
        <>
          {validator.peerType === 'waiting' && (
            <FontAwesomeIcon title="Waiting" icon={faClock} className="w300 mr-1" />
          )}
        </>
      );
  }
};

export default RowIcon;
