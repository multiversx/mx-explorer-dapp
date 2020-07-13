import axios from 'axios';
import { object, string, number, InferType } from 'yup';
import { ConfigType, TestnetType } from './state';
import config, { defaultTestnet } from './config';

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

export type AsyncConfigType = InferType<typeof schema> & { fetchedFromNetworkConfig?: boolean };

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

export default async function buildConfig(
  id?: string,
  stateConfig?: ConfigType
): Promise<ConfigType> {
  const internalConfig = stateConfig ? stateConfig : config;

  const configTestnet =
    config.testnets.find((testnet) => {
      if (id) {
        return testnet.id === id;
      } else return testnet.default;
    }) || defaultTestnet;

  if (!configTestnet.fetchedFromNetworkConfig && process.env.NODE_ENV !== 'test') {
    const testnetData = await getAsyncConfig({ ...configTestnet, timeout: 3000 });
    if (!(testnetData instanceof Error)) {
      const newTestnet: TestnetType = {
        ...configTestnet,
        gasLimit: testnetData!.config.erd_min_gas_limit,
        gasPrice: testnetData!.config.erd_min_gas_price,
        gasPerDataByte: testnetData!.config.erd_gas_per_data_byte,
        refreshRate: testnetData!.config.erd_round_duration,
        nrOfShards: testnetData!.config.erd_num_shards_without_meta,
        versionNumber: testnetData!.config.erd_latest_tag_software_version,
        denomination: testnetData!.config.erd_denomination,
        decimals: configTestnet.decimals || 2,
        fetchedFromNetworkConfig: true,
      };
      const configObject: ConfigType = {
        ...config,
        testnets: [newTestnet, ...internalConfig.testnets.filter((t) => t.id !== newTestnet.id)],
      };

      return configObject;
    }
  }
  const newTestnet: TestnetType = {
    ...configTestnet,
    fetchedFromNetworkConfig: false,
  };

  const configObject: ConfigType = {
    ...config,
    testnets: [newTestnet, ...internalConfig.testnets.filter((t) => t.id !== newTestnet.id)],
  };

  return configObject;
}
