import { useLocation } from 'react-router-dom';
import { PageState } from 'components';
import { analytics } from 'helpers';
import { faTimes } from 'icons/regular';

export const PageNotFound = () => {
  const { pathname } = useLocation();
  const explorerVersion = import.meta.env.VITE_APP_CACHE_BUST;

  if (explorerVersion !== undefined) {
    analytics.sendEvent({
      action: 'page-not-found',
      label: pathname,
      explorerVersion
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
