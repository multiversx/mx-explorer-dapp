import moment from 'moment';

import { Overlay } from 'components/Overlay';
import { formatBigNumber, getStringPlural } from 'helpers';

import { HeatmapUIType, DateWithCountType } from './heatmap.types';
import {
  generateDays,
  generateWeeks,
  getPercentileHeatLevel,
  groupWeeksByMonthOrdered
} from './helpers/generators';

export const Heatmap = ({ startDate, values }: HeatmapUIType) => {
  const renderYear = (startDate: Date) => {
    const days = generateDays(startDate, values);
    const weeks = generateWeeks(days);
    const months = groupWeeksByMonthOrdered(weeks);

    return months.map((month, index) => {
      return (
        <div key={index} className='month'>
          <div className='m-label'>{month.month}</div>
          <div className='m'>
            {month.weeks.map((week, index) => renderWeekGroup(week, index))}
          </div>
        </div>
      );
    });
  };

  const renderWeekGroup = (week: DateWithCountType[], weekIndex: number) => {
    return (
      <div key={weekIndex} className='w'>
        {week.map((day, index) => {
          const { count } = day;
          const heat = getPercentileHeatLevel(count, values);
          return renderDay({ index, day, heat });
        })}
      </div>
    );
  };

  const renderDay = ({
    index,
    heat,
    day
  }: {
    index: number;
    heat: number;
    day: DateWithCountType;
  }) => {
    const { date, count } = day;
    const dateString = moment.utc(date).format('ddd, MMM DD, YYYY');

    return (
      <Overlay
        title={
          <>
            {formatBigNumber({ value: count })}{' '}
            {getStringPlural(count, { string: 'transaction' })} on {dateString}
          </>
        }
        key={index}
        className={`d heat-${heat}`}
      ></Overlay>
    );
  };

  return (
    <div className='heatmap'>
      <div className='y'>
        <div className='w-label'>
          <span>Mon</span>
          <span></span>
          <span>Wed</span>
          <span></span>
          <span>Fri</span>
          <span></span>
          <span>Sun</span>
        </div>
        {renderYear(startDate)}
      </div>
      <div className='ms-auto d-flex gap-2 flex-nowrap mt-3'>
        <span>Less</span>
        <div className='d-flex gap-1 y'>
          {[...Array(6).keys()].map((i) => (
            <div className={`d heat-${i}`} key={i}></div>
          ))}
        </div>
        <span>More</span>
      </div>
    </div>
  );
};
