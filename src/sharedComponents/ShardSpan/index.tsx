import React from 'react';
import { metaChainShardId } from 'appConfig';

interface ShardSpanType {
  shard: number | string;
  hideText?: boolean;
}

export const shardSpanText = (shard: number | string, hideText?: boolean) => {
  if (typeof shard === 'string' && shard.includes('Shard')) {
    shard = shard.replace('Shard', '');
  }

  const isMetachain = metaChainShardId.toString() === String(shard).toString();

  return isMetachain ? 'Metachain' : `${hideText ? '' : 'Shard'} ${shard}`;
};

const ShardSpan = ({ shard, hideText }: ShardSpanType) => {
  return <span>{shardSpanText(shard, hideText)}</span>;
};

export default ShardSpan;
