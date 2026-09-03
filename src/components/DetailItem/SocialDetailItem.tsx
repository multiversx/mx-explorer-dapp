import { SocialIcons } from 'components';
import { TokenAssetType } from 'types';

import { DetailItem, DetailItemUIType } from './DetailItem';

export interface SocialDetailItemUIType extends DetailItemUIType {
  assets: TokenAssetType;
}

export const SocialDetailItem = ({
  title,
  assets,
  ...props
}: SocialDetailItemUIType) => {
  const mergedAssets = {
    ...(assets?.website
      ? {
          website: assets.website
        }
      : {}),
    ...(assets?.social ? assets.social : {})
  };

  return (
    <DetailItem title={title || 'Social'} {...props}>
      {Object.keys(mergedAssets).length > 0 ? (
        <div className='d-flex h-100'>
          <SocialIcons assets={mergedAssets} />
        </div>
      ) : (
        <span className='text-neutral-400'>N/A</span>
      )}
    </DetailItem>
  );
};
