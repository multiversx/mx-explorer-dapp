import * as React from 'react';
import { useLocation } from 'react-router-dom';
import { faTimes } from '@fortawesome/pro-regular-svg-icons/faTimes';
import { PageState } from 'sharedComponents';

const PageNotFound = () => {
  const { pathname } = useLocation();
  return (
    <PageState
      icon={faTimes}
      title="Page not found"
      description={pathname}
      className="py-spacer m-auto"
      dataTestId="errorScreen"
    />
  );
};

export default PageNotFound;
