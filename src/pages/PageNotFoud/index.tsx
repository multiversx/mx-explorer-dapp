import * as React from 'react';
import { useLocation } from 'react-router-dom';
import { faTimes } from '@fortawesome/pro-regular-svg-icons/faTimes';
import { PageState } from 'sharedComponents';
import { analytics } from 'helpers';

const PageNotFound = () => {
  const { pathname } = useLocation();
  const explorerVersion = process.env.REACT_APP_CACHE_BUST;

  if (explorerVersion !== undefined) {
    analytics.sendEvent({ action: 'page-not-found', label: pathname, explorerVersion });
  }

  return (
    <PageState
      icon={faTimes}
      title="Page not found"
      description={
        <div className="px-spacer">
          <span className="text-break-all">{pathname}</span>
        </div>
      }
      className="py-spacer m-auto"
      dataTestId="errorScreen"
    />
  );
};

export default PageNotFound;
