import classNames from 'classnames';

import { faInfoCircle } from 'icons/regular';
import { WithClassnameType } from 'types';

import { IconState } from './components/IconState';

interface BasicPageStateType extends WithClassnameType {
  title?: string;
  description?: string | React.ReactNode;
  action?: React.ReactNode;
  iconClassName?: string;
  titleClassName?: string;
  isError?: boolean;
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

export const PageState = ({
  title,
  description,
  icon,
  action,
  symbol,
  iconClassName,
  titleClassName,
  className,
  isError = false,
  'data-testid': dataTestId = ''
}: PageStateType) => (
  <div
    className={classNames('text-center py-spacer my-auto', className)}
    data-testid={dataTestId ?? isError ? 'errorScreen' : ''}
  >
    <div className='my-spacer'>
      {symbol ? (
        <>{symbol}</>
      ) : (
        <IconState
          className={iconClassName}
          icon={icon ? icon : faInfoCircle}
        />
      )}
      <div className={titleClassName ? titleClassName : 'mt-spacer'}>
        {title && <h5>{title}</h5>}
        {description && <>{description}</>}
      </div>
    </div>
    {action && (
      <div className='d-flex align-items-center flex-column mt-spacer'>
        {action}
      </div>
    )}
  </div>
);
