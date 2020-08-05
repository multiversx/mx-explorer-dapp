import axios from 'axios';
import { object, number, InferType } from 'yup';
import { NetworkStatusType } from 'helpers/validatorFunctions';
import { StateType } from 'context/state';

interface GetStatsType {
  elasticUrl: string;
  nodeUrl: string;
  metaChainShardId: number;
  timeout: number;
  cancelToken: StateType['cancelToken'];
}

const schema = object({
  averageBlockTxCount: number().nullable(true),
  averageTPS: number().nullable(true),
  blockNumber: number().required(),
  blockCount: number(),
  currentBlockNonce: number().required(),
  lastBlockTxCount: number().required(),
  liveTPS: number().required(),
  nrOfNodes: number().required(),
  nrOfShards: number().required(),
  peakTPS: number().required(),
  roundNumber: number().required(),
  roundTime: number().required(),
  shardID: number().required(),
  totalProcessedTxCount: number().required(),
}).required();

export async function getStats({
  elasticUrl,
  nodeUrl,
  metaChainShardId,
  timeout,
  cancelToken,
}: GetStatsType) {
  const data = {};
  try {
    const { data } = await axios.get(`${elasticUrl}/tps/meta`, {
      timeout,
      ...(cancelToken ? { cancelToken: cancelToken.token } : {}),
    });
    let dataValid = true;

    const source: InferType<typeof schema> = data;

    schema.validate(source, { strict: true }).catch(({ errors }) => {
      dataValid = false;
      console.error('Meta _source format errors: ', errors);
    });

    const {
      data: { data: epochData, code, error },
    } = await axios.get(`${nodeUrl}/network/status/${metaChainShardId}`, {
      timeout,
    });
    if (code === 'successful') {
      const message: NetworkStatusType = epochData;

      const epoch = message.status.erd_epoch_number;
      const roundsPassed = message.status.erd_rounds_passed_in_current_epoch;
      const roundsPerEpoch = message.status.erd_rounds_per_epoch;

      if (!dataValid) {
        return {
          data: { ...data, epoch, roundsPassed, roundsPerEpoch },
          success: false,
        };
      }

      return {
        data: { ...source, epoch, roundsPassed, roundsPerEpoch },
        success: true,
      };
    } else {
      throw new Error(error);
    }
  } catch {
    return {
      data,
      success: false,
    };
  }
}
