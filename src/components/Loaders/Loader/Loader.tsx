import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import classNames from 'classnames';

import { PageState } from 'components';
import { faSpinnerThird } from 'icons/regular';
import { WithClassnameType } from 'types';

export interface LoaderUIType extends WithClassnameType {
  small?: boolean;
  noText?: boolean;
}

export const Loader = ({
  small = false,
  noText = false,
  className,
  'data-testid': dataTestId = 'loader'
}: LoaderUIType) => {
  return (
    <PageState
      title={noText ? '' : 'Loading...'}
      symbol={
        <FontAwesomeIcon
          icon={faSpinnerThird}
          size={small ? '3x' : '5x'}
          className='text-primary fa-spin fast-spin'
        />
      }
      data-testid={dataTestId}
      titleClassName={noText ? 'mt-0' : ''}
      className={classNames(
        'loader d-flex h-100 align-items-center justify-content-center',
        { 'page-state-sm': small },
        { 'py-spacer my-auto': !small },
        className
      )}
    />
  );
};
