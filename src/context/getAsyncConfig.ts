import axios from 'axios';
import { object, string, number, InferType } from 'yup';

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

export default async function getAsyncConfig({ nodeUrl, timeout, id }: GetAsyncConfigType) {
  try {
    const { data } = await axios.get(`${nodeUrl}/network/config`, { timeout });

    schema.validate(data, { strict: true }).catch(({ errors }) => {
      console.error('Async config errors: ', errors);
    });

    const { config } = data.message as AsyncConfigType['message'];

    return {
      id,
      config,
    };
  } catch (err) {
    return {
      id,
      config: {},
    };
  }
}
