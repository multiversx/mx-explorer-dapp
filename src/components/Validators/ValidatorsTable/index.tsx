import { faCogs } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useGlobalState } from 'context';
import React from 'react';
import { populateValidatorsTable } from './../helpers/validatorHelpers';
import { Loader } from 'sharedComponents';
import ShardsList from './../ShardsList';
import Table from './Table';
import useSetValidatorsData from './../useSetValidatorsData';

interface ValidatorsTableType {
  success: boolean;
  validatorData: ReturnType<typeof populateValidatorsTable>;
  validatorDetails: boolean | undefined;
}

const ValidatorsTable = () => {
  const {
    activeTestnet: { validatorDetails },
    validatorData,
  } = useGlobalState();
  const success = useSetValidatorsData();

  return (
    <div>
      <div className="container pt-3 pb-3">
        <div className="row">
          <div className="col-12">
            <h4 data-testid="title">{'Validators'}</h4>
          </div>
        </div>
        {success ? (
          <>
            {validatorData.validatorsAndObservers.length > 0 ? (
              <>
                <ShardsList shardData={validatorData.shardData} />
                <Table {...validatorData} validatorDetails={validatorDetails || false} />
                )}
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
