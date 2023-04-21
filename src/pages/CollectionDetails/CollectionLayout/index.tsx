import React, { useEffect, useRef, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useSearchParams } from 'react-router-dom';

import { Loader } from 'components';
import { useAdapter, useGetPage, useGetHash } from 'hooks';
import { activeNetworkSelector } from 'redux/selectors';
import { setCollection } from 'redux/slices';

import { CollectionDetailsCard } from './CollectionDetailsCard';
import { FailedCollectionDetails } from './FailedCollectionDetails';

export const CollectionLayout = ({
  children
}: {
  children: React.ReactNode;
}) => {
  const ref = useRef(null);
  const { firstPageRefreshTrigger } = useGetPage();
  const [searchParams] = useSearchParams();
  const { id: activeNetworkId } = useSelector(activeNetworkSelector);
  const dispatch = useDispatch();
  const { getCollection } = useAdapter();

  const collection = useGetHash();

  const [dataReady, setDataReady] = useState<boolean | undefined>();

  const fetchCollectionDetails = () => {
    if (collection) {
      getCollection(collection).then((collectionDetailsData) => {
        if (ref.current !== null) {
          if (collectionDetailsData.success && collectionDetailsData?.data) {
            dispatch(setCollection(collectionDetailsData.data));
            setDataReady(true);
          }

          if (dataReady === undefined) {
            setDataReady(collectionDetailsData.success);
          }
        }
      });
    }
  };

  useEffect(() => {
    fetchCollectionDetails();
  }, [firstPageRefreshTrigger, activeNetworkId, collection, searchParams]);

  useEffect(() => {
    setDataReady(undefined);
  }, [collection, activeNetworkId, searchParams]);

  const loading = dataReady === undefined;
  const failed = dataReady === false;

  return (
    <>
      {loading && <Loader />}
      {!loading && failed && (
        <FailedCollectionDetails collection={collection} />
      )}

      <div ref={ref}>
        {!loading && !failed && (
          <div className='container page-content'>
            <CollectionDetailsCard />
            {children}
          </div>
        )}
      </div>
    </>
  );
};
