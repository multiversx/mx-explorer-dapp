import axios from 'axios';
import { object, string, number, InferType } from 'yup';
import config from './config';

const schema = object({
  config: object({
    erd_chain_id: string().required(),
    erd_denomination: number().required(),
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
}).defined();

export type AsyncConfigType = InferType<typeof schema>;

interface GetAsyncConfigType {
  id: string;
  nodeUrl: string;
  timeout: number;
}

interface GetAsyncConfigReturnType {
  id: string;
  config: AsyncConfigType['config'];
}

async function getAsyncConfig({
  nodeUrl,
  timeout,
  id,
}: GetAsyncConfigType): Promise<GetAsyncConfigReturnType> {
  try {
    const {
      data: { data, code, error },
    } = await axios.get(`${nodeUrl}/network/config`, { timeout });

    if (code === 'successful') {
      schema.validate(data, { strict: true }).catch(({ errors }) => {
        console.error(`Faild to get config for ${id} testnet.`, errors, code, error);
      });

      const { config } = data as AsyncConfigType;

      return {
        id,
        config,
      };
    } else {
      throw new Error(error);
    }
  } catch (err) {
    console.error(`Faild to get config for ${id} testnet.`);
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
      return {
        ...testnet,
        gasLimit: testnetData!.config.erd_min_gas_limit,
        gasPrice: testnetData!.config.erd_min_gas_price,
        gasPerDataByte: testnetData!.config.erd_gas_per_data_byte,
        refreshRate: testnetData!.config.erd_round_duration,
        nrOfShards: testnetData!.config.erd_num_shards_without_meta,
        versionNumber: testnetData!.config.erd_latest_tag_software_version,
        denomination: testnetData!.config.erd_denomination,
        decimals: testnet.decimals || 2,
      };
    }),
  };
  return configObject;
}
