import { ValidatorType } from 'context/validators';
import useFilters from './useFilters';

interface NodesIssuesType {
  node: ValidatorType;
  versionNumber: string;
}

export const nodesIssues = ({ node, versionNumber }: NodesIssuesType): ValidatorType['issue'] => {
  const shuffleOut = node.receivedShardID !== node.computedShardID && node.peerType === 'eligible';
  switch (true) {
    case node.totalUpTimeSec === 0:
      return 'Offline since genesis';
    case versionNumber !== node.versionNumber:
      return 'Outdated client version';
    case shuffleOut && !node.isActive:
      return '';
    case shuffleOut:
      return 'Shuffle out restart failed';
    default:
      return '';
  }
};

export { useFilters };
