import React from 'react';
import { metaChainShardId } from 'appConfig';

interface ShardSpanType {
  shardId: number | string;
}

const ShardSpan = ({ shardId }: ShardSpanType) => {
  if (typeof shardId === 'string' && shardId.includes('Shard')) {
    shardId = shardId.replace('Shard', '');
  }

  const isMetachain = metaChainShardId.toString() === String(shardId).toString();

  return isMetachain ? <span>Metachain</span> : <span>Shard {shardId}</span>;
};

export default ShardSpan;
