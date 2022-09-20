import moment from 'moment';
import { MergedChartDataType, ChartConfigType } from './types';
import getChartFilteredData from './getChartFilteredData';

const getChartMergedData = ({
  config,
  data,
  filter,
  category,
}: {
  config: ChartConfigType[];
  data?: any;
  filter?: string;
  category?: string;
}) => {
  const configData = config.map((chartConfig) => {
    const useData = chartConfig.data ? chartConfig.data : data;

    const id = chartConfig.id;
    const filteredData = getChartFilteredData({
      data: useData,
      filter,
      category,
      id,
    });
    if (filteredData && filteredData.length > 0) {
      const updatedData = filteredData.map((entry: any) => ({
        ...entry,
        id,
      }));

      return updatedData;
    }

    return filteredData;
  });

  if (configData && configData.length) {
    const allData = configData.reduce((acc, currentValue) => {
      return [...acc, ...currentValue];
    }, [] as MergedChartDataType[]);
    const mergedData = allData.reduce(
      ((map) => (acc: any, cur: any) => {
        map.set(cur.time, map.get(cur.time) || acc[acc.push({ time: cur.time }) - 1]);
        map.get(cur.time)[cur.id] = Number(cur.value);
        return acc;
      })(new Map()),
      []
    ) as MergedChartDataType[];

    mergedData.sort((a, b) => (moment(b.time).isBefore(a.time) ? 1 : -1));

    return mergedData;
  }

  return [];
};

export default getChartMergedData;
