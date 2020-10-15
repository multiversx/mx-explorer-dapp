import axios from 'axios';
import { object, string, number, InferType } from 'yup';
import { AdapterFunctionType } from './index';

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

type AsyncConfigType = InferType<typeof schema> & { fetchedFromNetworkConfig?: boolean };

export default async function getAsyncConfig({
  proxyUrl,
  timeout,
}: {
  proxyUrl: string;
  timeout: number;
}) {
  try {
    const {
      data: { data, code, error },
    } = await axios.get(`${proxyUrl}/network/config`, { timeout });

    if (code === 'successful') {
      schema.validate(data, { strict: true }).catch(({ errors }) => {
        console.error(`Faild to get config for network.`, errors, code, error);
      });

      const { config } = data as AsyncConfigType;

      return config;
    } else {
      throw new Error(error);
    }
  } catch (err) {
    console.error(`Faild to get config for network.`);
    return err;
  }
}
