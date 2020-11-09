import { NodeType } from 'context/state';

export default function nodeIssue(node: NodeType) {
  switch (true) {
    case node.issues.includes('outdatedVersion'):
      return 'Outdated client version';
    case node.issues.includes('offlineSinceGenesis'):
      return 'Offline since genesis';
    case node.issues.includes('shuffledOut'):
      return 'Shuffle out restart failed';
    default:
      return '';
  }
}
