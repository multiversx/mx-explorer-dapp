import { GrowthChartDataType } from 'types';
import { TransactionsStatisticsLabelEnum } from './enum';

export interface StatisticType {
  label: TransactionsStatisticsLabelEnum;
  color: string;
  value: string;
}

export interface ChartType {
  identifier: string;
  color: string;
  data: GrowthChartDataType[] | undefined;
}
