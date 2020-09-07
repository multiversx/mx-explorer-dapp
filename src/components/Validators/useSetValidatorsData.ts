import React from 'react';
import { useGlobalState, useGlobalDispatch } from 'context';
import {
  getValidatorsHeartbeat,
  getValidatorStatistics,
  getBrandData,
} from './helpers/asyncRequests';
import { populateValidatorsTable } from './helpers/validatorHelpers';

export default function useSetValidatorsData(ref: React.RefObject<HTMLInputElement>) {
  const {
    activeNetwork: { apiUrl, proxyUrl, versionNumber, nrOfShards },
    activeNetworkId,
    timeout,
    config: { metaChainShardId, explorerApi },
    validatorData: configValidatorData,
    brandData: configBrandData,
  } = useGlobalState();
  const dispatch = useGlobalDispatch();

  const [success, setSuccess] = React.useState(true);

  const getData = () => {
    // TODO: move logic on server
    const nodeUrl = apiUrl || proxyUrl || '';
    Promise.all([
      getValidatorsHeartbeat({
        nodeUrl: apiUrl || proxyUrl || '',
        timeout: Math.max(timeout, 30000),
      }),
      getValidatorStatistics({ nodeUrl, timeout: Math.max(timeout, 30000) }),
      getBrandData({ explorerApi, timeout: Math.max(timeout, 30000) }),
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
      if (ref.current) {
        const { data: brandData } = brand;
        if (validatorData.validatorsAndObservers.length > 0 && brandData.length > 0) {
          dispatch({ type: 'setValidatorData', validatorData });
          dispatch({ type: 'setBrandData', brandData });
        } else if (
          configValidatorData.validatorsAndObservers.length === 0 &&
          configBrandData.length === 0
        ) {
          setSuccess(success && validatorsSuccess);
        }
      }
    });
  };

  React.useEffect(getData, [activeNetworkId, timeout]);

  return success;
}
