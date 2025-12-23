import moment from 'moment';

import { Overlay } from 'components';
import { formatBigNumber, getStringPlural } from 'helpers';
import { ChartDataType } from 'types';

import { HeatmapUIType } from './heatmap.types';
import {
  generateDays,
  generateWeeks,
  getPercentileHeatLevel,
  groupWeeksByMonthOrdered
} from './helpers/generators';

export const Heatmap = ({ startDate, values }: HeatmapUIType) => {
  const renderYear = (startDate: number) => {
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

  const renderWeekGroup = (week: ChartDataType[], weekIndex: number) => {
    return (
      <div key={weekIndex} className='w'>
        {week.map((day, index) => {
          const { value } = day;
          const heat = getPercentileHeatLevel(value, values);
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
    day: ChartDataType;
  }) => {
    const { timestamp, value } = day;
    const dateString = moment(timestamp).utc().format('ddd, MMM DD, YYYY');

    return (
      <Overlay
        title={
          <>
            {formatBigNumber({ value })}{' '}
            {getStringPlural(value, { string: 'transaction' })} on {dateString}
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
