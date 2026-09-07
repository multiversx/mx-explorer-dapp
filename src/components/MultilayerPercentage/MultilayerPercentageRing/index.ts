import { lazyChart } from 'components/Chart/helpers/lazyChart';
import { MultilayerPercentageUIType } from '../types';

export const MultilayerPercentageRing = lazyChart<MultilayerPercentageUIType>(
  () =>
    import('./MultilayerPercentageRing').then((module) => ({
      default: module.MultilayerPercentageRing
    }))
);
