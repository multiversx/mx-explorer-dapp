import React from 'react';
import { useLocation, useParams } from 'react-router-dom';
import { useGlobalState, useGlobalDispatch } from 'context';
import {
  getValidatorsHeartbeat,
  getValidatorStatistics,
  getBrandData,
} from './helpers/asyncRequests';
import { populateValidatorsTable } from './helpers/validatorHelpers';
import { StateType } from './ValidatorsTable';
import ValidatorSwitch from './ValidatorSwitch';
import { validatorsRoutes } from 'routes';
import { ValidatorType as StateValidatorType } from 'context/validators';

export type ValidatorType = StateValidatorType;

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
    activeTestnet: { nodeUrl, validatorDetails, versionNumber, nrOfShards },
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
      const validatorData = populateValidatorsTable({
        data,
        metaChainShardId,
        statistics,
        versionNumber,
        nrOfShards,
      });
      if (ref.current !== null) {
        dispatch({ type: 'setValidatorData', validatorData });
        const { data: brandData } = brand;
        if (brandData.length > 0) {
          dispatch({ type: 'setBrandData', brandData });
        }
        setSuccess(success && validatorsSuccess);
      }
    });
  };

  const showNodes = pathname.endsWith(validatorsRoutes.nodes);

  React.useEffect(getData, [nodeUrl, timeout]);

  let validator: ValidatorType | undefined;
  if (hash) {
    validator = validatorData.validatorsAndObservers.find(v => v.publicKey === hash);
    if (validator === undefined && validatorData.validatorsAndObservers.length > 0) {
      validator = { peerType: 'observer' } as any;
    }
  }

  const props = {
    validator,
    hash,
    success,
    validatorData,
    showNodes,
    validatorDetails,
    brandData,
  };

  return (
    <div ref={ref}>
      <ValidatorSwitch {...props} />
    </div>
  );
};

export default Validators;
