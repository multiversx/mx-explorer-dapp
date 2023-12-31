import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { PageState } from 'components';
import { faSpinnerThird } from 'icons/regular';

export const Loader = ({
  dataTestId = 'loader',
  small = false,
  noText = false
}: {
  dataTestId?: string;
  small?: boolean;
  noText?: boolean;
}) => {
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
      dataTestId={dataTestId}
      titleClassName={noText ? 'mt-0' : ''}
      className={`loader d-flex h-100 align-items-center justify-content-center ${
        small ? 'page-state-sm' : 'py-spacer my-auto'
      }`}
    />
  );
};
