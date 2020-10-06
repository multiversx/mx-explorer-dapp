import { faCogs } from '@fortawesome/pro-solid-svg-icons/faCogs';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import { useGlobalState } from 'context';
import useSetValidatorsData from './useSetValidatorsData';
import { Loader } from 'sharedComponents';
import ShardsList from './ShardsList';

const ValidatorsTable = ({ children }: { children: React.ReactNode }) => {
  const ref = React.useRef(null);
  const { validatorData, brandData } = useGlobalState();
  const success = useSetValidatorsData(ref);

  return (
    <div ref={ref}>
      <div className="container pt-3 pb-3">
        <div className="row">
          <div className="col-12">
            <h4 data-testid="title">Validators</h4>
          </div>
        </div>
        {success ? (
          <>
            {brandData.length > 0 ? (
              <>
                <ShardsList shardData={validatorData.shardData} />
                {children}
              </>
            ) : (
              <Loader />
            )}
          </>
        ) : (
          <div className="card">
            <div className="card-body card-details" data-testid="errorScreen">
              <div className="empty">
                <FontAwesomeIcon icon={faCogs} className="empty-icon" />
                <span className="h4 empty-heading">Unable to load validators</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ValidatorsTable;
