import {
  METACHAIN_SHARD_ID,
  MAIN_SHARD_ID,
  ALL_SHARDS_SHARD_ID
} from 'appConstants';

export const getShardText = (
  shard: number | string | undefined,
  isSovereign?: boolean
) => {
  if (shard === undefined) {
    return '';
  }

  if (typeof shard === 'string' && shard.includes('Shard')) {
    shard = shard.replace('Shard', '');
  }

  const isMetachain =
    METACHAIN_SHARD_ID.toString() === String(shard).toString() ||
    String(shard) === 'metachain';

  const isAllShards =
    ALL_SHARDS_SHARD_ID.toString() === String(shard).toString();

  const isMainShard = MAIN_SHARD_ID.toString() === String(shard).toString();

  if (isMainShard) {
    return 'MultiversX';
  }
  if (isMetachain) {
    if (isSovereign) {
      return '';
    }

    return 'Metachain';
  }
  if (isAllShards) {
    return 'All Shards';
  }
  return `Shard ${shard}`;
};
