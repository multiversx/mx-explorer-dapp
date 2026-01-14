import { JSXElementConstructor, memo, ReactElement } from 'react';
import { ResponsiveContainer, LineChart } from 'recharts';
import { MergedChartDataType } from './helpers/types';

interface ChartLineContainerUIType {
  children: ReactElement<unknown, string | JSXElementConstructor<any>>;
  data: MergedChartDataType[];
  width?: string | number;
  height?: string | number;
}

export const ChartLineContainer = memo(
  ({ children, data, width, height }: ChartLineContainerUIType) => {
    if (width && height) {
      return (
        <LineChart data={data} width={Number(width)} height={Number(height)}>
          {children}
        </LineChart>
      );
    }

    return (
      <ResponsiveContainer width={width ?? '100%'} height={height ?? '100%'}>
        <LineChart data={data}>{children}</LineChart>
      </ResponsiveContainer>
    );
  }
);
