import moment from 'moment';
import { MergedChartDataType, ChartConfigType } from './types';
import { getChartFilteredData } from './getChartFilteredData';

export const getChartMergedData = ({
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

  if (configData && configData.length > 0) {
    const allData = configData.reduce((acc, currentValue) => {
      return [...acc, ...currentValue];
    }, [] as MergedChartDataType[]);

    const mergedData = allData.reduce(
      ((map) => (acc: any, cur: any) => {
        map.set(
          cur.timestamp,
          map.get(cur.timestamp) || acc[acc.push({ timestamp: cur.timestamp }) - 1]
        );
        map.get(cur.timestamp)[cur.id] = Number(cur.value);
        map.get(cur.timestamp)['isBinnedData'] = Boolean(cur.isBinnedData);

        return acc;
      })(new Map()),
      []
    ) as MergedChartDataType[];

    mergedData.sort((a, b) => (moment(b.timestamp).isBefore(a.timestamp) ? 1 : -1));

    return mergedData;
  }

  return [];
};
