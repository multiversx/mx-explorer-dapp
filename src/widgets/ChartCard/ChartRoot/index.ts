import { lazyChart } from 'components/Chart/helpers/lazyChart';
import { ChartRootPropsType } from './types';

export * from './types';

export const ChartRoot = lazyChart<ChartRootPropsType>(() =>
  import('./ChartRoot').then((module) => ({ default: module.ChartRoot }))
);
