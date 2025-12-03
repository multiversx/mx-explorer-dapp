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
          const coord = [0, date.getDay() * VERTICAL_OFFSET] as Coordinate;
          const color = generateCountColor(
            count,
            emptyColor,
            baseColor,
            scaleFactor
          );

          return renderDay(index, coord, color);
        })}
      </g>
    );
  };

  const renderDay = (key: number, coord: Coordinate, color: string) => {
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
        fill={color}
      />
    );
  };

  return (
    <svg viewBox='0 0 686 32' className={className} style={style}>
      <g>{renderYear(startDate)}</g>
    </svg>
  );
};
