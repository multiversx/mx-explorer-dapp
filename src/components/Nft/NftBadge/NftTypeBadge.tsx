import classNames from 'classnames';

import { getNftText } from 'helpers';
import { NftTypeEnum, TokenTypeEnum } from 'types';

export const NftTypeBadge = ({
  type,
  className
}: {
  type: NftTypeEnum | TokenTypeEnum;
  className?: string;
}) => {
  switch (type) {
    // default NFT types
    case NftTypeEnum.SemiFungibleESDT:
    case NftTypeEnum.NonFungibleESDT:
    case NftTypeEnum.MetaESDT:
      return (
        <div
          className={classNames(
            'badge badge-outline',
            { 'badge-outline-orange': type === NftTypeEnum.SemiFungibleESDT },
            { 'badge-outline-yellow': type === NftTypeEnum.NonFungibleESDT },
            { 'badge-outline-green': type === NftTypeEnum.MetaESDT },
            className
          )}
        >
          {getNftText(type)}
        </div>
      );

    default:
      return null;
  }
};
