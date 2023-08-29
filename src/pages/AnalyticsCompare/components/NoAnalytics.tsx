import { PageState } from 'components';
import { faChartBar } from 'icons/regular';

export const NoAnalytics = () => {
  return (
    <PageState
      icon={faChartBar}
      title='No Analytics Charts'
      className='py-spacer my-auto'
    />
  );
};
