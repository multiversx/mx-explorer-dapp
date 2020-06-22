export interface ValidatorType {
  computedShardID: number;
  publicKey: string;
  isActive: boolean;
  isValidator: boolean;
  peerType: 'waiting' | 'eligible' | 'observer' | 'new' | 'jailed';
  nodeDisplayName: string;
  identity: string;
  receivedShardID: number;
  timeStamp: string;
  totalDownTimeSec: number;
  totalUpTimeSec: number;
  versionNumber: string;
  shardId: string;
  shardNumber: number;
  rating: number;
  ratingModifier: number;
  issue:
    | 'Outdated client version'
    | 'Outdated client configuration'
    | 'Shuffle out restart failed'
    | 'Offline since genesis'
    | '';
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
