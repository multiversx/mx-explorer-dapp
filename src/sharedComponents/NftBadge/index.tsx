import React from 'react';
import { NftType } from 'helpers/types';

const NftBadge = ({ type, className }: { type: NftType['type']; className?: string }) => {
  switch (type) {
    case 'SemiFungibleESDT':
      return (
        <div className={`badge badge-secondary font-weight-light ${className ? className : ''}`}>
          SFT
        </div>
      );
    case 'NonFungibleESDT':
      return (
        <div className={`badge badge-secondary font-weight-light ${className ? className : ''}`}>
          NFT
        </div>
      );
    case 'MetaESDT':
      return (
        <div className={`badge badge-secondary font-weight-light ${className ? className : ''}`}>
          Meta-ESDT
        </div>
      );
    default:
      return null;
  }
};

export default NftBadge;
