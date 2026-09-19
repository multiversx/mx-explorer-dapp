import {
  Overlay,
  NftTypeBadge,
  NftSubTypeBadge,
  NftProofBadge
} from 'components';
import {
  NftSubtypeEnum,
  NftTypeEnum,
  TokenTypeEnum,
  WithClassnameType
} from 'types';

export interface NftBadgeUIType extends WithClassnameType {
  type: NftTypeEnum | TokenTypeEnum;
  subType?: NftSubtypeEnum;
  showTooltip?: boolean;
  isProof?: boolean;
}

export const NftBadge = ({
  type,
  subType,
  showTooltip = true,
  isProof,
  className
}: NftBadgeUIType) => {
  if (showTooltip && subType && (subType as string) !== type) {
    return (
      <Overlay title={<NftSubTypeBadge subType={subType} />}>
        <NftTypeBadge type={type} className={className}></NftTypeBadge>
      </Overlay>
    );
  }

  if (showTooltip && isProof) {
    return (
      <Overlay title={<NftProofBadge />}>
        <NftTypeBadge type={type} className={className}></NftTypeBadge>
      </Overlay>
    );
  }

  return <NftTypeBadge type={type} className={className}></NftTypeBadge>;
};
