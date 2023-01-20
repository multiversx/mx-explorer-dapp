import * as React from 'react';
import { faCoins } from '@fortawesome/pro-regular-svg-icons/faCoins';
import { PageState } from 'sharedComponents';

export default function NoTokens() {
  return <PageState icon={faCoins} title="No Tokens" className="py-spacer my-auto" />;
}
