export type Coordinate = [number, number];
export type RGB = [number, number, number];

export interface DateWithCount {
  date: Date;
  count: number;
}

export interface HeatmapUIType {
  startDate: Date;
  values: DateWithCount[];
  emptyColor?: RGB;
  baseColor?: RGB;
  scaleFactor?: number;
  className?: string;
  style?: React.CSSProperties;
}
