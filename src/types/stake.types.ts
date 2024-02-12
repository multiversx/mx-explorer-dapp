import { SliceType } from 'types/general.types';

export interface StakeType {
  totalValidators: number;
  activeValidators: number;
  totalStaked: string;
  nakamotoCoefficient?: number;

  queueSize?: number;
  minimumAuctionQualifiedTopUp?: string;
  minimumAuctionQualifiedStake?: string;
  auctionValidators?: number;
  eligibleValidators?: number;
  dangerZoneValidators?: number;
  waitingValidators?: number;
}

export interface StakeSliceType extends SliceType {
  unprocessed: StakeType;

  totalValidators: string;
  activeValidators: string;
  totalStaked: string;
  nakamotoCoefficient?: string;

  queueSize?: string;
  minimumAuctionQualifiedTopUp?: string;
  minimumAuctionQualifiedStake?: string;
  auctionValidators?: string;
  eligibleValidators?: string;
  dangerZoneValidators?: string;
  waitingValidators?: string;
}
