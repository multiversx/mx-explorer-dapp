import { faSearch } from '@fortawesome/pro-regular-svg-icons/faSearch';
import * as React from 'react';
import { useParams } from 'react-router-dom';
import { PageState } from 'sharedComponents';

const EmptySearch = () => {
  const { query } = useParams() as any;

  return (
    <>
      <div className="container py-spacer">
        <div className="row">
          <div className="col-12">
            <div className="card card-small">
              <div className="card-body">
                <PageState
                  icon={faSearch}
                  title="Your search does not match anything we've got"
                  description={query}
                  className="py-spacer d-flex h-100 align-items-center justify-content-center"
                  dataTestId="errorScreen"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default EmptySearch;
