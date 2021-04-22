import { NodeType } from 'context/state';

export default function nodeIssue(node: NodeType) {
  if (node.issues)
    switch (true) {
      case node.issues.includes('versionMismatch'):
        return 'Version mismatch';
      case node.issues.includes('offlineSinceGenesis'):
        return 'Offline since genesis';
      case node.issues.includes('shuffledOut'):
        return 'Shuffle out restart failed';
      case node.issues.includes('multipleInstances'):
        return 'Multiple instances';
    }
  return '';
}
