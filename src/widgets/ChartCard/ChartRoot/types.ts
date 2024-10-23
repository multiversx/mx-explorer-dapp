import { GrowthChartDataType } from 'types';

export interface ChartRootPropsType {
  identifier: string;
  color: string;
  data: GrowthChartDataType[] | undefined;
  className?: string;
  tooltipFormatter: (option: any) => string;
  height: number;
}
