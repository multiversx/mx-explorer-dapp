import { ShardType } from 'context/state';

export default function computeShardStatus(shard: ShardType) {
  const { activeValidators, validators } = shard;
  const danger = Math.ceil(validators * (2 / 3)) + 1;
  const warning = Math.ceil(validators - (validators - danger) / 2);
  switch (true) {
    case activeValidators >= warning:
      return 'success';
    case danger <= activeValidators && activeValidators < warning:
      return 'warning';
    default:
      return 'danger';
  }
}
