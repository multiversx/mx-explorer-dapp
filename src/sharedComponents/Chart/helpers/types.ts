export interface ChartDataType {
  timestamp: number;
  value: string;
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

export interface ChartConfigType {
  id: string;
  label?: string;
  data?: any;
  fill?: string;
  gradient?: string;
  stroke?: string;
  strokeDasharray?: string;
  tooltipStrokeDasharray?: string;
  zero?: boolean;
  showUsdValue?: boolean;
}

export enum DateFilterEnum {
  // day = "day",
  week = 'week',
  month = 'month',
  all = 'all',
}

export enum ChartSizeEnum {
  sm = 'sm',
  md = 'md',
  lg = 'lg',
}

export interface ChartProps {
  config: ChartConfigType[];
  data?: any;
  dateFormat?: string;
  filter?: string;
  category?: string;
  currency?: string;
  size?: ChartSizeEnum;
  hasOnlyStartEndTick?: boolean;
  tooltip?: {
    showUsdValue?: boolean;
    dateFormat?: string;
  };
}
