import { object, number, InferType } from 'yup';
import { AdapterFunctionType } from './index';

const schema = object({
  shards: number().required(),
  blocks: number().required(),
  accounts: number().required(),
  transactions: number().required(),
  epoch: number().required(),
  refreshRate: number().required(),
  roundsPassed: number().required(),
  roundsPerEpoch: number().required(),
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
      url: `/stats`,
      timeout,
    });

    const source: InferType<typeof schema> = data;

    schema.validate(source, { strict: true }).catch(({ errors }) => {
      console.error('Stats _source format errors: ', errors);
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
