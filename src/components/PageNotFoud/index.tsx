import * as React from 'react';
import { useLocation } from 'react-router-dom';
import { faTimes } from '@fortawesome/pro-regular-svg-icons/faTimes';
import { PageState } from 'sharedComponents';

const PageNotFound = () => {
  const { pathname } = useLocation();
  return (
    <div className="container py-spacer">
      <div className="row">
        <div className="col-12">
          <div className="card card-small">
            <div className="card-body">
              <PageState
                icon={faTimes}
                title="Page not found"
                description={pathname}
                className="py-spacer d-flex h-100 align-items-center justify-content-center"
                dataTestId="errorScreen"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PageNotFound;
