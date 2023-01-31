import { useCallback, useMemo } from 'react';
import { getChartMergedData } from '../helpers/getChartMergedData';
import { ChartComposedConfigType, MergedChartDataType } from '../helpers/types';

export const useChartComposedData = ({
  seriesConfig
}: ChartComposedConfigType) => {
  const series = useMemo(() => {
    return seriesConfig.map((sc) => ({
      id: sc.id,
      data: getChartMergedData({
        config: [sc],
        data: sc.data
      })
    }));
  }, [seriesConfig]);

  const getChartData = useCallback(() => {
    const data: MergedChartDataType[] = [];

    if (series.length < 1) {
      return data;
    }

    for (let i = 0; i < series[0].data.length; i++) {
      const timestamp = series[0].data[i].timestamp;

      const mergedSeriesObject: Record<string, string | number> = {};
      for (const s of series) {
        if (s.data?.[i]?.[s?.id] !== undefined) {
          mergedSeriesObject[s.id] = s.data[i][s.id];
        }
      }

      data.push({
        timestamp: timestamp,
        ...mergedSeriesObject
      });
    }

    return data;
  }, [seriesConfig, series]);

  return {
    getChartData
  };
};
