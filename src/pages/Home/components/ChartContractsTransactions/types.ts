import { GrowthChartDataType, WithClassnameType } from 'types';
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

export interface ChartContractsTransactionsUIType extends WithClassnameType {
  title?: string;
  showStatistics?: boolean;
  showTransactions?: boolean;
  showTotal?: boolean;
  showContracts?: boolean;
  simpleTooltip?: boolean;
}
