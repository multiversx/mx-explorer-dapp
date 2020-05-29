import { faCogs } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useMemo } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import { useGlobalState, useGlobalDispatch } from 'context';
import { Loader } from 'sharedComponents';
import {
  getValidatorsHeartbeat,
  getValidatorStatistics,
  getBrandData,
} from './helpers/asyncRequests';
import { populateValidatorsTable } from './helpers/validatorHelpers';
import ShardsList from './ShardsList';
import ValidatorsTable, { StateType } from './ValidatorsTable';
import ValidatorsBrandTable from './ValidatorsBrandTable';
import ValidatorDetails from './ValidatorDetails';

import { validatorsRouteNames } from 'routes';

export interface ValidatorType {
  computedShardID: number;
  publicKey: string;
  isActive: boolean;
  isValidator: boolean;
  peerType: 'waiting' | 'eligible' | 'observer' | 'new';
  nodeDisplayName: string;
  identity: string;
  receivedShardID: number;
  timeStamp: string;
  totalDownTimeSec: number;
  totalUpTimeSec: number;
  versionNumber: string;
  shardId: string;
  shardNumber: number;
  star: boolean;
  rating: number;
  ratingModifier: number;
}

export const initialState: StateType = {
  shardData: [
    {
      shardID: '',
      status: '',
      allValidators: 0,
      allActiveValidators: 0,
      shardNumber: -1,
    },
  ],
  shardsList: [''],
  validators: [],
  validatorsAndObservers: [],
};

export interface ShardDataType {
  [key: string]: {
    allValidators: number;
    allActiveValidators: number;
    shardNumber: number;
  };
}

const Validators = () => {
  const ref = React.useRef(null);
  const {
    activeTestnet: { nodeUrl, validatorDetails },
    timeout,
    config: { metaChainShardId, explorerApi },
    validatorData,
    brandData,
  } = useGlobalState();
  const dispatch = useGlobalDispatch();
  const { pathname } = useLocation();
  const { hash } = useParams();

  const [success, setSuccess] = React.useState(true);

  const getData = () => {
    Promise.all([
      getValidatorsHeartbeat({
        nodeUrl,
        timeout: Math.max(timeout, 10000),
      }),
      getValidatorStatistics({ nodeUrl, timeout: Math.max(timeout, 10000) }),
      getBrandData({ explorerApi, timeout }),
    ]).then(([getValidatorsDataResponse, validatorStats, brand]) => {
      const { data, success } = getValidatorsDataResponse;
      const { statistics, success: validatorsSuccess } = validatorStats;
      const validatorData = populateValidatorsTable({ data, metaChainShardId, statistics });
      dispatch({ type: 'setValidatorData', validatorData });
      const { data: brandData } = brand;
      dispatch({ type: 'setBrandData', brandData });
      if (ref.current !== null) {
        setSuccess(success && validatorsSuccess);
      }
    });
  };

  const showNodes = pathname.endsWith(validatorsRouteNames.validatorsNodes);

  React.useEffect(getData, [nodeUrl, timeout]);

  return useMemo(
    () => (
      <>
        {hash !== undefined ? (
          <ValidatorDetails validator={validatorData.validators.find(v => v.publicKey === hash)} />
        ) : (
          <div ref={ref}>
            <div className="container pt-3 pb-3">
              <div className="row">
                <div className="col-12">
                  <h4 data-testid="title">Validators</h4>
                </div>
              </div>
              {success ? (
                <>
                  {validatorData.validatorsAndObservers.length > 0 ? (
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
    ),
    [success, validatorDetails, validatorData, showNodes, brandData]
  );
};

export default Validators;
