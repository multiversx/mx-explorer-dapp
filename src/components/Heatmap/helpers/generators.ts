import {
  DAYS_IN_YEAR,
  OUT_OF_BOUNDS_INDEX,
  SQUARE_SIZE,
  HORIZONTAL_OFFSET
} from '../heatmap.constants';
import { RGB, DateWithCount } from '../heatmap.types';

export function generateDays(
  startDate: Date,
  values: DateWithCount[]
): DateWithCount[] {
  const days = [] as DateWithCount[];
  const currentDate = new Date(startDate);

  // Generate year from start date
  for (let i = 0; i < 365; i++) {
    const date = {
      date: new Date(currentDate),
      count: 0
    };

    days.push(date);
    currentDate.setDate(currentDate.getDate() + 1);
  }

  // Merge values into year
  for (const value of values) {
    const { date, count } = value;

    const index = days.findIndex(
      (day) => day.date.getTime() === date.getTime()
    );

    if (index !== -1) {
      const day = days[index];
      days[index] = { ...day, count };
    }
  }

  return days;
}

export function generateWeeks(days: DateWithCount[]): DateWithCount[][] {
  const weeks = [] as DateWithCount[][];
  let currentWeek = [] as DateWithCount[];

  days.forEach((day) => {
    const { date, count } = day;

    currentWeek.push({ date, count });

    // Saturday marks end of week
    if (date.getDay() === 6) {
      weeks.push([...currentWeek]);
      currentWeek = [];
    }
  });

  // Add last week if not complete
  if (currentWeek.length > 0) {
    weeks.push([...currentWeek]);
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

  const sf = Math.min(1, count / scaleFactor);
  const color = baseColor.map((channel) =>
    Math.round(channel + (255 - channel) * sf)
  ) as RGB;

  return convertRGBToString(color);
}
