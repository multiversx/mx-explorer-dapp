import { WithClassnameType } from 'types';

export interface MultilayerPercentageUIType extends WithClassnameType {
  steps: MultilayerPercentageStepType[];
  hasTrim?: boolean;
  hasSeparator?: boolean;
  legendClassName?: string;
}

export interface MultilayerPercentageStepType {
  name: string;
  value: number;
  legend?: React.ReactNode;
}
