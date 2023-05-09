import React from 'react';
import { useSelector } from 'react-redux';

import { Loader } from 'components';
import { collectionSelector } from 'redux/selectors';
import { NftTypeEnum } from 'types';

import { CollectionNfts } from './CollectionNfts';
import { CollectionRoles } from './CollectionRoles';

export const CollectionAssets = () => {
  const { collectionState } = useSelector(collectionSelector);
  const { collection, type } = collectionState;

  return (
    <>
      {collection ? (
        <>
          {type === NftTypeEnum.MetaESDT ? (
            <CollectionRoles />
          ) : (
            <CollectionNfts />
          )}
        </>
      ) : (
        <Loader />
      )}
    </>
  );
};
