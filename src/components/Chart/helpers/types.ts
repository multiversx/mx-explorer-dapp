import { CSSProperties } from 'react';

export interface ChartDataType {
  timestamp: number;
  value: string | number;
  isBinnedData?: boolean;
}

export interface MergedChartDataType {
  timestamp: string;
  [key: string]: string;
}

export interface HistoricDataType {
  type: string;
  data: {
    day?: ChartDataType[];
    week?: ChartDataType[];
    month?: ChartDataType[];
    all?: ChartDataType[];
  };
}
export interface ToggleType {
  [index: string]: boolean;
}

export interface OptionType {
  label: string;
  key: keyof ToggleType;
  color: string;
}

export interface ControlDataType {
  [index: string]: string;
}

export interface ControlType {
  comparison: string;
  callback: React.Dispatch<React.SetStateAction<string>>;
  singular: string;
  plural: string;
  data: ControlDataType;
}

export interface MetricType {
  label: string;
  value: string;
}

export interface ChartYAxisFormatConfig {
  id?: string;
  orientation?: 'left' | 'right';
  currency?: string;
  percentageMultiplier?: number;
  decimals?: number;
}

export type ChartLabelConfigType = {
  style?: CSSProperties;
  config?: {
    id: string;
    label?: string;
  };
};

export interface ChartConfigType {
  id: string;
  label?: string;
  data?: any;
  fill?: string;
  gradient?: string;
  gradientStopColor?: string;
  stroke?: string;
  strokeDasharray?: string;
  tooltipStrokeDasharray?: string;
  zero?: boolean;
  showUsdValue?: boolean;
  yAxisConfig?: ChartYAxisFormatConfig;
  legend?: ChartLabelConfigType;
  tooltip?: {
    showUsdValue?: boolean;
    dateFormat?: string;
  };
}

export interface ChartListType {
  id: string;
  label: string;
  path: string;
  longPath: string;
  dappConfig?: ChartYAxisFormatConfig;
  dynamicLabel?: string[];
  legend?: ChartLabelConfigType;
}

export enum DateFilterEnum {
  // day = "day",
  week = 'week',
  month = 'month',
  all = 'all'
}

export enum ChartSizeEnum {
  sm = 'sm',
  md = 'md',
  lg = 'lg'
}

export interface ChartProps {
  config: ChartConfigType[];
  data?: any;
  dateFormat?: string;
  filter?: string;
  category?: string;
  currency?: string;
  percentageMultiplier?: number;
  denomination?: number;
  size?: ChartSizeEnum;
  hasOnlyStartEndTick?: boolean;
  tooltip?: {
    showUsdValue?: boolean;
    dateFormat?: string;
  };
}

export interface ChartComposedConfigType {
  seriesConfig: ChartConfigType[];
}

export interface ChartComposedProps extends ChartComposedConfigType {
  seriesConfig: ChartConfigType[];
  size?: ChartSizeEnum;
  hasOnlyStartEndTick?: boolean;
  dateFormat?: string;
  tooltip?: {
    dateFormat?: string;
  };
  showLegend?: boolean;
}

export interface ChartAxisType extends ChartYAxisFormatConfig {
  tick: string;
}
