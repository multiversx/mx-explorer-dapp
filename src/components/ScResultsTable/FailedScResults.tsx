import * as React from 'react';
import { faCode } from '@fortawesome/pro-regular-svg-icons/faCode';
import { PageState } from 'components';

export const FailedScResults = () => {
  return (
    <PageState
      icon={faCode}
      title="Unable to load Smart Contract Results"
      className="py-spacer my-auto"
      dataTestId="errorScreen"
    />
  );
};
