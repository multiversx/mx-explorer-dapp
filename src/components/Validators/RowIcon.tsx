import { faClock } from '@fortawesome/pro-solid-svg-icons/faClock';
import { faEye } from '@fortawesome/pro-solid-svg-icons/faEye';
import { faLeaf } from '@fortawesome/pro-solid-svg-icons/faLeaf';
import { faLock } from '@fortawesome/pro-solid-svg-icons/faLock';
import { faSync } from '@fortawesome/pro-solid-svg-icons/faSync';
import { faExclamationTriangle } from '@fortawesome/pro-solid-svg-icons/faExclamationTriangle';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import * as React from 'react';
import { ValidatorType } from 'context/validators';

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
    case versionNumber !== validator.versionNumber.split('-')[0]:
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
