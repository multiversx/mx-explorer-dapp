import * as React from 'react';
import { faInfoCircle } from '@fortawesome/pro-regular-svg-icons/faInfoCircle';

import IconState from './../IconState';

interface BasicPageStateType {
  title?: string;
  className?: string;
  description?: string | React.ReactNode;
  action?: React.ReactNode;
  iconClassName?: string;
  dataTestId?: string;
}

interface PageStateWithIcon extends BasicPageStateType {
  icon: any;
  symbol?: never;
}
interface PageStateWithSymbol extends BasicPageStateType {
  icon?: never;
  symbol: React.ReactNode;
}

type PageStateType = PageStateWithIcon | PageStateWithSymbol;

const PageState = ({
  title,
  description,
  icon,
  action,
  symbol,
  className,
  iconClassName,
  dataTestId,
}: PageStateType) => (
  <div className={`text-center ${className ? className : ''}`} data-testid={dataTestId}>
    <div className="mb-spacer">
      {symbol ? (
        <>{symbol}</>
      ) : (
        <IconState className={iconClassName} icon={icon ? icon : faInfoCircle} />
      )}
      <div className="mt-spacer">
        {title && <p className="h4">{title}</p>}
        {description && <>{description}</>}
      </div>
    </div>
    {action && <div className="d-flex align-items-center flex-column mt-spacer">{action}</div>}
  </div>
);

export default PageState;
