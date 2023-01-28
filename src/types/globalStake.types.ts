import { NodesVersionsType } from 'types';
import { SliceType } from 'types/general.types';

export interface GlobalStakeType {
  totalValidators: number;
  activeValidators: number;
  queueSize: number;
  totalStaked: string;
  waitingList?: number;
  deliquentStake?: number;
  nodesVerions?: NodesVersionsType[];
}

export interface GlobalStakeSliceType extends SliceType {
  unprocessed: GlobalStakeType;

  totalValidators: string;
  activeValidators: string;
  queueSize: string;
  totalStaked: string;
  waitingList?: string;
  deliquentStake?: string;
  nodesVerions?: NodesVersionsType[];
}
