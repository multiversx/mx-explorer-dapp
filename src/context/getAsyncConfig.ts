import axios from 'axios';
import { object, string, number, InferType } from 'yup';
import config from './config';

const schema = object({
  message: object({
    config: object({
      erd_chain_id: string(),
      erd_gas_per_data_byte: number(),
      erd_meta_consensus_group_size: number(),
      erd_min_gas_limit: number(),
      erd_min_gas_price: number(),
      erd_num_metachain_nodes: number(),
      erd_num_nodes_in_shard: number(),
      erd_num_shards_without_meta: number(),
      erd_round_duration: number(),
      erd_shard_consensus_group_size: number(),
      erd_start_time: number(),
    }),
  }),
});

export type AsyncConfigType = InferType<typeof schema>;

interface GetAsyncConfigType {
  id: string;
  nodeUrl: string;
  timeout: number;
}

async function getAsyncConfig({ nodeUrl, timeout, id }: GetAsyncConfigType) {
  try {
    const { data } = await axios.get(`${nodeUrl}/network/config`, { timeout });

    schema.validate(data, { strict: true }).catch(({ errors }) => {
      console.error('Async config errors: ', errors);
    });

    const { config } =
      'message' in data
        ? (data.message as AsyncConfigType['message'])
        : (data as AsyncConfigType['message']);

    return {
      id,
      config,
    };
  } catch (err) {
    if (process.env.NODE_ENV === 'production') {
      console.error(`Faild to get config for ${id} testnet`);
    }
    return err;
  }
}

export default async function buildConfig() {
  const testnets = config.testnets.map(({ id, nodeUrl }) => ({
    id,
    nodeUrl,
    timeout: 5 * 1000,
  }));

  const promises = testnets.map(testnet => getAsyncConfig(testnet));
  const results = await Promise.all(promises);
  const asyncData = results.filter(result => !(result instanceof Error));

  const testnetIds = asyncData.map(result => result.id);
  const foundTestnets = config.testnets.filter(t => testnetIds.includes(t.id));

  const configObject = {
    ...config,
    testnets: foundTestnets.map(testnet => {
      const testnetData: any = asyncData.find(entry => entry.id === testnet.id);
      return {
        ...testnet,
        gasLimit: testnetData.config.erd_min_gas_limit,
        gasPrice: testnetData.config.erd_min_gas_price,
        gasPerDataByte: testnetData.config.erd_gas_per_data_byte,
        refreshRate: testnetData.config.erd_round_duration,
        nrOfShards: testnetData.config.erd_num_shards_without_meta,
      };
    }),
  };
  return configObject;
}
