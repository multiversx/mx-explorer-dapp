import { getShardText } from 'helpers';
import { useIsSovereign } from 'hooks';

interface ShardSpanType {
  shard: number | string;
}

export const ShardSpan = ({ shard }: ShardSpanType) => {
  const isSovereign = useIsSovereign();

  return <span>{getShardText(shard, isSovereign)}</span>;
};
