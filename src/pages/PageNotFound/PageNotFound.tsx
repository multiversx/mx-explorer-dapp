import React from 'react';
import { faTimes } from '@fortawesome/pro-regular-svg-icons';
import { useLocation } from 'react-router-dom';
import { PageState } from 'components';
import { analytics } from 'helpers';

export const PageNotFound = () => {
  const { pathname } = useLocation();
  const explorerVersion = process.env.VITE_APP_CACHE_BUST;

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
      title='Page not found'
      description={
        <div className='px-spacer'>
          <span className='text-break-all'>{pathname}</span>
        </div>
      }
      className='py-spacer m-auto'
      dataTestId='errorScreen'
    />
  );
};
