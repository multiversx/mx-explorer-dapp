import { SliceType } from 'types/general.types';

export interface GrowthEconomicsType {
  developerRewards: number;
  feesCaptured: number;
  applicationsDeployed: number;
}

export interface GrowthEconomicsSliceType extends SliceType {
  unprocessed: GrowthEconomicsType;

  developerRewards: string;
  feesCaptured: string;
  applicationsDeployed: string;
}
