import { SliceType } from 'types/general.types';

export interface GlobalStakeType {
  totalValidators: number;
  activeValidators: number;
  queueSize: number;
  totalStaked: string;
}

export interface GlobalStakeSliceType extends SliceType {
  unprocessed: GlobalStakeType;

  totalValidators: string;
  activeValidators: string;
  queueSize: string;
  totalStaked: string;
}
