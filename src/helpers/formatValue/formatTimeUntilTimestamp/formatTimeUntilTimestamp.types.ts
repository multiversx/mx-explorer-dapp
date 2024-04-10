export enum TimeGroupLabelEnum {
  days = 'days',
  hours = 'hours',
  minutes = 'minutes',
  seconds = 'seconds'
}

export type FormatterType = [TimeGroupLabelEnum, string];
export interface FormatTimeUntilTimestampPropsType {
  excludeTimeGroup?: TimeGroupLabelEnum[];
  showZeroDecimal?: boolean;
  showHourZeroDecimal?: boolean;
  timestamp: number;
}

export interface TimeGroupType {
  label: TimeGroupLabelEnum;
  time: string;
}
