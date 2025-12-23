import { ChartDataType } from 'types';

export type MonthMap = Record<string, ChartDataType[][]>;

export interface HeatmapUIType {
  startDate: number;
  values: ChartDataType[];
}
