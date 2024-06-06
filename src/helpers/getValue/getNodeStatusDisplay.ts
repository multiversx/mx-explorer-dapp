import {
  NodeStatusEnum,
  NodeStatusRawEnum,
  NodeTypeEnum,
  NodeStatusUIType
} from 'types';
import { getNodeIcon } from './getNodeIcon';

export const getNodeStatusDisplay = (node: NodeStatusUIType) => {
  const icon = getNodeIcon(node);
  const { type, status } = node;
  if (type === NodeTypeEnum.observer) {
    return {
      textColor: 'text-neutral-400',
      iconColor: 'text-neutral-300',
      text: 'Observer',
      icon
    };
  }

  switch (status) {
    case NodeStatusEnum.eligible:
      return {
        textColor: 'text-green-400',
        iconColor: 'text-green-300',
        text: 'Eligible',
        icon
      };
    case NodeStatusEnum.new:
      return {
        textColor: 'text-primary',
        iconColor: 'text-primary-300',
        text: 'New',
        icon
      };
    case NodeStatusEnum.waiting:
      return {
        textColor: 'text-cyan-400',
        iconColor: 'text-cyan-300',
        text: 'Waiting',
        icon
      };
    case NodeStatusEnum.auction:
      return {
        textColor: 'text-blue-400',
        iconColor: 'text-blue-300',
        text: 'Auction List',
        icon
      };
    case NodeStatusEnum.queued:
      return {
        textColor: 'text-blue-400',
        iconColor: 'text-blue-300',
        text: 'Queued',
        icon
      };
    case NodeStatusEnum.leaving:
      return {
        textColor: 'text-orange-500',
        iconColor: 'text-orange-400',
        text: 'Leaving',
        icon
      };
    case NodeStatusEnum.jailed:
      return {
        textColor: 'text-red-600',
        iconColor: 'text-red-500',
        text: 'Jailed',
        icon
      };
    case NodeStatusEnum.inactive:
      return {
        textColor: 'text-neutral-500',
        iconColor: 'text-neutral-400',
        text: 'Inactive',
        icon
      };
    case NodeStatusEnum.unknown:
      return {
        textColor: 'text-neutral-600',
        iconColor: 'text-neutral-500',
        text: 'Unknown',
        icon
      };
    case NodeStatusRawEnum.notStaked:
      return {
        textColor: 'text-neutral-400',
        iconColor: 'text-neutral-300',
        text: 'NotStaked',
        icon
      };
    case NodeStatusRawEnum.unStaked:
      return {
        textColor: 'text-amber-400',
        iconColor: 'text-amber-300',
        text: 'UnStaked',
        icon
      };
    case NodeStatusRawEnum.staked:
      return {
        textColor: 'text-primary-700',
        iconColor: 'text-primary-600',
        text: 'Staked',
        icon
      };

    default:
      return {
        textColor: '',
        iconColor: '',
        text: '',
        icon
      };
  }
};
