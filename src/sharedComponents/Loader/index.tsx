import { faSpinnerThird } from '@fortawesome/pro-regular-svg-icons/faSpinnerThird';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import { PageState } from 'sharedComponents';

const Loader = ({
  dataTestId = 'loader',
  small = false,
}: {
  dataTestId?: string;
  small?: boolean;
}) => {
  return (
    <PageState
      title="Loading..."
      symbol={
        <FontAwesomeIcon
          icon={faSpinnerThird}
          size={small ? '3x' : '5x'}
          className="text-primary fa-spin fast-spin"
        />
      }
      dataTestId={dataTestId}
      className={`d-flex h-100 align-items-center justify-content-center ${
        small ? 'page-state-sm' : 'py-spacer my-auto'
      }`}
    />
  );
};
export default Loader;
