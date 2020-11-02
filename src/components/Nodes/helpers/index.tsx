import { ValidatorType } from 'context/validators';
import useGetFilters from './useGetFilters';
import { outdatedVersion } from '../../../helpers';

interface NodesIssuesType {
  node: ValidatorType;
  versionNumber: string;
}

export const nodesIssues = ({ node, versionNumber }: NodesIssuesType): ValidatorType['issue'] => {
  const shuffleOut = node.receivedShardID !== node.computedShardID && node.peerType === 'eligible';
  switch (true) {
    case node.totalUpTimeSec === 0:
      return 'Offline since genesis';
    case outdatedVersion(node.versionNumber, versionNumber):
      return 'Outdated client version';
    case shuffleOut && !node.isActive:
      return '';
    case shuffleOut:
      return 'Shuffle out restart failed';
    default:
      return '';
  }
};

export { useGetFilters };
