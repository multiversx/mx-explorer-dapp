import * as React from 'react';
import { useLocation } from 'react-router-dom';
import { faTimes } from '@fortawesome/pro-regular-svg-icons/faTimes';
import { PageState } from 'sharedComponents';
import { analytics } from 'helpers';

const PageNotFound = () => {
  const { pathname } = useLocation();

  analytics.sendEvent({ action: 'page-not-found', label: pathname });

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
