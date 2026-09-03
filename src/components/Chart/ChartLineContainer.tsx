import { JSXElementConstructor, memo, ReactElement } from 'react';
import { ResponsiveContainer, LineChart } from 'recharts';
import { MergedChartDataType } from 'types';

interface ChartLineContainerUIType {
  children: ReactElement<unknown, string | JSXElementConstructor<any>>;
  data: MergedChartDataType[];
  width?: number | `${number}%`;
  height?: number | `${number}%`;
}

export const ChartLineContainer = memo(
  ({ children, data, width, height }: ChartLineContainerUIType) => {
    if (typeof width === 'number' && typeof height === 'number') {
      return (
        <LineChart data={data} width={width} height={height}>
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
