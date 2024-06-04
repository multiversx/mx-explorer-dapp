import {
  faArrowRightFromArc,
  faChartPieSimple,
  faEye,
  faFlagAlt,
  faLeaf
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
import {
  NodeStatusEnum,
  NodeApiStatusEnum,
  NodeStatusRawEnum,
  NodeTypeEnum
} from 'types';

export const getNodeStatusDisplay = ({
  type,
  status
}: {
  type?: NodeTypeEnum;
  status?: NodeApiStatusEnum;
}) => {
  if (type === NodeTypeEnum.observer) {
    return {
      textColor: 'text-neutral-400',
      iconColor: 'text-neutral-300',
      text: 'Observer',
      icon: faEye
    };
  }

  switch (status) {
    case NodeStatusEnum.eligible:
      return {
        textColor: 'text-green-400',
        iconColor: 'text-green-300',
        text: 'Eligible',
        icon: faCircleBolt
      };
    case NodeStatusEnum.new:
      return {
        textColor: 'text-primary',
        iconColor: 'text-primary-300',
        text: 'New',
        icon: faLeaf
      };
    case NodeStatusEnum.waiting:
      return {
        textColor: 'text-cyan-400',
        iconColor: 'text-cyan-300',
        text: 'Waiting',
        icon: faClock
      };
    case NodeStatusEnum.auction:
      return {
        textColor: 'text-blue-400',
        iconColor: 'text-blue-300',
        text: 'Auction List',
        icon: faGavel
      };
    case NodeStatusEnum.queued:
      return {
        textColor: 'text-blue-400',
        iconColor: 'text-blue-300',
        text: 'Queued',
        icon: faFlagAlt
      };
    case NodeStatusEnum.leaving:
      return {
        textColor: 'text-orange-500',
        iconColor: 'text-orange-400',
        text: 'Leaving',
        icon: faArrowRightFromArc
      };
    case NodeStatusEnum.jailed:
      return {
        textColor: 'text-red-600',
        iconColor: 'text-red-500',
        text: 'Jailed',
        icon: faCircleX
      };
    case NodeStatusEnum.inactive:
      return {
        textColor: 'text-neutral-500',
        iconColor: 'text-neutral-400',
        text: 'Inactive',
        icon: faCirclePause
      };
    case NodeStatusEnum.unknown:
      return {
        textColor: 'text-neutral-600',
        iconColor: 'text-neutral-500',
        text: 'Unknown',
        icon: faCircleQuestion
      };
    case NodeStatusRawEnum.notStaked:
      return {
        textColor: 'text-neutral-400',
        iconColor: 'text-neutral-300',
        text: 'NotStaked',
        icon: faCircleMinus
      };
    case NodeStatusRawEnum.unStaked:
      return {
        textColor: 'text-amber-400',
        iconColor: 'text-amber-300',
        text: 'UnStaked',
        icon: faChartPieSimple
      };
    case NodeStatusRawEnum.staked:
      return {
        textColor: 'text-primary-700',
        iconColor: 'text-primary-600',
        text: 'Staked',
        icon: faCircleS
      };

    default:
      return {
        textColor: '',
        iconColor: '',
        text: '',
        icon: undefined
      };
  }
};
