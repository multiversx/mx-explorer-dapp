import { GrowthChartDataType, WithClassnameType } from 'types';
import { TransactionsStatisticsLabelEnum } from './enum';

export interface StatisticType {
  label: TransactionsStatisticsLabelEnum | string;
  color?: string;
  value: React.ReactNode;
}

export interface ChartType {
  identifier: string;
  color: string;
  data: GrowthChartDataType[] | undefined;
}

export interface ChartContractsTransactionsUIType extends WithClassnameType {
  title?: string;
  customStatistics?: StatisticType[];
  showStatistics?: boolean;
  showTransactions?: boolean;
  showTotal?: boolean;
  showContracts?: boolean;
  simpleTooltip?: boolean;
  hasBorder?: boolean;
  isStandalone?: boolean;
}
