import { Overlay, NftTypeBadge, NftSubTypeBadge } from 'components';
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
}

export const NftBadge = ({
  type,
  subType,
  showTooltip = true,
  className
}: NftBadgeUIType) => {
  if (showTooltip && subType) {
    return (
      <Overlay title={<NftSubTypeBadge subType={subType} />}>
        <NftTypeBadge type={type} className={className}></NftTypeBadge>
      </Overlay>
    );
  }

  return <NftTypeBadge type={type} className={className}></NftTypeBadge>;
};
