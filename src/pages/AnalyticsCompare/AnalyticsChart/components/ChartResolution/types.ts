export type ChartResolutionRangeType = 'all' | 'year' | 'month' | 'week';

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
  isResponsive?: boolean;
}
