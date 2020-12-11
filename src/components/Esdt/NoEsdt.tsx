import * as React from 'react';
import { faCoins } from '@fortawesome/pro-regular-svg-icons/faCoins';
import { PageState } from 'sharedComponents';

export default function NoEsdt() {
  return <PageState icon={faCoins} title="No ESDT" className="py-spacer my-auto" />;
}
