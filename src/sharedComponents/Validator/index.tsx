import React from 'react';
const Validator = ({ children }: { children: React.ReactNode }) => <>{children}</>;

export interface ValidatorType {
  computedShardID: number;
  publicKey: string;
  isActive: boolean;
  isValidator: boolean;
  peerType: 'waiting' | 'eligible' | 'observer';
  nodeDisplayName: string;
  identity: string;
  receivedShardID: number;
  timeStamp: string;
  totalDownTimeSec: number;
  totalUpTimeSec: number;
  versionNumber: string;
  shardId: string;
  shardNumber: number;
  star: boolean;
  rating: number;
  ratingModifier: number;
}

export interface BrandType {
  name: string;
  avatar: string;
  score: number;
  stake: number;
  stakePercent: number;
  overallStakePercent: number;
  validators: ValidatorType[];
}

const BrandImage = ({ brand }: { brand: BrandType }) => (
  <div className="body">
    <div className="mr-3">
      <img
        className={brand.avatar ? 'avatar' : 'avatar gray'}
        src={brand.avatar ? brand.avatar : '/validators/default-avatar.svg'}
        alt={brand.name}
        height="42"
      />
    </div>
    {brand.name ? brand.name : 'N/A'}
  </div>
);

Validator.BrandImage = BrandImage;

export default Validator;
