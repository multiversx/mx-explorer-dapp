export interface NodeType {
  bls: string;
  name: string;
  type: 'observer' | 'validator';
  status?:
    | 'waiting'
    | 'eligible'
    | 'new'
    | 'jailed'
    | 'leaving'
    | 'inactive'
    | 'queued'
    | 'auction';
  online: boolean;
  rating: number;
  tempRating: number;
  ratingModifier: number;
  shard: number;
  nonce: number;
  instances: number;
  version: string;
  owner: string;
  stake: string;
  topUp: string;
  uptime: number;
  uptimeSec: number;
  downtime: number;
  downtimeSec: number;
  locked: string;
  identity?: string;
  provider?: string;
  issues?: string[];
  syncProgress?: number;
  leaderSuccess?: number;
  leaderFailure?: number;
  validatorSuccess?: number;
  validatorFailure?: number;
  validatorIgnoredSignatures?: number;
  position?: number;
  fullHistory?: boolean;

  auctionPosition?: number;
  auctionTopUp?: string;
  auctionQualified?: boolean;
  isInDangerZone?: boolean;

  // TODO check if used
  receivedShardID?: number;
  computedShardID?: number;
}

export enum NodeQualificationStatusEnum {
  qualified = 'Qualified',
  notQualified = 'Not Qualified',
  dangerZone = 'Danger Zone'
}
