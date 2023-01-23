import * as React from 'react';

import { NftEnumType } from 'types';
import { Loader } from 'components';

import { CollectionNfts } from './CollectionNfts';
import { CollectionDetailsRoles } from './CollectionRoles';

import { useSelector } from 'react-redux';
import { collectionSelector } from 'redux/selectors';

export const CollectionDetails = () => {
  const { collectionFetched, type } = useSelector(collectionSelector);

  return (
    <>
      {collectionFetched ? (
        <>{type === NftEnumType.MetaESDT ? <CollectionDetailsRoles /> : <CollectionNfts />}</>
      ) : (
        <Loader />
      )}
    </>
  );
};
