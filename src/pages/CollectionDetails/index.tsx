import React from 'react';
import { useSelector } from 'react-redux';

import { Loader } from 'components';
import { collectionSelector } from 'redux/selectors';
import { NftEnumType } from 'types';

import { CollectionNfts } from './CollectionNfts';
import { CollectionDetailsRoles } from './CollectionRoles';

export const CollectionDetails = () => {
  const { collectionState } = useSelector(collectionSelector);
  const { collection, type } = collectionState;

  return (
    <>
      {collection ? (
        <>
          {type === NftEnumType.MetaESDT ? (
            <CollectionDetailsRoles />
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
