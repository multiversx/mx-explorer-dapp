import * as React from 'react';
import { faCode } from '@fortawesome/pro-regular-svg-icons/faCode';
import { PageState } from 'sharedComponents';

export default function FailedScResults() {
  return (
    <PageState
      icon={faCode}
      title="Unable to load Smart Contract Results"
      className="py-spacer my-auto"
      dataTestId="errorScreen"
    />
  );
}
