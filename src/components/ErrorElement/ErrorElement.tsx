import { useLocation, useRouteError } from 'react-router-dom';
import { PageState } from 'components';
import { analytics } from 'helpers';
import { useGetHrp } from 'hooks';
import { faTimes } from 'icons/regular';

export const ErrorElement = () => {
  const explorerVersion = import.meta.env.VITE_APP_CACHE_BUST;

  const { pathname } = useLocation();
  const hrp = useGetHrp();
  const error = useRouteError();

  console.error(error);

  if (explorerVersion !== undefined) {
    analytics.sendEvent({
      action: 'error-encountered',
      label: pathname,
      explorerVersion,
      hrp
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
