import * as React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export const CardItem = ({
  children,
  title,
  icon,
  customIcon,
  className = ''
}: {
  children: React.ReactNode;
  title: string;
  icon?: any;
  customIcon?: React.ReactNode;
  className?: string;
}) => (
  <div className={`card-item px-2 py-3 d-flex align-items-center ${className}`}>
    <div className='card-item-icon flex-shrink-0 me-3'>
      {icon && <FontAwesomeIcon icon={icon} />}
      {customIcon && <>{customIcon}</>}
    </div>

    <div className='min-w-0 w-100'>
      <div className='card-item-title text-neutral-300'>{title}</div>
      <div className='card-item-value d-flex flex-row flex-nowrap'>
        {children}
      </div>
    </div>
  </div>
);
