import {
  SQUARE_SIZE,
  SQUARE_RADIUS,
  VERTICAL_OFFSET
} from './heatmap.constants';
import { HeatmapUIType, DateWithCount, Coordinate } from './heatmap.types';
import {
  generateDays,
  generateWeeks,
  generateWeekTransform,
  generateCountColor
} from './helpers/generators';

export const Heatmap = ({
  startDate,
  values,
  emptyColor = [20, 30, 30],
  baseColor = [0, 128, 0],
  scaleFactor = 10,
  className,
  style
}: HeatmapUIType) => {
  const renderYear = (startDate: Date) => {
    const days = generateDays(startDate, values);
    const weeks = generateWeeks(days);

    return weeks.map((week, index) => renderWeekGroup(week, index));
  };

  const renderWeekGroup = (week: DateWithCount[], weekIndex: number) => {
    const transform = generateWeekTransform(weekIndex);

    return (
      <g key={weekIndex} transform={transform}>
        {week.map((day, index) => {
          const { date, count } = day;
          const sundayBasedDay = date.getUTCDay() === 0 ? 7 : date.getUTCDay();
          const coord = [0, sundayBasedDay * VERTICAL_OFFSET] as Coordinate;
          const color = generateCountColor(
            count,
            emptyColor,
            baseColor,
            scaleFactor
          );
          const range = Math.min(0.5, count / 10) * 1000;

          return renderDay(index, coord, color, range);
        })}
      </g>
    );
  };

  const renderDay = (
    key: number,
    coord: Coordinate,
    color: string,
    range: number
  ) => {
    const [x, y] = coord;

    return (
      <rect
        key={key}
        width={SQUARE_SIZE}
        height={SQUARE_SIZE}
        rx={SQUARE_RADIUS}
        ry={SQUARE_RADIUS}
        x={x}
        y={y}
        //className='primary-100'
        fill={`var(--primary-${range})`}
        //  fill={color}
      />
    );
  };

  return (
    <svg viewBox='0 0 686 104' className={className} style={style}>
      <g>{renderYear(startDate)}</g>
    </svg>
  );
};
