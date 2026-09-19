import { lazyChart } from 'components/Chart/helpers/lazyChart';
import { ChartAreaPropsType } from './types';

export * from './types';

export const ChartArea = lazyChart<ChartAreaPropsType>(() =>
  import('./ChartArea').then((module) => ({ default: module.ChartArea }))
);
