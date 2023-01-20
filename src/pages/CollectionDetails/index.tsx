import * as React from 'react';

import { useGlobalState } from 'context';
import { NftEnumType } from 'helpers/types';
import { Loader } from 'components';

import CollectionNfts from './CollectionNfts';
import CollectionRoles from './CollectionRoles';

const CollectionDetails = () => {
  const { collectionDetails } = useGlobalState();

  return (
    <>
      {collectionDetails ? (
        <>
          {collectionDetails.type === NftEnumType.MetaESDT ? (
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

export default CollectionDetails;
