import axios from 'axios';
import { object, number, InferType } from 'yup';
import { NetworkStatusType } from 'helpers/validatorFunctions';

interface GetStatsType {
  elasticUrl: string;
  nodeUrl: string;
  metaChainShardId: number;
  timeout: number;
}

const schema = object({
  averageBlockTxCount: number().nullable(true),
  averageTPS: number().nullable(true),
  blockNumber: number().required(),
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

export async function getStats({ elasticUrl, nodeUrl, metaChainShardId, timeout }: GetStatsType) {
  const data = {};
  try {
    const { data } = await axios.get(`${elasticUrl}/tps/_doc/meta`, { timeout });

    const source: InferType<typeof schema> = data._source;

    schema.validate(source, { strict: true }).catch(({ errors }) => {
      console.error('Meta _source format errors: ', errors);
    });

    const { data: epochData } = await axios.get(`${nodeUrl}/network/status/${metaChainShardId}`, {
      timeout,
    });

    const message: NetworkStatusType = epochData.message;

    const epoch = message.status.erd_epoch_number;
    const roundsPassed = message.status.erd_rounds_passed_in_current_epoch;
    const roundsPerEpoch = message.status.erd_rounds_per_epoch;

    if (!data.found) {
      return {
        data: { ...data, epoch, roundsPassed, roundsPerEpoch },
        success: false,
      };
    }

    return {
      data: { ...source, epoch, roundsPassed, roundsPerEpoch },
      success: true,
    };
  } catch {
    return {
      data,
      success: false,
    };
  }
}
