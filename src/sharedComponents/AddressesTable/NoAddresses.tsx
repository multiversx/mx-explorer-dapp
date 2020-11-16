import * as React from 'react';
import { faExchangeAlt } from '@fortawesome/pro-regular-svg-icons/faExchangeAlt';
import { PageState } from 'sharedComponents';

export default function NoAddresses() {
  return <PageState icon={faExchangeAlt} title={'No addresses'} className="py-spacer my-auto" />;
}
