import { useGetShardText } from 'hooks';

interface ShardSpanType {
  shard: number | string;
}

export const ShardSpan = ({ shard }: ShardSpanType) => {
  const getShardText = useGetShardText();

  return <span>{getShardText(shard)}</span>;
};
