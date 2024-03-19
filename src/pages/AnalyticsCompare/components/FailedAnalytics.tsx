import { PageState } from 'components';
import { faChartBar } from 'icons/regular';

export const FailedAnalytics = () => {
  return (
    <PageState
      icon={faChartBar}
      title='Unable to load Analytics Details'
      isError
    />
  );
};
