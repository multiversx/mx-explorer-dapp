import { WithClassnameType } from 'types';

export interface MultilayerPercentageUIType extends WithClassnameType {
  steps: MultilayerPercentageStepType[];
  hasTrim?: boolean;
  hasChart?: boolean;
  hasSeparator?: boolean;
  legendClassName?: string;
}

export interface MultilayerPercentageStepType extends WithClassnameType {
  name: string;
  value: number | string;
  legend?: React.ReactNode;
}
