import React from 'react';
import { ChartArea } from './ChartArea';
import { ChartBar } from './ChartBar';
import { ChartBody } from './ChartBody';
import { ChartComposed } from './ChartComposed';
import { ChartControls } from './ChartControls';
import { ChartDonut } from './ChartDonut';
import { ChartHeading } from './ChartHeading';
import { ChartLine } from './ChartLine';
import { ChartMetrics } from './ChartMetrics';
import { ChartOptions } from './ChartOptions';

export default class Chart extends React.Component<{
  children: React.ReactNode;
}> {
  static Area = ChartArea;
  static Line = ChartLine;
  static Bar = ChartBar;
  static Donut = ChartDonut;
  static Options = ChartOptions;
  static Heading = ChartHeading;
  static Controls = ChartControls;
  static Metrics = ChartMetrics;
  static Body = ChartBody;
  static Composed = ChartComposed;

  render() {
    return null;
  }
}
