import * as React from 'react';
import { faExchangeAlt } from '@fortawesome/pro-regular-svg-icons/faExchangeAlt';
import { PageState } from 'sharedComponents';

export default function NoBlocks({ title }: { title?: string }) {
  return (
    <PageState
      icon={faExchangeAlt}
      title={title ? title : 'No blocks'}
      className="py-spacer my-auto"
    />
  );
}
