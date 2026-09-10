import { HeatmapYear } from './components/HeatmapYear';
import { HeatmapUIType } from './heatmap.types';

export const Heatmap = ({ startDate, values }: HeatmapUIType) => {
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
        <HeatmapYear startDate={startDate} values={values} />
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
