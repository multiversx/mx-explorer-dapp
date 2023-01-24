import moment from 'moment';
import { ChartDataType } from './types';

export const formatDataCharts = (
  data: { value: number; time: string }[]
): ChartDataType[] => {
  const formattedData = data.map((entry) => {
    return {
      value: entry.value,
      timestamp: Number(moment(entry.time).format('X'))
    };
  });

  return formattedData;
};
