import * as React from 'react';
import { faCoins } from '@fortawesome/pro-regular-svg-icons/faCoins';
import { PageState } from 'components';

export default function NoTokens() {
  return <PageState icon={faCoins} title="No Meta-ESDT Tokens" className="py-spacer my-auto" />;
}
