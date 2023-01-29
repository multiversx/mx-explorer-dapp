import { useCallback } from 'react';
import { getChartMergedData } from '../helpers/getChartMergedData';
import { BiAxialChartConfigType, MergedChartDataType } from '../helpers/types';

export const useBiAxialChartData = ({
  firstSeriesConfig,
  secondSeriesConfig
}: BiAxialChartConfigType) => {
  const firstSeriesData = getChartMergedData({
    config: [firstSeriesConfig],
    data: firstSeriesConfig.data
  });
  const secondSeriesData = getChartMergedData({
    config: [secondSeriesConfig],
    data: secondSeriesConfig.data
  });

  const getChartData = useCallback(() => {
    const data: MergedChartDataType[] = [];

    for (let i = 0; i < firstSeriesData.length; i++) {
      data.push({
        timestamp: firstSeriesData[i].timestamp,
        [firstSeriesConfig.id]: firstSeriesData[i][firstSeriesConfig.id],
        [secondSeriesConfig.id]: secondSeriesData[i][secondSeriesConfig.id]
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
