import * as React from 'react';

import { useGlobalState } from 'context';
import { NftEnumType } from 'helpers/types';
import { Loader } from 'components';

import { CollectionNfts } from './CollectionNfts';
import { CollectionDetailsRoles } from './CollectionRoles';

export const CollectionDetails = () => {
  const { collectionDetails } = useGlobalState();

  return (
    <>
      {collectionDetails ? (
        <>
          {collectionDetails.type === NftEnumType.MetaESDT ? (
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
