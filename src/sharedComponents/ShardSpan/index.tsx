import React from 'react';
import { metaChainShardId } from 'appConfig';

interface ShardSpanType {
  shard: number | string;
}

export const shardSpanText = (shard: number | string) => {
  if (typeof shard === 'string' && shard.includes('Shard')) {
    shard = shard.replace('Shard', '');
  }

  const isMetachain = metaChainShardId.toString() === String(shard).toString();

  return isMetachain ? 'Metachain' : `Shard ${shard}`;
};

const ShardSpan = ({ shard }: ShardSpanType) => {
  return <span>{shardSpanText(shard)}</span>;
};

export default ShardSpan;
