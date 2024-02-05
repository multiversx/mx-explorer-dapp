import {
  faClock,
  faEye,
  faFlagAlt,
  faLeaf,
  faSnooze,
  faSync,
  faLock,
  faExclamationTriangle
} from 'icons/regular';
import { NodeType } from 'types';

export const getNodeIcon = (node: NodeType) => {
  switch (true) {
    case node.type === 'observer':
      return faEye;

    case node.status === 'new':
      return faLeaf;

    case node.status === 'inactive':
      return faSnooze;

    case node.receivedShardID !== node.computedShardID:
      return faSync;

    case node.status === 'waiting':
      return faClock;

    case node.status === 'queued':
      return faFlagAlt;

    default:
      return null;
  }
};

export const getNodeIssueIcon = (node: NodeType) => {
  switch (true) {
    case node.status === 'jailed':
      return faLock;

    case node.issues && node.issues.length > 0:
      return faExclamationTriangle;

    case node.receivedShardID !== node.computedShardID:
      return faSync;

    default:
      return null;
  }
};
