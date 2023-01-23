import React from 'react';
import { METACHAIN_SHARD_ID, ALL_SHARDS_SHARD_ID } from 'appConstants';

interface ShardSpanType {
  shard: number | string;
}

export const shardSpanText = (shard: number | string) => {
  if (typeof shard === 'string' && shard.includes('Shard')) {
    shard = shard.replace('Shard', '');
  }

  const isMetachain =
    METACHAIN_SHARD_ID.toString() === String(shard).toString() || String(shard) === 'metachain';
  const isAllShards = ALL_SHARDS_SHARD_ID.toString() === String(shard).toString();

  if (isMetachain) {
    return 'Metachain';
  }
  if (isAllShards) {
    return 'All Shards';
  }
  return `Shard ${shard}`;
};

export const ShardSpan = ({ shard }: ShardSpanType) => {
  return <span>{shardSpanText(shard)}</span>;
};
