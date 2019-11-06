import * as React from 'react';
import { useParams } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import { Highlights } from './../../sharedComponents';

const EmptySearch = () => {
  let { query } = useParams();

  return (
    <>
      <Highlights />
      <div className="container pt-3 pb-3">
        <div className="row">
          <div className="col-12">
            <div className="card">
              <div className="card-body card-details">
                <div className="empty">
                  <FontAwesomeIcon icon={faSearch} className="empty-icon" />
                  <span className="h4 empty-heading">
                    Your hash does not match anything we've got
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
