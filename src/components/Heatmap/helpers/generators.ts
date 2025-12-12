import { SQUARE_SIZE, HORIZONTAL_OFFSET } from '../heatmap.constants';
import { RGB, DateWithCount } from '../heatmap.types';

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

export function generateDays(
  startDate: Date,
  values: DateWithCount[]
): DateWithCount[] {
  const days = [] as DateWithCount[];
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

export function generateWeeks(days: DateWithCount[]): DateWithCount[][] {
  const normalized = days
    .map((d) => ({
      date: normalizeUtcDate(new Date(d.date)),
      count: d.count
    }))
    .sort((a, b) => a.date.valueOf() - b.date.valueOf());

  const weeks = [] as DateWithCount[][];
  let currentWeek = [] as DateWithCount[];

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

export function generateWeekTransform(weekIndex: number): string {
  return `translate(${weekIndex * (SQUARE_SIZE + HORIZONTAL_OFFSET)}, 0)`;
}

function convertRGBToString(rgb: RGB): string {
  return `rgb(${rgb.join(',')})`;
}

export function generateCountColor(
  count: number,
  emptyColor: RGB,
  baseColor: RGB,
  scaleFactor: number
): string {
  if (count === 0) {
    return convertRGBToString(emptyColor);
  }

  // -contribution-default-bgColor-0: #151b23;
  // --contribution-default-bgColor-1: #033a16;
  // --contribution-default-bgColor-2: #196c2e;
  // --contribution-default-bgColor-3: #2ea043;
  // --contribution-default-bgColor-4: #56d364;

  const sf = Math.min(1, count / scaleFactor);

  // Darken: move each channel towards 0
  const color = baseColor.map((channel) =>
    Math.round(channel * (1 - sf))
  ) as RGB;

  return convertRGBToString(color);
}
