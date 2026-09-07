import { ChartBody } from './ChartBody';
import { ChartControls } from './ChartControls';
import { ChartHeading } from './ChartHeading';
import { ChartMetrics } from './ChartMetrics';
import { ChartOptions } from './ChartOptions';
import { lazyChart } from './helpers/lazyChart';
import { ChartComposedProps, ChartProps } from './helpers/types';

const ChartArea = lazyChart<ChartProps>(() =>
  import('./ChartArea').then((module) => ({ default: module.ChartArea }))
);
const ChartBar = lazyChart<ChartProps>(() =>
  import('./ChartBar').then((module) => ({ default: module.ChartBar }))
);
const ChartComposed = lazyChart<ChartComposedProps>(() =>
  import('./ChartComposed').then((module) => ({
    default: module.ChartComposed
  }))
);
const ChartDonut = lazyChart<ChartProps>(() =>
  import('./ChartDonut').then((module) => ({ default: module.ChartDonut }))
);
const ChartLine = lazyChart<ChartProps>(() =>
  import('./ChartLine').then((module) => ({ default: module.ChartLine }))
);

const Chart = {
  Area: ChartArea,
  Line: ChartLine,
  Bar: ChartBar,
  Donut: ChartDonut,
  Options: ChartOptions,
  Heading: ChartHeading,
  Controls: ChartControls,
  Metrics: ChartMetrics,
  Body: ChartBody,
  Composed: ChartComposed
};

export default Chart;
