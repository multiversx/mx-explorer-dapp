import { useLocation } from 'react-router-dom';
import { PageState } from 'components';
import { analytics } from 'helpers';
import { useGetHrp } from 'hooks';
import { faTimes } from 'icons/regular';

export const PageNotFound = () => {
  const explorerVersion = import.meta.env.VITE_APP_CACHE_BUST;

  const { pathname } = useLocation();
  const hrp = useGetHrp();

  if (explorerVersion !== undefined) {
    analytics.sendEvent({
      action: 'page-not-found',
      label: pathname,
      explorerVersion,
      hrp
    });
  }

  return (
    <PageState
      icon={faTimes}
      title='Page Not Found'
      description={
        <div className='px-spacer'>
          <span className='text-break-all'>{pathname}</span>
        </div>
      }
      data-testid='404Screen'
    />
  );
};
