import { MarkerType, RankType, WithClassnameType } from 'types';

export interface ValidatorsStatusType extends WithClassnameType {
  isSmall?: boolean;
}

export interface ValidatorsStatusCardType extends WithClassnameType {
  totalValidators: string;
  markers: MarkerType[];
  continentsRank: RankType[];
}
