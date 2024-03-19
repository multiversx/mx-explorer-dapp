import { FormatTimeUntilTimestampPropsType } from 'helpers';

export interface UseGetRemainingTimePropsType
  extends Omit<FormatTimeUntilTimestampPropsType, 'timestamp'> {
  timeData: number;
  onCountdownEnd?: () => void;
}
