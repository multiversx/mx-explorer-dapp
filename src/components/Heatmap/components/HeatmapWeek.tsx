import { ChartDataType } from 'types';

import { HeatmapDay } from './HeatmapDay';
import { getPercentileHeatLevel } from '../helpers/generators';

export const HeatmapWeek = ({
  values,
  week
}: {
  values: ChartDataType[];
  week: ChartDataType[];
}) => {
  return (
    <div className='w'>
      {week.map((day, index) => {
        const { value } = day;
        const heat = getPercentileHeatLevel(value, values);
        return <HeatmapDay key={index} heat={heat} day={day} />;
      })}
    </div>
  );
};
