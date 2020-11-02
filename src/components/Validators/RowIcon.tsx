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
import { outdatedVersion } from '../../helpers';

interface ValidatorIssuesType {
  validator: ValidatorType;
  versionNumber: string;
  metaChainShardId: number;
  nrOfShards: number;
}

export const validatorIssues = ({
  validator,
  versionNumber,
  metaChainShardId,
  nrOfShards,
}: ValidatorIssuesType): ValidatorType['issue'] => {
  const shuffleOut =
    validator.receivedShardID !== validator.computedShardID && validator.peerType === 'eligible';
  switch (true) {
    case validator.totalUpTimeSec === 0:
      return 'Offline since genesis';
    case outdatedVersion(validator.versionNumber, versionNumber):
      return 'Outdated client version';
    case shuffleOut && !validator.isActive:
      return '';
    case shuffleOut:
      return 'Shuffle out restart failed';
    case validator.receivedShardID !== metaChainShardId && validator.receivedShardID > nrOfShards:
      return 'Outdated client configuration';
    default:
      return '';
  }
};

const RowIcon = ({ validator }: { validator: ValidatorType }) => {
  switch (true) {
    case validator.peerType === 'jailed':
      return <FontAwesomeIcon title="Jailed" icon={faLock} className="text-danger w300 mr-1" />;

    case validator.peerType === 'observer':
      return <FontAwesomeIcon title="Observer" icon={faEye} className="w300 mr-1" />;

    case validator.peerType === 'new':
      return <FontAwesomeIcon title="New" icon={faLeaf} className="w300 mr-1" />;

    case validator.issue !== '':
      return (
        <FontAwesomeIcon
          title={validator.issue}
          icon={faExclamationTriangle}
          className="w300 mr-1 text-warning"
        />
      );

    case validator.receivedShardID !== validator.computedShardID:
      return <FontAwesomeIcon title="Changing shard" icon={faSync} className="w300 mr-1" />;

    case validator.peerType === 'waiting':
      return <FontAwesomeIcon title="Waiting" icon={faClock} className="w300 mr-1" />;

    default:
      return null;
  }
};

export default RowIcon;
