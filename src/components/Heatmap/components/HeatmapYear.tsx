import { HeatmapWeek } from './HeatmapWeek';

import { HeatmapUIType } from '../heatmap.types';
import {
  generateDays,
  generateWeeks,
  groupWeeksByMonthOrdered
} from '../helpers/generators';

export const HeatmapYear = ({ startDate, values }: HeatmapUIType) => {
  const days = generateDays(startDate, values);
  const weeks = generateWeeks(days);
  const months = groupWeeksByMonthOrdered(weeks);

  return months.map((month, index) => {
    return (
      <div key={index} className='month'>
        <div className='m-label'>{month.month}</div>
        <div className='m'>
          {month.weeks.map((week, index) => (
            <HeatmapWeek key={index} week={week} values={values} />
          ))}
        </div>
      </div>
    );
  });
};
