import { SliceType } from 'types/general.types';

export interface StakeType {
  totalValidators: number;
  activeValidators: number;
  totalStaked: string;
  nakamotoCoefficient?: number;

  totalObservers?: number;
  queueSize?: number;
  minimumAuctionQualifiedTopUp?: string;
  minimumAuctionQualifiedStake?: string;
  auctionValidators?: number;
  qualifiedAuctionValidators?: number;
  dangerZoneValidators?: number;
  eligibleValidators?: number;
  waitingValidators?: number;
  allStakedNodes?: number;

  // not in API
  notQualifiedAuctionValidators?: number;
}

export interface StakeSliceType extends SliceType {
  unprocessed: StakeType;

  totalValidators: string;
  activeValidators: string;
  totalStaked: string;
  nakamotoCoefficient?: string;
  totalObservers?: string;

  queueSize?: string;
  minimumAuctionQualifiedTopUp?: string;
  minimumAuctionQualifiedStake?: string;
  auctionValidators?: string;
  qualifiedAuctionValidators?: string;
  dangerZoneValidators?: string;
  eligibleValidators?: string;
  waitingValidators?: string;
  allStakedNodes?: string;

  // not in API
  notQualifiedAuctionValidators?: string;
}

export interface StakeExtraType {
  totalNodes?: number;
  totalValidatorNodes?: number;
  totalIdentityNodes?: number;
}

export interface StakeExtraSliceType extends SliceType {
  unprocessed: StakeExtraType;

  totalNodes?: string;
  totalValidatorNodes?: string;
  totalIdentityNodes?: string;
}
