import { faClock, faEye, faLeaf, faLock, faSync } from '@fortawesome/free-solid-svg-icons';
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
}: ValidatorIssuesType) => {
  switch (true) {
    case versionNumber !== validator.versionNumber.split('-')[0]:
      return 'Outdated client version';
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

    // case validator.issue !== '':
    //   return (
    //     <FontAwesomeIcon
    //       title={validator.issue}
    //       icon={faExclamationTriangle}
    //       className="text-warning w300 mr-1"
    //     />
    //   );

    case validator.receivedShardID !== validator.computedShardID:
      return <FontAwesomeIcon title="Changing shard" icon={faSync} className="w300 mr-1" />;

    case validator.peerType === 'waiting':
      return <FontAwesomeIcon title="Waiting" icon={faClock} className="w300 mr-1" />;

    default:
      return null;
  }
};

export default RowIcon;
