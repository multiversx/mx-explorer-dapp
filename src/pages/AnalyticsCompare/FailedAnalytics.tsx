import * as React from 'react';
import { faChartBar } from '@fortawesome/pro-regular-svg-icons/faChartBar';
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
