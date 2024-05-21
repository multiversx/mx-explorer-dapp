import { useLocation, useRouteError } from 'react-router-dom';
import { PageState } from 'components';
import { analytics } from 'helpers';
import { faTimes } from 'icons/regular';

export const ErrorElement = () => {
  const { pathname } = useLocation();
  const explorerVersion = process.env.VITE_APP_CACHE_BUST;
  const error = useRouteError();
  console.error(error);

  if (explorerVersion !== undefined) {
    analytics.sendEvent({
      action: 'error-encountered',
      label: pathname,
      explorerVersion
    });
  }

  return (
    <PageState
      icon={faTimes}
      title='Unexpected Error'
      description={
        <div className='px-spacer'>
          <div className='text-break-all text-neutral-500'>
            Something went wrong. We are looking into the incident.
          </div>
          <button
            className='btn btn-sm btn-primary mx-auto mt-spacer'
            onClick={() => {
              window.location.reload();
            }}
          >
            Reload
          </button>
        </div>
      }
      isError
    />
  );
};
