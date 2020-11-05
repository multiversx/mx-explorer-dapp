export interface ValidatorType {
  computedShardID: number;
  publicKey: string;
  isActive: boolean; // TODO: remove
  isValidator: boolean;
  peerType: 'waiting' | 'eligible' | 'observer' | 'new' | 'jailed';
  nodeType: 'observer' | 'validator';
  status: 'online' | 'offline';
  nodeDisplayName: string;
  identity: string;
  receivedShardID: number;
  timeStamp: string;
  totalDownTimeSec: number;
  totalUpTimeSec: number;
  versionNumber: string;
  shardId: string; // TODO: remove
  shardNumber: number;
  rating: number;
  ratingModifier: number;
  issues: string[];
  issue: any; // TODO: remove
}

interface ComputedShard {
  shardID: string;
  status: string;
  allValidators: number;
  allActiveValidators: number;
  shardNumber: number;
}

interface ValidatorDataType {
  shardData: ComputedShard[];
  shardsList: string[];
  validators: ValidatorType[];
  validatorsAndObservers: ValidatorType[];
}

export interface BrandDataType {
  avatar: string;
  name: string;
  identity: string;
  publicKeys: string[];
  twitter: string;
  web: string;
  location: string;
}

export const validatorData: ValidatorDataType = {
  shardData: [
    {
      shardID: '',
      status: '',
      allValidators: 0,
      allActiveValidators: 0,
      shardNumber: -1,
    },
  ],
  shardsList: [''],
  validators: [],
  validatorsAndObservers: [],
};

export const brandData: BrandDataType[] = [];
