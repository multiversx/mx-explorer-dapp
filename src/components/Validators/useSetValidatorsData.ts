import React from 'react';
import { useGlobalState, useGlobalDispatch } from 'context';
import {
  getValidatorsHeartbeat,
  getValidatorStatistics,
  getBrandData,
} from './helpers/asyncRequests';
import { populateValidatorsTable } from './helpers/validatorHelpers';

export default function useSetValidatorsData() {
  const {
    activeTestnet: { nodeUrl, versionNumber, nrOfShards },
    timeout,
    config: { metaChainShardId, explorerApi },
  } = useGlobalState();
  const dispatch = useGlobalDispatch();

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
      dispatch({ type: 'setValidatorData', validatorData });
      const { data: brandData } = brand;
      if (brandData.length > 0) {
        dispatch({ type: 'setBrandData', brandData });
      }
      setSuccess(success && validatorsSuccess);
    });
  };

  React.useEffect(getData, [nodeUrl, timeout]);

  return success;
}
