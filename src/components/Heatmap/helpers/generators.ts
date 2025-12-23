import { ChartDataType } from 'types';
import { MonthMap } from '../heatmap.types';

const normalizeUtcDate = (timestamp: number) => {
  const date = new Date(timestamp);
  return new Date(
    Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate())
  ).valueOf();
};

const getUTCDateKey = (timestamp: number) => {
  const date = new Date(timestamp);
  return `${date.getUTCFullYear()}-${
    date.getUTCMonth() + 1
  }-${date.getUTCDate()}`;
};

const daysInYear = (timestamp: number) => {
  const date = new Date(timestamp);
  const year = date.getUTCFullYear();

  const start = new Date(Date.UTC(year, 0, 1)).valueOf();
  const end = new Date(Date.UTC(year + 1, 0, 1)).valueOf();

  const msInDay = 24 * 60 * 60 * 1000;

  return (end - start) / msInDay;
};

export const getPercentileHeatLevel = (
  value: number | string,
  values: ChartDataType[]
) => {
  const count = Number(value);
  if (!count) {
    return 0;
  }

  const sortedCounts = values.map((d) => Number(d.value)).sort();
  const index = sortedCounts.indexOf(count);
  const percentile = index / sortedCounts.length;

  if (percentile < 0.2) return 1;
  if (percentile < 0.4) return 2;
  if (percentile < 0.6) return 3;
  if (percentile < 0.8) return 4;
  return 5;
};

const groupWeeksByMonth = (weeks: ChartDataType[][]) => {
  return weeks.reduce<MonthMap>((acc, week) => {
    if (week.length === 0) return acc;

    const firstDay = new Date(week[0].timestamp);

    const monthName = firstDay.toLocaleString('en-US', {
      month: 'long'
    });

    if (!acc[monthName]) {
      acc[monthName] = [];
    }

    acc[monthName].push(week);

    return acc;
  }, {});
};

export const groupWeeksByMonthOrdered = (weeks: ChartDataType[][]) => {
  const map = groupWeeksByMonth(weeks);

  return Object.entries(map).map(([month, weeks]) => ({
    month,
    weeks
  }));
};

export const generateDays = (
  startTimestamp: number,
  entries: ChartDataType[]
) => {
  const days = [] as ChartDataType[];
  const daysInStartDateYear = daysInYear(startTimestamp);

  for (let i = 0; i < daysInStartDateYear; i++) {
    const currentDate = new Date(startTimestamp);
    const date = {
      timestamp: normalizeUtcDate(
        new Date(currentDate.setUTCDate(currentDate.getUTCDate() + i)).valueOf()
      ),
      value: 0
    };
    days.push(date);
  }

  for (const entry of entries) {
    const { timestamp, value } = entry;

    const index = days.findIndex(
      (day) => getUTCDateKey(day.timestamp) === getUTCDateKey(timestamp)
    );

    if (index !== -1) {
      const day = days[index];
      days[index] = { ...day, value };
    }
  }

  return days;
};

export const generateWeeks = (days: ChartDataType[]) => {
  const normalized = days
    .map((d) => ({
      timestamp: normalizeUtcDate(d.timestamp),
      value: d.value
    }))
    .sort((a, b) => a.timestamp - b.timestamp);

  const weeks = [] as ChartDataType[][];
  let currentWeek = [] as ChartDataType[];

  for (const day of normalized) {
    currentWeek.push(day);

    // Sunday = end of week (UTC)
    if (new Date(day.timestamp).getUTCDay() === 0) {
      weeks.push(currentWeek);
      currentWeek = [];
    }
  }

  if (currentWeek.length > 0) {
    weeks.push(currentWeek);
  }

  return weeks;
};
