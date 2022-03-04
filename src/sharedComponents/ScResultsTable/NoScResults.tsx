import * as React from 'react';
import { faCode } from '@fortawesome/pro-regular-svg-icons/faCode';
import { PageState } from 'sharedComponents';

export default function NoScResults() {
  return (
    <PageState icon={faCode} title="No Smart Contract Results" className="py-spacer my-auto" />
  );
}
