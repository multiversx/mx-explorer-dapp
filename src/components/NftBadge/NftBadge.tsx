import React from 'react';

import { NftTypeEnum, TokenTypeEnum } from 'types';

export const NftBadge = ({
  type,
  className
}: {
  type: NftTypeEnum | TokenTypeEnum;
  className?: string;
}) => {
  switch (type) {
    case NftTypeEnum.SemiFungibleESDT:
      return (
        <div
          className={`badge badge-outline badge-outline-orange ${
            className ? className : ''
          }`}
        >
          SFT
        </div>
      );
    case NftTypeEnum.NonFungibleESDT:
      return (
        <div
          className={`badge badge-outline badge-outline-yellow ${
            className ? className : ''
          }`}
        >
          NFT
        </div>
      );
    case NftTypeEnum.MetaESDT:
      return (
        <div
          className={`badge badge-outline badge-outline-green ${
            className ? className : ''
          }`}
        >
          Meta-ESDT
        </div>
      );
    default:
      return null;
  }
};
