import { DateWithCountType, MonthMap } from '../heatmap.types';

function normalizeUtcDate(d: Date): Date {
  return new Date(
    Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate())
  );
}

function getUTCDateKey(date: Date) {
  return `${date.getUTCFullYear()}-${
    date.getUTCMonth() + 1
  }-${date.getUTCDate()}`;
}

function daysInYear(date: Date) {
  const year = date.getUTCFullYear();

  const start = new Date(Date.UTC(year, 0, 1)).valueOf();
  const end = new Date(Date.UTC(year + 1, 0, 1)).valueOf();

  const msInDay = 24 * 60 * 60 * 1000;

  return (end - start) / msInDay;
}

export function getPercentileHeatLevel(
  count: number,
  values: DateWithCountType[]
) {
  if (!count) {
    return 0;
  }

  const sortedCounts = values.map((d) => d.count).sort();
  const index = sortedCounts.indexOf(count);
  const percentile = index / sortedCounts.length;

  if (percentile < 0.2) return 1;
  if (percentile < 0.4) return 2;
  if (percentile < 0.6) return 3;
  if (percentile < 0.8) return 4;
  return 5;
}

function groupWeeksByMonth(weeks: DateWithCountType[][]) {
  return weeks.reduce<MonthMap>((acc, week) => {
    if (week.length === 0) return acc;

    const firstDay = new Date(week[0].date);

    const monthName = firstDay.toLocaleString('en-US', {
      month: 'long'
    });

    if (!acc[monthName]) {
      acc[monthName] = [];
    }

    acc[monthName].push(week);

    return acc;
  }, {});
}

export function groupWeeksByMonthOrdered(weeks: DateWithCountType[][]) {
  const map = groupWeeksByMonth(weeks);

  return Object.entries(map).map(([month, weeks]) => ({
    month,
    weeks
  }));
}

export function generateDays(
  startDate: Date,
  values: DateWithCountType[]
): DateWithCountType[] {
  const days = [] as DateWithCountType[];
  const daysInStartDateYear = daysInYear(startDate);

  for (let i = 0; i < daysInStartDateYear; i++) {
    const currentDate = new Date(startDate);
    const date = {
      date: normalizeUtcDate(
        new Date(currentDate.setUTCDate(currentDate.getUTCDate() + i))
      ),
      count: 0
    };
    days.push(date);
  }

  for (const value of values) {
    const { date, count } = value;

    const index = days.findIndex(
      (day) => getUTCDateKey(day.date) === getUTCDateKey(date)
    );

    if (index !== -1) {
      const day = days[index];
      days[index] = { ...day, count };
    }
  }

  return days;
}

export function generateWeeks(
  days: DateWithCountType[]
): DateWithCountType[][] {
  const normalized = days
    .map((d) => ({
      date: normalizeUtcDate(new Date(d.date)),
      count: d.count
    }))
    .sort((a, b) => a.date.valueOf() - b.date.valueOf());

  const weeks = [] as DateWithCountType[][];
  let currentWeek = [] as DateWithCountType[];

  for (const day of normalized) {
    currentWeek.push(day);

    // Sunday = end of week (UTC)
    if (day.date.getUTCDay() === 0) {
      weeks.push(currentWeek);
      currentWeek = [];
    }
  }

  if (currentWeek.length > 0) {
    weeks.push(currentWeek);
  }

  return weeks;
}
