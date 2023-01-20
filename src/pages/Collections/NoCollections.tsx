import * as React from 'react';
import { faCoins } from '@fortawesome/pro-regular-svg-icons/faCoins';
import { PageState } from 'sharedComponents';

export default function NoCollections() {
  return <PageState icon={faCoins} title="No Collections" className="py-spacer my-auto" />;
}
