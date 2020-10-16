import { ValidatorType } from 'context/validators';
import { metaChainShardId } from 'appConfig';

interface NodesIssuesType {
  node: ValidatorType;
  versionNumber: string;
  nrOfShards: number;
}

export const nodesIssues = ({
  node,
  versionNumber,
  nrOfShards,
}: NodesIssuesType): ValidatorType['issue'] => {
  const shuffleOut = node.receivedShardID !== node.computedShardID && node.peerType === 'eligible';
  switch (true) {
    case node.totalUpTimeSec === 0:
      return 'Offline since genesis';
    case versionNumber !== node.versionNumber.split('-')[0]:
      return 'Outdated client version';
    case shuffleOut && !node.isActive:
      return '';
    case shuffleOut:
      return 'Shuffle out restart failed';
    case node.receivedShardID !== metaChainShardId && node.receivedShardID > nrOfShards:
      return 'Outdated client configuration';
    default:
      return '';
  }
};
