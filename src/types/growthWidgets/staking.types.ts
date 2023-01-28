import { SliceType } from 'types/general.types';
import { GrowthChartDataType } from 'types/growthWidgets/chart.types';

export interface GrowthStakingType {
  totalStaked: number;
  stakingPercentage: number;
  circulatingSupply: number;
  usersStaking: number;
  averageAPR: number;
}

export interface GrowthStakingSliceType extends SliceType {
  unprocessed: GrowthStakingType;

  totalStaked: string;
  stakingPercentage: string;
  circulatingSupply: string;
  usersStaking: string;
  averageAPR: string;

  totalStaked7d: GrowthChartDataType[];
  totalStaked30d: GrowthChartDataType[];
  totalStakedAll: GrowthChartDataType[];
}
