import axios from 'axios';
import { object, string, number, InferType } from 'yup';
import config from './config';

const schema = object({
  message: object({
    config: object({
      erd_chain_id: string().required(),
      erd_gas_per_data_byte: number().required(),
      erd_latest_tag_software_version: string().required(),
      erd_meta_consensus_group_size: number().required(),
      erd_min_gas_limit: number().required(),
      erd_min_gas_price: number().required(),
      erd_num_metachain_nodes: number().required(),
      erd_num_nodes_in_shard: number().required(),
      erd_num_shards_without_meta: number().required(),
      erd_round_duration: number().required(),
      erd_shard_consensus_group_size: number().required(),
      erd_start_time: number().required(),
    }).required(),
  }).required(),
}).defined();

export type AsyncConfigType = InferType<typeof schema>;

interface GetAsyncConfigType {
  id: string;
  nodeUrl: string;
  timeout: number;
}

interface GetAsyncConfigReturnType {
  id: string;
  config: AsyncConfigType['message']['config'];
}

async function getAsyncConfig({
  nodeUrl,
  timeout,
  id,
}: GetAsyncConfigType): Promise<GetAsyncConfigReturnType> {
  try {
    const { data } = await axios.get(`${nodeUrl}/network/config`, { timeout });

    schema.validate(data, { strict: true }).catch(({ errors }) => {
      console.error('Async config errors: ', `${nodeUrl}/network/config`, errors);
    });

    const { config } =
      'message' in data
        ? (data.message as AsyncConfigType['message'])
        : (data as AsyncConfigType['message']);

    if (config !== undefined) {
      return {
        id,
        config,
      };
    } else {
      throw new Error(data.message.error);
    }
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

  const promises = testnets.map((testnet) => getAsyncConfig(testnet));
  const results = await Promise.all(promises);
  const asyncData = results.filter((result) => !(result instanceof Error));

  const testnetIds = asyncData.map((result) => result.id);
  const foundTestnets = config.testnets.filter((t) => testnetIds.includes(t.id));

  const configObject = {
    ...config,
    testnets: foundTestnets.map((testnet) => {
      const testnetData = asyncData.find((entry) => entry.id === testnet.id);
      console.warn(11, testnetData, asyncData);

      return {
        ...testnet,
        gasLimit: testnetData!.config.erd_min_gas_limit,
        gasPrice: testnetData!.config.erd_min_gas_price,
        gasPerDataByte: testnetData!.config.erd_gas_per_data_byte,
        refreshRate: testnetData!.config.erd_round_duration,
        nrOfShards: testnetData!.config.erd_num_shards_without_meta,
        versionNumber: testnetData!.config.erd_latest_tag_software_version,
      };
    }),
  };
  return configObject;
}
