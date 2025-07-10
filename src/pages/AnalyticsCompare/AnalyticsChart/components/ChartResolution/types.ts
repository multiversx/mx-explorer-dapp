export type ChartResolutionRangeType =
  | 'all'
  | 'year'
  | 'month'
  | 'week'
  | 'day';

export interface ChartResolutionItemType {
  label: string;
  range: ChartResolutionRangeType;
}

export type ChartResolutionType = {
  [key in ChartResolutionRangeType]: {
    label: string;
    range: ChartResolutionRangeType;
  };
};

export interface ChartResolutionSelectorPropsType {
  value: ChartResolutionRangeType;
  onChange?: (resolution: ChartResolutionItemType) => void;
  hasDayOption?: boolean;
  isResponsive?: boolean;
}
