import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import * as React from 'react';

const CardItem = ({
  children,
  title,
  icon,
  customIcon,
}: {
  children: React.ReactNode;
  title: string;
  icon?: any;
  customIcon?: React.ReactNode;
}) => (
  <div
    className="card-item flex-fill p-2 d-flex align-items-center"
    style={{ maxWidth: '15rem', minWidth: '10rem' }}
  >
    <div className="right-angle-icon mr-2">
      {icon && <FontAwesomeIcon icon={icon} />}
      {customIcon && <>{customIcon}</>}
    </div>

    <div className="card-icon-body min-w-0">
      <div className="card-icon-label">{title}</div>
      <div className="d-flex flex-row flex-nowrap">{children}</div>
    </div>
  </div>
);

export default CardItem;
