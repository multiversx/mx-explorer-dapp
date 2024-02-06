import { SliceType } from 'types/general.types';

export interface StakeType {
  totalValidators: number;
  activeValidators: number;
  queueSize: number;
  totalStaked: string;
}

export interface StakeSliceType extends SliceType {
  unprocessed: StakeType;

  totalValidators: string;
  activeValidators: string;
  queueSize: string;
  totalStaked: string;
}
