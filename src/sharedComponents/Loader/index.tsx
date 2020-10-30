import { faSpinnerThird } from '@fortawesome/pro-regular-svg-icons/faSpinnerThird';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import { PageState } from 'sharedComponents';

const Loader = ({ dataTestId = 'loader' }: { dataTestId?: string }) => (
  <PageState
    title="Loading..."
    symbol={
      <FontAwesomeIcon icon={faSpinnerThird} size="5x" className="text-primary fa-spin fast-spin" />
    }
    dataTestId={dataTestId}
    className="py-spacer my-auto d-flex h-100 align-items-center justify-content-center"
  />
);
export default Loader;
