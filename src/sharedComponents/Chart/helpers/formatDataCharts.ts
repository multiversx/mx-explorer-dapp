import moment from 'moment';
import { ChartDataType } from './types';

const formatDataCharts = (data: any[]): ChartDataType[] => {
  const formattedData = data.map((entry) => {
    return {
      value: entry.value,
      timestamp: Number(moment(entry.time).format('X')),
    };
  });

  return formattedData;
};

export default formatDataCharts;
