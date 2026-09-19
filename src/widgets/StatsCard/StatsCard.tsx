import { ReactNode } from 'react';
import classNames from 'classnames';

import { WithClassnameType } from 'types';

export interface StatsCardUIType extends WithClassnameType {
  title?: ReactNode;
  subTitle?: ReactNode;
  icon?: ReactNode;
  value?: ReactNode;
  children?: ReactNode;
  isAnimated?: boolean;
}

export const StatsCard = ({
  title,
  subTitle,
  value,
  icon,
  className,
  isAnimated,
  children
}: StatsCardUIType) => {
  if (!(title || value || subTitle || children)) {
    return null;
  }

  return (
    <div className={classNames('stats-card card d-flex', className)}>
      <div className='card-body stats-card-body d-flex flex-column p-4'>
        {title && (
          <p className='text-neutral-400 mb-0 stats-card-title'>{title}</p>
        )}
        {value && (
          <h2
            className={classNames('stats-card-value mb-0 text-primary', {
              'has-animation': isAnimated
            })}
          >
            {value}
          </h2>
        )}
        {subTitle && (
          <p className='text-primary-200 mb-0 stats-card-title mt-2'>
            {icon}
            <span className='mx-1'>{subTitle}</span>
          </p>
        )}
        {children && (
          <p
            className={classNames(
              'text-primary-200 d-flex align-items-center stats-card-content',
              {
                'has-animation': isAnimated
              }
            )}
          >
            {children}
          </p>
        )}
      </div>
    </div>
  );
};
