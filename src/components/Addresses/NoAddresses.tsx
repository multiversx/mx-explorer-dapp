import * as React from 'react';
import { faUser } from '@fortawesome/pro-regular-svg-icons/faUser';
import { PageState } from 'sharedComponents';

export default function NoAddresses() {
  return <PageState icon={faUser} title="No addresses" className="py-spacer my-auto" />;
}
