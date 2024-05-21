import { AuctionValidatorType, WithClassnameType } from 'types';

export interface AuctionListTableUIType extends WithClassnameType {
  auctionListValidators?: AuctionValidatorType[];
  showPosition?: boolean;
}

export interface AuctionListBaseRowUIType extends WithClassnameType {
  validator: AuctionValidatorType;
  index: number;
  details?: string;
  showPosition?: boolean;
}

export interface ThresholdRowConfigType {
  showThresholdRow: boolean;
  thresholdIndex?: number;
  qualifiedValidators?: number;
  notQualifiedValidators?: number;
}

export interface ExpandRowDetailsType {
  qualifiedExpandPosition: number | undefined;
  qualifiedExpandClosePosition: number | undefined;
  remainingQualifiedValidators: number | undefined;
  notQualifiedExpandPosition: number | undefined;
  notQualifiedExpandClosePosition: number | undefined;
  remainingNotQualifiedValidators: number | undefined;
}

export interface ExpandRowConfigType extends ExpandRowDetailsType {
  qualifiedExpanded: boolean;
  dangerZoneExpanded: boolean;
  notQualifiedExpanded: boolean;
  setQualifiedExpanded: React.Dispatch<React.SetStateAction<boolean>>;
  setDangerZoneExpanded: React.Dispatch<React.SetStateAction<boolean>>;
  setNotQualifiedExpanded: React.Dispatch<React.SetStateAction<boolean>>;
}
