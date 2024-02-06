import { SliceType } from 'types/general.types';

export interface StakeType {
  totalValidators: number;
  activeValidators: number;
  queueSize: number;
  totalStaked: string;

  nakamotoCoefficient?: number;
  minimumAuctionTopup?: string;
  minimumAuctionStake?: string;
  dangerZoneValidators?: number;
  eligibleValidators?: number;
  notEligibleValidators?: number;
}

export interface StakeSliceType extends SliceType {
  unprocessed: StakeType;

  totalValidators: string;
  activeValidators: string;
  queueSize: string;
  totalStaked: string;

  nakamotoCoefficient?: string;
  minimumAuctionTopup?: string;
  minimumAuctionStake?: string;
  dangerZoneValidators?: string;
  eligibleValidators?: string;
  notEligibleValidators?: string;
}
