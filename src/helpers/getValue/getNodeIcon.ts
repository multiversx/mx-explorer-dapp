import {
  faClock,
  faEye,
  faFlagAlt,
  faLeaf,
  faSnooze,
  faSync,
  faLock,
  faExclamationTriangle,
  faGavel
} from 'icons/regular';
import { NodeType, NodeStatusEnum, NodeTypeEnum } from 'types';

export const getNodeIcon = (node: NodeType) => {
  switch (true) {
    case node.type === NodeTypeEnum.observer:
      return faEye;

    case node.status === NodeStatusEnum.new:
      return faLeaf;

    case node.status === NodeStatusEnum.inactive:
      return faSnooze;

    case node.receivedShardID !== node.computedShardID:
      return faSync;

    case node.status === NodeStatusEnum.waiting:
      return faClock;

    case node.status === NodeStatusEnum.queued:
      return faFlagAlt;

    case node.status === NodeStatusEnum.auction:
      return faGavel;

    default:
      return null;
  }
};

export const getNodeIssueIcon = (node: NodeType) => {
  switch (true) {
    case node.status === NodeStatusEnum.jailed:
      return faLock;

    case node.issues && node.issues.length > 0:
      return faExclamationTriangle;

    case node.receivedShardID !== node.computedShardID:
      return faSync;

    default:
      return null;
  }
};
