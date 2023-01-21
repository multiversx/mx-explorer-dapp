import BigNumber from 'bignumber.js';
import { ChartDataType } from 'components/Chart/helpers/types';

export const getLastDayValue = (chartData: ChartDataType[]) => {
  if (chartData.length >= 2) {
    const lastDay = chartData[chartData.length - 1].value;
    const penultimateDay = chartData[chartData.length - 2].value;

    const day = new BigNumber(lastDay).minus(penultimateDay).toFormat(0);
    return day;
  }
  return '...';
};
