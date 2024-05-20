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
      ledColor: 'bg-neutral-400',
      text: 'Observer',
      icon: faEye
    };
  }

  switch (status) {
    case NodeStatusEnum.eligible:
      return {
        textColor: 'text-success',
        ledColor: 'bg-success',
        text: 'Eligible',
        icon: faCircleBolt
      };
    case NodeStatusEnum.new:
      return {
        textColor: 'text-primary',
        ledColor: 'bg-primary',
        text: 'New',
        icon: faLeaf
      };
    case NodeStatusEnum.waiting:
      return {
        textColor: 'text-cyan-400',
        ledColor: 'bg-cyan-400',
        text: 'Waiting',
        icon: faClock
      };
    case NodeStatusEnum.auction:
      return {
        textColor: 'text-blue-400',
        ledColor: 'bg-blue-400',
        text: 'Auction List',
        icon: faGavel
      };
    case NodeStatusEnum.queued:
      return {
        textColor: 'text-blue-400',
        ledColor: 'bg-blue-400',
        text: 'Queued',
        icon: faFlagAlt
      };
    case NodeStatusEnum.leaving:
      return {
        textColor: 'text-orange-500',
        ledColor: 'bg-orange-500',
        text: 'Leaving',
        icon: faArrowRightFromArc
      };
    case NodeStatusEnum.jailed:
      return {
        textColor: 'text-red-600',
        ledColor: 'bg-red-600',
        text: 'Jailed',
        icon: faCircleX
      };
    case NodeStatusEnum.inactive:
      return {
        textColor: 'text-neutral-500',
        ledColor: 'bg-neutral-500',
        text: 'Inactive',
        icon: faCirclePause
      };
    case NodeStatusEnum.unknown:
      return {
        textColor: 'text-neutral-600',
        ledColor: 'bg-neutral-600',
        text: 'Unknown',
        icon: faCircleQuestion
      };

    case NodeStatusRawEnum.notStaked:
      return {
        textColor: 'text-neutral-400',
        ledColor: 'bg-neutral-400',
        text: 'NotStaked',
        icon: faCircleMinus
      };
    case NodeStatusRawEnum.unStaked:
      return {
        textColor: 'text-warning',
        ledColor: 'bg-warning',
        text: 'UnStaked',
        icon: faChartPieSimple
      };
    case NodeStatusRawEnum.staked:
      return {
        textColor: 'text-primary-700',
        ledColor: 'bg-primary-700',
        text: 'Staked',
        icon: faCircleS
      };

    default:
      return {
        textColor: '',
        ledColor: '',
        text: '',
        icon: undefined
      };
  }
};
