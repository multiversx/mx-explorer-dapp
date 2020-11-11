import { object, number, InferType } from 'yup';
import { AdapterFunctionType } from './index';

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

export default async function getHighlights({
  provider,
  baseUrl,
  timeout,
}: AdapterFunctionType & {
  metaChainShardId: number;
  proxyUrl: string;
}) {
  try {
    const { data } = await provider({
      baseUrl,
      url: `/tps/meta`,
      timeout,
    });

    const source: InferType<typeof schema> = data;

    schema.validate(source, { strict: true }).catch(({ errors }) => {
      console.error('Meta _source format errors: ', errors);
    });
    return {
      data,
      success: true,
    };
  } catch {
    return {
      success: false,
    };
  }
}
