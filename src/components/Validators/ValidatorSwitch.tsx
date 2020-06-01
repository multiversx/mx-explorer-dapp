import { faCogs } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useMemo } from 'react';
import { populateValidatorsTable } from './helpers/validatorHelpers';
import { Loader } from 'sharedComponents';
import ShardsList from './ShardsList';
import ValidatorsTable from './ValidatorsTable';
import ValidatorsBrandTable, { BrandDataType } from './ValidatorsBrandTable';
import ValidatorDetails from './ValidatorDetails';
import { ValidatorType } from './';

interface ValidatorSwitchType {
  validator: ValidatorType | undefined;
  hash: string | undefined;
  success: boolean;
  validatorData: ReturnType<typeof populateValidatorsTable>;
  showNodes: boolean;
  validatorDetails: boolean | undefined;
  brandData: BrandDataType[];
}

const ValidatorSwitch = ({
  validator,
  hash,
  success,
  validatorData,
  showNodes,
  validatorDetails,
  brandData,
}: ValidatorSwitchType) => {
  return useMemo(() => {
    return (
      <>
        {validator !== undefined ? (
          <ValidatorDetails validator={validator} />
        ) : (
          <div>
            <div className="container pt-3 pb-3">
              <div className="row">
                <div className="col-12">
                  <h4 data-testid="title">{hash ? 'Node Information' : 'Validators'}</h4>
                </div>
              </div>
              {success ? (
                <>
                  {validatorData.validatorsAndObservers.length > 0 && brandData.length > 0 ? (
                    <>
                      <ShardsList shardData={validatorData.shardData} />

                      {showNodes ? (
                        <ValidatorsTable
                          {...validatorData}
                          validatorDetails={validatorDetails || false}
                        />
                      ) : (
                        <ValidatorsBrandTable
                          allValidators={validatorData.validators}
                          brandData={brandData}
                        />
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
        )}
      </>
    );
  }, [success, validatorData, showNodes, brandData, validator]);
};

export default ValidatorSwitch;
