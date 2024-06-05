import {
  faArrowRightFromArc,
  faChartPieSimple,
  faEye,
  faFlagAlt,
  faLeaf,
  faSync,
  faLock
} from 'icons/regular';
import {
  faCircleBolt,
  faCircleMinus,
  faCirclePause,
  faCircleQuestion,
  faCircleS,
  faCircleX,
  faClock,
  faGavel
} from 'icons/solid';
import { faExclamationTriangle } from 'icons/solid';
import {
  NodeType,
  NodeStatusEnum,
  NodeStatusRawEnum,
  NodeTypeEnum,
  NodeStatusUIType
} from 'types';

export const getNodeIcon = (node: NodeStatusUIType) => {
  const { type, status } = node;
  if (node.receivedShardID !== node.computedShardID) {
    return faSync;
  }
  if (type === NodeTypeEnum.observer) {
    return faEye;
  }
  switch (status) {
    case NodeStatusEnum.eligible:
      return faCircleBolt;

    case NodeStatusEnum.new:
      return faLeaf;

    case NodeStatusEnum.waiting:
      return faClock;

    case NodeStatusEnum.auction:
      return faGavel;

    case NodeStatusEnum.queued:
      return faFlagAlt;

    case NodeStatusEnum.leaving:
      return faArrowRightFromArc;

    case NodeStatusEnum.jailed:
      return faCircleX;

    case NodeStatusEnum.inactive:
      return faCirclePause;

    case NodeStatusEnum.unknown:
      return faCircleQuestion;

    case NodeStatusRawEnum.notStaked:
      return faCircleMinus;

    case NodeStatusRawEnum.unStaked:
      return faChartPieSimple;

    case NodeStatusRawEnum.staked:
      return faCircleS;

    default:
      return undefined;
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
