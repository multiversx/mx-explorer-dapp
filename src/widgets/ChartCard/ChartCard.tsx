import { ReactNode } from 'react';
import classNames from 'classnames';
import { SingleValue } from 'react-select';

import { Select, SelectOptionType } from 'components';
import { StatisticType, WithClassnameType } from 'types';

export interface ChartCardUIType extends WithClassnameType {
  title?: ReactNode;
  value?: ReactNode;
  subtitle?: ReactNode;
  children?: ReactNode;
  filters?: SelectOptionType[];
  defaultFilterValue?: SelectOptionType;
  statistics?: StatisticType[];
  onChange?: (option: SingleValue<SelectOptionType>) => void;
}

export const ChartCard = ({
  title,
  value,
  subtitle,
  children,
  filters = [],
  defaultFilterValue,
  statistics = [],
  onChange,
  className
}: ChartCardUIType) => {
  return (
    <div className={classNames('chart-card', className)}>
      <div className='chart-card-wrapper'>
        <div className='chart-card-left'>
          {title && <div className='chart-card-title'>{title}</div>}
          {value && <div className='chart-card-value'>{value}</div>}
          {subtitle && <div className='chart-card-subtitle'>{subtitle}</div>}
        </div>
        {onChange && (
          <div className='chart-card-right'>
            <Select
              options={filters}
              onChange={onChange}
              defaultValue={defaultFilterValue}
            />
          </div>
        )}
      </div>
      <div className='chart-card-root'>{children}</div>
      <div className='chart-card-statistics'>
        {statistics.map((statistic) => (
          <div className='statistic' key={statistic.label}>
            <div className='label'>{statistic.label}</div>
            <div className='value'>{statistic.value}</div>
          </div>
        ))}
      </div>
    </div>
  );
};
