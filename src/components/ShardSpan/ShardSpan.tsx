import { memo } from 'react';
import { useGetShardText } from 'hooks';

interface ShardSpanType {
  shard: number | string;
}

export const ShardSpan = memo(({ shard }: ShardSpanType) => {
  const getShardText = useGetShardText();

  return <span>{getShardText(shard)}</span>;
});
