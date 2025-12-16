export interface DateWithCountType {
  date: Date;
  count: number;
}

export type MonthMap = Record<string, DateWithCountType[][]>;

export interface HeatmapUIType {
  startDate: Date;
  values: DateWithCountType[];
}
