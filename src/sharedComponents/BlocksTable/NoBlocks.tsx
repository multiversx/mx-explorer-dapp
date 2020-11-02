import * as React from 'react';
import { faExchangeAlt } from '@fortawesome/pro-regular-svg-icons/faExchangeAlt';
import { PageState } from 'sharedComponents';

export default function NoBlocks() {
  return <PageState icon={faExchangeAlt} title="No blocks" className="py-spacer my-auto" />;
}
