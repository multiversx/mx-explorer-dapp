import { useCallback } from 'react';
import { getChartMergedData } from '../helpers/getChartMergedData';
import { BiAxialChartConfigType, MergedChartDataType } from '../helpers/types';

export const useBiAxialChartData = ({
  config,
  data,
  filter,
  category
}: {
  config: BiAxialChartConfigType;
  data?: any;
  filter?: string;
  category?: string;
}) => {
  const firstSeriesData = getChartMergedData({
    config: [config.firstSeriesConfig],
    data,
    filter,
    category
  });
  const secondSeriesData = getChartMergedData({
    config: [config.secondSeriesConfig],
    data,
    filter,
    category
  });

  const getChartData = useCallback(() => {
    const data: MergedChartDataType[] = [];

    for (let i = 0; i < firstSeriesData.length; i++) {
      data.push({
        timestamp: firstSeriesData[i].timestamp,
        [config.firstSeriesConfig.id]:
          firstSeriesData[i][config.firstSeriesConfig.id],
        [config.secondSeriesConfig.id]:
          secondSeriesData[i][config.secondSeriesConfig.id]
      });
    }

    return data;
  }, [firstSeriesData, secondSeriesData]);

  return {
    firstSeriesData,
    secondSeriesData,
    getChartData
  };
};
