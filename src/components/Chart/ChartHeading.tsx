import React, { ReactElement } from 'react';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export const ChartHeading = ({
  title,
  icon,
  svgIcon,
  iconClass,
  className,
  children
}: {
  title?: string;
  icon?: IconProp;
  svgIcon?: ReactElement;
  iconClass?: string;
  className?: string;
  children?: React.ReactNode;
}) => (
  <div className={`chart-heading card-header ${className ?? ''}`}>
    <div className='card-header-item d-flex align-items-center'>
      {icon && (
        <FontAwesomeIcon
          icon={icon}
          className={`chart-icon me-3 ${iconClass ? iconClass : ''}`}
        />
      )}
      {svgIcon && svgIcon}
      {title && <h5 className='title mb-0'>{title}</h5>}

      {children}
    </div>
  </div>
);
