import { faSearch } from '@fortawesome/pro-regular-svg-icons/faSearch';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import * as React from 'react';
import { useParams } from 'react-router-dom';

const EmptySearch = () => {
  const { query } = useParams() as any;

  return (
    <>
      <div className="container pt-3 pb-3">
        <div className="row">
          <div className="col-12">
            <div className="card">
              <div className="card-body card-details">
                <div className="empty">
                  <FontAwesomeIcon icon={faSearch} className="empty-icon" />
                  <span className="h4 empty-heading">
                    Your search does not match anything we've got
                  </span>
                  <span className="empty-details">{query}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default EmptySearch;
