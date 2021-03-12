import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import * as React from 'react';

const CardItem = ({
  children,
  title,
  icon,
  customIcon,
  className = '',
}: {
  children: React.ReactNode;
  title: string;
  icon?: any;
  customIcon?: React.ReactNode;
  className?: string;
}) => (
  <div className={`card-item px-2 py-3 d-flex align-items-center ${className}`}>
    <div className="right-angle-icon mr-3">
      {icon && <FontAwesomeIcon icon={icon} />}
      {customIcon && <>{customIcon}</>}
    </div>

    <div className="min-w-0">
      <div className="card-item-title">{title}</div>
      <div className="card-item-value d-flex flex-row flex-nowrap text-secondary">{children}</div>
    </div>
  </div>
);

export default CardItem;
