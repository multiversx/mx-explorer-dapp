import axios from 'axios';
import { object, string, number, InferType } from 'yup';
import { ConfigType, NetworkType, AdapterType } from './state';
import config, { defaultNetwork } from './config';

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
  timeout: number;
}

interface GetAsyncConfigReturnType {
  id: string;
  config: AsyncConfigType['config'];
}

async function getAsyncConfig({
  proxyUrl,
  apiUrl,
  timeout,
  id,
}: GetAsyncConfigType & AdapterType): Promise<GetAsyncConfigReturnType> {
  if (id === 'mainnet') {
    return {
      id,
      config: {
        erd_chain_id: '1',
        erd_denomination: 18,
        erd_gas_per_data_byte: 1500,
        erd_latest_tag_software_version: 'v1.1.6.1',
        erd_meta_consensus_group_size: 400,
        erd_min_gas_limit: 50000,
        erd_min_gas_price: 1000000000,
        erd_num_metachain_nodes: 400,
        erd_num_nodes_in_shard: 400,
        erd_num_shards_without_meta: 3,
        erd_round_duration: 6000,
        erd_shard_consensus_group_size: 63,
        erd_start_time: 1596117600,
      },
    };
  } else {
    const nodeUrl = apiUrl || proxyUrl;
    try {
      const {
        data: { data, code, error },
      } = await axios.get(`${nodeUrl}/network/config`, { timeout });

      if (code === 'successful') {
        schema.validate(data, { strict: true }).catch(({ errors }) => {
          console.error(`Faild to get config for ${id} network.`, errors, code, error);
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
      console.error(`Faild to get config for ${id} network.`);
      return err;
    }
  }
}

export default async function buildConfig(
  id?: string,
  stateConfig?: ConfigType
): Promise<ConfigType> {
  const internalConfig = stateConfig ? stateConfig : config;

  const configNetwork =
    config.networks.find((network) => {
      if (id) {
        return network.id === id;
      } else return network.default;
    }) || defaultNetwork;

  if (!configNetwork.fetchedFromNetworkConfig && process.env.NODE_ENV !== 'test') {
    const networkData = await getAsyncConfig({ ...configNetwork, timeout: 3000 });
    if (!(networkData instanceof Error)) {
      const newNetwork: NetworkType = {
        ...configNetwork,
        gasLimit: networkData!.config.erd_min_gas_limit,
        gasPrice: networkData!.config.erd_min_gas_price,
        gasPerDataByte: networkData!.config.erd_gas_per_data_byte,
        refreshRate: networkData!.config.erd_round_duration,
        nrOfShards: networkData!.config.erd_num_shards_without_meta,
        versionNumber: networkData!.config.erd_latest_tag_software_version,
        denomination: networkData!.config.erd_denomination,
        decimals: configNetwork.decimals || 4,
        fetchedFromNetworkConfig: true,
      };
      const configObject: ConfigType = {
        ...config,
        networks: [newNetwork, ...internalConfig.networks.filter((t) => t.id !== newNetwork.id)],
      };

      return configObject;
    }
  }
  const newNetwork: NetworkType = {
    ...configNetwork,
    fetchedFromNetworkConfig: false,
  };

  const configObject: ConfigType = {
    ...config,
    networks: [newNetwork, ...internalConfig.networks.filter((t) => t.id !== newNetwork.id)],
  };

  return configObject;
}
