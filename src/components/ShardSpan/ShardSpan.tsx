import { getShardText } from 'helpers';

interface ShardSpanType {
  shard: number | string;
}

export const ShardSpan = ({ shard }: ShardSpanType) => {
  return <span>{getShardText(shard)}</span>;
};
