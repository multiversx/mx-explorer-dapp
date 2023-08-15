import React from 'react';
import { faChartBar } from 'icons/regular';

import { PageState } from 'components';

export const FailedAnalytics = () => {
  return (
    <PageState
      icon={faChartBar}
      title='Unable to load Analytics Details'
      className='py-spacer my-auto'
      dataTestId='errorScreen'
    />
  );
};
