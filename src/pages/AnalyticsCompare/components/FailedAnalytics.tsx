import { PageState } from 'components';
import { faChartBar } from 'icons/regular';

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
