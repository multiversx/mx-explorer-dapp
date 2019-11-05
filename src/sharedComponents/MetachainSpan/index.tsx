import React from 'react';
import { useGlobalState } from '../../context';

interface ScAddressIconType {
  shardId: number;
}

const MetachainSpan = ({ shardId }: ScAddressIconType) => {
  const {
    config: { metaChainShardId },
  } = useGlobalState();

  const isMetachain = metaChainShardId === shardId;

  return isMetachain ? <span>Metachain</span> : <span>Shard {shardId}</span>;
};

export default MetachainSpan;
