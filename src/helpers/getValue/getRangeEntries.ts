import { formatTimestamp } from 'helpers/formatValue';
import { ChartDataType, ChartResolutionRangeType } from 'types';
import { getRangeDays } from './getRangeDays';

const MS_IN_DAY = 24 * 60 * 60 * 1000;

const normalizeUtcDate = (timestamp: number) => {
  const date = new Date(timestamp);

  return Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate());
};

export const getRangeEntries = ({
  entries,
  range
}: {
  entries: ChartDataType[];
  range: ChartResolutionRangeType;
}) => {
  if (range === 'all') {
    return entries;
  }

  const endDay = normalizeUtcDate(Date.now());
  const startDay = endDay - (getRangeDays(range) - 1) * MS_IN_DAY;

  const entriesByDay = new Map<number, ChartDataType>();

  for (const entry of entries) {
    const day = normalizeUtcDate(formatTimestamp(entry.timestamp));

    if (day >= startDay && day <= endDay) {
      entriesByDay.set(day, entry);
    }
  }

  if (entriesByDay.size === 0) {
    return [];
  }

  const rangeEntries = [] as ChartDataType[];

  for (let timestamp = startDay; timestamp <= endDay; timestamp += MS_IN_DAY) {
    const entry = entriesByDay.get(timestamp);

    rangeEntries.push(
      entry ? { ...entry, timestamp } : { timestamp, value: 0 }
    );
  }

  return rangeEntries;
};
