import React, { ReactElement } from 'react';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const ChartHeading = ({
  title,
  icon,
  svgIcon,
  iconClass,
  children,
}: {
  title?: string;
  icon?: IconProp;
  svgIcon?: ReactElement;
  iconClass?: string;
  children?: React.ReactNode;
}) => (
  <div className="chart-heading card-header">
    <div className="card-header-item d-flex align-items-center">
      {icon && (
        <FontAwesomeIcon icon={icon} className={`chart-icon mr-3 ${iconClass ? iconClass : ''}`} />
      )}
      {svgIcon && svgIcon}
      {title && <h6 className="title mb-0">{title}</h6>}

      {children}
    </div>
  </div>
);

export default ChartHeading;
