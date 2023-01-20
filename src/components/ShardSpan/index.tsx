import React from 'react';
import { metaChainShardId, allShardsShardId } from 'appConfig';

interface ShardSpanType {
  shard: number | string;
}

export const shardSpanText = (shard: number | string) => {
  if (typeof shard === 'string' && shard.includes('Shard')) {
    shard = shard.replace('Shard', '');
  }

  const isMetachain =
    metaChainShardId.toString() === String(shard).toString() || String(shard) === 'metachain';
  const isAllShards = allShardsShardId.toString() === String(shard).toString();

  if (isMetachain) {
    return 'Metachain';
  }
  if (isAllShards) {
    return 'All Shards';
  }
  return `Shard ${shard}`;
};

const ShardSpan = ({ shard }: ShardSpanType) => {
  return <span>{shardSpanText(shard)}</span>;
};

export default ShardSpan;
