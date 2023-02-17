import React from 'react';

import { SocialIcons } from 'components';
import { TokenAssetType } from 'types';

import { DetailItem, DetailItemType } from './DetailItem';

export interface SocialDetailItemType extends DetailItemType {
  assets: TokenAssetType;
}

export const SocialDetailItem = ({
  children,
  title,
  assets,
  ...props
}: SocialDetailItemType) => {
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
