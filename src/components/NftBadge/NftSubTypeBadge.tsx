import classNames from 'classnames';

import { NftSubtypeEnum } from 'types';

export const NftSubTypeBadge = ({
  subType,
  className
}: {
  subType: NftSubtypeEnum;
  className?: string;
}) => {
  switch (subType) {
    // NFT Subtypes
    case NftSubtypeEnum.DynamicSemiFungibleESDT:
    case NftSubtypeEnum.DynamicNonFungibleESDT:
    case NftSubtypeEnum.NonFungibleESDTv2:
    case NftSubtypeEnum.DynamicMetaESDT:
      return (
        <div
          className={classNames(
            'badge',
            {
              'badge-orange text-orange-100':
                subType === NftSubtypeEnum.DynamicSemiFungibleESDT,
              'badge-yellow text-orange-100':
                subType === NftSubtypeEnum.DynamicNonFungibleESDT ||
                subType === NftSubtypeEnum.NonFungibleESDTv2,
              'badge-green text-green-100':
                subType === NftSubtypeEnum.DynamicMetaESDT
            },
            className
          )}
        >
          {subType}
        </div>
      );

    default:
      return null;
  }
};
