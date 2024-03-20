import moment, { Moment, unitOfTime } from 'moment';

import { ChartDataType } from 'components/Chart/helpers/types';
import { DECIMALS, DIGITS } from 'config';
import { formatAmount } from 'helpers';

interface AccountBalanceHistoryType {
  address: string;
  balance: string;
  timestamp: number;
  isSender?: boolean;
}

const getMoment = (timestamp: string | number): Moment => {
  return typeof timestamp === 'number'
    ? moment.unix(timestamp)
    : moment(timestamp);
};

export const getFrequency = (
  data: ChartDataType[] | AccountBalanceHistoryType[]
): unitOfTime.DurationConstructor => {
  const startDate = data[0].timestamp;
  const endDate = data[data.length - 1].timestamp;
  const momentStart = getMoment(startDate);
  const momentEnd = getMoment(endDate);
  const bin = momentEnd.diff(momentStart, 'hours', true);

  if (bin > 24) {
    return 'days';
  } else {
    const minuteBin = momentEnd.diff(momentStart, 'minutes', true);
    if (minuteBin < 180) {
      return 'minutes';
    } else {
      return 'hours';
    }
  }
};

export const getIntervalDates = (
  startDate: string | number,
  endDate: string | number,
  frequency: unitOfTime.DurationConstructor
): number[] => {
  const dates = [];
  const list = [];

  const now = getMoment(startDate).clone();
  while (now.isSameOrBefore(getMoment(endDate), frequency)) {
    dates.push(Number(now.startOf(frequency).format('X')));
    list.push(now.format());
    now.add(1, frequency);
  }

  return dates;
};

export const formatEntry = (entry: AccountBalanceHistoryType) => {
  const value = formatAmount({
    input: entry.balance,
    decimals: DECIMALS,
    digits: DIGITS,
    showLastNonZeroDecimal: false,
    addCommas: false
  });
  return {
    timestamp: entry.timestamp,
    value
  };
};

export const getNormalizedTimeEntries = (
  data: AccountBalanceHistoryType[],
  frequency: unitOfTime.DurationConstructor
): any[] => {
  const normalizedEntries: { [key: string]: any } = {};
  for (const entry of [...data]) {
    const identifier = getMoment(entry.timestamp)
      .startOf(frequency)
      .format('X');
    normalizedEntries[identifier] = formatEntry(entry);
  }
  return Object.values(normalizedEntries);
};

export const getChartBinnedData = (data: AccountBalanceHistoryType[]) => {
  const frequency = getFrequency(data);
  const normalizedEntries = getNormalizedTimeEntries(data, frequency);

  const intervalDates = getIntervalDates(
    normalizedEntries[0].timestamp,
    normalizedEntries[normalizedEntries.length - 1].timestamp,
    frequency
  );

  const binnedData: {
    [key: number]: ChartDataType;
  } = {};

  for (const date of intervalDates) {
    binnedData[date] = {
      timestamp: Number(moment.unix(date).format('X')),
      value: ''
    };
  }

  for (const entry of normalizedEntries) {
    binnedData[entry.timestamp] = entry;
  }

  let previousEntry;
  const chartBinnedData: ChartDataType[] = [];
  for (const normalizedEntry of Object.values(binnedData)) {
    if (normalizedEntry?.value) {
      chartBinnedData.push(normalizedEntry);
      previousEntry = normalizedEntry;
    } else if (previousEntry?.value) {
      chartBinnedData.push({
        ...normalizedEntry,
        value: previousEntry.value,
        isBinnedData: true
      });
    }
  }

  return chartBinnedData;
};
