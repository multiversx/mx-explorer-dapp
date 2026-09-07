import { lazyChart } from 'components/Chart/helpers/lazyChart';
import type { ValidatorMapType } from './ValidatorMap';

export const ValidatorMap = lazyChart<ValidatorMapType>(() =>
  import('./ValidatorMap').then((module) => ({ default: module.ValidatorMap }))
);

export type { ValidatorMapType };
