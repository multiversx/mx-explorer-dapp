import { WithClassnameType } from 'types';

export interface MultilayerPercentageUIType extends WithClassnameType {
  steps: MultilayerPercentageStepType[];
  hasTrim?: boolean;
  hasSeparator?: boolean;
}

export interface MultilayerPercentageStepType {
  name: React.ReactNode;
  value: number;
  description?: React.ReactNode;
}
