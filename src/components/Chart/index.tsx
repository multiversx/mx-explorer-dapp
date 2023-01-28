import * as React from 'react';

import { ChartArea } from './ChartArea';
import { ChartBar } from './ChartBar';
import { ChartBody } from './ChartBody';
import { ChartControls } from './ChartControls';
import { ChartDonut } from './ChartDonut';
import { ChartHeading } from './ChartHeading';
import { ChartMetrics } from './ChartMetrics';
import { ChartOptions } from './ChartOptions';
import { ComposedChartPoC } from './ComposedChartPoC';

export default class Chart extends React.Component<{
  children: React.ReactNode;
}> {
  static Area = ChartArea;
  static Bar = ChartBar;
  static Donut = ChartDonut;
  static Options = ChartOptions;
  static Heading = ChartHeading;
  static Controls = ChartControls;
  static Metrics = ChartMetrics;
  static Body = ChartBody;
  static ComposedChartPoC = ComposedChartPoC;

  render() {
    return null;
  }
}
