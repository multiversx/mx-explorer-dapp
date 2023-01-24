import moment from 'moment';
import { getFrequency, getIntervalDates } from './getChartBinnedData';
import { ChartDataType } from './types';

export const getTimeTicks = (data: ChartDataType[], total: number) => {
  const frequency = getFrequency(data);
  const intervalDates = getIntervalDates(
    data[0].timestamp,
    data[data.length - 1].timestamp,
    frequency
  );

  let current = data[0].timestamp;
  const velocity = Math.round((intervalDates.length - 1) / (total - 1));
  const ticks = [data[0].timestamp];

  for (let i = 1; i < total - 1; i++) {
    current = Number(
      moment
        .unix(current)
        .add(i * velocity, frequency)
        .format('X')
    );
    ticks.push(current);
  }

  ticks.push(data[data.length - 1].timestamp);

  return ticks;
};
