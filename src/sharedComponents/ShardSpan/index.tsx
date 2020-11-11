import React from 'react';
import { metaChainShardId } from 'appConfig';

interface ShardSpanType {
  shard: number | string;
}

const ShardSpan = ({ shard }: ShardSpanType) => {
  if (typeof shard === 'string' && shard.includes('Shard')) {
    shard = shard.replace('Shard', '');
  }

  const isMetachain = metaChainShardId.toString() === String(shard).toString();

  return isMetachain ? <span>Metachain</span> : <span>Shard {shard}</span>;
};

export default ShardSpan;
