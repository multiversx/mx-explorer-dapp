import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

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
      className={`loader d-flex h-100 align-items-center justify-content-center ${
        small ? 'page-state-sm' : 'py-spacer my-auto'
      }`}
    />
  );
};
