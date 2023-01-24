import { ShardType } from 'types';

export const sortShards = ({
  shards,
  METACHAIN_SHARD_ID
}: {
  shards: ShardType[];
  METACHAIN_SHARD_ID: number;
}) => {
  const sorted = [...shards];
  sorted.sort((a, b) => (a.shard > b.shard ? 1 : -1));

  const metaShard = sorted.find((shard) => shard.shard === METACHAIN_SHARD_ID);
  if (metaShard && sorted[0].shard !== metaShard.shard) {
    sorted.splice(sorted.indexOf(metaShard));
    sorted.unshift(metaShard);
  }

  return sorted;
};
