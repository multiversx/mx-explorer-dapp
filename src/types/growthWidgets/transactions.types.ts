import { SliceType } from 'types/general.types';
import { GrowthChartDataType } from 'types/growthWidgets/chart.types';

export interface GrowthTransactionsType {
  totalTransactions: number;
  scResults: number;
  transactions: number;
}

export interface GrowthTransactionsSliceType extends SliceType {
  unprocessed: GrowthTransactionsType;

  totalTransactions: string;
  scResults: string;
  transactions: string;

  scResults7d: GrowthChartDataType[];
  scResults30d: GrowthChartDataType[];
  scResultsAll: GrowthChartDataType[];
  transactions7d: GrowthChartDataType[];
  transactions30d: GrowthChartDataType[];
  transactionsAll: GrowthChartDataType[];
}
