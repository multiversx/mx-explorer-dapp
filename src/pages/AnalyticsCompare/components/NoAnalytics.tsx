import React from 'react';
import { faChartBar } from '@fortawesome/pro-regular-svg-icons/faChartBar';

import { PageState } from 'components';

export const NoAnalytics = () => {
  return (
    <PageState
      icon={faChartBar}
      title='No Analytics Charts'
      className='py-spacer my-auto'
    />
  );
};
