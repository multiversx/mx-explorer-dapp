import { GrowthChartDataType } from 'types';

export interface PayloadType {
  data: GrowthChartDataType[] | undefined;
  label: string;
  key: string;
  color: string;
}

export interface ChartAreaPropsType {
  className?: string;
  simpleTooltip?: boolean;
  height?: number;
  payload: PayloadType[];
}
