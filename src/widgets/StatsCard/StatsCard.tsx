import React from 'react';

import { WithClassnameType } from 'types';

export interface StatsCardType extends WithClassnameType {
  title?: string | React.ReactNode;
  value?: string | React.ReactNode;
  neutralColors?: boolean;
  children?: React.ReactNode;
}

export const StatsCard = ({
  title,
  value,
  className,
  neutralColors = false,
  children
}: StatsCardType) => {
  return (
    <div className={`card d-flex flex-grow-1 ${className ?? ''}`}>
      <div className='card-body p-4'>
        {title && <p className='text-neutral-400 mb-0'>{title}</p>}
        {value && (
          <h2
            className={`card-value ${
              neutralColors ? 'text-neutral-300' : 'text-primary'
            }`}
          >
            {value}
          </h2>
        )}
        {children && (
          <p className={`mb-0 ${neutralColors ? '' : 'text-primary-200'}`}>
            {children}
          </p>
        )}
      </div>
    </div>
  );
};